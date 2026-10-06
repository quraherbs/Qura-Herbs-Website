import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.models import models
from backend.app.api.v1 import health, products, categories, orders, reviews, blogs, offers, admin, media, customers, content


# Print safe configuration status (without secrets)
print(f"[AUTH CONFIG] ADMIN_EMAILS configured: {bool(settings.ADMIN_EMAILS)}")
print(f"[AUTH CONFIG] ADMIN_PASSWORD configured: {bool(settings.ADMIN_PASSWORD)}")
print(f"[AUTH CONFIG] JWT_SECRET configured: {bool(settings.JWT_SECRET)}")
print(f"[AUTH CONFIG] DATABASE_URL configured: {bool(settings.DATABASE_URL)}")

# Create database tables automatically (for SQLite/Development) safely
try:
    Base.metadata.create_all(bind=engine)
except Exception as _db_err:
    print("[WARN] Table auto-creation skipped or deferred:", _db_err)

from backend.app.core.database import SessionLocal
from backend.app.seed import seed_db

# Run full catalog seed if database is missing categories/products
try:
    seed_db()
except Exception as err:
    print("[WARN] Catalog seed error:", err)

def seed_initial_content():
    db = SessionLocal()
    try:
        if db.query(models.RealResult).count() == 0:
            initial_real_results = [
                models.RealResult(
                    customer_name="Ananya S.",
                    customer_location="Coimbatore, TN",
                    before_image="/uploads/product_placeholder.jpg",
                    after_image="/uploads/product_placeholder.jpg",
                    description="My dark spots faded dramatically and my overall complexion got an intense radiant boost. The saffron formulation feels so luxury.",
                    product_used="Glow Radiant Plus",
                    duration="4 Weeks",
                    skin_concern="Hyperpigmentation & Dullness",
                    display_order=1,
                    active=True
                ),
                models.RealResult(
                    customer_name="Rohan M.",
                    customer_location="Bengaluru, KA",
                    before_image="/uploads/product_placeholder.jpg",
                    after_image="/uploads/product_placeholder.jpg",
                    description="My active breakouts cleared up within days without drying out my skin. The gel texture is so soothing on irritated pores.",
                    product_used="Tea Tree Pureveil Cleanser",
                    duration="2 Weeks",
                    skin_concern="Acne Breakouts & Redness",
                    display_order=2,
                    active=True
                ),
                models.RealResult(
                    customer_name="Meera K.",
                    customer_location="Chennai, TN",
                    before_image="/uploads/product_placeholder.jpg",
                    after_image="/uploads/product_placeholder.jpg",
                    description="Absolutely resolved my winter dry flakes. I wake up with very soft, bouncy, and hydrated skin every single morning.",
                    product_used="Avocado Night Cream",
                    duration="3 Weeks",
                    skin_concern="Dry Flaky Patches",
                    display_order=3,
                    active=True
                )
            ]
            db.add_all(initial_real_results)
            db.commit()

        if db.query(models.BotanicalJourney).count() == 0:
            initial_journeys = [
                models.BotanicalJourney(
                    title="Overnight Hydration & Barrier Repair",
                    customer_name="Verified Routine Progress",
                    skin_type="Dry to Combination",
                    skin_concern="Dehydration & Dull Skin",
                    products_used="Avocado Pro Nourish Night Cream",
                    routine_description="Nightly application of Avocado Cream after gentle botanical cleansing.",
                    morning_routine="Rose Water Mist & Gentle Cleanser",
                    night_routine="Avocado Night Cream & Moisture Lock Balm",
                    duration="4 Weeks Daily Use",
                    result_description="Noticeable improvement in skin texture and moisture retention after incorporating Avocado Night Cream into evening routine.",
                    before_image="/uploads/product_placeholder.jpg",
                    progress_images=["/uploads/product_placeholder.jpg"],
                    final_image="/uploads/product_placeholder.jpg",
                    display_order=1,
                    active=True
                ),
                models.BotanicalJourney(
                    title="Radiance & Natural Glow Boost",
                    customer_name="Routine Journey Progress",
                    skin_type="All Skin Types",
                    skin_concern="Uneven Tone & Fatigue",
                    products_used="Kumkumadi Radiance Elixir",
                    routine_description="3-4 drops of Kumkumadi Elixir massaged upward onto damp face.",
                    morning_routine="Saffron Cleanser & Kumkumadi Drops",
                    night_routine="Pure Hydrosol Toner & Kumkumadi Elixir",
                    duration="3 Weeks Ritual",
                    result_description="Skin appears visibly brighter and more balanced with regular botanical cleansing and nourishment.",
                    before_image="/uploads/product_placeholder.jpg",
                    progress_images=["/uploads/product_placeholder.jpg"],
                    final_image="/uploads/product_placeholder.jpg",
                    display_order=2,
                    active=True
                ),
                models.BotanicalJourney(
                    title="Soothed Skin Barrier & Calming Ritual",
                    customer_name="Daily Skincare Journey",
                    skin_type="Sensitive & Acne-Prone",
                    skin_concern="Redness & Blemish Spots",
                    products_used="Neem Purifying Gel Cleanser",
                    routine_description="Twice daily gentle lathering with cool water.",
                    morning_routine="Neem Gel Cleanser & Aloe Gel",
                    night_routine="Neem Gel Cleanser & Tea Tree Serum",
                    duration="2 Weeks Daily Use",
                    result_description="Helped soothe redness and maintain a comfortable, hydrated complexion without heaviness.",
                    before_image="/uploads/product_placeholder.jpg",
                    progress_images=["/uploads/product_placeholder.jpg"],
                    final_image="/uploads/product_placeholder.jpg",
                    display_order=3,
                    active=True
                )
            ]
            db.add_all(initial_journeys)
            db.commit()
    except Exception as e:
        db.rollback()
        print("Seed error:", e)
    finally:
        db.close()

try:
    seed_initial_content()
except Exception as _seed_err:
    print("[WARN] Seed initial content skipped or failed:", _seed_err)



app = FastAPI(
    title="Qura Herbs API",
    description="Backend API for Qura Herbs Skincare E-commerce Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=False
)

# CORS configuration
origins = [
    settings.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup local upload storage directories
# On Vercel, use /tmp/uploads (writable); locally use backend/uploads
if os.environ.get("VERCEL"):
    UPLOAD_DIR = "/tmp/uploads"
else:
    UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount local upload directory for static serving
# Wrapped in try/except so a missing uploads dir never crashes the app on cold start
try:
    from fastapi.staticfiles import StaticFiles as _SF
    app.mount("/uploads", _SF(directory=UPLOAD_DIR), name="uploads")
except Exception as _mount_err:
    print(f"[WARN] Could not mount /uploads static dir: {_mount_err}")

# Include v1 API routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["Reviews"])
app.include_router(blogs.router, prefix="/api/v1/blogs", tags=["Blogs"])
app.include_router(offers.router, prefix="/api/v1/offers", tags=["Offers"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(media.router, prefix="/api/v1/media", tags=["Media"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["Customers"])
app.include_router(content.router, prefix="/api/v1/content", tags=["Content"])



@app.get("/api/health")
@app.get("/api/health/", include_in_schema=False)
def api_health():
    return {"status": "ok"}

@app.get("/api/admin/system-health")
@app.get("/api/admin/system-health/", include_in_schema=False)
def admin_system_health(db = Depends(health.get_db)):
    return health.system_health_check(db)

@app.get("/")
def read_root():
    return {
        "brand": "Qura Herbs",
        "description": "Premium Editorial Skincare API",
        "status": "online",
        "docs": "/docs"
    }
