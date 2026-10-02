from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

# --- HERO BANNERS ---
@router.get("/hero-banners", response_model=List[schemas.HeroBannerResponse])
def list_hero_banners(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.HeroBanner)
    if active_only:
        query = query.filter(models.HeroBanner.active == True)
    return query.order_by(models.HeroBanner.display_order.asc(), models.HeroBanner.id.asc()).all()

@router.post("/hero-banners", response_model=schemas.HeroBannerResponse, status_code=status.HTTP_201_CREATED)
def create_hero_banner(banner_in: schemas.HeroBannerCreate, db: Session = Depends(get_db)):
    db_banner = models.HeroBanner(**banner_in.model_dump())
    db.add(db_banner)
    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.put("/hero-banners/{id}", response_model=schemas.HeroBannerResponse)
def update_hero_banner(id: int, banner_in: schemas.HeroBannerCreate, db: Session = Depends(get_db)):
    db_banner = db.query(models.HeroBanner).filter(models.HeroBanner.id == id).first()
    if not db_banner:
        raise HTTPException(status_code=404, detail="Hero banner not found")

    for key, val in banner_in.model_dump().items():
        setattr(db_banner, key, val)

    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.delete("/hero-banners/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hero_banner(id: int, db: Session = Depends(get_db)):
    db_banner = db.query(models.HeroBanner).filter(models.HeroBanner.id == id).first()
    if not db_banner:
        raise HTTPException(status_code=404, detail="Hero banner not found")
    db.delete(db_banner)
    db.commit()
    return None

# --- RESULTS GALLERY ---
@router.get("/results-gallery", response_model=List[schemas.ResultGalleryResponse])
def list_results_gallery(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.ResultGalleryItem)
    if active_only:
        query = query.filter(models.ResultGalleryItem.active == True)
    return query.order_by(models.ResultGalleryItem.display_order.asc(), models.ResultGalleryItem.id.asc()).all()

@router.post("/results-gallery", response_model=schemas.ResultGalleryResponse, status_code=status.HTTP_201_CREATED)
def create_result_item(item_in: schemas.ResultGalleryCreate, db: Session = Depends(get_db)):
    db_item = models.ResultGalleryItem(**item_in.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/results-gallery/{id}", response_model=schemas.ResultGalleryResponse)
def update_result_item(id: int, item_in: schemas.ResultGalleryCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.ResultGalleryItem).filter(models.ResultGalleryItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Result item not found")

    for key, val in item_in.model_dump().items():
        setattr(db_item, key, val)

    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/results-gallery/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_result_item(id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.ResultGalleryItem).filter(models.ResultGalleryItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Result item not found")
    db.delete(db_item)
    db.commit()
    return None

# --- FOUNDER STORY ---
@router.get("/founder")
def get_founder_content(db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "founder_story").first()
    if not setting:
        return {
            "name": "Nandavel V",
            "founder_name": "Nandavel V",
            "title": "Founder & CEO, Qura Herbs",
            "founder_designation": "Founder & CEO, Qura Herbs",
            "eyebrow": "THE FOUNDER",
            "heading": "Meet Our Founder",
            "image": "",
            "founder_image": "",
            "quote": "Build Qura Herbs with purpose. Grow it with people. And never lose the reason we started.",
            "founder_quote": "Build Qura Herbs with purpose. Grow it with people. And never lose the reason we started.",
            "description": "Qura Herbs started with an idea that was personal to me: people deserve skincare that understands their concerns instead of making them feel like they need to change who they are.\n\nWhen I started Qura Herbs on January 13, 2025, in Coimbatore, I didn't see it as simply starting another beauty brand. I wanted to build something that could genuinely connect with people, understand their individual skin and hair concerns, and become a trusted part of their everyday routine.\n\nBeing involved in Qura from the beginning has meant being part of everything—from understanding customer concerns and developing products to building the brand, creating content, managing operations, and listening to every piece of feedback we receive.\n\nWhat means the most to me is not simply seeing Qura grow. It is seeing someone trust our brand, share their experience, and come back because they believe in what we are building.\n\nThere is still a long way to go, but the vision remains simple:",
            "founder_bio": "Qura Herbs started with an idea that was personal to me: people deserve skincare that understands their concerns instead of making them feel like they need to change who they are.\n\nWhen I started Qura Herbs on January 13, 2025, in Coimbatore, I didn't see it as simply starting another beauty brand. I wanted to build something that could genuinely connect with people, understand their individual skin and hair concerns, and become a trusted part of their everyday routine.\n\nBeing involved in Qura from the beginning has meant being part of everything—from understanding customer concerns and developing products to building the brand, creating content, managing operations, and listening to every piece of feedback we receive.\n\nWhat means the most to me is not simply seeing Qura grow. It is seeing someone trust our brand, share their experience, and come back because they believe in what we are building.\n\nThere is still a long way to go, but the vision remains simple:",
            "signature": "— Nandavel V\nFounder & CEO, Qura Herbs"
        }
    return setting.value

@router.post("/founder")
def update_founder_content(payload: dict, db: Session = Depends(get_db)):
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

# --- CEO STORY ---
@router.get("/ceo")
def get_ceo_content(db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "ceo_story").first()
    if not setting:
        return {
            "name": "Pranavi G",
            "ceo_name": "Pranavi G",
            "title": "Chief Executive Officer, Qura Herbs",
            "ceo_designation": "Chief Executive Officer, Qura Herbs",
            "eyebrow": "THE CEO",
            "heading": "Meet Our CEO",
            "image": "",
            "ceo_image": "",
            "quote": "This is more than building a company for me. It is about building something I can be proud to put my name behind.",
            "ceo_quote": "This is more than building a company for me. It is about building something I can be proud to put my name behind.",
            "description": "For me, Qura Herbs is more than a business. It is something I genuinely care about building—one customer, one product, and one experience at a time.\n\nAs the CEO of Qura Herbs, I am closely involved in shaping the brand, understanding what our customers truly need, and making sure every part of their experience feels thoughtful and meaningful. I believe a beauty brand should listen before it speaks, understand before it promises, and always put people before trends.\n\nWhat inspires me most is seeing Qura grow from an idea into a brand that people choose to bring into their everyday routines. Every message from a customer, every piece of feedback, and every small milestone reminds me why we started.\n\nI want Qura Herbs to be a brand that feels personal—not distant or overly complicated. A brand that people can trust, relate to, and grow with.",
            "ceo_bio": "For me, Qura Herbs is more than a business. It is something I genuinely care about building—one customer, one product, and one experience at a time.\n\nAs the CEO of Qura Herbs, I am closely involved in shaping the brand, understanding what our customers truly need, and making sure every part of their experience feels thoughtful and meaningful. I believe a beauty brand should listen before it speaks, understand before it promises, and always put people before trends.\n\nWhat inspires me most is seeing Qura grow from an idea into a brand that people choose to bring into their everyday routines. Every message from a customer, every piece of feedback, and every small milestone reminds me why we started.\n\nI want Qura Herbs to be a brand that feels personal—not distant or overly complicated. A brand that people can trust, relate to, and grow with.",
            "signature": "— Pranavi G\nChief Executive Officer, Qura Herbs"
        }
    return setting.value

@router.post("/ceo")
def update_ceo_content(payload: dict, db: Session = Depends(get_db)):
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

# --- ABOUT PAGE CONTENT ---
@router.get("/about")
def get_about_content(db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "about_page").first()
    if not setting:
        return {
            "subtitle": "OUR STORY",
            "title": "Care That Begins With Understanding",
            "hero_heading": "Care That Begins With Understanding",
            "hero_paragraph1": "Founded on January 13, 2025, in Coimbatore, Tamil Nadu, India, Qura Herbs was created with a simple belief: skincare should begin with understanding, not comparison.\n\nEvery person has different skin, different concerns, and a different journey. That is why we believe there is no single routine that works for everyone. Qura Herbs focuses on creating purposeful skincare and haircare designed around real everyday concerns—with thoughtful formulations, botanical ingredients, and carefully selected active ingredients.",
            "hero_paragraph2": "But Qura is about more than what goes inside a bottle.\n\nIt is about listening to our customers, understanding their concerns, helping them build consistent routines, and being there throughout their journey. Every product, conversation, and experience is part of our effort to make personal care more intentional and easier to understand.\n\nWe are building Qura Herbs for people who want to care for their skin and hair without unrealistic standards or unnecessary promises.",
            "closing_statement": "Real concerns. Thoughtful care. Consistent routines.\n\nThat is the Qura way.",
            "hero_image": "",
            "founder_name": "Nandavel V",
            "founder_designation": "Founder & CEO, Qura Herbs",
            "ceo_name": "Pranavi G",
            "ceo_designation": "Chief Executive Officer, Qura Herbs"
        }
    return setting.value

@router.post("/about")
def update_about_content(payload: dict, db: Session = Depends(get_db)):
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


# --- REAL RESULTS CRUD ---
@router.get("/real-results", response_model=List[schemas.RealResultResponse])
def list_real_results(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.RealResult)
    if active_only:
        query = query.filter(models.RealResult.active == True)
    return query.order_by(models.RealResult.display_order.asc(), models.RealResult.id.asc()).all()

@router.post("/real-results", response_model=schemas.RealResultResponse, status_code=status.HTTP_201_CREATED)
def create_real_result(item_in: schemas.RealResultCreate, db: Session = Depends(get_db)):
    db_item = models.RealResult(**item_in.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/real-results/{id}", response_model=schemas.RealResultResponse)
def update_real_result(id: int, item_in: schemas.RealResultCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.RealResult).filter(models.RealResult.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Real result item not found")

    for key, val in item_in.model_dump().items():
        setattr(db_item, key, val)

    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/real-results/{id}/toggle", response_model=schemas.RealResultResponse)
def toggle_real_result_status(id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.RealResult).filter(models.RealResult.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Real result item not found")

    db_item.active = not db_item.active
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/real-results/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_real_result(id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.RealResult).filter(models.RealResult.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Real result item not found")
    db.delete(db_item)
    db.commit()
    return None


# --- BOTANICAL ROUTINE JOURNEYS CRUD ---
@router.get("/botanical-journeys", response_model=List[schemas.BotanicalJourneyResponse])
def list_botanical_journeys(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.BotanicalJourney)
    if active_only:
        query = query.filter(models.BotanicalJourney.active == True)
    return query.order_by(models.BotanicalJourney.display_order.asc(), models.BotanicalJourney.id.asc()).all()

@router.post("/botanical-journeys", response_model=schemas.BotanicalJourneyResponse, status_code=status.HTTP_201_CREATED)
def create_botanical_journey(journey_in: schemas.BotanicalJourneyCreate, db: Session = Depends(get_db)):
    db_journey = models.BotanicalJourney(**journey_in.model_dump())
    db.add(db_journey)
    db.commit()
    db.refresh(db_journey)
    return db_journey

@router.put("/botanical-journeys/{id}", response_model=schemas.BotanicalJourneyResponse)
def update_botanical_journey(id: int, journey_in: schemas.BotanicalJourneyCreate, db: Session = Depends(get_db)):
    db_journey = db.query(models.BotanicalJourney).filter(models.BotanicalJourney.id == id).first()
    if not db_journey:
        raise HTTPException(status_code=404, detail="Botanical journey not found")

    for key, val in journey_in.model_dump().items():
        setattr(db_journey, key, val)

    db.commit()
    db.refresh(db_journey)
    return db_journey

@router.patch("/botanical-journeys/{id}/toggle", response_model=schemas.BotanicalJourneyResponse)
def toggle_botanical_journey_status(id: int, db: Session = Depends(get_db)):
    db_journey = db.query(models.BotanicalJourney).filter(models.BotanicalJourney.id == id).first()
    if not db_journey:
        raise HTTPException(status_code=404, detail="Botanical journey not found")

    db_journey.active = not db_journey.active
    db.commit()
    db.refresh(db_journey)
    return db_journey

@router.delete("/botanical-journeys/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_botanical_journey(id: int, db: Session = Depends(get_db)):
    db_journey = db.query(models.BotanicalJourney).filter(models.BotanicalJourney.id == id).first()
    if not db_journey:
        raise HTTPException(status_code=404, detail="Botanical journey not found")
    db.delete(db_journey)
    db.commit()
    return None


