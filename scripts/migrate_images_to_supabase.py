import os
import sys
import mimetypes
import logging
import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.core.config import settings
from backend.app.models.models import (
    Product, Category, Review, Blog, HeroBanner,
    ResultGalleryItem, RealResult, BotanicalJourney, Setting
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("migrate_images")

def get_supabase_credentials():
    url = (settings.SUPABASE_URL or settings.NEXT_PUBLIC_SUPABASE_URL or "").rstrip('/')
    key = (
        settings.SUPABASE_SERVICE_ROLE_KEY or
        settings.SUPABASE_ANON_KEY or
        settings.SUPABASE_PUBLISHABLE_KEY or
        settings.NEXT_PUBLIC_SUPABASE_ANON_KEY or
        ""
    )
    return url, key


def upload_to_supabase(content: bytes, filename: str, content_type: str = "image/jpeg") -> str:
    supabase_url, supabase_key = get_supabase_credentials()
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase credentials not configured in environment/.env")

    bucket = settings.SUPABASE_STORAGE_BUCKET or "product-images"
    endpoint = f"{supabase_url}/storage/v1/object/{bucket}/{filename}"

    headers = {
        "Authorization": f"Bearer {supabase_key}",
        "apiKey": supabase_key,
        "Content-Type": content_type,
        "x-upsert": "true"
    }

    res = requests.post(endpoint, data=content, headers=headers)
    if res.status_code == 404 and "Bucket not found" in res.text:
        create_bucket_url = f"{supabase_url}/storage/v1/bucket"
        create_headers = {
            "Authorization": f"Bearer {supabase_key}",
            "apiKey": supabase_key,
            "Content-Type": "application/json"
        }
        requests.post(create_bucket_url, json={"id": bucket, "name": bucket, "public": True}, headers=create_headers)
        res = requests.post(endpoint, data=content, headers=headers)

    if res.status_code not in (200, 201):
        raise Exception(f"Supabase upload failed ({res.status_code}): {res.text}")

    return f"{supabase_url}/storage/v1/object/public/{bucket}/{filename}"


def migrate_image_url(url: str, uploads_dir: str, cache: dict) -> str:
    if not url or not isinstance(url, str):
        return url
    
    if url.startswith("http://") or url.startswith("https://"):
        return url

    filename = url.replace("/uploads/", "").strip("/")
    if not filename:
        return url

    if filename in cache:
        return cache[filename]

    file_path = os.path.join(uploads_dir, filename)
    if not os.path.exists(file_path):
        logger.warning(f"Local file not found for migration: {file_path}")
        return url

    try:
        with open(file_path, "rb") as f:
            content = f.read()
        mime = mimetypes.guess_type(filename)[0] or "image/jpeg"
        public_url = upload_to_supabase(content, filename, mime)
        logger.info(f"Uploaded {filename} -> {public_url}")
        cache[filename] = public_url
        return public_url
    except Exception as e:
        logger.error(f"Failed to migrate {filename}: {e}")
        return url


def main():
    s_url, s_key = get_supabase_credentials()
    if not s_url or not s_key:
        logger.error("Supabase URL and API Key must be set in .env or environment")
        sys.exit(1)

    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    uploads_dir = os.path.join(base_dir, "backend", "uploads")
    if not os.path.exists(uploads_dir):
        uploads_dir = os.path.join(base_dir, "uploads")

    url_cache = {}

    try:
        # Migrate Products
        products = session.query(Product).all()
        for p in products:
            if p.thumbnail:
                p.thumbnail = migrate_image_url(p.thumbnail, uploads_dir, url_cache)
            if p.product_images and isinstance(p.product_images, list):
                p.product_images = [migrate_image_url(img, uploads_dir, url_cache) for img in p.product_images]

        # Migrate Categories
        categories = session.query(Category).all()
        for c in categories:
            if c.image:
                c.image = migrate_image_url(c.image, uploads_dir, url_cache)

        # Migrate Reviews
        reviews = session.query(Review).all()
        for r in reviews:
            if r.image:
                r.image = migrate_image_url(r.image, uploads_dir, url_cache)

        # Migrate Blogs
        blogs = session.query(Blog).all()
        for b in blogs:
            if b.featured_image:
                b.featured_image = migrate_image_url(b.featured_image, uploads_dir, url_cache)

        # Migrate Banners
        banners = session.query(HeroBanner).all()
        for bn in banners:
            if bn.desktop_image:
                bn.desktop_image = migrate_image_url(bn.desktop_image, uploads_dir, url_cache)
            if bn.mobile_image:
                bn.mobile_image = migrate_image_url(bn.mobile_image, uploads_dir, url_cache)

        # Migrate Results Gallery
        rg_items = session.query(ResultGalleryItem).all()
        for rg in rg_items:
            if rg.image:
                rg.image = migrate_image_url(rg.image, uploads_dir, url_cache)

        # Migrate Real Results
        real_results = session.query(RealResult).all()
        for rr in real_results:
            if rr.before_image:
                rr.before_image = migrate_image_url(rr.before_image, uploads_dir, url_cache)
            if rr.after_image:
                rr.after_image = migrate_image_url(rr.after_image, uploads_dir, url_cache)

        # Migrate Botanical Journeys
        botanicals = session.query(BotanicalJourney).all()
        for bj in botanicals:
            if bj.before_image:
                bj.before_image = migrate_image_url(bj.before_image, uploads_dir, url_cache)
            if bj.final_image:
                bj.final_image = migrate_image_url(bj.final_image, uploads_dir, url_cache)
            if bj.progress_images and isinstance(bj.progress_images, list):
                bj.progress_images = [migrate_image_url(img, uploads_dir, url_cache) for img in bj.progress_images]

        session.commit()
        logger.info("Successfully migrated all database image references to Supabase Storage!")

    except Exception as e:
        session.rollback()
        logger.error(f"Migration error: {e}")
        sys.exit(1)
    finally:
        session.close()

if __name__ == "__main__":
    main()
