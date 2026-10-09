import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas
from backend.app.services.email_service import EmailService
from backend.app.services.google_sheets_service import GoogleSheetsService

router = APIRouter()

def generate_order_number() -> str:
    now = datetime.now()
    date_str = now.strftime("%Y%m%d")
    rand_num = random.randint(1000, 9999)
    return f"QH-{date_str}-{rand_num}"

def is_tamil_nadu(state_str: Optional[str]) -> bool:
    if not state_str:
        return False
    clean = state_str.strip().lower().replace(" ", "")
    return clean in ["tamilnadu", "tn"]

def compute_order_amounts(db: Session, order_in: schemas.OrderCreate, customer: models.Customer):
    computed_subtotal = 0.0
    order_items_prepared = []
    
    for item in order_in.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for product {product.name}. Available: {product.stock}"
            )
        
        unit_price = product.sale_price if (product.sale_price is not None and product.sale_price > 0) else product.price
        if item.variant:
            variant_obj = db.query(models.ProductVariant).filter(
                models.ProductVariant.product_id == product.id,
                models.ProductVariant.name == item.variant
            ).first()
            if variant_obj and variant_obj.price_override is not None:
                unit_price = variant_obj.price_override

        computed_subtotal += round(unit_price * item.quantity, 2)
        order_items_prepared.append((product, round(unit_price, 2), item))

    computed_subtotal = round(computed_subtotal, 2)

    computed_discount = 0.0
    offer_obj = None
    voucher_code_used = None

    if order_in.offer_id or order_in.voucher_code:
        if order_in.offer_id:
            offer_obj = db.query(models.Offer).filter(models.Offer.id == order_in.offer_id).first()
        elif order_in.voucher_code:
            offer_obj = db.query(models.Offer).filter(models.Offer.code == order_in.voucher_code.strip().upper()).first()

        if offer_obj and offer_obj.active:
            now = datetime.now()
            start_ok = not offer_obj.start_date or offer_obj.start_date <= now
            end_ok = not offer_obj.end_date or offer_obj.end_date >= now
            min_val_ok = computed_subtotal >= (offer_obj.minimum_order_value or 0)

            if start_ok and end_ok and min_val_ok:
                voucher_code_used = offer_obj.code
                if offer_obj.offer_type == "percentage":
                    computed_discount = round((computed_subtotal * offer_obj.discount_value) / 100.0, 2)
                    if offer_obj.maximum_discount:
                        computed_discount = min(computed_discount, round(offer_obj.maximum_discount, 2))
                else:
                    computed_discount = round(min(offer_obj.discount_value, computed_subtotal), 2)

    shipping_state = (order_in.state or customer.state or "").strip()
    computed_shipping = 80.0 if is_tamil_nadu(shipping_state) else 150.0

    computed_total = max(0.0, round(computed_subtotal - computed_discount + computed_shipping, 2))

    return {
        "subtotal": computed_subtotal,
        "discount": computed_discount,
        "shipping": computed_shipping,
        "total": computed_total,
        "offer": offer_obj,
        "voucher_code": voucher_code_used,
        "order_items_prepared": order_items_prepared,
        "shipping_address": order_in.shipping_address or customer.address,
        "city": order_in.city or customer.city,
        "district": order_in.district or customer.district,
        "state": shipping_state,
        "pincode": order_in.pincode or customer.pincode
    }

