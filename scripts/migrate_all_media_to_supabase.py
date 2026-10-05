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
logger = logging.getLogger("migrate_media")

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

    public_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{filename}"
    return public_url

def verify_url(url: str) -> bool:
    try:
        res = requests.head(url, timeout=10)
        if res.status_code == 200:
            return True
        res_get = requests.get(url, stream=True, timeout=10)
        return res_get.status_code == 200
    except Exception:
        return False

def replace_uploads_in_obj(obj, mapping):
    if isinstance(obj, str):
        if obj.startswith("/uploads/"):
            filename = obj.replace("/uploads/", "").strip("/")
            return mapping.get(filename, obj)
        return obj
    elif isinstance(obj, list):
        return [replace_uploads_in_obj(item, mapping) for item in obj]
    elif isinstance(obj, dict):
        return {k: replace_uploads_in_obj(v, mapping) for k, v in obj.items()}
    return obj

def main():
    s_url, s_key = get_supabase_credentials()
    if not s_url or not s_key:
        logger.error("Supabase URL and API Key must be set in .env")
        sys.exit(1)

    bucket = settings.SUPABASE_STORAGE_BUCKET or "product-images"
    logger.info(f"Target Supabase Project: {s_url}, Bucket: {bucket}")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_uploads = os.path.join(base_dir, "backend", "uploads")
    frontend_uploads = os.path.join(base_dir, "frontend", "public", "uploads")

    all_files = {}
    for d in [backend_uploads, frontend_uploads]:
        if os.path.exists(d):
            for fname in os.listdir(d):
                fpath = os.path.join(d, fname)
                if os.path.isfile(fpath) and not fname.startswith("."):
                    all_files[fname] = fpath

    logger.info(f"Found {len(all_files)} unique local media files across uploads folders.")

    url_mapping = {}
    uploaded_count = 0
    failed_count = 0
    total_bytes = 0

    for fname, fpath in all_files.items():
        size = os.path.getsize(fpath)
        total_bytes += size
        try:
            with open(fpath, "rb") as f:
                content = f.read()
            mime = mimetypes.guess_type(fname)[0] or "image/jpeg"
            public_url = upload_to_supabase(content, fname, mime)
            
            # Verify upload
            if verify_url(public_url):
                url_mapping[fname] = public_url
                uploaded_count += 1
                logger.info(f"Uploaded & verified ({uploaded_count}/{len(all_files)}): {fname} -> {public_url}")
            else:
                logger.warning(f"Verification failed for {fname}")
                failed_count += 1
        except Exception as e:
            logger.error(f"Failed to upload {fname}: {e}")
            failed_count += 1

    logger.info(f"Uploading completed. Uploaded: {uploaded_count}, Failed: {failed_count}, Total Size: {total_bytes / (1024*1024):.2f} MB")

    # Now update database references
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    engine = create_engine(db_url)
    Session = sessionmaker(bind=engine)
    session = Session()

    updated_records = 0

    try:
        # 1. Products
        for p in session.query(Product).all():
            changed = False
            if p.thumbnail and p.thumbnail.startswith("/uploads/"):
                fname = p.thumbnail.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    p.thumbnail = url_mapping[fname]
                    changed = True
            if p.product_images and isinstance(p.product_images, list):
                new_imgs = []
                for img in p.product_images:
                    if isinstance(img, str) and img.startswith("/uploads/"):
                        fname = img.replace("/uploads/", "").strip("/")
                        new_imgs.append(url_mapping.get(fname, img))
                    else:
                        new_imgs.append(img)
                if new_imgs != p.product_images:
                    p.product_images = new_imgs
                    changed = True
            if changed:
                updated_records += 1

        # 2. Categories
        for c in session.query(Category).all():
            if c.image and c.image.startswith("/uploads/"):
                fname = c.image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    c.image = url_mapping[fname]
                    updated_records += 1

        # 3. Reviews
        for r in session.query(Review).all():
            if r.image and r.image.startswith("/uploads/"):
                fname = r.image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    r.image = url_mapping[fname]
                    updated_records += 1

        # 4. Blogs
        for b in session.query(Blog).all():
            if b.featured_image and b.featured_image.startswith("/uploads/"):
                fname = b.featured_image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    b.featured_image = url_mapping[fname]
                    updated_records += 1

        # 5. Banners
        for bn in session.query(HeroBanner).all():
            changed = False
            if bn.desktop_image and bn.desktop_image.startswith("/uploads/"):
                fname = bn.desktop_image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    bn.desktop_image = url_mapping[fname]
                    changed = True
            if bn.mobile_image and bn.mobile_image.startswith("/uploads/"):
                fname = bn.mobile_image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    bn.mobile_image = url_mapping[fname]
                    changed = True
            if changed:
                updated_records += 1

        # 6. Results Gallery
        for rg in session.query(ResultGalleryItem).all():
            if rg.image and rg.image.startswith("/uploads/"):
                fname = rg.image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    rg.image = url_mapping[fname]
                    updated_records += 1

        # 7. Real Results
        for rr in session.query(RealResult).all():
            changed = False
            if rr.before_image and rr.before_image.startswith("/uploads/"):
                fname = rr.before_image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    rr.before_image = url_mapping[fname]
                    changed = True
            if rr.after_image and rr.after_image.startswith("/uploads/"):
                fname = rr.after_image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    rr.after_image = url_mapping[fname]
                    changed = True
            if changed:
                updated_records += 1

        # 8. Botanical Journeys
        for bj in session.query(BotanicalJourney).all():
            changed = False
            if bj.before_image and bj.before_image.startswith("/uploads/"):
                fname = bj.before_image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    bj.before_image = url_mapping[fname]
                    changed = True
            if bj.final_image and bj.final_image.startswith("/uploads/"):
                fname = bj.final_image.replace("/uploads/", "").strip("/")
                if fname in url_mapping:
                    bj.final_image = url_mapping[fname]
                    changed = True
            if bj.progress_images and isinstance(bj.progress_images, list):
                new_imgs = [url_mapping.get(img.replace("/uploads/", "").strip("/"), img) if isinstance(img, str) and img.startswith("/uploads/") else img for img in bj.progress_images]
                if new_imgs != bj.progress_images:
                    bj.progress_images = new_imgs
                    changed = True
            if changed:
                updated_records += 1

        # 9. Settings (homepage, about_page, founder_story, ceo_story, etc.)
        for st in session.query(Setting).all():
            if st.value and isinstance(st.value, dict):
                new_val = replace_uploads_in_obj(st.value, url_mapping)
                if new_val != st.value:
                    st.value = new_val
                    updated_records += 1

        session.commit()
        logger.info(f"Database update complete! Total DB records updated: {updated_records}")

    except Exception as e:
        session.rollback()
        logger.error(f"Error updating database: {e}")
        sys.exit(1)
    finally:
        session.close()

if __name__ == "__main__":
    main()
