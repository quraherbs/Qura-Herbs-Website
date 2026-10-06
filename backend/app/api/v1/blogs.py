from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas
from datetime import datetime

router = APIRouter()

@router.get("", response_model=List[schemas.BlogResponse])
@router.get("/", response_model=List[schemas.BlogResponse], include_in_schema=False)
def list_blogs(published_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.Blog)
    if published_only:
        query = query.filter(models.Blog.published == True)
    return query.order_by(models.Blog.published_at.desc()).all()

@router.get("/{id}", response_model=schemas.BlogResponse)
def get_blog(id: int, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.get("/slug/{slug}", response_model=schemas.BlogResponse)
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.post("", response_model=schemas.BlogResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.BlogResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_blog(blog_in: schemas.BlogCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(models.Blog).filter(models.Blog.slug == blog_in.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="Blog slug must be unique")
            
        blog_dict = blog_in.model_dump()
        if blog_dict.get("published") and not blog_dict.get("published_at"):
            blog_dict["published_at"] = datetime.now()
            
        db_blog = models.Blog(**blog_dict)
        db.add(db_blog)
        db.commit()
        db.refresh(db_blog)
        return db_blog
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create blog: {str(e)}")

@router.put("/{id}", response_model=schemas.BlogResponse)
def update_blog(id: int, blog_in: schemas.BlogCreate, db: Session = Depends(get_db)):
    try:
        db_blog = db.query(models.Blog).filter(models.Blog.id == id).first()
        if not db_blog:
            raise HTTPException(status_code=404, detail="Blog not found")
            
        blog_dict = blog_in.model_dump()
        # Handle publishing dates
        if blog_dict.get("published") and not db_blog.published:
            blog_dict["published_at"] = datetime.now()
        elif not blog_dict.get("published"):
            blog_dict["published_at"] = None
            
        for key, val in blog_dict.items():
            setattr(db_blog, key, val)
            
        db.commit()
        db.refresh(db_blog)
        return db_blog
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update blog: {str(e)}")

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id: int, db: Session = Depends(get_db)):
    try:
        db_blog = db.query(models.Blog).filter(models.Blog.id == id).first()
        if not db_blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        db.delete(db_blog)
        db.commit()
        return None
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete blog: {str(e)}")
