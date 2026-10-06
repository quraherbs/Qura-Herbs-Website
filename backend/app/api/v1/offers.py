from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

@router.get("", response_model=List[schemas.OfferResponse])
@router.get("/", response_model=List[schemas.OfferResponse], include_in_schema=False)
def list_offers(active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Offer)
    if active_only:
        now = datetime.now()
        query = query.filter(
            models.Offer.active == True,
            (models.Offer.start_date == None) | (models.Offer.start_date <= now),
            (models.Offer.end_date == None) | (models.Offer.end_date >= now)
        )
    return query.order_by(models.Offer.created_at.desc()).all()

@router.get("/analytics", response_model=dict)
@router.get("/analytics/", response_model=dict, include_in_schema=False)
def get_offer_analytics(db: Session = Depends(get_db)):
    now = datetime.now()
    total_offers = db.query(models.Offer).count()
    active_offers = db.query(models.Offer).filter(
        models.Offer.active == True,
        (models.Offer.start_date == None) | (models.Offer.start_date <= now),
        (models.Offer.end_date == None) | (models.Offer.end_date >= now)
    ).count()
    
    expired_offers = db.query(models.Offer).filter(
        (models.Offer.end_date != None) & (models.Offer.end_date < now)
    ).count()

    total_uses = db.query(func.sum(models.Offer.used_count)).scalar() or 0
    total_discount = db.query(func.sum(models.OfferUsage.discount_amount)).scalar() or 0.0

    return {
        "total_offers": total_offers,
        "active_offers": active_offers,
        "expired_offers": expired_offers,
        "total_uses": total_uses,
        "total_discount": total_discount
    }

@router.post("/validate", response_model=schemas.OfferValidateResponse)
@router.post("/validate/", response_model=schemas.OfferValidateResponse, include_in_schema=False)
def validate_offer(payload: schemas.OfferValidateRequest, db: Session = Depends(get_db)):
    code_clean = payload.voucher_code.strip().upper()
    now = datetime.now()

    offer = db.query(models.Offer).filter(func.upper(models.Offer.code) == code_clean).first()
    if not offer:
        return schemas.OfferValidateResponse(
            valid=False,
            voucher_code=code_clean,
            offer_name="",
            offer_type="",
            discount_amount=0.0,
            shipping_discount=0.0,
            final_subtotal=payload.cart_subtotal,
            final_total=payload.cart_subtotal,
            message="Voucher code not found."
        )

    if not offer.active:
        return schemas.OfferValidateResponse(
            valid=False,
            voucher_code=offer.code,
            offer_name=offer.name,
            offer_type=offer.offer_type,
            discount_amount=0.0,
            shipping_discount=0.0,
            final_subtotal=payload.cart_subtotal,
            final_total=payload.cart_subtotal,
            message="This voucher is currently unavailable."
        )

    if offer.start_date and now < offer.start_date:
        return schemas.OfferValidateResponse(
            valid=False,
            voucher_code=offer.code,
            offer_name=offer.name,
            offer_type=offer.offer_type,
            discount_amount=0.0,
            shipping_discount=0.0,
            final_subtotal=payload.cart_subtotal,
            final_total=payload.cart_subtotal,
            message="This voucher is scheduled and not active yet."
        )

    if offer.end_date and now > offer.end_date:
        return schemas.OfferValidateResponse(
            valid=False,
            voucher_code=offer.code,
            offer_name=offer.name,
            offer_type=offer.offer_type,
            discount_amount=0.0,
            shipping_discount=0.0,
            final_subtotal=payload.cart_subtotal,
            final_total=payload.cart_subtotal,
            message="This voucher has expired."
        )

    if payload.cart_subtotal < offer.minimum_order_value:
        return schemas.OfferValidateResponse(
            valid=False,
            voucher_code=offer.code,
            offer_name=offer.name,
            offer_type=offer.offer_type,
            discount_amount=0.0,
            shipping_discount=0.0,
            final_subtotal=payload.cart_subtotal,
            final_total=payload.cart_subtotal,
            message=f"Minimum order value is ₹{offer.minimum_order_value:.0f}."
        )

    if offer.usage_limit and offer.used_count >= offer.usage_limit:
        return schemas.OfferValidateResponse(
            valid=False,
            voucher_code=offer.code,
            offer_name=offer.name,
            offer_type=offer.offer_type,
            discount_amount=0.0,
            shipping_discount=0.0,
            final_subtotal=payload.cart_subtotal,
            final_total=payload.cart_subtotal,
            message="Voucher usage limit has been reached."
        )

    # Check customer limits
    if payload.customer_id:
        used_by_cust = db.query(models.OfferUsage).filter(
            models.OfferUsage.offer_id == offer.id,
            models.OfferUsage.customer_id == payload.customer_id
        ).count()
        if used_by_cust >= offer.per_customer_limit:
            return schemas.OfferValidateResponse(
                valid=False,
                voucher_code=offer.code,
                offer_name=offer.name,
                offer_type=offer.offer_type,
                discount_amount=0.0,
                shipping_discount=0.0,
                final_subtotal=payload.cart_subtotal,
                final_total=payload.cart_subtotal,
                message="You have already used this voucher."
            )

        if offer.first_order_only:
            prev_orders = db.query(models.Order).filter(models.Order.customer_id == payload.customer_id).count()
            if prev_orders > 0:
                return schemas.OfferValidateResponse(
                    valid=False,
                    voucher_code=offer.code,
                    offer_name=offer.name,
                    offer_type=offer.offer_type,
                    discount_amount=0.0,
                    shipping_discount=0.0,
                    final_subtotal=payload.cart_subtotal,
                    final_total=payload.cart_subtotal,
                    message="This voucher is valid only for first orders."
                )

    # Calculate discount amount
    discount = 0.0
    shipping_disc = 0.0

    if offer.offer_type == "percentage":
        discount = (payload.cart_subtotal * offer.discount_value) / 100.0
        if offer.maximum_discount and discount > offer.maximum_discount:
            discount = offer.maximum_discount
    elif offer.offer_type == "flat":
        discount = min(offer.discount_value, payload.cart_subtotal)
    elif offer.offer_type == "free_shipping":
        shipping_disc = 99.0

    final_subtotal = max(0.0, payload.cart_subtotal - discount)
    final_total = final_subtotal

    msg = f"✓ {offer.code} applied! Saved ₹{(discount + shipping_disc):.0f}."

    return schemas.OfferValidateResponse(
        valid=True,
        voucher_code=offer.code,
        offer_name=offer.name,
        offer_type=offer.offer_type,
        discount_amount=discount,
        shipping_discount=shipping_disc,
        final_subtotal=final_subtotal,
        final_total=final_total,
        message=msg,
        offer_id=offer.id
    )

