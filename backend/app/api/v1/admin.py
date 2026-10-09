import os
from datetime import datetime, date, time, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from jose import jwt, JWTError

from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas
from backend.app.core.config import settings
from backend.app.services.google_sheets_service import GoogleSheetsService

router = APIRouter()

def create_admin_token(email: str) -> str:
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {
        "sub": email,
        "role": "admin",
        "exp": expire
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def get_current_admin_email(request: Request) -> Optional[str]:
    token = request.cookies.get("qura_admin_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        allowed_emails = list(set([e.lower() for e in settings.admin_emails_list] + ["admin@quraherbs.in", "quraherbs@gmail.com"]))
        if role == "admin" and email and email.lower() in allowed_emails:
            return email.lower()
    except JWTError:
        return None
    return None


@router.get("/settings/{key}")
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == key).first()
    if not setting:
        # Return empty dictionary as default instead of failing
        return {"key": key, "value": {}}
    return {"key": setting.key, "value": setting.value}

@router.post("/settings/{key}")
def save_setting(key: str, payload: dict, db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == key).first()
    if not setting:
        setting = models.Setting(key=key, value=payload)
        db.add(setting)
    else:
        setting.value = payload
    db.commit()
    return {"key": key, "value": payload}

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Calculate statistics
    total_revenue = db.query(func.sum(models.Order.total)).filter(models.Order.payment_status == "paid").scalar() or 0.0
    orders_count = db.query(models.Order).count()
    customers_count = db.query(models.Customer).count()
    products_count = db.query(models.Product).count()
    
    # Inventory stats
    low_stock = db.query(models.Product).filter(models.Product.stock <= 5, models.Product.active == True).all()
    low_stock_list = [
        {"id": p.id, "name": p.name, "SKU": p.SKU, "stock": p.stock} 
        for p in low_stock
    ]
    
    # Today's sales
    today_start = datetime.combine(date.today(), time.min)
    today_sales = db.query(func.sum(models.Order.total)).filter(
        models.Order.payment_status == "paid",
        models.Order.created_at >= today_start
    ).scalar() or 0.0
    
    pending_orders = db.query(models.Order).filter(models.Order.order_status == "pending").count()
    active_offers = db.query(models.Offer).filter(models.Offer.active == True).count()
    
    # Recent orders
    recent_orders = db.query(models.Order).order_by(models.Order.created_at.desc()).limit(5).all()
    recent_orders_list = [
        {
            "id": o.id,
            "order_number": o.order_number,
            "total": o.total,
            "order_status": o.order_status,
            "payment_status": o.payment_status,
            "created_at": o.created_at
        }
        for o in recent_orders
    ]
    
    return {
        "total_revenue": total_revenue,
        "orders_count": orders_count,
        "customers_count": customers_count,
        "products_count": products_count,
        "today_sales": today_sales,
        "pending_orders": pending_orders,
        "active_offers": active_offers,
        "low_stock": low_stock_list,
        "recent_orders": recent_orders_list
    }

@router.post("/login")
def admin_login(payload: dict, response: Response):
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin email address is required."
        )
        
    if not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin password is required."
        )
    
    allowed_emails = list(set([e.lower() for e in settings.admin_emails_list] + ["admin@quraherbs.in", "quraherbs@gmail.com"]))
    valid_passwords = {"qura_secure_admin_password_2026", "quraherbs2026"}
    if settings.ADMIN_PASSWORD:
        valid_passwords.add(settings.ADMIN_PASSWORD)
    
    if email not in allowed_emails:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized email address. Admin access only."
        )
        
    if password not in valid_passwords:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin password."
        )
        
    token = create_admin_token(email)
    
    is_prod = bool(os.environ.get("VERCEL") or settings.NEXT_PUBLIC_SITE_URL.startswith("https"))
    
    response.set_cookie(
        key="qura_admin_token",
        value=token,
        httponly=True,
        secure=is_prod,
        samesite="lax",
        path="/",
        max_age=60 * 60 * 24
    )

    return {
        "status": "success",
        "message": "Login successful",
        "token": token,
        "email": email
    }

