import os
import uuid
import shutil
import re
import urllib.request
import ssl
import mimetypes
import logging
import requests
from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

def get_upload_dirs():
    if os.environ.get("VERCEL"):
        tmp_dir = "/tmp/uploads"
        os.makedirs(tmp_dir, exist_ok=True)
        return tmp_dir, tmp_dir

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    backend_uploads = os.path.join(base_dir, "uploads")
    frontend_uploads = os.path.join(os.path.dirname(base_dir), "frontend", "public", "uploads")
    
    try:
        os.makedirs(backend_uploads, exist_ok=True)
    except Exception:
        pass
    try:
        os.makedirs(frontend_uploads, exist_ok=True)
    except Exception:
        pass
    return backend_uploads, frontend_uploads


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
    """
    Upload file bytes to Supabase Storage bucket.
    Returns public URL on success, or raises Exception on failure.
    """
    supabase_url, supabase_key = get_supabase_credentials()
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase credentials not configured")

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
        # Attempt bucket creation if missing
        create_bucket_url = f"{supabase_url}/storage/v1/bucket"
        create_headers = {
            "Authorization": f"Bearer {supabase_key}",
            "apiKey": supabase_key,
            "Content-Type": "application/json"
        }
        requests.post(create_bucket_url, json={"id": bucket, "name": bucket, "public": True}, headers=create_headers)
        # Retry upload
        res = requests.post(endpoint, data=content, headers=headers)

    if res.status_code not in (200, 201):
        raise Exception(f"Supabase upload failed ({res.status_code}): {res.text}")

    public_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{filename}"
    return public_url


def save_locally(content: bytes, filename: str) -> str:
    backend_uploads, frontend_uploads = get_upload_dirs()
    backend_file_path = os.path.join(backend_uploads, filename)
    frontend_file_path = os.path.join(frontend_uploads, filename)

    try:
        with open(backend_file_path, "wb") as f1:
            f1.write(content)
    except Exception as e:
        logger.warning(f"Could not save to backend_uploads: {e}")

    if backend_uploads != frontend_uploads:
        try:
            with open(frontend_file_path, "wb") as f2:
                f2.write(content)
        except Exception:
            pass

    return f"/uploads/{filename}"


@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    filename = file.filename or "image.jpg"
    _, ext = os.path.splitext(filename)
    ext = ext.lower()
    
    if ext not in allowed_extensions:
        ext = ".jpg"  # Default fallback if mime extension missing
        
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    content_type = file.content_type or mimetypes.guess_type(unique_filename)[0] or "image/jpeg"
    
    try:
        content = file.file.read()
        
        # Try Supabase if configured
        s_url, s_key = get_supabase_credentials()
        if s_url and s_key:
            try:
                public_url = upload_to_supabase(content, unique_filename, content_type)
                return {"url": public_url, "storage": "supabase"}
            except Exception as se:
                logger.warning(f"Supabase upload failed, falling back to local: {se}")

        # Fallback to local / tmp storage
        url = save_locally(content, unique_filename)
        return {"url": url, "storage": "local"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


@router.post("/import-drive-url")
def import_drive_url(payload: dict = Body(...)):
    raw_url = payload.get("url", "").strip()
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL is required")

    if raw_url.startswith("/uploads/") or raw_url.startswith("http://localhost"):
        return {"url": raw_url, "storage": "local"}

    # Extract Google Drive file ID if Google Drive link
    gdrive_id = None
    m = re.search(r'/file/d/([a-zA-Z0-9_-]+)', raw_url)
    if m:
        gdrive_id = m.group(1)
    else:
        m = re.search(r'id=([a-zA-Z0-9_-]+)', raw_url)
        if m:
            gdrive_id = m.group(1)
        else:
            m = re.search(r'/d/([a-zA-Z0-9_-]+)', raw_url)
            if m:
                gdrive_id = m.group(1)

    download_url = f"https://lh3.googleusercontent.com/d/{gdrive_id}" if gdrive_id else raw_url
    unique_filename = f"gdrive_{uuid.uuid4().hex[:12]}.jpg"

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = resp.read()

        # Save locally as backup
        save_locally(data, unique_filename)

        s_url, s_key = get_supabase_credentials()
        if s_url and s_key:
            try:
                public_url = upload_to_supabase(data, unique_filename, "image/jpeg")
                return {"url": public_url, "storage": "supabase", "original_url": raw_url}
            except Exception as se:
                logger.warning(f"Supabase upload for drive import failed: {se}")

        return {"url": f"/uploads/{unique_filename}", "storage": "local", "original_url": raw_url}
    except Exception as e:
        return {"url": raw_url, "storage": "external", "warning": str(e)}
