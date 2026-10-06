from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

@router.get("/product/{product_id}", response_model=List[schemas.ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    return db.query(models.Review).filter(
        models.Review.product_id == product_id,
        models.Review.approved == True
    ).order_by(models.Review.created_at.desc()).all()

@router.post("", response_model=schemas.ReviewResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ReviewResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_review(review_in: schemas.ReviewCreate, db: Session = Depends(get_db)):
    try:
        # Verify product exists
        product = db.query(models.Product).filter(models.Product.id == review_in.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        customer = None
        if review_in.customer_id:
            customer = db.query(models.Customer).filter(models.Customer.id == review_in.customer_id).first()
            
        if not customer:
            name = review_in.customer_name or "Anonymous Buyer"
            email = review_in.customer_email or f"{name.lower().replace(' ', '.')}@quraherbs-reviewer.com"
            
            customer = db.query(models.Customer).filter(models.Customer.email == email).first()
            if not customer:
                customer = models.Customer(
                    name=name,
                    email=email,
                    phone="0000000000",
                    address="Admin Created Review",
                    city="Unknown",
                    state="Unknown",
                    pincode="000000"
                )
                db.add(customer)
                db.commit()
                db.refresh(customer)

        # Check if customer actually purchased the product to set verified_purchase
        purchased = db.query(models.OrderItem).join(models.Order).filter(
            models.Order.customer_id == customer.id,
            models.OrderItem.product_id == review_in.product_id,
            models.Order.payment_status == "paid"
        ).first() is not None

        db_review = models.Review(
            product_id=review_in.product_id,
            customer_id=customer.id,
            rating=review_in.rating,
            review=review_in.review,
            image=review_in.image,
            featured=review_in.featured,
            verified_purchase=purchased,
            approved=True  # Auto-approve if created by admin/manually
        )
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        return db_review
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create review: {str(e)}")

@router.get("", response_model=List[schemas.ReviewResponse])
@router.get("/", response_model=List[schemas.ReviewResponse], include_in_schema=False)
def list_all_reviews(approved: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(models.Review)
    if approved is not None:
        query = query.filter(models.Review.approved == approved)
    return query.order_by(models.Review.created_at.desc()).all()

@router.put("/{id}", response_model=schemas.ReviewResponse)
def update_review(id: int, review_in: schemas.ReviewCreate, db: Session = Depends(get_db)):
    try:
        db_review = db.query(models.Review).filter(models.Review.id == id).first()
        if not db_review:
            raise HTTPException(status_code=404, detail="Review not found")
            
        db_review.rating = review_in.rating
        db_review.review = review_in.review
        db_review.image = review_in.image
        db_review.featured = review_in.featured
        
        if review_in.customer_id:
            db_review.customer_id = review_in.customer_id
            
        if db_review.customer:
            if review_in.customer_name:
                db_review.customer.name = review_in.customer_name
            if review_in.customer_email:
                db_review.customer.email = review_in.customer_email
                
        db.commit()
        db.refresh(db_review)
        return db_review
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update review: {str(e)}")

@router.put("/{id}/approve", response_model=schemas.ReviewResponse)
def approve_review(id: int, db: Session = Depends(get_db)):
    try:
        review = db.query(models.Review).filter(models.Review.id == id).first()
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        review.approved = True
        db.commit()
        db.refresh(review)
        return review
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to approve review: {str(e)}")

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(id: int, db: Session = Depends(get_db)):
    try:
        review = db.query(models.Review).filter(models.Review.id == id).first()
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        db.delete(review)
        db.commit()
        return None
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete review: {str(e)}")