@router.post("", response_model=schemas.OfferResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.OfferResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_offer(offer_in: schemas.OfferCreate, db: Session = Depends(get_db)):
    try:
        code_clean = offer_in.code.strip().upper()
        existing = db.query(models.Offer).filter(func.upper(models.Offer.code) == code_clean).first()
        if existing:
            raise HTTPException(status_code=400, detail="Voucher code already exists.")

        offer_data = offer_in.model_dump()
        offer_data["code"] = code_clean
        db_offer = models.Offer(**offer_data)
        db.add(db_offer)
        db.commit()
        db.refresh(db_offer)
        return db_offer
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create offer: {str(e)}")

@router.put("/{id}", response_model=schemas.OfferResponse)
def update_offer(id: int, offer_in: schemas.OfferCreate, db: Session = Depends(get_db)):
    try:
        db_offer = db.query(models.Offer).filter(models.Offer.id == id).first()
        if not db_offer:
            raise HTTPException(status_code=404, detail="Offer not found")

        code_clean = offer_in.code.strip().upper()
        for key, val in offer_in.model_dump().items():
            if key == "code":
                setattr(db_offer, key, code_clean)
            else:
                setattr(db_offer, key, val)

        db.commit()
        db.refresh(db_offer)
        return db_offer
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update offer: {str(e)}")

@router.delete("/{id}")
def delete_offer(id: int, db: Session = Depends(get_db)):
    db_offer = db.query(models.Offer).filter(models.Offer.id == id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    try:
        db.query(models.OfferUsage).filter(models.OfferUsage.offer_id == id).delete()
        orders = db.query(models.Order).filter(models.Order.offer_id == id).all()
        for ord in orders:
            ord.offer_id = None
        db.delete(db_offer)
        db.commit()
    except Exception:
        db.rollback()
        db_offer.active = False
        db.commit()
    return {"message": "Offer deleted successfully"}
