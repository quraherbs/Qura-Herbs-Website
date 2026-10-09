import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from sqlalchemy import create_engine, text
from backend.app.core.config import settings

def apply_migration():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    print(f"Connecting to database: {db_url.split('@')[-1] if '@' in db_url else db_url}")
    engine = create_engine(db_url)
    is_sqlite = db_url.startswith("sqlite")

    with engine.connect() as conn:
        if is_sqlite:
            # SQLite syntax
            cols = [col[1] for col in conn.execute(text("PRAGMA table_info(orders)")).fetchall()]
            if "google_sheets_sync_status" not in cols:
                conn.execute(text("ALTER TABLE orders ADD COLUMN google_sheets_sync_status VARCHAR(20) DEFAULT 'PENDING'"))
                print("Added column: google_sheets_sync_status")
            if "google_sheets_synced_at" not in cols:
                conn.execute(text("ALTER TABLE orders ADD COLUMN google_sheets_synced_at DATETIME NULL"))
                print("Added column: google_sheets_synced_at")
            if "google_sheets_sync_error" not in cols:
                conn.execute(text("ALTER TABLE orders ADD COLUMN google_sheets_sync_error TEXT NULL"))
                print("Added column: google_sheets_sync_error")
            conn.commit()
        else:
            # PostgreSQL / Supabase syntax
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS google_sheets_sync_status VARCHAR(20) DEFAULT 'PENDING'"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS google_sheets_synced_at TIMESTAMP NULL"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS google_sheets_sync_error TEXT NULL"))
            conn.commit()
            print("Successfully applied Google Sheets tracking columns to PostgreSQL orders table.")

    print("[SUCCESS] Orders schema migration complete.")

if __name__ == "__main__":
    apply_migration()
