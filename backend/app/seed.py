from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models import models
from datetime import datetime

def seed_db():
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        existing_categories = db.query(models.Category).all()
        already_seeded = len(existing_categories) > 0

        if not already_seeded:
            print("Seeding database categories...")

            # 1. Create Categories
            categories_data = [
                {
                    "name": "Hair Care",
                    "slug": "hair-care",
                    "description": "Nourishing remedies for healthy scalp and lustrous hair roots.",
                    "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_care_concern.jpg",
                    "display_order": 1
                },
                {
                    "name": "Oily Skin",
                    "slug": "oily-skin",
                    "description": "Purifying, sebum-balancing formulas to clarify pores and prevent acne & blemishes.",
                    "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/oily_skin_concern.png",
                    "display_order": 2
                },
                {
                    "name": "Sensitive Skin",
                    "slug": "sensitive-skin",
                    "description": "Soothing, hypoallergenic herbal formulas to calm redness and irritation.",
                    "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/sensitive_skin_concern.jpg",
                    "display_order": 3
                },
                {
                    "name": "Dry Skin",
                    "slug": "dry-skin",
                    "description": "Deeply replenishing botanical creams and elixirs for moisture locking and barrier repair.",
                    "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/dry_skin_concern.jpg",
                    "display_order": 4
                },
                {
                    "name": "Combination Skin",
                    "slug": "combination-skin",
                    "description": "Harmonizing botanical care to balance T-zone oiliness while nourishing dry areas.",
                    "image": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/combination_skin_concern.jpg",
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
                
        cat_list = existing_categories if already_seeded else db_categories
        cat_map = {}
        for c in cat_list:
            cat_map[c.slug] = c.id
            if c.name:
                norm = c.name.lower().strip().replace(' ', '-')
                cat_map[norm] = c.id
                cat_map[c.name.lower().strip()] = c.id
        if already_seeded:
            print("Database categories already exist. Syncing products with seed definitions...")

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
                "category_id": cat_map.get("dry-skin", 2),
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
                "category_id": cat_map.get("dry-skin", 2),
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
                "category_id": cat_map.get("oily-skin", 1),
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
                "category_id": cat_map.get("dry-skin", 2),
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
                "featured": False,
                "active": True
            },
            {
                "name": "SPF 50 Sunscreen",
                "slug": "spf-50-sunscreen",
                "short_description": "Moisturizing SPF 50+ sunscreen with Coconut & Sesame Oil, Shea Butter, and Aloe Vera for broad-spectrum protection and hydration.",
                "full_description": """SPF 50 Sunscreen — 100ml

Moisturizing Sun Screen • Hydrates & Protects SPF 50+

A botanical broad-spectrum sunscreen that provides high-level daily defense against UVA and UVB rays while keeping the skin barrier hydrated and calm. Enriched with natural oils and soothing plant extracts, it protects against sunburn, reduces photo-damage, and blends smoothly without greasy residue or white cast.

Key Benefits
• Broad-Spectrum SPF 50+ Defense: Shields skin from damaging UV rays and photo-aging
• Reduce Irritation: Calms inflammation and sunburn redness with soothing pure Aloe Vera
• Antioxidant Properties: Rich botanical oils protect against environmental free-radical damage
• Maintain Even Skin Tone: Prevents sunspots, tan buildup, and hyperpigmentation
• Deeply Moisturizing: Shea Butter and Sesame Oil maintain all-day moisture without heaviness

Key Ingredients
• Coconut & Sesame Oil — rich in natural sun-protective lipids, essential fatty acids, and antioxidants to nourish and guard skin
• Shea Butter — rich emollient that seals in hydration and strengthens the epidermal barrier
• Aloe Vera — instantly cools, calms irritation, and hydrates sun-exposed skin

Suitable For
All skin types, including sensitive, combination, dry, and normal skin. Ideal for daily morning wear.

How To Use
Apply generously to clean face and neck every morning. Allow 10 minutes before direct sun exposure. Reapply every 2-3 hours during prolonged sun exposure.

Formulation Highlights
• 100% Herbal & Botanical actives
• Paraben-free & Non-greasy
• Suitable for daily morning ritual
• Broad spectrum SPF 50+ protection""",
                "price": 499.0,
                "sale_price": 499.0,
                "SKU": "QH-HYD-SPF50-100",
                "stock": 80,
                "category_id": cat_map.get("combination-skin", 4),
                "ingredients": "Coconut & Sesame Oil, Shea Butter, Aloe Vera, Botanical Actives.",
                "benefits": "Broad-Spectrum SPF 50+ Defense • Reduce Irritation • Antioxidant Properties • Maintain Even Skin Tone • Non-Greasy.",
                "how_to_use": "Apply on Clean Face Every Morning, and Avoid direct sun exposure for 10 minutes.",
                "skin_type": "All Skin Types",
                "product_images": [
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_back.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_ingredients.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_before_after.jpg"
                ],
                "thumbnail": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg",
                "featured": False,
                "active": True
            },
            {
                "name": "Vitamin C Serum",
                "slug": "vitamin-c-serum",
                "short_description": "Advanced Face Serum with Vitamin C+, E+, Niacinamide, and Hyaluronic Acid for radiant brightness and antioxidant defense.",
                "full_description": """Advanced Face Serum (Vitamin C+, E+) — 30ml

Brightens Skin Tone • Overnight Radiance • Antioxidant Protection

An advanced botanical face elixir crafted with potent Vitamin C, Vitamin E, Niacinamide, and Hyaluronic Acid. Designed to defend against environmental stressors, fade stubborn dark spots and acne marks, boost cellular collagen synthesis, and unveil a revitalized, luminous complexion.

Key Benefits
• Brightens Skin Tone: Clinically inspired botanical actives fade post-acne blemishes, hyperpigmentation, and sun damage
• Overnight Radiance: Illuminates fatigued, dull skin for an effortlessly refreshed, lit-from-within morning glow
• Antioxidant Protection: Synergistic Vitamin C + Vitamin E shield dermal layers from photo-aging and oxidative stress
• Deep Hydration & Plumping: Hyaluronic Acid and Glycerin deeply infuse moisture, smoothing fine lines and texture
• Calming & Barrier Support: Niacinamide and pure Aloe Vera extract calm redness, balance sebum, and minimize pore congestion

Key Ingredients
• Vitamin C — potent antioxidant that illuminates skin tone and promotes firm elasticity
• Vitamin E — defends against free radicals and reinforces lipid barrier recovery
• Niacinamide (Vitamin B3) — refines pores, fades dark marks, and evens out tone
• Hyaluronic Acid — deep-hydration magnet that plumps skin and maintains moisture elasticity
• Aloe Vera Extract — soothes irritation and cools reactive skin
• Glycerin — locks in weightless hydration throughout the day and night

Suitable For
All skin types including dull, sensitive, combination, and acne-prone skin.

How To Use
Dispense 3-4 drops onto clean fingertips. Gently press and smooth across cleansed face and neck until absorbed. Follow with moisturizer and always apply SPF during daytime.

Formulation Highlights
• 100% Herbal & Botanical actives
• Paraben-free & Non-sticky formulation
• Fast-absorbing lightweight serum
• Suitable for day and night rituals""",
                "price": 599.0,
                "sale_price": 599.0,
                "SKU": "QH-GLOW-VITC-30",
                "stock": 60,
                "category_id": cat_map.get("sensitive-skin", 3),
                "ingredients": "Vitamin C, Vitamin E, Niacinamide, Hyaluronic Acid, Aloe Vera Extract, Glycerin, Botanical Actives.",
                "benefits": "Brightens Skin Tone • Overnight Radiance • Antioxidant Protection • Fades Blemishes & Dark Spots • Deep Hydration.",
                "how_to_use": "Apply 3-4 drops to cleansed face and neck morning and evening. Follow with moisturizer and SPF during daytime.",
                "skin_type": "All Skin Types",
                "product_images": [
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_ingredients.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_before_after.jpg"
                ],
                "thumbnail": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg",
                "featured": False,
                "active": True
            },
            {
                "name": "Hair Shine Serum",
                "slug": "hair-shine-serum",
                "short_description": "Anti-Frizz Hair Serum for Instant Frizz Control, Smoothness & Glass-Like Shine with Argan, Jojoba & Silk Protein.",
                "full_description": """Anti-Frizz Hair Serum — 50ml

Instant Frizz Control • Adds Smoothness & Shine • Protects Against Humidity

A weightless, multi-benefit botanical hair serum expertly crafted to transform dull, coarse, and unruly strands into a silky, light-reflective cascade. Enriched with cold-pressed Argan Oil, Jojoba Oil, Almond Oil, Vitamin E, and hydrolysed Silk Protein, it tames stubborn flyaways, locks out environmental humidity, and restores lustrous shine without greasiness or buildup.

Key Benefits
• Instant Frizz & Flyaway Control: Calms rebellious texture and seals cuticles for all-day sleekness
• Glass-Like Smoothness & Shine: Infuses strands with light-catching botanical oils for radiant, healthy gloss
• Humidity Defense: Forms a weightless protective shield that blocks humidity-induced puffiness and frizz
• Heat & Environmental Protection: Vitamin E and Silk Protein guard hair fibers against thermal styling stress and pollution
• Non-Greasy & Ultra-Lightweight: Absorbs effortlessly into hair shafts without weighing down roots or strands

Key Ingredients
• Argan Oil — liquid gold rich in fatty acids and antioxidants to restore elasticity and natural shine
• Jojoba Oil — mimics natural scalp sebum to balance moisture and nourish hair ends
• Sweet Almond Oil — softens rough cuticles and enhances hair strength and silkiness
• Vitamin E — defends against environmental damage and oxidative stress
• Aloe Vera Extract — hydrates strands and calms static flyaways
• Hydrolysed Silk Protein — locks in moisture, smooths cuticles, and provides a salon-smooth finish

Suitable For
All hair types including straight, wavy, curly, coily, colored, and chemically treated hair.

How To Use
Dispense 2-3 pumps onto palms and rub together. Work evenly through towel-dried or dry hair from mid-lengths to ends. Style as usual. Can be used before heat styling or as a finishing touch for mirror-like shine.

Formulation Highlights
• 100% Herbal & Botanical actives
• Mineral Oil-free & Paraben-free
• Non-sticky & Weightless formula
• Suitable for everyday styling""",
                "price": 544.0,
                "sale_price": 544.0,
                "SKU": "QH-HAIR-SHINE-50",
                "stock": 70,
                "category_id": cat_map.get("hair-care", 5),
                "ingredients": "Argan Oil, Jojoba Oil, Almond Oil, Vitamin E, Aloe Vera Extract, Silk Protein, Botanical Actives.",
                "benefits": "Controls Frizz & Flyaways • Adds Smoothness & Shine • Protects Against Humidity • Non-Greasy Finish.",
                "how_to_use": "Take 2-3 drops on palms and distribute evenly through damp or dry hair lengths, focusing on mid-lengths to ends.",
                "skin_type": "All Hair Types",
                "product_images": [
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_ingredients.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_before_after_1.jpg",
                    "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_before_after_2.jpg"
                ],
                "thumbnail": "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg",
                "featured": True,
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
        }

        # Purge any products no longer in products_data
        active_slugs = [p["slug"] for p in products_data]
        obsolete_prods = db.query(models.Product).filter(~models.Product.slug.in_(active_slugs)).all()
        for obs_p in obsolete_prods:
            db.query(models.ProductVariant).filter(models.ProductVariant.product_id == obs_p.id).delete()
            db.query(models.Review).filter(models.Review.product_id == obs_p.id).delete()
            db.delete(obs_p)
        db.commit()

        for p_data in products_data:
            existing_prod = db.query(models.Product).filter(models.Product.slug == p_data["slug"]).first()
            if existing_prod:
                for k, v in p_data.items():
                    setattr(existing_prod, k, v)
                db.commit()
                db.refresh(existing_prod)
            else:
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

        if already_seeded:
            print("Product catalog successfully synchronized with latest definitions.")
            return

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
            featured_image="https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/the_glow_guide_journal.jpg",
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
