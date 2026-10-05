from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.core.config import settings

import os

db_url = settings.DATABASE_URL
if os.environ.get("VERCEL") and db_url.startswith("sqlite:///./"):
    db_url = "sqlite:////tmp/qura_herbs.db"

# Determine database type and configure connect_args
is_sqlite = db_url.startswith("sqlite")

connect_args = {}
if is_sqlite:
    connect_args["check_same_thread"] = False
    connect_args["timeout"] = 30


# Create database engine
engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
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
