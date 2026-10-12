from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

# --- HERO BANNERS ---
@router.get("/hero-banners", response_model=List[schemas.HeroBannerResponse])
@router.get("/hero-banners/", response_model=List[schemas.HeroBannerResponse], include_in_schema=False)
def list_hero_banners(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.HeroBanner)
    if active_only:
        query = query.filter(models.HeroBanner.active == True)
    return query.order_by(models.HeroBanner.display_order.asc(), models.HeroBanner.id.asc()).all()

@router.post("/hero-banners", response_model=schemas.HeroBannerResponse, status_code=status.HTTP_201_CREATED)
@router.post("/hero-banners/", response_model=schemas.HeroBannerResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_hero_banner(banner_in: schemas.HeroBannerCreate, db: Session = Depends(get_db)):
    try:
        db_banner = models.HeroBanner(**banner_in.model_dump())
        db.add(db_banner)
        db.commit()
        db.refresh(db_banner)
        return db_banner
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create hero banner: {str(e)}")

@router.put("/hero-banners/{id}", response_model=schemas.HeroBannerResponse)
def update_hero_banner(id: int, banner_in: schemas.HeroBannerCreate, db: Session = Depends(get_db)):
    try:
        db_banner = db.query(models.HeroBanner).filter(models.HeroBanner.id == id).first()
        if not db_banner:
            raise HTTPException(status_code=404, detail="Hero banner not found")

        for key, val in banner_in.model_dump().items():
            setattr(db_banner, key, val)

        db.commit()
        db.refresh(db_banner)
        return db_banner
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update hero banner: {str(e)}")

@router.delete("/hero-banners/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hero_banner(id: int, db: Session = Depends(get_db)):
    try:
        db_banner = db.query(models.HeroBanner).filter(models.HeroBanner.id == id).first()
        if not db_banner:
            raise HTTPException(status_code=404, detail="Hero banner not found")
        db.delete(db_banner)
        db.commit()
        return None
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete hero banner: {str(e)}")

# --- RESULTS GALLERY ---
@router.get("/results-gallery", response_model=List[schemas.ResultGalleryResponse])
@router.get("/results-gallery/", response_model=List[schemas.ResultGalleryResponse], include_in_schema=False)
def list_results_gallery(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.ResultGalleryItem)
    if active_only:
        query = query.filter(models.ResultGalleryItem.active == True)
    return query.order_by(models.ResultGalleryItem.display_order.asc(), models.ResultGalleryItem.id.asc()).all()

@router.post("/results-gallery", response_model=schemas.ResultGalleryResponse, status_code=status.HTTP_201_CREATED)
@router.post("/results-gallery/", response_model=schemas.ResultGalleryResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_result_item(item_in: schemas.ResultGalleryCreate, db: Session = Depends(get_db)):
    try:
        db_item = models.ResultGalleryItem(**item_in.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create result item: {str(e)}")

@router.put("/results-gallery/{id}", response_model=schemas.ResultGalleryResponse)
def update_result_item(id: int, item_in: schemas.ResultGalleryCreate, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.ResultGalleryItem).filter(models.ResultGalleryItem.id == id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Result item not found")

        for key, val in item_in.model_dump().items():
            setattr(db_item, key, val)

        db.commit()
        db.refresh(db_item)
        return db_item
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update result item: {str(e)}")

@router.delete("/results-gallery/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_result_item(id: int, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.ResultGalleryItem).filter(models.ResultGalleryItem.id == id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Result item not found")
        db.delete(db_item)
        db.commit()
        return None
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete result item: {str(e)}")

# --- FOUNDER STORY ---
@router.get("/founder")
@router.get("/founder/", include_in_schema=False)
def get_founder_content(db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "founder_story").first()
    if not setting:
        return {
            "name": "Nandavel V",
            "founder_name": "Nandavel V",
            "title": "Founder, Qura Herbs",
            "founder_designation": "Founder, Qura Herbs",
            "eyebrow": "SECTION 02 • THE FOUNDER",
            "heading": "MEET THE FOUNDER",
            "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/nandavel_founder.jpg",
            "founder_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/nandavel_founder.jpg",
            "headline": "Qura Herbs began with Nandavel's own skin journey.",
            "quote": "“Qura Herbs started with my own skin journey. I wanted to bring that experience to people who were going through something similar and help them feel more comfortable in their own skin.”",
            "founder_quote": "“Qura Herbs started with my own skin journey. I wanted to bring that experience to people who were going through something similar and help them feel more comfortable in their own skin.”",
            "description": "Having experienced skin concerns himself, he understood the insecurity and frustration that can come with trying to find the right care. His personal experience with skincare and herbal ingredients eventually inspired him to build something that could reach people facing similar concerns.\n\nHis vision was simple, to make people feel more confident in their own skin through better care, not through unrealistic standards of beauty.\n\nFrom understanding customer concerns and exploring ingredients to selecting products and shaping the brand, Nandavel continues to be closely involved in the foundation and direction of Qura Herbs.",
            "founder_bio": "Having experienced skin concerns himself, he understood the insecurity and frustration that can come with trying to find the right care. His personal experience with skincare and herbal ingredients eventually inspired him to build something that could reach people facing similar concerns.\n\nHis vision was simple, to make people feel more confident in their own skin through better care, not through unrealistic standards of beauty.\n\nFrom understanding customer concerns and exploring ingredients to selecting products and shaping the brand, Nandavel continues to be closely involved in the foundation and direction of Qura Herbs.",
            "signature": "— Nandavel V\nFounder, Qura Herbs"
        }
    return setting.value

@router.post("/founder")
@router.post("/founder/", include_in_schema=False)
def update_founder_content(payload: dict, db: Session = Depends(get_db)):
    try:
        img = payload.get("image") or payload.get("founder_image")
        if img:
            payload["image"] = img
            payload["founder_image"] = img

        setting = db.query(models.Setting).filter(models.Setting.key == "founder_story").first()
        if not setting:
            setting = models.Setting(key="founder_story", value=payload)
            db.add(setting)
        else:
            setting.value = payload

        db.commit()
        return {"success": True, "value": payload}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update founder story: {str(e)}")

# --- CEO STORY ---
@router.get("/ceo")
@router.get("/ceo/", include_in_schema=False)
def get_ceo_content(db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "ceo_story").first()
    if not setting:
        return {
            "name": "Pranavi GY",
            "ceo_name": "Pranavi GY",
            "title": "Co-Founder & CEO, Qura Herbs",
            "ceo_designation": "Co-Founder & CEO, Qura Herbs",
            "eyebrow": "SECTION 03 • CO-FOUNDER & CEO",
            "heading": "MEET THE CO-FOUNDER & CEO",
            "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/ceo_pranavi.jpg",
            "ceo_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/ceo_pranavi.jpg",
            "headline": "Pranavi believed everyone deserved to feel confident in their own skin.",
            "quote": "“For me, Qura is more than a business. It is a feeling that deserves to be experienced, expressed, and carried forward.”",
            "ceo_quote": "“For me, Qura is more than a business. It is a feeling that deserves to be experienced, expressed, and carried forward.”",
            "description": "As Qura Herbs continued to take shape, Pranavi became part of the journey, bringing her own perspective, creativity, and ideas to the brand.\n\nWith a strong eye for aesthetics, creativity, and communication, Pranavi brings a distinct perspective to Qura Herbs. As someone who genuinely values self-care, she believes that taking care of your skin and yourself should be a positive and empowering experience. Her ideas and creative direction shape Qura's visual identity, presentation, and voice, bringing this belief into the way the brand expresses itself.",
            "ceo_bio": "As Qura Herbs continued to take shape, Pranavi became part of the journey, bringing her own perspective, creativity, and ideas to the brand.\n\nWith a strong eye for aesthetics, creativity, and communication, Pranavi brings a distinct perspective to Qura Herbs. As someone who genuinely values self-care, she believes that taking care of your skin and yourself should be a positive and empowering experience. Her ideas and creative direction shape Qura's visual identity, presentation, and voice, bringing this belief into the way the brand expresses itself.",
            "signature": "— Pranavi GY\nCo-Founder & CEO, Qura Herbs"
        }
    return setting.value

@router.post("/ceo")
@router.post("/ceo/", include_in_schema=False)
def update_ceo_content(payload: dict, db: Session = Depends(get_db)):
    try:
        img = payload.get("image") or payload.get("ceo_image")
        if img:
            payload["image"] = img
            payload["ceo_image"] = img

        setting = db.query(models.Setting).filter(models.Setting.key == "ceo_story").first()
        if not setting:
            setting = models.Setting(key="ceo_story", value=payload)
            db.add(setting)
        else:
            setting.value = payload

        db.commit()
        return {"success": True, "value": payload}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update CEO story: {str(e)}")

# --- ABOUT PAGE CONTENT ---
@router.get("/about")
@router.get("/about/", include_in_schema=False)
def get_about_content(db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "about_page").first()
    if not setting:
        return {
            "brand_name": "QURA HERBS",
            "tagline": "Skin That Feels Like You.",
            "subtitle": "OUR STORY",
            "title": "Skin That Feels Like You.",
            "hero_heading": "Skin That Feels Like You.",
            "hero_paragraph1": "Qura Herbs is a skincare and haircare brand built around a simple belief people should feel comfortable and confident in their own skin.\n\nFounded in Coimbatore - 2025, Qura Herbs began with a personal skin journey and has grown through real customer experiences, offline connections, and now an expanding online community of 300+ customers.",
            "hero_paragraph2": "We bring together skincare and haircare products made with herbal and botanical ingredients, selected with care for everyday skin and hair concerns. Our focus is on thoughtful products, honest communication, and routines that are simple enough to become part of everyday life.\n\nWhat began with a small circle of customers is now growing into a brand with a larger purpose helping people care for their skin and hair without feeling the need to change who they are.",
            "purpose_heading": "GROWING WITH PURPOSE",
            "purpose_paragraph": "As an authorised reseller, we continue to grow through customer feedback, thoughtful product selection, and a commitment to presenting trusted skincare and haircare with transparency.",
            "purpose_quote": "Beauty isn't about changing who you are. It's about caring for who you are.",
            "hero_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/product-images/d5dbde14da8c48a5ab796d080b563d42.jpg",
            "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/product-images/d5dbde14da8c48a5ab796d080b563d42.jpg"
        }
    return setting.value

@router.post("/about")
@router.post("/about/", include_in_schema=False)
def update_about_content(payload: dict, db: Session = Depends(get_db)):
    try:
        hero_img = payload.get("image") or payload.get("hero_image")
        if hero_img:
            payload["image"] = hero_img
            payload["hero_image"] = hero_img

        setting = db.query(models.Setting).filter(models.Setting.key == "about_page").first()
        if not setting:
            setting = models.Setting(key="about_page", value=payload)
            db.add(setting)
        else:
            setting.value = payload

        db.commit()
        return {"success": True, "value": payload}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update about page: {str(e)}")


# --- REAL RESULTS CRUD ---
@router.get("/real-results", response_model=List[schemas.RealResultResponse])
@router.get("/real-results/", response_model=List[schemas.RealResultResponse], include_in_schema=False)
def list_real_results(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.RealResult)
    if active_only:
        query = query.filter(models.RealResult.active == True)
    return query.order_by(models.RealResult.display_order.asc(), models.RealResult.id.asc()).all()

@router.post("/real-results", response_model=schemas.RealResultResponse, status_code=status.HTTP_201_CREATED)
@router.post("/real-results/", response_model=schemas.RealResultResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_real_result(item_in: schemas.RealResultCreate, db: Session = Depends(get_db)):
    try:
        db_item = models.RealResult(**item_in.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create real result: {str(e)}")

@router.put("/real-results/{id}", response_model=schemas.RealResultResponse)
def update_real_result(id: int, item_in: schemas.RealResultCreate, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.RealResult).filter(models.RealResult.id == id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Real result item not found")

        for key, val in item_in.model_dump().items():
            setattr(db_item, key, val)

        db.commit()
        db.refresh(db_item)
        return db_item
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update real result: {str(e)}")

@router.patch("/real-results/{id}/toggle", response_model=schemas.RealResultResponse)
def toggle_real_result_status(id: int, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.RealResult).filter(models.RealResult.id == id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Real result item not found")

        db_item.active = not db_item.active
        db.commit()
        db.refresh(db_item)
        return db_item
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to toggle real result status: {str(e)}")

@router.delete("/real-results/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_real_result(id: int, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.RealResult).filter(models.RealResult.id == id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Real result item not found")
        db.delete(db_item)
        db.commit()
        return None
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete real result: {str(e)}")


# --- BOTANICAL ROUTINE JOURNEYS CRUD ---
@router.get("/botanical-journeys", response_model=List[schemas.BotanicalJourneyResponse])
@router.get("/botanical-journeys/", response_model=List[schemas.BotanicalJourneyResponse], include_in_schema=False)
def list_botanical_journeys(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.BotanicalJourney)
    if active_only:
        query = query.filter(models.BotanicalJourney.active == True)
    return query.order_by(models.BotanicalJourney.display_order.asc(), models.BotanicalJourney.id.asc()).all()

@router.post("/botanical-journeys", response_model=schemas.BotanicalJourneyResponse, status_code=status.HTTP_201_CREATED)
@router.post("/botanical-journeys/", response_model=schemas.BotanicalJourneyResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_botanical_journey(journey_in: schemas.BotanicalJourneyCreate, db: Session = Depends(get_db)):
    try:
        db_journey = models.BotanicalJourney(**journey_in.model_dump())
        db.add(db_journey)
        db.commit()
        db.refresh(db_journey)
        return db_journey
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create botanical journey: {str(e)}")

@router.put("/botanical-journeys/{id}", response_model=schemas.BotanicalJourneyResponse)
def update_botanical_journey(id: int, journey_in: schemas.BotanicalJourneyCreate, db: Session = Depends(get_db)):
    try:
        db_journey = db.query(models.BotanicalJourney).filter(models.BotanicalJourney.id == id).first()
        if not db_journey:
            raise HTTPException(status_code=404, detail="Botanical journey not found")

        for key, val in journey_in.model_dump().items():
            setattr(db_journey, key, val)

        db.commit()
        db.refresh(db_journey)
        return db_journey
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update botanical journey: {str(e)}")

@router.patch("/botanical-journeys/{id}/toggle", response_model=schemas.BotanicalJourneyResponse)
def toggle_botanical_journey_status(id: int, db: Session = Depends(get_db)):
    try:
        db_journey = db.query(models.BotanicalJourney).filter(models.BotanicalJourney.id == id).first()
        if not db_journey:
            raise HTTPException(status_code=404, detail="Botanical journey not found")

        db_journey.active = not db_journey.active
        db.commit()
        db.refresh(db_journey)
        return db_journey
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to toggle botanical journey status: {str(e)}")

@router.delete("/botanical-journeys/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_botanical_journey(id: int, db: Session = Depends(get_db)):
    try:
        db_journey = db.query(models.BotanicalJourney).filter(models.BotanicalJourney.id == id).first()
        if not db_journey:
            raise HTTPException(status_code=404, detail="Botanical journey not found")
        db.delete(db_journey)
        db.commit()
        return None
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete botanical journey: {str(e)}")
