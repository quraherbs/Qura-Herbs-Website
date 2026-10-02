import os
import uuid
import shutil
import re
import urllib.request
import ssl
from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from typing import Optional
from backend.app.core.config import settings

router = APIRouter()

def get_upload_dirs():
    # backend/app/api/v1/media.py -> 4 levels up is backend root directory
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    backend_uploads = os.path.join(base_dir, "uploads")
    frontend_uploads = os.path.join(os.path.dirname(base_dir), "frontend", "public", "uploads")
    
    os.makedirs(backend_uploads, exist_ok=True)
    os.makedirs(frontend_uploads, exist_ok=True)
    return backend_uploads, frontend_uploads


@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
    # Validate file type
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    filename = file.filename
    _, ext = os.path.splitext(filename)
    ext = ext.lower()
    
    if ext not in allowed_extensions:
        ext = ".jpg"  # Default fallback if mime extension missing
        
    # Standardize filename to avoid conflicts
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    
    backend_uploads, frontend_uploads = get_upload_dirs()
    backend_file_path = os.path.join(backend_uploads, unique_filename)
    frontend_file_path = os.path.join(frontend_uploads, unique_filename)
    
    try:
        # Read uploaded content
        content = file.file.read()
        
        # Save to backend uploads
        with open(backend_file_path, "wb") as f1:
            f1.write(content)
            
        # Save copy to frontend public uploads for static Next.js serving
        try:
            with open(frontend_file_path, "wb") as f2:
                f2.write(content)
        except Exception:
            pass
        
        local_url = f"/uploads/{unique_filename}"
        return {"url": local_url, "storage": "local"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


@router.post("/import-drive-url")
def import_drive_url(payload: dict = Body(...)):
    raw_url = payload.get("url", "").strip()
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL is required")

    # If it's already a local relative path, return directly
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
    backend_uploads, frontend_uploads = get_upload_dirs()
    backend_file_path = os.path.join(backend_uploads, unique_filename)
    frontend_file_path = os.path.join(frontend_uploads, unique_filename)

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = resp.read()
            with open(backend_file_path, "wb") as f1:
                f1.write(data)
            try:
                with open(frontend_file_path, "wb") as f2:
                    f2.write(data)
            except Exception:
                pass

        return {"url": f"/uploads/{unique_filename}", "storage": "local", "original_url": raw_url}
    except Exception as e:
        # If external image download fails, return original URL as fallback
        return {"url": raw_url, "storage": "external", "warning": str(e)}
