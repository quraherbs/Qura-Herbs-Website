from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

def _format_product(prod: models.Product):
    if prod is None:
        return None
    cat_ids = [c.id for c in prod.categories]
    if prod.category_id and prod.category_id not in cat_ids:
        cat_ids.insert(0, prod.category_id)
    setattr(prod, "category_ids", cat_ids)
    return prod

@router.get("", response_model=List[schemas.ProductResponse])
@router.get("/", response_model=List[schemas.ProductResponse], include_in_schema=False)
def list_products(
    category_id: Optional[int] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    active_only: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    if active_only:
        query = query.filter(models.Product.active == True)
    
    if category_id is not None:
        query = query.filter(
            (models.Product.category_id == category_id) |
            (models.Product.categories.any(models.Category.id == category_id))
        )
    if featured is not None:
        query = query.filter(models.Product.featured == featured)
    if search:
        query = query.filter(
            (models.Product.name.ilike(f"%{search}%")) |
            (models.Product.short_description.ilike(f"%{search}%"))
        )
        
    products = query.order_by(models.Product.id.desc()).all()
    return [_format_product(p) for p in products]

@router.get("/{id}", response_model=schemas.ProductResponse)
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _format_product(product)

@router.get("/slug/{slug}", response_model=schemas.ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _format_product(product)

@router.post("", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    try:
        # Check if slug is unique
        existing = db.query(models.Product).filter(models.Product.slug == product_in.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Product save failed: Slug '{product_in.slug}' already exists. Please enter a unique slug.")
            
        # Check if SKU is unique
        if product_in.SKU:
            existing_sku = db.query(models.Product).filter(models.Product.SKU == product_in.SKU).first()
            if existing_sku:
                raise HTTPException(status_code=400, detail=f"Product save failed: SKU '{product_in.SKU}' already exists. Please use a unique SKU.")

        # Extract variants and category_ids
        variants_data = product_in.variants or []
        category_ids = product_in.category_ids or ([product_in.category_id] if product_in.category_id else [])
        
        product_dict = product_in.model_dump(exclude={"variants", "category_ids"})
        if category_ids and not product_dict.get("category_id"):
            product_dict["category_id"] = category_ids[0]
            
        db_product = models.Product(**product_dict)
        
        if category_ids:
            cats = db.query(models.Category).filter(models.Category.id.in_(category_ids)).all()
            db_product.categories = cats
            
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        
        for variant in variants_data:
            db_variant = models.ProductVariant(**variant.model_dump(), product_id=db_product.id)
            db.add(db_variant)
        
        db.commit()
        db.refresh(db_product)
        return _format_product(db_product)
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database save failed: {str(e)}")

@router.put("/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    try:
        db_product = db.query(models.Product).filter(models.Product.id == id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        # Check slug uniqueness if changed
        if product_in.slug != db_product.slug:
            existing = db.query(models.Product).filter(models.Product.slug == product_in.slug, models.Product.id != id).first()
            if existing:
                raise HTTPException(status_code=400, detail=f"Product save failed: Slug '{product_in.slug}' already exists. Please enter a unique slug.")

        # Check SKU uniqueness if changed
        if product_in.SKU and product_in.SKU != db_product.SKU:
            existing_sku = db.query(models.Product).filter(models.Product.SKU == product_in.SKU, models.Product.id != id).first()
            if existing_sku:
                raise HTTPException(status_code=400, detail=f"Product save failed: SKU '{product_in.SKU}' already exists. Please use a unique SKU.")

        category_ids = product_in.category_ids
        product_dict = product_in.model_dump(exclude={"variants", "category_ids"})
        
        for key, val in product_dict.items():
            setattr(db_product, key, val)
            
        if category_ids is not None:
            cats = db.query(models.Category).filter(models.Category.id.in_(category_ids)).all()
            db_product.categories = cats
            if category_ids:
                db_product.category_id = category_ids[0]
            
        # Re-sync variants if provided
        if product_in.variants is not None:
            db.query(models.ProductVariant).filter(models.ProductVariant.product_id == id).delete()
            for variant in product_in.variants:
                db_variant = models.ProductVariant(**variant.model_dump(), product_id=id)
                db.add(db_variant)
                
        db.commit()
        db.refresh(db_product)
        return _format_product(db_product)
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database save failed: {str(e)}")

@router.delete("/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    try:
        # Delete associated variants & reviews first
        db.query(models.ProductVariant).filter(models.ProductVariant.product_id == id).delete()
        db.query(models.Review).filter(models.Review.product_id == id).delete()
        db.delete(db_product)
        db.commit()
    except Exception as e:
        db.rollback()
        # If product is referenced in order_items, soft-delete to preserve order history
        db_product.active = False
        db.commit()

    return {"message": "Product deleted successfully"}
