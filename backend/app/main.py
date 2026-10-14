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
        desired_real_results = [
            {
                "id": 1,
                "customer_name": "Ananya S.",
                "customer_location": "Coimbatore, TN",
                "before_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/ananya_s_before.jpg",
                "after_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/ananya_s_after.jpg",
                "description": "My dark spots faded dramatically and my overall complexion got an intense radiant boost. The saffron formulation feels so luxury.",
                "product_used": "Glow Radiant Plus",
                "duration": "4 Weeks",
                "skin_concern": "Hyperpigmentation & Dullness",
                "display_order": 1,
                "active": True
            },
            {
                "id": 2,
                "customer_name": "Rohan M.",
                "customer_location": "Bengaluru, KA",
                "before_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/rohan_m_before.jpg",
                "after_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/rohan_m_after.jpg",
                "description": "My active breakouts cleared up within days without drying out my skin. The gel texture is so soothing on irritated pores.",
                "product_used": "Tea Tree Pureveil Cleanser",
                "duration": "2 Weeks",
                "skin_concern": "Acne Breakouts & Redness",
                "display_order": 2,
                "active": True
            },
            {
                "id": 3,
                "customer_name": "Meera K.",
                "customer_location": "Chennai, TN",
                "before_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/meera_k_before.jpg",
                "after_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/meera_k_after.jpg",
                "description": "Absolutely resolved my winter dry flakes. I wake up with very soft, bouncy, and hydrated skin every single morning.",
                "product_used": "Avocado Night Cream",
                "duration": "3 Weeks",
                "skin_concern": "Dry Flaky Patches",
                "display_order": 3,
                "active": True
            },
            {
                "id": 4,
                "customer_name": "Harini R.",
                "customer_location": "Madurai, TN",
                "before_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_4_before.jpg",
                "after_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_4_after.jpg",
                "description": "Noticeable reduction in acne marks and visible redness. My cheek area looks remarkably clearer and healthier.",
                "product_used": "Glow Radiant Plus Night Cream",
                "duration": "4 Weeks",
                "skin_concern": "Blemishes & Post-Acne Marks",
                "display_order": 4,
                "active": True
            },
            {
                "id": 5,
                "customer_name": "Divya M.",
                "customer_location": "Bengaluru, KA",
                "before_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_5_before.jpg",
                "after_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_5_after.jpg",
                "description": "The deep hydration helped soothe my under-eye fatigue and brought a natural, refreshed brightness to my entire complexion.",
                "product_used": "Avocado Pro Nourish Night Cream",
                "duration": "3 Weeks",
                "skin_concern": "Under-Eye Dark Circles & Dullness",
                "display_order": 5,
                "active": True
            },
            {
                "id": 6,
                "customer_name": "Kavya P.",
                "customer_location": "Kochi, KL",
                "before_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_6_before.jpg",
                "after_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_6_after.jpg",
                "description": "My skin texture smoothed out significantly with daily nighttime use, leaving behind a smooth, radiant glow.",
                "product_used": "Glow Radiant Plus Night Cream",
                "duration": "4 Weeks",
                "skin_concern": "Uneven Texture & Rough Skin",
                "display_order": 6,
                "active": True
            },
            {
                "id": 7,
                "customer_name": "Karthik V.",
                "customer_location": "Coimbatore, TN",
                "before_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_7_before.jpg",
                "after_image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_7_after.jpg",
                "description": "Calmed down the stubborn bumps on my cheek within two weeks without any greasy feel or dryness.",
                "product_used": "Avocado Pro Nourish Night Cream",
                "duration": "2 Weeks",
                "skin_concern": "Active Breakouts & Irritation",
                "display_order": 7,
                "active": True
            }
        ]
        for item_data in desired_real_results:
            existing = db.query(models.RealResult).filter(models.RealResult.id == item_data["id"]).first()
            if not existing:
                db.add(models.RealResult(**item_data))
            else:
                for k, v in item_data.items():
                    setattr(existing, k, v)
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
                    before_image="https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_before.jpg",
                    progress_images=["https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_before.jpg", "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_after.jpg"],
                    final_image="https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_after.jpg",
                    display_order=1,
                    active=True
                ),
                models.BotanicalJourney(
                    title="Shine and Smooth Hair",
                    customer_name="Routine Journey Progress",
                    skin_type="All Hair Types",
                    skin_concern="Frizz & Dullness",
                    products_used="Anti-Frizz Hair Shine Serum",
                    routine_description="Apply 3-4 drops of Anti-Frizz Serum to your hair and distribute it evenly through the lengths to achieve smooth, shiny hair.",
                    morning_routine="Distribute evenly through lengths",
                    night_routine="Light touch-up before bed",
                    duration="3 Weeks Ritual",
                    result_description="Apply 3-4 drops of Anti-Frizz Serum to your hair and distribute it evenly through the lengths to achieve smooth, shiny hair.",
                    before_image="https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_before.jpg",
                    progress_images=["https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_before.jpg", "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_after.jpg"],
                    final_image="https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_after.jpg",
                    display_order=2,
                    active=True
                ),
                models.BotanicalJourney(
                    title="Soothed Skin Barrier & Calming Ritual",
                    customer_name="Daily Skincare Journey",
                    skin_type="Sensitive & Acne-Prone",
                    skin_concern="Redness & Blemish Spots",
                    products_used="Glow Radiant Plus Night Cream",
                    routine_description="Twice daily gentle lathering with cool water.",
                    morning_routine="Neem Gel Cleanser & Aloe Gel",
                    night_routine="Glow Radiant Plus Night Cream & Hydration Mist",
                    duration="2 Weeks Daily Use",
                    result_description="Helped soothe redness and maintain a comfortable, hydrated complexion without heaviness.",
                    before_image="https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_before.jpg",
                    progress_images=["https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_before.jpg", "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_after.jpg"],
                    final_image="https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_after.jpg",
                    display_order=3,
                    active=True
                )
            ]
            db.add_all(initial_journeys)
            db.commit()

        # Remove any legacy dummy placeholder reviews if present
        legacy_dummy_reviews = db.query(models.Review).join(models.Customer).filter(
            models.Customer.email.like('%@quraherbs-reviewer.com')
        ).all()
        for ldr in legacy_dummy_reviews:
            db.delete(ldr)
        db.commit()

        # Seed 6 customer reviews per product across all catalog items
        product_reviews_seed = [
            # Avocado Pro Nourish Night Cream
            {
                "product_slug": "avocado-night-cream",
                "customer_name": "Meera Kalyanasundaram",
                "customer_email": "meera.kalyan@gmail.com",
                "customer_city": "Chennai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "I have been using this Avocado cream for nearly a month now. Night time apply pannittu thoongina, morning skin feels very soft and plump. Skin dullness is visibly reduced and there is a healthy glow.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "avocado-night-cream",
                "customer_name": "Deepa Natarajan",
                "customer_email": "deepa.natarajan@gmail.com",
                "customer_city": "Coimbatore",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Romba rich yet absorbs without being sticky. After waking up, dry patches around my nose and cheeks are gone. My skin feels thoroughly nourished and moisturised.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "avocado-night-cream",
                "customer_name": "Shruthi Venkatesh",
                "customer_email": "shruthi.venkat@outlook.com",
                "customer_city": "Bengaluru",
                "customer_state": "Karnataka",
                "rating": 4,
                "review": "Good night cream for tired skin. Dark spots have softened in appearance over 3-4 weeks of regular use. Texture is very soothing and mild botanical fragrance.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "avocado-night-cream",
                "customer_name": "Priya Sundar",
                "customer_email": "priya.sundar@yahoo.com",
                "customer_city": "Madurai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Enoda skin konjam sensitive and acne-prone. Usually heavy creams breakout tharum, but this one didn't cause any pimples. Woke up with calm and fresh-looking skin.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "avocado-night-cream",
                "customer_name": "Ananya Raman",
                "customer_email": "ananya.raman@gmail.com",
                "customer_city": "Salem",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Skin feels so supple and hydrated. I noticed my morning complexion looks clearer and less dull. Definitely staying in my evening ritual.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "avocado-night-cream",
                "customer_name": "Karthiga Devi",
                "customer_email": "karthiga.devi@gmail.com",
                "customer_city": "Tiruchirappalli",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Subtle natural herbal scent and deep moisturizing feel. My skin texture feels smoother and makeup sits much better during the day now.",
                "verified_purchase": True,
                "approved": True,
            },

            # Glow Radiant Plus Night Cream
            {
                "product_slug": "glow-radiant-plus",
                "customer_name": "Pavithra Sridhar",
                "customer_email": "pavithra.sridhar@gmail.com",
                "customer_city": "Chennai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Using this cream for 3 weeks every night. Face-la irundha pigmentation marks konjam light aagirukku and skin tone looks much more even and radiant.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "glow-radiant-plus",
                "customer_name": "Archana Krishnan",
                "customer_email": "archana.krishnan@outlook.com",
                "customer_city": "Bengaluru",
                "customer_state": "Karnataka",
                "rating": 5,
                "review": "Really impressed with how bright my skin looks in the mornings. It helped fade stubborn post-blemish marks without irritating my combination skin.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "glow-radiant-plus",
                "customer_name": "Gayathri Mohan",
                "customer_email": "gayathri.mohan@gmail.com",
                "customer_city": "Coimbatore",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Lightweight feel on skin but deeply moisturising. Saffron and licorice fragrance is so soothing. My face doesn't look dull even after long work hours.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "glow-radiant-plus",
                "customer_name": "Nithya Balaji",
                "customer_email": "nithya.balaji@yahoo.com",
                "customer_city": "Madurai",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Gentle on sensitive skin. Took around 20 days to notice difference, but skin definitely feels softer, clearer, and has a natural healthy radiance.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "glow-radiant-plus",
                "customer_name": "Swetha R.",
                "customer_email": "swetha.r@gmail.com",
                "customer_city": "Tiruppur",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Nalla texture, quickly absorbs. Acne scars appearance konjam konjama reduce aavudhu. Skin feels super hydrated when I wash my face next morning.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "glow-radiant-plus",
                "customer_name": "Vimala Chandran",
                "customer_email": "vimala.chandran@gmail.com",
                "customer_city": "Erode",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "A little goes a long way. My skin tone appears more luminous and nourished. No harsh peeling or burning feeling at all.",
                "verified_purchase": True,
                "approved": True,
            },

            # Tea Tree Pureveil Cleanser
            {
                "product_slug": "tea-tree-pureveil-cleanser",
                "customer_name": "Harish Raghavan",
                "customer_email": "harish.raghavan@gmail.com",
                "customer_city": "Chennai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Perfect daily cleanser for humid weather. Cleans off oil and daily commute dirt completely without leaving that stretchy or dry feeling on the face.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "tea-tree-pureveil-cleanser",
                "customer_name": "Sneha Murugan",
                "customer_email": "sneha.murugan@gmail.com",
                "customer_city": "Coimbatore",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Enoda oily T-zone-ku romba nalla suit aachu. Gentle tea tree cooling effect is so refreshing after coming back from office. Pores feel clean.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "tea-tree-pureveil-cleanser",
                "customer_name": "Divya Prasad",
                "customer_email": "divya.prasad@outlook.com",
                "customer_city": "Bengaluru",
                "customer_state": "Karnataka",
                "rating": 4,
                "review": "Pleasant mild gel lather that washes off cleanly. It controls excess sebum and makes my face feel instantly fresh and bright.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "tea-tree-pureveil-cleanser",
                "customer_name": "Keerthana Vijay",
                "customer_email": "keerthana.vijay@gmail.com",
                "customer_city": "Salem",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Doesn't strip moisture like regular foaming cleansers. Skin feels surprisingly soft and calmed down after washing. Great for acne-prone skin.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "tea-tree-pureveil-cleanser",
                "customer_name": "Arvind Sethupathi",
                "customer_email": "arvind.sethupathi@gmail.com",
                "customer_city": "Madurai",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Very easy pump bottle and refreshing botanical aroma. Removed sunscreen and sweat without stinging eyes or drying out my cheeks.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "tea-tree-pureveil-cleanser",
                "customer_name": "Roshini K.",
                "customer_email": "roshini.k@gmail.com",
                "customer_city": "Kochi",
                "customer_state": "Kerala",
                "rating": 5,
                "review": "Daily evening routine-la regular use pandren. Impurities clear pannudhu, and breakouts have reduced significantly over the past month.",
                "verified_purchase": True,
                "approved": True,
            },

            # Red Wine Glow Cleanser
            {
                "product_slug": "red-wine-glow-cleanser",
                "customer_name": "Malathi Sundaresan",
                "customer_email": "malathi.sundaresan@gmail.com",
                "customer_city": "Chennai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Rich antioxidant feel with a lovely mild aroma. Washes away pollutants easily and leaves the skin with an instant fresh, soft brightness.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "red-wine-glow-cleanser",
                "customer_name": "Janani Narayanan",
                "customer_email": "janani.narayanan@gmail.com",
                "customer_city": "Bengaluru",
                "customer_state": "Karnataka",
                "rating": 5,
                "review": "Face wash pannadhukku appram skin feels hydrated, not dry at all. Daily dullness completely remove aaguthu. Really luxurious everyday experience.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "red-wine-glow-cleanser",
                "customer_name": "Abinaya R.",
                "customer_email": "abinaya.r@gmail.com",
                "customer_city": "Coimbatore",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Silky gel texture that lathers gently. My skin looks cleaner and softer after every wash. Ideal morning face wash before stepping out.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "red-wine-glow-cleanser",
                "customer_name": "Radhika Suresh",
                "customer_email": "radhika.suresh@gmail.com",
                "customer_city": "Tiruchirappalli",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Removes makeup residue and grime effortlessly. My skin feels fresh, bright, and nourished rather than tight. Very gentle on dry skin.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "red-wine-glow-cleanser",
                "customer_name": "Sowmya Venkat",
                "customer_email": "sowmya.venkat@outlook.com",
                "customer_city": "Madurai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Smells subtle and high-end. Skin looks noticeably less tired after a long day in the sun. Gives a smooth, clean canvas for my night serums.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "red-wine-glow-cleanser",
                "customer_name": "Preethi Kumar",
                "customer_email": "preethi.kumar@gmail.com",
                "customer_city": "Vellore",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Good gentle cleanser for daily routine. Easy to rinse off, no sticky residue, and skin feels velvety soft to touch.",
                "verified_purchase": True,
                "approved": True,
            },

            # Vitamin C Serum
            {
                "product_slug": "vitamin-c-serum",
                "customer_name": "Aishwarya Rajan",
                "customer_email": "aishwarya.rajan@gmail.com",
                "customer_city": "Chennai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Enoda dark spots and tanning konjam light aagiduchu after 3 weeks of morning use. Texture is water-light, not sticky at all, and absorbs very fast.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "vitamin-c-serum",
                "customer_name": "Lavanya Sekar",
                "customer_email": "lavanya.sekar@gmail.com",
                "customer_city": "Bengaluru",
                "customer_state": "Karnataka",
                "rating": 5,
                "review": "One of the few Vitamin C serums that didn't oxidize fast or irritate my skin. Visibly brightens morning dullness and layers beautifully under sunscreen.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "vitamin-c-serum",
                "customer_name": "Revathi Muthu",
                "customer_email": "revathi.muthu@gmail.com",
                "customer_city": "Coimbatore",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Lightweight and non-greasy drops. Skin has developed a very healthy natural glow. Subtle reduction in cheek pigmentation marks.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "vitamin-c-serum",
                "customer_name": "Pooja Nair",
                "customer_email": "pooja.nair@outlook.com",
                "customer_city": "Kochi",
                "customer_state": "Kerala",
                "rating": 5,
                "review": "Fits right into my AM routine before moisturizer. My complexion looks fresher and more radiant throughout the day. Worth every drop.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "vitamin-c-serum",
                "customer_name": "Deepthi Mohan",
                "customer_email": "deepthi.mohan@gmail.com",
                "customer_city": "Madurai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Sun spots around forehead have become noticeably less prominent. Quick absorbing serum and gives a dewy finish without any oily residue.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "vitamin-c-serum",
                "customer_name": "Shweta Anand",
                "customer_email": "shweta.anand@gmail.com",
                "customer_city": "Salem",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Gentle formula with botanical boosters. Doesn't cause tingling or breakouts. Skin looks more awake and even-toned.",
                "verified_purchase": True,
                "approved": True,
            },

            # Hair Shine Serum / Anti-Frizz Hair Shine Serum
            {
                "product_slug": "hair-shine-serum",
                "customer_name": "Rohini Subramanian",
                "customer_email": "rohini.subramanian@gmail.com",
                "customer_city": "Chennai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Chennai humidity-la enoda hair romba frizz aagum. Just 3 drops of this serum on damp hair keeps it smooth, manageable, and silky all day.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "hair-shine-serum",
                "customer_name": "Varsha Anand",
                "customer_email": "varsha.anand@gmail.com",
                "customer_city": "Bengaluru",
                "customer_state": "Karnataka",
                "rating": 5,
                "review": "Tamed flyaways without weighing down my fine hair or making it greasy. Hair feels so much softer and has a glossy, healthy shine.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "hair-shine-serum",
                "customer_name": "Nandhini Prakash",
                "customer_email": "nandhini.prakash@outlook.com",
                "customer_city": "Coimbatore",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Dry, split ends look noticeably healthier and smoother. It spreads easily through lengths and smells delicate and natural.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "hair-shine-serum",
                "customer_name": "Krithika S.",
                "customer_email": "krithika.s@gmail.com",
                "customer_city": "Madurai",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Frizz control is excellent even on monsoon days. Hair looks shinier, detangles quickly, and feels feather-light.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "hair-shine-serum",
                "customer_name": "Meenakshi Sundaram",
                "customer_email": "meenakshi.sundaram@gmail.com",
                "customer_city": "Tiruchirappalli",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Hair wash pannitu apply panna, blow dry or heat illamale hair stays soft and neat. Huge improvement in rough hair texture.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "hair-shine-serum",
                "customer_name": "Bhavani Govind",
                "customer_email": "bhavani.govind@gmail.com",
                "customer_city": "Hyderabad",
                "customer_state": "Telangana",
                "rating": 4,
                "review": "Non-sticky formulation that adds an instant polished sheen to dull lengths. Makes combing effortless and hair feels velvety.",
                "verified_purchase": True,
                "approved": True,
            },

            # SPF 50 Sunscreen
            {
                "product_slug": "spf-50-sunscreen",
                "customer_name": "Shalini Mahesh",
                "customer_email": "shalini.mahesh@gmail.com",
                "customer_city": "Chennai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Zero white cast! Spreads like a light moisturiser and doesn't sweat off in Chennai heat. My skin stays hydrated and protected the whole day.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "spf-50-sunscreen",
                "customer_name": "Dhivya Karthik",
                "customer_email": "dhivya.karthik@gmail.com",
                "customer_city": "Coimbatore",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Enoda daily routine-ku idhu must-have. No greasy layer, no heavy feel on face, and reapplication is super easy over makeup too.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "spf-50-sunscreen",
                "customer_name": "Anitha Krishnan",
                "customer_email": "anitha.krishnan@outlook.com",
                "customer_city": "Bengaluru",
                "customer_state": "Karnataka",
                "rating": 4,
                "review": "Gives broad spectrum protection with a comfortable dewy finish. Doesn't pill under foundation and keeps dry areas well moisturised.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "spf-50-sunscreen",
                "customer_name": "Sneha Paul",
                "customer_email": "sneha.paul@gmail.com",
                "customer_city": "Kochi",
                "customer_state": "Kerala",
                "rating": 5,
                "review": "Lightweight fluid texture that sinks in within seconds. Very soothing on sensitive skin and doesn't sting the eye area.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "spf-50-sunscreen",
                "customer_name": "Vinothini R.",
                "customer_email": "vinothini.r@gmail.com",
                "customer_city": "Madurai",
                "customer_state": "Tamil Nadu",
                "rating": 5,
                "review": "Sunburn and redness thadukudhu very effectively. Daily college wear-ku perfect, feels completely weightless like a light day cream.",
                "verified_purchase": True,
                "approved": True,
            },
            {
                "product_slug": "spf-50-sunscreen",
                "customer_name": "Madhumitha S.",
                "customer_email": "madhumitha.s@gmail.com",
                "customer_city": "Salem",
                "customer_state": "Tamil Nadu",
                "rating": 4,
                "review": "Moisturizing without clogging pores. No breakouts so far. Keeps my face comfortable and hydrated during long outdoor commutes.",
                "verified_purchase": True,
                "approved": True,
            },
        ]

        for rev_item in product_reviews_seed:
            prod = db.query(models.Product).filter(models.Product.slug == rev_item["product_slug"]).first()
            if not prod:
                continue

            customer = db.query(models.Customer).filter(models.Customer.email == rev_item["customer_email"]).first()
            if not customer:
                customer = models.Customer(
                    name=rev_item["customer_name"],
                    email=rev_item["customer_email"],
                    phone="9876543210",
                    address="Customer Verified Residence",
                    city=rev_item["customer_city"],
                    state=rev_item["customer_state"],
                    pincode="600001"
                )
                db.add(customer)
                db.commit()
                db.refresh(customer)
            else:
                customer.name = rev_item["customer_name"]
                customer.city = rev_item["customer_city"]
                customer.state = rev_item["customer_state"]
                db.commit()

            existing_rev = db.query(models.Review).filter(
                models.Review.product_id == prod.id,
                models.Review.customer_id == customer.id
            ).first()

            if not existing_rev:
                new_rev = models.Review(
                    product_id=prod.id,
                    customer_id=customer.id,
                    rating=rev_item["rating"],
                    review=rev_item["review"],
                    verified_purchase=rev_item["verified_purchase"],
                    approved=rev_item["approved"],
                    featured=True
                )
                db.add(new_rev)
            else:
                existing_rev.rating = rev_item["rating"]
                existing_rev.review = rev_item["review"]
                existing_rev.verified_purchase = rev_item["verified_purchase"]
                existing_rev.approved = rev_item["approved"]

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
