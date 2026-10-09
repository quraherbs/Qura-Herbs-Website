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
                "short_description": "Let your skin do its best work while you rest. A botanically nourishing night cream that deeply hydrates, visibly brightens, and repairs the skin barrier.",
                "full_description": """Glow Radiant Plus Skin Whitening Cream — 35g

Let your skin do its best work while you rest. Reveal your natural brightness.

A botanically nourishing skin brightening cream that works in harmony with your skin's natural renewal cycle. Powered by pure botanical extracts, it deeply hydrates, visibly brightens, and steadily repairs a compromised skin barrier, so you wake up to skin that looks and feels genuinely restored.

Key Benefits
• Deep Hydration: Sustained overnight hydration that locks in moisture without heaviness
• Brightens Skin: Visibly brightens uneven, dull, or tired-looking skin and fades dark spots
• Repairs Barrier: Strengthens and repairs the natural skin barrier with consistent use
• Evens Skin Tone: Targets hyperpigmentation revealing an editorial-level luminous complexion

Key Ingredients
• Aloe Vera — deeply hydrating and calming, reduces redness and soothes irritated skin
• Licorice — a well-regarded botanical that gently brightens and evens skin tone over time
• Sweet Almond Oil — nourishes and softens skin texture without congesting pores
• Lavender — calms the skin and supports overnight recovery from environmental stress
• Mango Seed Butter — rich and emollient, restores suppleness and seals in moisture
• Carrot Seed Oil — high in antioxidants and vitamins, supports skin renewal and a healthy natural glow

Suitable For
Dull, dry, combination, and normal skin types. Particularly beneficial for skin that looks fatigued or uneven. Ideal for daily nighttime rituals.

How To Use
Cleanse thoroughly and pat your face dry. Take a small amount and warm between your fingertips. Apply evenly across face and neck using gentle upward strokes. Allow the formula to absorb fully overnight. Rinse gently in the morning.

Formulation Highlights
• Paraben-free & Sulphate-free
• No harsh bleaching or peeling agents
• 100% Botanically sourced actives
• Suitable for nightly ritual""",
                "price": 799.0,
                "sale_price": 799.0,
                "SKU": "QH-GLOW-RADPLUS-35",
                "stock": 45,
                "category_id": cat_map["dry-skin"],
                "ingredients": "Aloe Vera, Licorice Extract, Sweet Almond Oil, Lavender Oil, Mango Seed Butter, Carrot Seed Oil, Botanical Actives.",
                "benefits": "Deep Hydration • Brightens Skin • Repairs Barrier • Fades Dark Spots • Even Skin Tone.",
                "how_to_use": "Cleanse thoroughly and pat your face dry. Warm between fingertips and apply evenly using gentle upward strokes before sleeping.",
                "skin_type": "Dull, Dry & Uneven Skin Types",
                "product_images": [
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_main.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_ingredients.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_before_after_1.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_before_after_2.jpg"
                ],
                "thumbnail": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_main.jpg",
                "featured": True,
                "active": True
            },
            {
                "name": "Avocado Pro Nourish Night Cream",
                "slug": "avocado-night-cream",
                "short_description": "Feed your skin. Reveal its natural brightness. A botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep.",
                "full_description": """Avocado Pro Nourish Night Cream — 35g

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
                "price": 799.0,
                "sale_price": 799.0,
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
                "short_description": "A purifying, non-stripping face wash for acne control, pore refining, and bright, clear skin.",
                "full_description": """Tea Tree Pureveil Cleanser — 100ml

Reduce Acne + Brightening Botanical Gel Cleanser

Clean skin, calm skin every single day. A powerfully gentle face cleanser built for skin that needs more than just cleansing. Formulated with nature's most trusted purifying botanicals, it clears congested pores, actively works to reduce breakouts, and calms irritation — all in one step. Designed for daily use without the harshness that most acne-focused cleansers carry.

Skin that breaks out does not need to be punished, it needs to be rebalanced. Tea Tree Pureveil Cleanser is built on that principle, combining deep-cleansing actives with soothing, skin-respecting botanicals so your skin feels genuinely cared for after every wash, not stripped or tight.

Key Benefits
• Deeply Cleanses Pores: Clears daily buildup, pollution, and excess sebum without over-drying
• Helps Reduce Breakouts: Targets blemish-causing impurities and helps prevent future congestion
• Soothes Irritated Skin: Calms redness, inflammation, and reactive skin with lavender and aloe vera
• Protects Skin Barrier: Enriched with nourishing avocado oil so cleansing never leaves skin depleted
• Balances Moisture: Preserves natural skin hydration for a refreshed, calm, and luminous feel

Key Ingredients
• Tea Tree Extract — a well-studied purifying botanical that targets blemish-causing buildup and keeps pores clear
• Neem & Aloe Vera — deeply purifying and soothing plant extracts that control excess sebum, heal redness, and hydrate
• Avocado Oil — nourishes and protects the skin barrier so cleansing never leaves skin tight or dry
• Lavender Oil — calms inflammation, soothes reactive skin, and supports natural skin repair

Suitable For
Oily, acne-prone, combination, sensitive, and all skin types. Ideal for those experiencing frequent breakouts, enlarged pores, or persistent irritation.

How To Use
Apply to wet skin. Massage gently over face and neck in circular motions for 60 seconds. Rinse thoroughly with lukewarm or cool water. Use morning and night for consistent, clear results.

Formulation Highlights
• 100% Herbal & Botanical actives
• Paraben-free & Sulphate-free
• Non-stripping acne control formula
• Suitable for daily skincare ritual""",
                "price": 399.0,
                "sale_price": 399.0,
                "SKU": "QH-ACNE-TEATREE-100",
                "stock": 100,
                "category_id": cat_map["oily-skin"],
                "ingredients": "Tea Tree Extract, Neem & Aloe Vera Extract, Avocado Oil, Lavender Oil, Botanical Actives.",
                "benefits": "Deep Cleanses Pores • Helps Reduce Breakouts • Soothes Irritated Skin • Balances Sebum • Non-Stripping.",
                "how_to_use": "Apply to wet skin, massage gently, and rinse off. Use morning & night.",
                "skin_type": "Oily, Acne-Prone & Sensitive Skin",
                "product_images": [
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_main.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_back.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_ingredients.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_before_after.jpg"
                ],
                "thumbnail": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_main.jpg",
                "featured": False,
                "active": True
            },
            {
                "name": "Red Wine Glow Cleanser",
                "slug": "red-wine-glow-cleanser",
                "short_description": "Antioxidant-rich botanical gel cleanser with Fresh Grape Red Wine, Rice Exfoliator, and Glycerin for clear, radiant, and even-toned skin.",
                "full_description": """Red Wine Glow Cleanser — 100ml

Brightening + Hydrating Botanical Facial Cleanser

Experience botanical luxury and antioxidant care. Infused with Fresh Grape Red Wine extract, gentle Rice Exfoliator, and hydrating Glycerin, this daily gel cleanser gently lifts impurities, deeply cleanses pores, helps prevent breakouts, and leaves your skin with a luminous veil.

Key Benefits
• Antioxidant Care: Combats environmental stressors and free-radical damage with rich red grape antioxidants
• Even Tone Support: Gently refines surface texture and diminishes dullness for a brighter, balanced complexion
• Anti-Aging Boost: Enhances skin firmness, elasticity, and youthful radiance
• Helps Reduce Breakouts: Gently clears congested pores and blemishes without stripping skin moisture
• Deep Cleanses Pores: Soft micro-exfoliation from natural rice exfoliator washes away daily pollution and excess sebum
• Soothes Irritated Skin: Deeply hydrates with glycerin to leave skin refreshed, calmed, and never tight

Key Ingredients
• Fresh Grape Red Wine — rich in Resveratrol and polyphenols to revitalize dull skin, combat aging, and protect the skin barrier
• Rice Exfoliator — delicate natural exfoliator that gently smooths rough patches, clears pore congestion, and enhances luminosity
• Glycerin — pure humectant that binds moisture to the skin during cleansing, preventing moisture loss and irritation

Suitable For
Dull, uneven, oily, combination, normal, and dry skin types. Ideal for everyday morning and evening use.

How To Use
Apply to wet skin. Massage gently over face and neck in upward circular motions for 60 seconds. Rinse thoroughly with lukewarm or cool water. Use both morning & night for visible clarity and glow.

Formulation Highlights
• 100% Herbal & Botanical actives
• Paraben-free & gentle on skin
• Non-stripping antioxidant formula
• Suitable for daily skincare ritual""",
                "price": 399.0,
                "sale_price": 399.0,
                "SKU": "QH-GLOW-REDWINE-100",
                "stock": 60,
                "category_id": cat_map["dry-skin"],
                "ingredients": "Fresh Grape Red Wine Extract (Resveratrol), Rice Exfoliator, Pure Glycerin, Botanical Actives.",
                "benefits": "Antioxidant Care • Even Tone Support • Anti-Aging Boost • Deep Cleanses Pores • Helps Reduce Breakouts • Soothes Irritated Skin.",
                "how_to_use": "Apply to wet skin, massage gently, and rinse off. Use morning & night.",
                "skin_type": "Dull, Normal, Combination & Dry Skin",
                "product_images": [
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_main.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_back.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_ingredients.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_before_after_1.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_before_after_2.jpg"
                ],
                "thumbnail": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_main.jpg",
                "featured": True,
                "active": True
            },
            {
                "name": "SPF 50 Sunscreen",
                "slug": "spf-50-sunscreen",
                "short_description": "Ultra-lightweight, zero-white-cast botanical sunscreen.",
                "full_description": "Our SPF 50 Broad Spectrum Sunscreen protects against UVA and UVB rays while delivering rich hydration. Blended with Cucumber and Green Tea extracts, it leaves a dry-touch mtte finish that sits beautifully under makeup.",
                "price": 499.0,
                "sale_price": 499.0,
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
                "price": 599.0,
                "sale_price": 599.0,
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
                "price": 544.0,
                "sale_price": 544.0,
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
                "price": 649.0,
                "sale_price": 649.0,
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
            "glow-radiant-plus": "35g",
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
            name="✨ THE FIRST RITUAL",
            code="QURAFIRST",
            description="Claim ₹200 off your first Qura Herbs purchase. Start your natural radiance routine today.",
            offer_type="flat",
            discount_value=200.0,
            minimum_order_value=999.0,
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
