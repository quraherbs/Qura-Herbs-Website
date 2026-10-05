import os
import uuid
import shutil
import re
import urllib.request
import ssl
import mimetypes
import logging
import requests
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Body, Form
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
    url = (
        settings.SUPABASE_URL or
        settings.NEXT_PUBLIC_SUPABASE_URL or
        os.environ.get("SUPABASE_URL") or
        os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or
        ""
    ).rstrip('/')
    
    key = (
        settings.SUPABASE_SERVICE_ROLE_KEY or
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or
        settings.SUPABASE_ANON_KEY or
        os.environ.get("SUPABASE_ANON_KEY") or
        settings.NEXT_PUBLIC_SUPABASE_ANON_KEY or
        ""
    )
    return url, key


def upload_to_supabase(content: bytes, object_path: str, content_type: str = "image/jpeg") -> str:
    """
    Upload file bytes to Supabase Storage bucket.
    Returns permanent public CDN URL on success.
    """
    supabase_url, supabase_key = get_supabase_credentials()
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase Storage credentials (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) are not configured.")

    bucket = settings.SUPABASE_STORAGE_BUCKET or "product-images"
    endpoint = f"{supabase_url}/storage/v1/object/{bucket}/{object_path}"

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

    public_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{object_path}"
    return public_url


def delete_from_supabase(public_url: str) -> bool:
    """
    Safely delete object from Supabase Storage if it belongs to the configured bucket.
    """
    supabase_url, supabase_key = get_supabase_credentials()
    if not supabase_url or not supabase_key or not public_url:
        return False

    bucket = settings.SUPABASE_STORAGE_BUCKET or "product-images"
    prefix = f"{supabase_url}/storage/v1/object/public/{bucket}/"
    if not public_url.startswith(prefix):
        return False

    object_path = public_url.replace(prefix, "")
    endpoint = f"{supabase_url}/storage/v1/object/{bucket}/{object_path}"
    headers = {
        "Authorization": f"Bearer {supabase_key}",
        "apiKey": supabase_key
    }
    res = requests.delete(endpoint, headers=headers)
    return res.status_code in (200, 204)


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
def upload_file(
    file: UploadFile = File(...),
    folder: Optional[str] = Form(None)
):
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"}
    original_filename = file.filename or "image.jpg"
    _, ext = os.path.splitext(original_filename)
    ext = ext.lower()
    
    if ext not in allowed_extensions:
        ext = ".jpg"
        
    unique_name = f"{uuid.uuid4().hex}{ext}"
    clean_folder = re.sub(r'[^a-zA-Z0-9_-]', '', folder).strip('/') if folder else ""
    object_path = f"{clean_folder}/{unique_name}" if clean_folder else unique_name
    
    content_type = file.content_type or mimetypes.guess_type(unique_name)[0] or "image/jpeg"
    
    try:
        content = file.file.read()
        if len(content) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 15 MB.")
        
        s_url, s_key = get_supabase_credentials()
        is_production = bool(os.environ.get("VERCEL") or (s_url and s_key))
        
        if s_url and s_key:
            try:
                public_url = upload_to_supabase(content, object_path, content_type)
                return {"url": public_url, "storage": "supabase", "path": object_path}
            except Exception as se:
                logger.error(f"Supabase Storage upload error: {se}")
                if is_production:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Production media upload failed: Could not store file in Supabase Storage ({str(se)})"
                    )

        # Local development fallback
        if not is_production:
            url = save_locally(content, unique_name)
            return {"url": url, "storage": "local"}
        else:
            raise HTTPException(status_code=500, detail="Supabase Storage credentials missing in production environment.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to process uploaded file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


@router.post("/import-drive-url")
def import_drive_url(payload: dict = Body(...)):
    raw_url = payload.get("url", "").strip()
    folder = payload.get("folder", "")
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL is required")

    if raw_url.startswith("https://") and "supabase.co" in raw_url:
        return {"url": raw_url, "storage": "supabase"}

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
    clean_folder = re.sub(r'[^a-zA-Z0-9_-]', '', folder).strip('/') if folder else "imported"
    unique_name = f"gdrive_{uuid.uuid4().hex[:12]}.jpg"
    object_path = f"{clean_folder}/{unique_name}"

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = resp.read()

        s_url, s_key = get_supabase_credentials()
        if s_url and s_key:
            try:
                public_url = upload_to_supabase(data, object_path, "image/jpeg")
                return {"url": public_url, "storage": "supabase", "original_url": raw_url}
            except Exception as se:
                logger.error(f"Supabase upload for drive import failed: {se}")

        if not os.environ.get("VERCEL"):
            save_locally(data, unique_name)
            return {"url": f"/uploads/{unique_name}", "storage": "local", "original_url": raw_url}
        else:
            raise HTTPException(status_code=500, detail="Failed to import image to Supabase Storage in production.")
    except HTTPException:
        raise
    except Exception as e:
        return {"url": raw_url, "storage": "external", "warning": str(e)}


@router.delete("/delete")
def delete_media_file(payload: dict = Body(...)):
    url = payload.get("url", "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="Image URL is required for deletion.")

    deleted = delete_from_supabase(url)
    return {"success": deleted, "url": url}
