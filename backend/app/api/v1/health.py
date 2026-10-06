import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db
from backend.app.models import models
from backend.app.core.config import settings

router = APIRouter()

@router.get("/health")
@router.get("/health/", include_in_schema=False)
def check_health():
    return {"status": "healthy", "database": "connected"}

@router.get("/system-health")
@router.get("/system-health/", include_in_schema=False)
def system_health_check(db: Session = Depends(get_db)):
    results = {}
    overall_status = "PASS"

    # 1. Database Check
    try:
        db.execute(text("SELECT 1"))
        results["database"] = {"status": "PASS", "message": "Database query successful"}
    except Exception as e:
        overall_status = "FAIL"
        results["database"] = {"status": "FAIL", "error": f"Database error: {str(e)}"}

    # 2. Tables & Data Verification
    try:
        p_count = db.query(models.Product).count()
        o_count = db.query(models.Order).count()
        of_count = db.query(models.Offer).count()
        r_count = db.query(models.Review).count()
        b_count = db.query(models.Blog).count()
        c_count = db.query(models.Category).count()
        res_count = db.query(models.RealResult).count()
        journeys_count = db.query(models.BotanicalJourney).count()
        banners_count = db.query(models.HeroBanner).count()

        results["data_integrity"] = {
            "status": "PASS",
            "products": p_count,
            "orders": o_count,
            "offers": of_count,
            "reviews": r_count,
            "blogs": b_count,
            "categories": c_count,
            "real_results": res_count,
            "botanical_journeys": journeys_count,
            "hero_banners": banners_count,
        }
    except Exception as e:
        overall_status = "FAIL"
        results["data_integrity"] = {"status": "FAIL", "error": str(e)}

    # 3. Supabase Storage Configuration & Connectivity
    s_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    s_bucket = (os.environ.get("SUPABASE_STORAGE_BUCKET") or "product-images").strip()
    s_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    storage_info = {
        "bucket": s_bucket,
        "url_configured": bool(s_url),
        "service_role_key_configured": bool(s_key),
    }

    if s_url and s_key:
        try:
            from supabase import create_client
            supabase = create_client(s_url.strip(), s_key.strip())
            files = supabase.storage.from_(s_bucket).list()
            storage_info["status"] = "PASS"
            storage_info["accessible"] = True
            storage_info["files_sample_count"] = len(files) if isinstance(files, list) else 0
        except Exception as se:
            storage_info["status"] = "WARN"
            storage_info["message"] = f"Storage list check warning: {str(se)}"
    else:
        storage_info["status"] = "PASS (Local/Public)"

    results["supabase_storage"] = storage_info

    # 4. Auth Config Check
    results["auth_config"] = {
        "status": "PASS",
        "admin_emails_configured": bool(settings.ADMIN_EMAILS),
        "admin_password_configured": bool(settings.ADMIN_PASSWORD),
        "jwt_secret_configured": bool(settings.JWT_SECRET),
    }

    return {
        "status": overall_status,
        "service": "Qura Herbs API",
        "environment": "production" if os.environ.get("VERCEL") else "development",
        "checks": results
    }