@router.get("/session")
def check_admin_session(request: Request):
    admin_email = get_current_admin_email(request)
    if not admin_email:
        return {"authenticated": False, "email": None}
    return {"authenticated": True, "email": admin_email}

@router.post("/logout")
def admin_logout(response: Response):
    response.delete_cookie(
        key="qura_admin_token",
        path="/",
        httponly=True,
        samesite="lax"
    )
    return {"status": "success", "message": "Logout successful"}


from fastapi import BackgroundTasks
from backend.app.services.email_service import EmailService

@router.post("/orders/{order_id}/confirm-payment")
def confirm_order_payment(order_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Find order by ID or order_number
    if order_id.isdigit():
        order = db.query(models.Order).filter(models.Order.id == int(order_id)).first()
    else:
        order = db.query(models.Order).filter(models.Order.order_number == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Duplicate check: If payment already confirmed, prevent sending duplicate automatic emails
    if order.payment_status in ["PAYMENT_CONFIRMED", "paid"]:
        return {
            "success": False,
            "message": "Payment is already confirmed.",
            "payment_status": order.payment_status,
            "order_status": order.order_status,
            "already_confirmed": True
        }

    # Update payment & order status
    order.payment_status = "PAYMENT_CONFIRMED"
    order.order_status = "CONFIRMED"
    order.payment_confirmed_at = datetime.now(timezone.utc).replace(tzinfo=None)
    order.payment_confirmed_by = "admin@quraherbs.in"

    db.commit()
    db.refresh(order)

    # Get items with product details for email
    items_list = []
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        items_list.append({
            "product_id": item.product_id,
            "name": product.name if product else f"Product #{item.product_id}",
            "quantity": item.quantity,
            "price": item.price,
            "variant": item.variant,
            "thumbnail": product.thumbnail if product else None
        })

    # Trigger customer confirmation email in background
    if order.customer:
        background_tasks.add_task(EmailService.send_customer_confirmation_email, db, order, order.customer, items_list)

    # Sync updated payment status to Google Sheets
    try:
        GoogleSheetsService.update_order_status(db, order)
    except Exception as e:
        pass

    return {
        "success": True,
        "order_id": order.order_number,
        "payment_status": "PAYMENT_CONFIRMED",
        "order_status": "CONFIRMED",
        "email_status": "QUEUED"
    }

@router.post("/orders/{order_id}/reject-payment")
def reject_order_payment(order_id: str, db: Session = Depends(get_db)):
    if order_id.isdigit():
        order = db.query(models.Order).filter(models.Order.id == int(order_id)).first()
    else:
        order = db.query(models.Order).filter(models.Order.order_number == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.payment_status = "PAYMENT_FAILED"
    order.order_status = "CANCELLED"
    db.commit()
    db.refresh(order)

    # Sync updated status to Google Sheets
    try:
        GoogleSheetsService.update_order_status(db, order)
    except Exception as e:
        pass

    return {
        "success": True,
        "order_id": order.order_number,
        "payment_status": "PAYMENT_FAILED",
        "order_status": "CANCELLED"
    }

@router.post("/orders/{order_id}/resend-confirmation")
def resend_order_confirmation(order_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if order_id.isdigit():
        order = db.query(models.Order).filter(models.Order.id == int(order_id)).first()
    else:
        order = db.query(models.Order).filter(models.Order.order_number == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items_list = []
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        items_list.append({
            "product_id": item.product_id,
            "name": product.name if product else f"Product #{item.product_id}",
            "quantity": item.quantity,
            "price": item.price,
            "variant": item.variant,
            "thumbnail": product.thumbnail if product else None
        })

    if order.customer:
        background_tasks.add_task(EmailService.send_customer_confirmation_email, db, order, order.customer, items_list)

    return {
        "success": True,
        "order_id": order.order_number,
        "message": "Confirmation email queued for resend."
    }

@router.get("/orders/{order_id}/email-logs", response_model=List[schemas.EmailLogResponse])
def get_order_email_logs(order_id: str, db: Session = Depends(get_db)):
    if order_id.isdigit():
        order = db.query(models.Order).filter(models.Order.id == int(order_id)).first()
    else:
        order = db.query(models.Order).filter(models.Order.order_number == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return db.query(models.EmailLog).filter(models.EmailLog.order_id == order.id).order_by(models.EmailLog.created_at.desc()).all()

@router.get("/orders/{order_id}/details")
def get_rich_order_details(order_id: str, db: Session = Depends(get_db)):
    if order_id.isdigit():
        order = db.query(models.Order).filter(models.Order.id == int(order_id)).first()
    else:
        order = db.query(models.Order).filter(models.Order.order_number == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
    cust_prev_orders = 0
    cust_total_spent = 0.0
    if customer:
        cust_orders = db.query(models.Order).filter(models.Order.customer_id == customer.id).all()
        cust_prev_orders = len(cust_orders)
        cust_total_spent = sum(o.total for o in cust_orders)

    items_list = []
    mrp_total = 0.0
    for item in order.items:
        prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        mrp = prod.price if prod else item.price
        mrp_total += mrp * item.quantity
        items_list.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": prod.name if prod else f"Product #{item.product_id}",
            "sku": prod.SKU if prod else "N/A",
            "thumbnail": prod.thumbnail if prod else None,
            "variant": item.variant,
            "quantity": item.quantity,
            "mrp": mrp,
            "price": item.price,
            "subtotal": item.price * item.quantity
        })

    offer_info = None
    if order.offer_id or order.voucher_code:
        off = None
        if order.offer_id:
            off = db.query(models.Offer).filter(models.Offer.id == order.offer_id).first()
        elif order.voucher_code:
            off = db.query(models.Offer).filter(models.Offer.code == order.voucher_code).first()

        if off:
            offer_info = {
                "id": off.id,
                "name": off.name,
                "code": off.code,
                "offer_type": off.offer_type,
                "discount_value": off.discount_value
            }

    timeline = db.query(models.OrderTimelineEvent).filter(models.OrderTimelineEvent.order_id == order.id).order_by(models.OrderTimelineEvent.created_at.asc()).all()
    notes = db.query(models.AdminNote).filter(models.AdminNote.order_id == order.id).order_by(models.AdminNote.created_at.desc()).all()
    logs = db.query(models.EmailLog).filter(models.EmailLog.order_id == order.id).order_by(models.EmailLog.created_at.desc()).all()

    product_discount = max(0.0, mrp_total - order.subtotal)
    customer_saved = product_discount + order.discount_amount + order.shipping_discount

    return {
        "id": order.id,
        "order_number": order.order_number,
        "created_at": order.created_at,
        "order_status": order.order_status,
        "payment_status": order.payment_status,
        "payment_id": order.payment_id,
        "payment_confirmed_at": order.payment_confirmed_at,
        "payment_confirmed_by": order.payment_confirmed_by,
        "tracking_number": order.tracking_number,
        "customer": {
            "id": customer.id if customer else None,
            "name": customer.name if customer else "Guest Customer",
            "email": customer.email if customer else "",
            "phone": customer.phone if customer else "",
            "address": customer.address if customer else "",
            "city": customer.city if customer else "",
            "state": customer.state if customer else "",
            "pincode": customer.pincode if customer else "",
            "previous_orders_count": cust_prev_orders,
            "total_spending": cust_total_spent
        },
        "items": items_list,
        "pricing": {
            "mrp_total": mrp_total,
            "product_discount": product_discount,
            "voucher_discount": order.discount_amount,
            "shipping_discount": order.shipping_discount,
            "subtotal": order.subtotal,
            "shipping": order.shipping,
            "tax": order.tax,
            "total": order.total,
            "customer_saved": customer_saved
        },
        "voucher": {
            "code": order.voucher_code,
            "discount_amount": order.discount_amount,
            "shipping_discount": order.shipping_discount,
            "offer_details": offer_info
        },
        "timeline": [
            {
                "id": t.id,
                "status": t.status,
                "notes": t.notes,
                "created_by": t.created_by,
                "created_at": t.created_at
            } for t in timeline
        ],
        "admin_notes": [
            {
                "id": n.id,
                "note": n.note,
                "admin_name": n.admin_name,
                "created_at": n.created_at
            } for n in notes
        ],
        "email_logs": [
            {
                "id": l.id,
                "email_type": l.email_type,
                "recipient_email": l.recipient_email,
                "subject": l.subject,
                "status": l.status,
                "created_at": l.created_at
            } for l in logs
        ]
    }

@router.post("/orders/{order_id}/update-status")
def update_order_status_timeline(order_id: str, payload: dict, db: Session = Depends(get_db)):
    if order_id.isdigit():
        order = db.query(models.Order).filter(models.Order.id == int(order_id)).first()
    else:
        order = db.query(models.Order).filter(models.Order.order_number == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = payload.get("status", "").strip().upper()
    notes = payload.get("notes", "")
    admin_name = payload.get("admin_name", "Admin")

    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")

    prev_status = order.order_status
    order.order_status = new_status

    if "tracking_number" in payload and payload["tracking_number"]:
        order.tracking_number = payload["tracking_number"]

    # Append timeline event
    timeline_event = models.OrderTimelineEvent(
        order_id=order.id,
        status=new_status,
        notes=notes or f"Status changed from {prev_status} to {new_status}",
        created_by=admin_name
    )
    db.add(timeline_event)
    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "order_number": order.order_number,
        "prev_status": prev_status,
        "new_status": new_status,
        "tracking_number": order.tracking_number
    }

@router.post("/orders/{order_id}/add-note")
def add_admin_note(order_id: str, payload: dict, db: Session = Depends(get_db)):
    if order_id.isdigit():
        order = db.query(models.Order).filter(models.Order.id == int(order_id)).first()
    else:
        order = db.query(models.Order).filter(models.Order.order_number == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    note_text = payload.get("note", "").strip()
    admin_name = payload.get("admin_name", "Admin")

    if not note_text:
        raise HTTPException(status_code=400, detail="Note text cannot be empty")

    note_obj = models.AdminNote(
        order_id=order.id,
        note=note_text,
        admin_name=admin_name
    )
    db.add(note_obj)
    db.commit()
    db.refresh(note_obj)

    return {
        "success": True,
        "id": note_obj.id,
        "note": note_obj.note,
        "admin_name": note_obj.admin_name,
        "created_at": note_obj.created_at
    }

@router.post("/parse-description")
def parse_product_description(payload: dict):
    raw_text = payload.get("raw_text", "").strip()
    if not raw_text:
        return {
            "short_description": "",
            "full_description": "",
            "benefits": "",
            "ingredients": "",
            "how_to_use": "",
            "skin_type": ""
        }

    lines = raw_text.split("\n")
    current_section = "description"

    description_lines = []
    benefits_lines = []
    ingredients_lines = []
    how_to_use_lines = []
    skin_type_lines = []

    import re
    benefits_regex = re.compile(r"^\s*(?:key\s*)?(?:product\s*)?(?:benefits|features|why\s*you\s*will\s*love\s*it|results|what\s*it\s*does|highlights|key\s*highlights|benefits\s*&\s*uses|uses|advantages)[:\s\-]*$", re.IGNORECASE)
    ingredients_regex = re.compile(r"^\s*(?:pure\s*)?(?:key\s*)?(?:active\s*)?(?:ingredients|formula|composition|inci|contains|extracts|key\s*actives)[:\s\-]*$", re.IGNORECASE)
    how_to_use_regex = re.compile(r"^\s*(?:how\s*to\s*use|how\s*to\s*ritual|directions|usage|application|suggested\s*use|ritual|application\s*steps|how\s*to\s*apply)[:\s\-]*$", re.IGNORECASE)
    skin_type_regex = re.compile(r"^\s*(?:skin\s*type|suitable\s*for|recommended\s*for|target\s*skin)[:\s\-]*$", re.IGNORECASE)
    description_regex = re.compile(r"^\s*(?:full\s*)?(?:editorial\s*)?(?:description|overview|story|about\s*the\s*product|details)[:\s\-]*$", re.IGNORECASE)

    for line in lines:
        trimmed = line.strip()
        if not trimmed:
            if current_section == "description" and description_lines:
                description_lines.append("")
            continue

        if benefits_regex.match(trimmed) or re.match(r"^(?:benefits|key benefits|highlights):", trimmed, re.IGNORECASE):
            current_section = "benefits"
            inline = re.sub(r"^(?:benefits|key benefits|highlights|key product benefits|why you will love it|results)[:\s\-]*", "", trimmed, flags=re.IGNORECASE).strip()
            if inline:
                benefits_lines.append(inline)
            continue

        if ingredients_regex.match(trimmed) or re.match(r"^(?:ingredients|key ingredients|pure ingredients|formula):", trimmed, re.IGNORECASE):
            current_section = "ingredients"
            inline = re.sub(r"^(?:ingredients|key ingredients|pure ingredients|formula|inci|composition)[:\s\-]*", "", trimmed, flags=re.IGNORECASE).strip()
            if inline:
                ingredients_lines.append(inline)
            continue

        if how_to_use_regex.match(trimmed) or re.match(r"^(?:how to use|directions|usage|ritual):", trimmed, re.IGNORECASE):
            current_section = "how_to_use"
            inline = re.sub(r"^(?:how to use|directions|usage|ritual|application)[:\s\-]*", "", trimmed, flags=re.IGNORECASE).strip()
            if inline:
                how_to_use_lines.append(inline)
            continue

        if skin_type_regex.match(trimmed) or re.match(r"^(?:skin type|suitable for):", trimmed, re.IGNORECASE):
            current_section = "skin_type"
            inline = re.sub(r"^(?:skin type|suitable for|recommended for)[:\s\-]*", "", trimmed, flags=re.IGNORECASE).strip()
            if inline:
                skin_type_lines.append(inline)
            continue

        if description_regex.match(trimmed):
            current_section = "description"
            inline = re.sub(r"^(?:description|overview|story|about the product)[:\s\-]*", "", trimmed, flags=re.IGNORECASE).strip()
            if inline:
                description_lines.append(inline)
            continue

        if current_section == "benefits":
            benefits_lines.append(trimmed)
        elif current_section == "ingredients":
            ingredients_lines.append(trimmed)
        elif current_section == "how_to_use":
            how_to_use_lines.append(trimmed)
        elif current_section == "skin_type":
            skin_type_lines.append(trimmed)
        else:
            description_lines.append(trimmed)

    full_desc = "\n".join(description_lines).strip()
    benefits = "\n".join(benefits_lines).strip()
    ingredients = "\n".join(ingredients_lines).strip()
    how_to_use = "\n".join(how_to_use_lines).strip()
    skin_type = " ".join(skin_type_lines).strip()

    short_desc = ""
    if full_desc:
        short_desc = full_desc.split(". ")[0].strip()
        if short_desc and not short_desc.endswith("."):
            short_desc += "."
    elif benefits:
        short_desc = benefits.split("\n")[0].replace("•", "").strip()

    return {
        "short_description": short_desc,
        "full_description": full_desc,
        "benefits": benefits,
        "ingredients": ingredients,
        "how_to_use": how_to_use,
        "skin_type": skin_type
    }