@router.post("", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_order(order_in: schemas.OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        # Verify customer exists
        customer = db.query(models.Customer).filter(models.Customer.id == order_in.customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
            
        order_number = generate_order_number()
        calc = compute_order_amounts(db, order_in, customer)
        
        db_order = models.Order(
            order_number=order_number,
            customer_id=order_in.customer_id,
            subtotal=calc["subtotal"],
            discount=calc["discount"],
            shipping=calc["shipping"],
            tax=0.0,
            total=calc["total"],
            payment_status="PAYMENT_PENDING",
            order_status="PAYMENT_PENDING",
            payment_id=order_in.payment_id,
            razorpay_order_id=order_in.razorpay_order_id,
            tracking_number=order_in.tracking_number,
            offer_id=calc["offer"].id if calc["offer"] else None,
            voucher_code=calc["voucher_code"],
            discount_amount=calc["discount"],
            shipping_discount=0.0,
            shipping_address=calc["shipping_address"],
            city=calc["city"],
            district=calc["district"],
            state=calc["state"],
            pincode=calc["pincode"]
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)

        # Initial timeline event
        initial_event = models.OrderTimelineEvent(
            order_id=db_order.id,
            status="ORDER_PLACED",
            notes="Order placed via checkout",
            created_by="Customer"
        )
        db.add(initial_event)

        # Record offer usage if applicable
        if calc["offer"]:
            calc["offer"].used_count = (calc["offer"].used_count or 0) + 1
            usage = models.OfferUsage(
                offer_id=calc["offer"].id,
                customer_id=order_in.customer_id,
                order_id=db_order.id,
                discount_amount=calc["discount"]
            )
            db.add(usage)
        
        order_items_list = []
        # Save order items and reduce stock
        for product, unit_price, item_in in calc["order_items_prepared"]:
            # Deduct stock
            product.stock -= item_in.quantity
            
            db_item = models.OrderItem(
                order_id=db_order.id,
                product_id=product.id,
                quantity=item_in.quantity,
                price=unit_price,
                variant=item_in.variant
            )
            db.add(db_item)
            order_items_list.append({
                "product_id": product.id,
                "name": product.name,
                "quantity": item_in.quantity,
                "price": unit_price,
                "variant": item_in.variant,
                "thumbnail": product.thumbnail
            })
            
        db.commit()
        db.refresh(db_order)

        # Queue Admin New Order Notification Email
        background_tasks.add_task(EmailService.send_admin_new_order_email, db, db_order, customer, order_items_list)

        # Synchronize order to Google Sheets
        try:
            GoogleSheetsService.sync_order(db, db_order, customer, order_items_list)
        except Exception as sheet_err:
            # Safe non-blocking catch: Database transaction has already succeeded
            pass

        return db_order
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Order creation failed: {str(e)}")

@router.get("", response_model=List[schemas.OrderResponse])
@router.get("/", response_model=List[schemas.OrderResponse], include_in_schema=False)
def list_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Order)
    if status:
        query = query.filter(models.Order.order_status == status)
    return query.order_by(models.Order.created_at.desc()).all()

@router.get("/analytics/shipping", response_model=schemas.ShippingAnalyticsResponse)
@router.get("/analytics/shipping/", response_model=schemas.ShippingAnalyticsResponse, include_in_schema=False)
def get_shipping_analytics(db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()
    total_orders = len(orders)
    tn_orders = 0
    outside_tn_orders = 0
    shipping_80_orders = 0
    shipping_150_orders = 0
    total_shipping_revenue = 0.0
    date_map = {}
    state_map = {}

    for ord in orders:
        st = (ord.state or (ord.customer.state if ord.customer else "") or "Unknown").strip()
        ship_charge = round(ord.shipping or 0.0, 2)
        total_shipping_revenue += ship_charge

        if is_tamil_nadu(st):
            tn_orders += 1
        else:
            outside_tn_orders += 1

        if abs(ship_charge - 80.0) < 0.01:
            shipping_80_orders += 1
        elif abs(ship_charge - 150.0) < 0.01:
            shipping_150_orders += 1

        dt_str = ord.created_at.strftime("%Y-%m-%d") if ord.created_at else "Unknown"
        date_map[dt_str] = round(date_map.get(dt_str, 0.0) + ship_charge, 2)

        st_clean = st.title() if st else "Unknown"
        if st_clean not in state_map:
            state_map[st_clean] = {"orders": 0, "revenue": 0.0}
        state_map[st_clean]["orders"] += 1
        state_map[st_clean]["revenue"] = round(state_map[st_clean]["revenue"] + ship_charge, 2)

    avg_shipping = round(total_shipping_revenue / total_orders, 2) if total_orders > 0 else 0.0

    revenue_by_date = [{"date": k, "revenue": v} for k, v in sorted(date_map.items())]
    revenue_by_state = [
        {"state": k, "orders": v["orders"], "revenue": v["revenue"]} 
        for k, v in sorted(state_map.items(), key=lambda x: x[1]["revenue"], reverse=True)
    ]

    return {
        "total_orders": total_orders,
        "tn_orders": tn_orders,
        "outside_tn_orders": outside_tn_orders,
        "shipping_80_orders": shipping_80_orders,
        "shipping_150_orders": shipping_150_orders,
        "total_shipping_revenue": round(total_shipping_revenue, 2),
        "avg_shipping_charge": avg_shipping,
        "revenue_by_date": revenue_by_date,
        "revenue_by_state": revenue_by_state
    }

@router.get("/{id}", response_model=schemas.OrderResponse)
def get_order(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/number/{order_number}", response_model=schemas.OrderResponse)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/customer/{customer_id}", response_model=List[schemas.OrderResponse])
def list_customer_orders(customer_id: int, db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.customer_id == customer_id).order_by(models.Order.created_at.desc()).all()

@router.put("/{id}/status", response_model=schemas.OrderResponse)
def update_order_status(id: int, payload: dict, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if "order_status" in payload:
        order.order_status = payload["order_status"]
    if "tracking_number" in payload:
        order.tracking_number = payload["tracking_number"]
    if "payment_status" in payload:
        order.payment_status = payload["payment_status"]
        
    db.commit()
    db.refresh(order)

    # Sync updated status to Google Sheets
    try:
        GoogleSheetsService.update_order_status(db, order)
    except Exception as e:
        pass

    return order

@router.post("/sync-sheets")
def sync_all_pending_sheets(limit: int = 50, db: Session = Depends(get_db)):
    """
    Retries synchronization for all orders where google_sheets_sync_status != 'SYNCED'.
    Also supports historical order synchronization.
    """
    result = GoogleSheetsService.retry_failed_syncs(db, limit=limit)
    return result

@router.post("/{id}/sync-sheet")
def sync_single_order_sheet(id: int, db: Session = Depends(get_db)):
    """
    Manually triggers or retries Google Sheets synchronization for a specific order.
    """
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    result = GoogleSheetsService.sync_order(db, order)
    return {
        "order_id": order.order_number,
        "sync_status": order.google_sheets_sync_status,
        "synced_at": order.google_sheets_synced_at,
        "error": order.google_sheets_sync_error,
        "details": result
    }
