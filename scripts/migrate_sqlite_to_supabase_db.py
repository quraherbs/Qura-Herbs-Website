import os
import sys
import json
import sqlite3
import logging
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.core.config import settings
from backend.app.core.database import Base
from backend.app.models import models

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("migrate_db")

TABLE_MODELS = [
    ("categories", models.Category),
    ("products", models.Product),
    ("product_variants", models.ProductVariant),
    ("product_categories", None),  # Association table
    ("customers", models.Customer),
    ("orders", models.Order),
    ("order_items", models.OrderItem),
    ("order_timeline_events", models.OrderTimelineEvent),
    ("admin_notes", models.AdminNote),
    ("email_logs", models.EmailLog),
    ("reviews", models.Review),
    ("blogs", models.Blog),
    ("offers", models.Offer),
    ("coupons", models.Coupon),
    ("offer_usages", models.OfferUsage),
    ("hero_banners", models.HeroBanner),
    ("results_gallery", models.ResultGalleryItem),
    ("real_results", models.RealResult),
    ("botanical_routine_journeys", models.BotanicalJourney),
    ("settings", models.Setting),
    ("ai_analysis_logs", models.AIAnalysisLog),
    ("users", models.User),
]

def get_sqlite_table_counts(sqlite_db_path):
    conn = sqlite3.connect(sqlite_db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall() if not row[0].startswith("sqlite_")]
    counts = {}
    for t in tables:
        cursor.execute(f'SELECT COUNT(*) FROM "{t}"')
        counts[t] = cursor.fetchone()[0]
    conn.close()
    return counts

def migrate_to_postgresql(target_pg_url):
    logger.info("Starting SQLite -> Supabase PostgreSQL Migration...")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sqlite_db_path = os.path.join(base_dir, "qura_herbs.db")

    if not os.path.exists(sqlite_db_path):
        logger.error(f"Local SQLite database not found at {sqlite_db_path}")
        sys.exit(1)

    sqlite_counts = get_sqlite_table_counts(sqlite_db_path)
    logger.info(f"Loaded SQLite source table counts: {len(sqlite_counts)} tables found.")

    # Fix postgres:// prefix for SQLAlchemy
    if target_pg_url.startswith("postgres://"):
        target_pg_url = target_pg_url.replace("postgres://", "postgresql://", 1)

    pg_engine = create_engine(target_pg_url, pool_pre_ping=True)

    # 1. Create PostgreSQL Schema
    logger.info("Creating PostgreSQL table schema...")
    Base.metadata.create_all(bind=pg_engine)

    # 2. Open SQLite connection & Postgres session
    sqlite_conn = sqlite3.connect(sqlite_db_path)
    sqlite_conn.row_factory = sqlite3.Row
    sqlite_cursor = sqlite_conn.cursor()

    PgSession = sessionmaker(bind=pg_engine)
    pg_session = PgSession()

    pg_counts = {}

    try:
        # Transfer data table by table
        for table_name, model_cls in TABLE_MODELS:
            sqlite_cursor.execute(f'SELECT * FROM "{table_name}"')
            rows = [dict(r) for r in sqlite_cursor.fetchall()]

            if not rows:
                logger.info(f"Table '{table_name}' has 0 rows. Skipping data insert.")
                pg_counts[table_name] = 0
                continue

            if model_cls is not None:
                # Use ORM model insertion
                inst_list = []
                for r in rows:
                    inst = model_cls()
                    for col_name, val in r.items():
                        if hasattr(inst, col_name):
                            setattr(inst, col_name, val)
                    inst_list.append(inst)
                pg_session.add_all(inst_list)
                pg_session.flush()
            else:
                # Raw SQL insert for association table (product_categories)
                columns = list(rows[0].keys())
                col_names_str = ", ".join(columns)
                val_params_str = ", ".join([f":{c}" for c in columns])
                insert_stmt = text(f'INSERT INTO "{table_name}" ({col_names_str}) VALUES ({val_params_str}) ON CONFLICT DO NOTHING')
                for r in rows:
                    pg_session.execute(insert_stmt, r)
                pg_session.flush()

            # Align PostgreSQL auto-increment sequence if primary key 'id' exists
            try:
                seq_check_stmt = text(f"SELECT setval(pg_get_serial_sequence('{table_name}', 'id'), COALESCE(MAX(id), 1)) FROM \"{table_name}\";")
                pg_session.execute(seq_check_stmt)
            except Exception:
                pass  # Ignore if table has no serial 'id' column

            logger.info(f"Migrated {len(rows)} records into PostgreSQL table '{table_name}'.")

        pg_session.commit()
        logger.info("Data commit successful!")

        # Count records in PostgreSQL
        inspector = inspect(pg_engine)
        pg_table_names = inspector.get_table_names()

        for t_name in sqlite_counts.keys():
            if t_name in pg_table_names:
                count_res = pg_session.execute(text(f'SELECT COUNT(*) FROM "{t_name}"')).scalar()
                pg_counts[t_name] = count_res
            else:
                pg_counts[t_name] = 0

        # Summary verification report
        logger.info("=== MIGRATION VERIFICATION REPORT ===")
        mismatch_found = False
        for t_name, s_cnt in sorted(sqlite_counts.items()):
            p_cnt = pg_counts.get(t_name, 0)
            status = "OK" if s_cnt == p_cnt else "MISMATCH"
            if s_cnt != p_cnt:
                mismatch_found = True
            logger.info(f"Table: {t_name:30s} | SQLite: {s_cnt:4d} -> Postgres: {p_cnt:4d} | Status: {status}")

        if mismatch_found:
            logger.warning("Migration completed with count mismatches!")
        else:
            logger.info("Migration completed with 100% table & record count match!")

    except Exception as e:
        pg_session.rollback()
        logger.error(f"Migration error: {e}")
        sys.exit(1)
    finally:
        sqlite_conn.close()
        pg_session.close()

if __name__ == "__main__":
    pg_url = os.environ.get("TARGET_POSTGRES_URL") or settings.DATABASE_URL
    if not pg_url or pg_url.startswith("sqlite"):
        logger.error("Please provide PostgreSQL connection string via TARGET_POSTGRES_URL env var.")
        logger.error("Example: TARGET_POSTGRES_URL='postgresql://postgres:password@db.project.supabase.co:5432/postgres' python3 scripts/migrate_sqlite_to_supabase_db.py")
        sys.exit(1)

    migrate_to_postgresql(pg_url)
