from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

@router.post("/", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_or_get_customer(customer_in: schemas.CustomerCreate, db: Session = Depends(get_db)):
    # Check if customer already exists by email
    existing = db.query(models.Customer).filter(models.Customer.email == customer_in.email).first()
    if existing:
        # Update address details
        existing.name = customer_in.name
        existing.phone = customer_in.phone
        existing.address = customer_in.address
        existing.city = customer_in.city
        existing.state = customer_in.state
        existing.district = customer_in.district
        existing.pincode = customer_in.pincode
        if customer_in.user_id:
            existing.user_id = customer_in.user_id
        db.commit()
        db.refresh(existing)
        return existing
        
    db_customer = models.Customer(**customer_in.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@router.get("/{id}", response_model=schemas.CustomerResponse)
def get_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.get("/email/{email}", response_model=schemas.CustomerResponse)
def get_customer_by_email(email: str, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.email == email).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
