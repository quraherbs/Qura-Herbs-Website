from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models import models
from datetime import datetime

def seed_db():
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if database is already seeded
        if db.query(models.Category).first() is not None:
            print("Database already contains data. Skipping seeding.")
            return

        print("Seeding database...")

        # 1. Create Categories
        categories_data = [
            {
                "name": "Oily Skin",
                "slug": "oily-skin",
                "description": "Purifying, sebum-balancing formulas to clarify pores and prevent acne & blemishes.",
                "image": "https://images.unsplash.com/photo-1501570889534-b3d6790757a5?q=80&w=800&auto=format&fit=crop",
                "display_order": 1
            },
            {
                "name": "Dry Skin",
                "slug": "dry-skin",
                "description": "Deeply replenishing botanical creams and elixirs for moisture locking and barrier repair.",
                "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
                "display_order": 2
            },
            {
                "name": "Sensitive Skin",
                "slug": "sensitive-skin",
                "description": "Soothing, hypoallergenic herbal formulas to calm redness and irritation.",
                "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
                "display_order": 3
            },
            {
                "name": "Combination Skin",
                "slug": "combination-skin",
                "description": "Harmonizing botanical care to balance T-zone oiliness while nourishing dry areas.",
                "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
                "display_order": 4
            },
            {
                "name": "Hair Care",
                "slug": "hair-care",
                "description": "Nourishing remedies for healthy scalp and lustrous hair roots.",
                "image": "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop",
                "display_order": 5
            }
        ]

        db_categories = []
        for cat in categories_data:
            db_cat = models.Category(**cat)
            db.add(db_cat)
            db_categories.append(db_cat)
            
        db.commit()
        # Refresh categories to get IDs
        for db_cat in db_categories:
            db.refresh(db_cat)
            
        # Map slugs to IDs for easier product creation
        cat_map = {c.slug: c.id for c in db_categories}

        # 2. Create Products
        products_data = [
            {
                "name": "Glow Radiant Plus",
                "slug": "glow-radiant-plus",
                "short_description": "An intense brightness booster with Saffron & Turmeric extracts.",
                "full_description": "Glow Radiant Plus is an editorial-grade luxury face elixir formulated with authentic Indian Saffron (Kesar) and Sandalwood extracts. This serum target hyperpigmentation, uneven skin tone, and dullness, revealing a natural luminous finish.",
                "price": 999.0,
                "sale_price": 849.0,
                "SKU": "QH-GLOW-RADPLUS-30",
                "stock": 45,
                "category_id": cat_map["oily-skin"],
                "ingredients": "Kashmiri Saffron, Wild Turmeric, Sandalwood Oil, Licorice Extract, Hyaluronic Acid, Aloe Vera Extract.",
                "benefits": "Reduces dark spots, provides an instant glass-skin glow, balances tone, and deeply moisturizes.",
                "how_to_use": "Apply 3-4 drops to cleansed face and neck in the morning and evening. Gently press into skin until fully absorbed.",
                "skin_type": "Oily & Dull Skin",
                "product_images": ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"],
                "thumbnail": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
                "featured": True,
                "active": True
            },
            {
                "name": "Avocado Pro Nourish Night Cream",
                "slug": "avocado-night-cream",
                "short_description": "Feed your skin. Reveal its natural brightness. A botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep.",
                "full_description": """Avocado Pro Nourish Night Cream — 30g

Feed your skin. Reveal its natural brightness.

A botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep. Powered by avocado, sweet almond oil, honey, wheatgerm, milk protein, and seaweed, it supports healthier-looking, smoother, more luminous skin without harsh bleaching agents.

Key Benefits
• Deep, sustained nourishment throughout the day
• Visibly softer and smoother skin with regular use
• Restores a natural, healthy radiance to dull skin
• Strengthens the skin barrier over time
• Supports a more even, luminous complexion

Key Ingredients
• Avocado - rich in fatty acids that repair the skin barrier and restore suppleness
• Sweet Almond Oil - lightweight and emollient, softens without congesting pores
• Honey - a natural humectant that draws and locks moisture into the skin
• Wheatgerm Extract - packed with Vitamin E to support renewal and reduce dullness
• Milk Protein - smooths skin tone and refines the complexion
• Seaweed - marine-derived minerals that firm, hydrate, and restore luminosity

Suitable For
Oily, combination, aging, dull, and normal skin types. Ideal for daily use, overnight.

How To Use
Cleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.

Formulation Highlights
• Paraben-free
• No harsh bleaching agents
• Botanically sourced actives
• Suitable for daily use""",
                "price": 1299.0,
                "sale_price": 1149.0,
                "SKU": "QH-HYD-AVONIGHT-35",
                "stock": 30,
                "category_id": cat_map["dry-skin"],
                "ingredients": "Avocado (rich in fatty acids), Sweet Almond Oil, Honey, Wheatgerm Extract, Milk Protein, Seaweed minerals, Botanically Sourced Actives.",
                "benefits": "Deep, sustained nourishment throughout the day • Visibly softer and smoother skin with regular use • Restores natural, healthy radiance to dull skin • Strengthens the skin barrier over time • Supports a more even, luminous complexion.",
                "how_to_use": "Cleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.",
                "skin_type": "Oily, combination, aging, dull, and normal skin types",
                "product_images": [
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_ingredients.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_before_after.jpg"
                ],
                "thumbnail": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
                "featured": True,
                "active": True
            },
            {
                "name": "Tea Tree Pureveil Cleanser",
                "slug": "tea-tree-pureveil-cleanser",
                "short_description": "A purifying, non-stripping face wash for acne control.",
                "full_description": "A gentle botanical gel cleanser containing pure Australian Tea Tree oil and Neem extracts. Dissolves excess sebum and acne-causing impurities while keeping the skin barrier perfectly hydrated without tight post-wash dryness.",
                "price": 549.0,
                "sale_price": None,
                "SKU": "QH-ACNE-TEATREE-100",
                "stock": 100,
                "category_id": cat_map["oily-skin"],
                "ingredients": "Tea Tree Essential Oil, Organic Neem leaf infusion, Salicylic Acid (1%), Basil Extract, Glycerin.",
                "benefits": "Deep cleans pores, controls breakouts, reduces inflammation, and balances oil production.",
                "how_to_use": "Pump a small amount onto damp hands. Message gently over face in circular motions, then rinse thoroughly with lukewarm water.",
                "skin_type": "Oily and Acne-Prone Skin",
                "product_images": ["https://images.unsplash.com/photo-1556229010-6c3f2c9ca418?q=80&w=600&auto=format&fit=crop"],
                "thumbnail": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca418?q=80&w=600&auto=format&fit=crop",
                "featured": False,
                "active": True
            },
            {
                "name": "Red Wine Glow Cleanser",
                "slug": "red-wine-glow-cleanser",
                "short_description": "Luxury antioxidant face cleanser for youthful radiance.",
                "full_description": "Experience botanical opulence. Red Wine Glow Cleanser is infused with Resveratrol (extracted from red grape skins) and organic honey. It combats free-radical damage, washes off pollution, and leaves a visible luminous veil.",
                "price": 649.0,
                "sale_price": 599.0,
                "SKU": "QH-GLOW-REDWINE-100",
                "stock": 60,
                "category_id": cat_map["dry-skin"],
                "ingredients": "Red Wine Extract (Resveratrol), Organic Honey, Aloe Vera Juice, Vitamin C, Gotu Kola extract.",
                "benefits": "Rich in antioxidants, protects against photo-aging, boosts surface glow, and softens skin.",
                "how_to_use": "Massage onto damp face for 60 seconds. Wash off with cool water. Use twice daily.",
                "skin_type": "Dull, Normal and Dry Skin",
                "product_images": ["https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop"],
                "thumbnail": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop",
                "featured": True,
                "active": True
            },
            {
                "name": "SPF 50 Sunscreen",
                "slug": "spf-50-sunscreen",
                "short_description": "Ultra-lightweight, zero-white-cast botanical sunscreen.",
                "full_description": "Our SPF 50 Broad Spectrum Sunscreen protects against UVA and UVB rays while delivering rich hydration. Blended with Cucumber and Green Tea extracts, it leaves a dry-touch mtte finish that sits beautifully under makeup.",
                "price": 799.0,
                "sale_price": 699.0,
                "SKU": "QH-HYD-SPF50-100",
                "stock": 80,
                "category_id": cat_map["combination-skin"],
                "ingredients": "Zinc Oxide, Titanium Dioxide, Cucumber extract, Green Tea extract, Gotu Kola, Licorice.",
                "benefits": "Broad-spectrum UV protection, prevents sun spots, lightweight and non-greasy, soothing effect.",
                "how_to_use": "Apply generously on clean face and neck 15 minutes before sun exposure. Reapply every 2 hours.",
                "skin_type": "Combination & All Skin Types",
                "product_images": ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop"],
                "thumbnail": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
                "featured": True,
                "active": True
            },
            {
                "name": "Vitamin C Serum",
                "slug": "vitamin-c-serum",
                "short_description": "15% Kakadu Plum Vitamin C for luminous skin defense.",
                "full_description": "A high-potency serum featuring 15% Vitamin C from natural Kakadu Plum extract and Ferulic Acid. Provides advanced environmental protection, brightens hyperpigmentation, and stimulates natural collagen synthesis.",
                "price": 899.0,
                "sale_price": 799.0,
                "SKU": "QH-GLOW-VITC-30",
                "stock": 50,
                "category_id": cat_map["sensitive-skin"],
                "ingredients": "Kakadu Plum extract (15% Vitamin C), Ferulic Acid, Hyaluronic Acid, Vitamin E, Sweet Orange Oil.",
                "benefits": "Reduces fine lines, clears skin tone, repairs UV damage, and hydrates.",
                "how_to_use": "Smooth 2-3 drops onto face after cleansing and toning. Always follow with SPF during daytime.",
                "skin_type": "Sensitive & All Skin Types",
                "product_images": ["https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop"],
                "thumbnail": "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop",
                "featured": False,
                "active": True
            },
            {
                "name": "Hair Shine Serum",
                "slug": "hair-shine-serum",
                "short_description": "Silky smoothing botanical serum with Moroccan Argan & Bhringraj.",
                "full_description": "Transform dry, frizzy strands into a gloss cascade. Enriched with Moroccan Argan Oil and Bhringraj herb, this lightweight elixir forms a protective coat, seals split ends, and delivers high-shine finish.",
                "price": 699.0,
                "sale_price": None,
                "SKU": "QH-HAIR-SHINE-50",
                "stock": 70,
                "category_id": cat_map["hair-care"],
                "ingredients": "Moroccan Argan Oil, Bhringraj extract, Almond Oil, Coconut Oil fractions, Rosemary Essential Oil.",
                "benefits": "Controls frizz instantly, gives a glossy shine, strengthens hair shafts, protects from heat styling.",
                "how_to_use": "Take 2-3 drops on palms and distribute evenly through damp or dry hair lengths, avoiding the roots.",
                "skin_type": "All Hair Types",
                "product_images": ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop"],
                "thumbnail": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
                "featured": False,
                "active": True
            },
            {
                "name": "Anti-Dandruff Scalp Detox Gel",
                "slug": "anti-dandruff-scalp-detox-gel",
                "short_description": "Clearing scalp treatment with Tea Tree and Rosemary.",
                "full_description": "A detoxifying scalp gel that targets itching, flaking, and buildup. Infused with Tea Tree, Rosemary, and Ginger oil, it deeply purifies scalp pores and controls dandruff microbes, boosting hair follicle health.",
                "price": 599.0,
                "sale_price": 499.0,
                "SKU": "QH-HAIR-DETOX-100",
                "stock": 25,
                "category_id": cat_map["hair-care"],
                "ingredients": "Tea Tree oil, Rosemary hydrosol, Aloe Vera gel base, Salicylic Acid (0.5%), Ginger root extract.",
                "benefits": "Reduces dandruff flaking, relieves scalp itchiness, removes sebum buildup, soothes roots.",
                "how_to_use": "Apply directly to scalp dry or damp. Message gently for 5 minutes. Leave on for 30 minutes, then shampoo out.",
                "skin_type": "Flaky & Dry Scalp",
                "product_images": ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop"],
                "thumbnail": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
                "featured": False,
                "active": True
            }
        ]

        volume_mapping = {
            "avocado-night-cream": "35g",
            "tea-tree-pureveil-cleanser": "100ml",
            "red-wine-glow-cleanser": "100ml",
            "spf-50-sunscreen": "100ml",
            "vitamin-c-serum": "30ml",
            "glow-radiant-plus": "30ml",
            "hair-shine-serum": "50ml",
            "anti-dandruff-scalp-detox-gel": "100g",
        }

        for p_data in products_data:
            db_prod = models.Product(**p_data)
            db.add(db_prod)
            db.commit()
            db.refresh(db_prod)

            vol_name = volume_mapping.get(db_prod.slug, "100ml")
            single_variant = models.ProductVariant(
                product_id=db_prod.id,
                name=vol_name,
                sku_suffix=f"V{vol_name.upper().replace(' ', '')}",
                price_override=None,
                stock=db_prod.stock
            )
            db.add(single_variant)
            
        db.commit()

        # 3. Create Home Settings configuration
        homepage_config = {
            "hero_title": "Botanical Science. Luxury Skincare.",
            "hero_subtitle": "Skincare rooted in ancient herbal wisdom, designed for modern skin rituals.",
            "hero_image": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop",
            "cta_text": "SHOP THE RITUAL",
            "cta_link": "/shop",
            "announcement_bar": "✨ DISCOVER YOUR SKIN RITUAL | FREE SHIPPING ABOVE ₹1999",
            "founder_quote": "We believe in skincare that is organic, clean, and elegant—blending active laboratory science with the rich healing heritage of Indian botanicals.",
            "founder_name": "Nanda Velv",
            "founder_designation": "Founder & Herbal Chemist",
            "founder_image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
            "founder_bio": "Nanda founded Qura Herbs to deliver honest, premium formulas that respect the skin barrier. Leveraging years of phytomedical research, Qura Herbs products capture nature's pure essence."
        }

        db_settings = models.Setting(key="homepage", value=homepage_config)
        db.add(db_settings)
        
        # 4. Create one initial Offer
        initial_offer = models.Offer(
            title="✨ THE FIRST RITUAL",
            description="Claim ₹200 off your first Qura Herbs purchase. Start your natural radiance routine today.",
            banner="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
            coupon_code="QURAFIRST",
            CTA="CLAIM MY ₹200 OFF",
            active=True
        )
        db.add(initial_offer)
        
        # 5. Create a default Coupon matching the offer
        db_coupon = models.Coupon(
            code="QURAFIRST",
            discount_type="fixed",
            discount_value=200.0,
            minimum_order=999.0,
            active=True
        )
        db.add(db_coupon)

        # 6. Create Initial Blog Post
        initial_blog = models.Blog(
            title="How to Use Our Avocado Night Cream for Maximum Hydration",
            slug="how-to-use-our-night-cream",
            excerpt="Minimal care rituals to refine and deeply nourish dry to mature skin barriers overnight.",
            content="Using a wonderful texture of cold-pressed Avocado Butter and Ashwagandha extract, our Avocado Night Cream restores your skin's elasticity while you sleep.",
            featured_image="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
            author="Pranavi",
            published=True,
            published_at=datetime.utcnow(),
            meta_description="Learn how to incorporate Avocado Night Cream into your evening botanical ritual."
        )
        db.add(initial_blog)

        db.commit()
        print("Database successfully seeded with Qura Herbs brand catalog!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
