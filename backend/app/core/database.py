from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.core.config import settings

import os

from sqlalchemy.pool import NullPool

db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# If running on Vercel and DATABASE_URL is not PostgreSQL, fallback to SQLite in /tmp
if os.environ.get("VERCEL"):
    if not db_url or db_url.startswith("sqlite"):
        db_url = "sqlite:////tmp/qura_herbs.db"
elif not db_url:
    db_url = "sqlite:///./qura_herbs.db"

# Determine database type and configure connect_args
is_sqlite = db_url.startswith("sqlite")

connect_args = {}
engine_kwargs = {"pool_pre_ping": True}

if is_sqlite:
    connect_args["check_same_thread"] = False
    connect_args["timeout"] = 30
else:
    # Use NullPool in serverless environments to prevent connection leakage to Supabase PostgreSQL
    if os.environ.get("VERCEL"):
        engine_kwargs["poolclass"] = NullPool
    else:
        engine_kwargs["pool_recycle"] = 300

# Create database engine
engine = create_engine(
    db_url,
    connect_args=connect_args,
    **engine_kwargs
)

# Enable WAL mode and foreign key support for SQLite
if is_sqlite:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        try:
            cursor.execute("PRAGMA journal_mode=WAL;")
        except Exception:
            pass
        try:
            cursor.execute("PRAGMA foreign_keys=ON;")
        except Exception:
            pass
        cursor.close()

# Create thread-local session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models
Base = declarative_base()

# Dependency to inject DB session into endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
