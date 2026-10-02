from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).filter(models.Category.active == True).order_by(models.Category.display_order).all()

@router.get("/{id}", response_model=schemas.CategoryResponse)
def get_category(id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.get("/slug/{slug}", response_model=schemas.CategoryResponse)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.slug == slug).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_in: schemas.CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Category).filter(models.Category.slug == category_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category slug must be unique")
    db_category = models.Category(**category_in.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.put("/{id}", response_model=schemas.CategoryResponse)
def update_category(id: int, category_in: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, val in category_in.model_dump().items():
        setattr(db_category, key, val)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{id}")
def delete_category(id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    try:
        db.delete(db_category)
        db.commit()
    except Exception:
        db.rollback()
        db_category.active = False
        db.commit()
    return {"message": "Category deleted successfully"}
