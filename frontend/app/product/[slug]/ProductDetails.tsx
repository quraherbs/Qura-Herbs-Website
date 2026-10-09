"use client";

import { useEffect, useState } from "react";
import { getApiUrl, getImageUrl } from "@/lib/api";
import { useCart } from "../../../context/CartContext";
import { ShoppingBag, Star, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductVariant {
  id: number;
  product_id?: number;
  name: string;
  sku_suffix: string;
  price_override: number | null;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  price: number;
  sale_price: number | null;
  SKU: string;
  stock: number;
  ingredients: string;
  benefits: string;
  how_to_use: string;
  skin_type: string;
  product_images: string[];
  thumbnail: string;
  variants: ProductVariant[];
}

interface Review {
  id: number;
  rating: number;
  review: string;
  verified_purchase: boolean;
  created_at: string;
}

export default function ProductDetails({ slug }: { slug: string }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "benefits" | "ingredients" | "how">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(getApiUrl(`/api/v1/products/slug/${slug}`))
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data: Product) => {
        if (data.slug === "spf-50-sunscreen" && (data.thumbnail?.includes("unsplash") || !data.product_images || data.product_images.length < 4)) {
          data.thumbnail = "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg";
          data.product_images = [
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_back.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_ingredients.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_before_after.jpg"
          ];
        }
        if (data.slug === "vitamin-c-serum" && (data.thumbnail?.includes("unsplash") || !data.product_images || data.product_images.length < 3)) {
          data.thumbnail = "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg";
          data.product_images = [
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_ingredients.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_before_after.jpg"
          ];
        }
        if (data.slug === "hair-shine-serum" && (data.thumbnail?.includes("unsplash") || !data.product_images || data.product_images.length < 4)) {
          data.thumbnail = "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg";
          data.product_images = [
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_ingredients.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_before_after_1.jpg",
            "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_before_after_2.jpg"
          ];
        }
        setProduct(data);
        setSelectedImage(data.thumbnail);
        if (data.variants && data.variants.length > 0) {
          // Find standard default variant
          const defaultVar = data.variants[0];
          setSelectedVariant(defaultVar);
        }
        // Fetch reviews
        return fetch(getApiUrl(`/api/v1/reviews/product/${data.id}`));
      })
      .then((res) => res.json())
      .then((reviewData: Review[]) => {
        if (Array.isArray(reviewData)) {
          setReviews(reviewData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load product:", err);
        if (slug === "glow-radiant-plus") {
          const fallbackGlow: Product = {
            id: 1,
            name: "Glow Radiant Plus",
            slug: "glow-radiant-plus",
            short_description: "Let your skin do its best work while you rest. A botanically nourishing night cream that deeply hydrates, visibly brightens, and repairs the skin barrier.",
            full_description: `Glow Radiant Plus Skin Whitening Cream — 35g\n\nLet your skin do its best work while you rest. Reveal your natural brightness.\n\nA botanically nourishing skin brightening cream that works in harmony with your skin's natural renewal cycle. Powered by pure botanical extracts, it deeply hydrates, visibly brightens, and steadily repairs a compromised skin barrier, so you wake up to skin that looks and feels genuinely restored.\n\nKey Benefits\n• Deep Hydration: Sustained overnight hydration that locks in moisture without heaviness\n• Brightens Skin: Visibly brightens uneven, dull, or tired-looking skin and fades dark spots\n• Repairs Barrier: Strengthens and repairs the natural skin barrier with consistent use\n• Evens Skin Tone: Targets hyperpigmentation revealing an editorial-level luminous complexion\n\nKey Ingredients\n• Aloe Vera — deeply hydrating and calming, reduces redness and soothes irritated skin\n• Licorice — a well-regarded botanical that gently brightens and evens skin tone over time\n• Sweet Almond Oil — nourishes and softens skin texture without congesting pores\n• Lavender — calms the skin and supports overnight recovery from environmental stress\n• Mango Seed Butter — rich and emollient, restores suppleness and seals in moisture\n• Carrot Seed Oil — high in antioxidants and vitamins, supports skin renewal and a healthy natural glow\n\nSuitable For\nDull, dry, combination, and normal skin types. Particularly beneficial for skin that looks fatigued or uneven. Ideal for daily nighttime rituals.\n\nHow To Use\nCleanse thoroughly and pat your face dry. Take a small amount and warm between your fingertips. Apply evenly across face and neck using gentle upward strokes. Allow the formula to absorb fully overnight. Rinse gently in the morning.\n\nFormulation Highlights\n• Paraben-free & Sulphate-free\n• No harsh bleaching or peeling agents\n• 100% Botanically sourced actives\n• Suitable for nightly ritual`,
            price: 799.0,
            sale_price: 799.0,
            SKU: "QH-GLOW-RADPLUS-35",
            stock: 45,
            ingredients: "Aloe Vera, Licorice Extract, Sweet Almond Oil, Lavender Oil, Mango Seed Butter, Carrot Seed Oil, Botanical Actives.",
            benefits: "Deep Hydration • Brightens Skin • Repairs Barrier • Fades Dark Spots • Even Skin Tone.",
            how_to_use: "Cleanse thoroughly and pat your face dry. Warm between fingertips and apply evenly using gentle upward strokes before sleeping.",
            skin_type: "Dull, Dry & Uneven Skin Types",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_before_after_1.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_before_after_2.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_main.jpg",
            variants: [
              { id: 28, product_id: 1, name: "35g", sku_suffix: "V35G", price_override: null, stock: 45 }
            ]
          };
          setProduct(fallbackGlow);
          setSelectedImage(fallbackGlow.thumbnail);
          setSelectedVariant(fallbackGlow.variants[0]);
          setError(false);
          setLoading(false);
          return;
        }
        if (slug === "avocado-night-cream") {
          const fallbackProduct: Product = {
            id: 2,
            name: "Avocado Pro Nourish Night Cream",
            slug: "avocado-night-cream",
            short_description: "Feed your skin. Reveal its natural brightness. A botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep.",
            full_description: `Avocado Pro Nourish Night Cream — 35g\n\nFeed your skin. Reveal its natural brightness.\n\nA botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep. Powered by avocado, sweet almond oil, honey, wheatgerm, milk protein, and seaweed, it supports healthier-looking, smoother, more luminous skin without harsh bleaching agents.\n\nKey Benefits\n• Deep, sustained nourishment throughout the day\n• Visibly softer and smoother skin with regular use\n• Restores a natural, healthy radiance to dull skin\n• Strengthens the skin barrier over time\n• Supports a more even, luminous complexion\n\nKey Ingredients\n• Avocado - rich in fatty acids that repair the skin barrier and restore suppleness\n• Sweet Almond Oil - lightweight and emollient, softens without congesting pores\n• Honey - a natural humectant that draws and locks moisture into the skin\n• Wheatgerm Extract - packed with Vitamin E to support renewal and reduce dullness\n• Milk Protein - smooths skin tone and refines the complexion\n• Seaweed - marine-derived minerals that firm, hydrate, and restore luminosity\n\nSuitable For\nOily, combination, aging, dull, and normal skin types. Ideal for daily use, overnight.\n\nHow To Use\nCleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.\n\nFormulation Highlights\n• Paraben-free\n• No harsh bleaching agents\n• Botanically sourced actives\n• Suitable for daily use`,
            price: 799.0,
            sale_price: 799.0,
            SKU: "QH-HYD-AVONIGHT-35",
            stock: 30,
            ingredients: "Avocado (rich in fatty acids), Sweet Almond Oil, Honey, Wheatgerm Extract, Milk Protein, Seaweed minerals, Botanically Sourced Actives.",
            benefits: "Deep, sustained nourishment throughout the day • Visibly softer and smoother skin with regular use • Restores natural, healthy radiance to dull skin • Strengthens the skin barrier over time • Supports a more even, luminous complexion.",
            how_to_use: "Cleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.",
            skin_type: "Oily, combination, aging, dull, and normal skin types",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_before_after.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
            variants: [
              { id: 29, product_id: 2, name: "35g", sku_suffix: "V35G", price_override: null, stock: 30 }
            ]
          };
          setProduct(fallbackProduct);
          setSelectedImage(fallbackProduct.thumbnail);
          setSelectedVariant(fallbackProduct.variants[0]);
          setError(false);
          setLoading(false);
          return;
        }
        if (slug === "red-wine-glow-cleanser") {
          const fallbackRedWine: Product = {
            id: 4,
            name: "Red Wine Glow Cleanser",
            slug: "red-wine-glow-cleanser",
            short_description: "Antioxidant-rich botanical gel cleanser with Fresh Grape Red Wine, Rice Exfoliator, and Glycerin for clear, radiant, and even-toned skin.",
            full_description: `Red Wine Glow Cleanser — 100ml\n\nBrightening + Hydrating Botanical Facial Cleanser\n\nExperience botanical luxury and antioxidant care. Infused with Fresh Grape Red Wine extract, gentle Rice Exfoliator, and hydrating Glycerin, this daily gel cleanser gently lifts impurities, deeply cleanses pores, helps prevent breakouts, and leaves your skin with a luminous veil.\n\nKey Benefits\n• Antioxidant Care: Combats environmental stressors and free-radical damage with rich red grape antioxidants\n• Even Tone Support: Gently refines surface texture and diminishes dullness for a brighter, balanced complexion\n• Anti-Aging Boost: Enhances skin firmness, elasticity, and youthful radiance\n• Helps Reduce Breakouts: Gently clears congested pores and blemishes without stripping skin moisture\n• Deep Cleanses Pores: Soft micro-exfoliation from natural rice exfoliator washes away daily pollution and excess sebum\n• Soothes Irritated Skin: Deeply hydrates with glycerin to leave skin refreshed, calmed, and never tight\n\nKey Ingredients\n• Fresh Grape Red Wine — rich in Resveratrol and polyphenols to revitalize dull skin, combat aging, and protect the skin barrier\n• Rice Exfoliator — delicate natural exfoliator that gently smooths rough patches, clears pore congestion, and enhances luminosity\n• Glycerin — pure humectant that binds moisture to the skin during cleansing, preventing moisture loss and irritation\n\nSuitable For\nDull, uneven, oily, combination, normal, and dry skin types. Ideal for everyday morning and evening use.\n\nHow To Use\nApply to wet skin. Massage gently over face and neck in upward circular motions for 60 seconds. Rinse thoroughly with lukewarm or cool water. Use both morning & night for visible clarity and glow.\n\nFormulation Highlights\n• 100% Herbal & Botanical actives\n• Paraben-free & gentle on skin\n• Non-stripping antioxidant formula\n• Suitable for daily skincare ritual`,
            price: 399.0,
            sale_price: 399.0,
            SKU: "QH-GLOW-REDWINE-100",
            stock: 60,
            ingredients: "Fresh Grape Red Wine Extract (Resveratrol), Rice Exfoliator, Pure Glycerin, Botanical Actives.",
            benefits: "Antioxidant Care • Even Tone Support • Anti-Aging Boost • Deep Cleanses Pores • Helps Reduce Breakouts • Soothes Irritated Skin.",
            how_to_use: "Apply to wet skin, massage gently, and rinse off. Use morning & night.",
            skin_type: "Dull, Normal, Combination & Dry Skin",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_back.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_before_after_1.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_before_after_2.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_main.jpg",
            variants: [
              { id: 31, product_id: 4, name: "100ml", sku_suffix: "V100ML", price_override: null, stock: 60 }
            ]
          };
          setProduct(fallbackRedWine);
          setSelectedImage(fallbackRedWine.thumbnail);
          setSelectedVariant(fallbackRedWine.variants[0]);
          setError(false);
          setLoading(false);
          return;
        }
        if (slug === "tea-tree-pureveil-cleanser") {
          const fallbackTeaTree: Product = {
            id: 3,
            name: "Tea Tree Pureveil Cleanser",
            slug: "tea-tree-pureveil-cleanser",
            short_description: "A purifying, non-stripping face wash for acne control, pore refining, and bright, clear skin.",
            full_description: `Tea Tree Pureveil Cleanser — 100ml\n\nReduce Acne + Brightening Botanical Gel Cleanser\n\nClean skin, calm skin every single day. A powerfully gentle face cleanser built for skin that needs more than just cleansing. Formulated with nature's most trusted purifying botanicals, it clears congested pores, actively works to reduce breakouts, and calms irritation — all in one step. Designed for daily use without the harshness that most acne-focused cleansers carry.\n\nSkin that breaks out does not need to be punished, it needs to be rebalanced. Tea Tree Pureveil Cleanser is built on that principle, combining deep-cleansing actives with soothing, skin-respecting botanicals so your skin feels genuinely cared for after every wash, not stripped or tight.\n\nKey Benefits\n• Deeply Cleanses Pores: Clears daily buildup, pollution, and excess sebum without over-drying\n• Helps Reduce Breakouts: Targets blemish-causing impurities and helps prevent future congestion\n• Soothes Irritated Skin: Calms redness, inflammation, and reactive skin with lavender and aloe vera\n• Protects Skin Barrier: Enriched with nourishing avocado oil so cleansing never leaves skin depleted\n• Balances Moisture: Preserves natural skin hydration for a refreshed, calm, and luminous feel\n\nKey Ingredients\n• Tea Tree Extract — a well-studied purifying botanical that targets blemish-causing buildup and keeps pores clear\n• Neem & Aloe Vera — deeply purifying and soothing plant extracts that control excess sebum, heal redness, and hydrate\n• Avocado Oil — nourishes and protects the skin barrier so cleansing never leaves skin tight or dry\n• Lavender Oil — calms inflammation, soothes reactive skin, and supports natural skin repair\n\nSuitable For\nOily, acne-prone, combination, sensitive, and all skin types. Ideal for those experiencing frequent breakouts, enlarged pores, or persistent irritation.\n\nHow To Use\nApply to wet skin. Massage gently over face and neck in circular motions for 60 seconds. Rinse thoroughly with lukewarm or cool water. Use morning and night for consistent, clear results.\n\nFormulation Highlights\n• 100% Herbal & Botanical actives\n• Paraben-free & Sulphate-free\n• Non-stripping acne control formula\n• Suitable for daily skincare ritual`,
            price: 399.0,
            sale_price: 399.0,
            SKU: "QH-ACNE-TEATREE-100",
            stock: 100,
            ingredients: "Tea Tree Extract, Neem & Aloe Vera Extract, Avocado Oil, Lavender Oil, Botanical Actives.",
            benefits: "Deep Cleanses Pores • Helps Reduce Breakouts • Soothes Irritated Skin • Balances Sebum • Non-Stripping.",
            how_to_use: "Apply to wet skin, massage gently, and rinse off. Use morning & night.",
            skin_type: "Oily, Acne-Prone & Sensitive Skin",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_back.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_before_after.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_main.jpg",
            variants: [
              { id: 30, product_id: 3, name: "100ml", sku_suffix: "V100ML", price_override: null, stock: 100 }
            ]
          };
          setProduct(fallbackTeaTree);
          setSelectedImage(fallbackTeaTree.thumbnail);
          setSelectedVariant(fallbackTeaTree.variants[0]);
          setError(false);
          setLoading(false);
          return;
        }
        if (slug === "spf-50-sunscreen") {
          const fallbackSPF: Product = {
            id: 5,
            name: "SPF 50 Sunscreen",
            slug: "spf-50-sunscreen",
            short_description: "Moisturizing SPF 50+ sunscreen with Coconut & Sesame Oil, Shea Butter, and Aloe Vera for broad-spectrum protection and hydration.",
            full_description: `SPF 50 Sunscreen — 100ml\n\nMoisturizing Sun Screen • Hydrates & Protects SPF 50+\n\nA botanical broad-spectrum sunscreen that provides high-level daily defense against UVA and UVB rays while keeping the skin barrier hydrated and calm. Enriched with natural oils and soothing plant extracts, it protects against sunburn, reduces photo-damage, and blends smoothly without greasy residue or white cast.\n\nKey Benefits\n• Broad-Spectrum SPF 50+ Defense: Shields skin from damaging UV rays and photo-aging\n• Reduce Irritation: Calms inflammation and sunburn redness with soothing pure Aloe Vera\n• Antioxidant Properties: Rich botanical oils protect against environmental free-radical damage\n• Maintain Even Skin Tone: Prevents sunspots, tan buildup, and hyperpigmentation\n• Deeply Moisturizing: Shea Butter and Sesame Oil maintain all-day moisture without heaviness\n\nKey Ingredients\n• Coconut & Sesame Oil — rich in natural sun-protective lipids, essential fatty acids, and antioxidants to nourish and guard skin\n• Shea Butter — rich emollient that seals in hydration and strengthens the epidermal barrier\n• Aloe Vera — instantly cools, calms irritation, and hydrates sun-exposed skin\n\nSuitable For\nAll skin types, including sensitive, combination, dry, and normal skin. Ideal for daily morning wear.\n\nHow To Use\nApply generously to clean face and neck every morning. Allow 10 minutes before direct sun exposure. Reapply every 2-3 hours during prolonged sun exposure.\n\nFormulation Highlights\n• 100% Herbal & Botanical actives\n• Paraben-free & Non-greasy\n• Suitable for daily morning ritual\n• Broad spectrum SPF 50+ protection`,
            price: 499.0,
            sale_price: 499.0,
            SKU: "QH-HYD-SPF50-100",
            stock: 80,
            ingredients: "Coconut & Sesame Oil, Shea Butter, Aloe Vera, Botanical Actives.",
            benefits: "Broad-Spectrum SPF 50+ Defense • Reduce Irritation • Antioxidant Properties • Maintain Even Skin Tone • Non-Greasy.",
            how_to_use: "Apply on Clean Face Every Morning, and Avoid direct sun exposure for 10 minutes.",
            skin_type: "All Skin Types",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_back.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_before_after.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg",
            variants: [
              { id: 24, product_id: 5, name: "100ml", sku_suffix: "V100ML", price_override: null, stock: 80 }
            ]
          };
          setProduct(fallbackSPF);
          setSelectedImage(fallbackSPF.thumbnail);
          setSelectedVariant(fallbackSPF.variants[0]);
          setError(false);
          setLoading(false);
          return;
        }
        if (slug === "vitamin-c-serum") {
          const fallbackVitC: Product = {
            id: 6,
            name: "Vitamin C Serum",
            slug: "vitamin-c-serum",
            short_description: "Advanced Face Serum with Vitamin C+, E+, Niacinamide, and Hyaluronic Acid for radiant brightness and antioxidant defense.",
            full_description: `Advanced Face Serum (Vitamin C+, E+) — 30ml\n\nBrightens Skin Tone • Overnight Radiance • Antioxidant Protection\n\nAn advanced botanical face elixir crafted with potent Vitamin C, Vitamin E, Niacinamide, and Hyaluronic Acid. Designed to defend against environmental stressors, fade stubborn dark spots and acne marks, boost cellular collagen synthesis, and unveil a revitalized, luminous complexion.\n\nKey Benefits\n• Brightens Skin Tone: Clinically inspired botanical actives fade post-acne blemishes, hyperpigmentation, and sun damage\n• Overnight Radiance: Illuminates fatigued, dull skin for an effortlessly refreshed, lit-from-within morning glow\n• Antioxidant Protection: Synergistic Vitamin C + Vitamin E shield dermal layers from photo-aging and oxidative stress\n• Deep Hydration & Plumping: Hyaluronic Acid and Glycerin deeply infuse moisture, smoothing fine lines and texture\n• Calming & Barrier Support: Niacinamide and pure Aloe Vera extract calm redness, balance sebum, and minimize pore congestion\n\nKey Ingredients\n• Vitamin C — potent antioxidant that illuminates skin tone and promotes firm elasticity\n• Vitamin E — defends against free radicals and reinforces lipid barrier recovery\n• Niacinamide (Vitamin B3) — refines pores, fades dark marks, and evens out tone\n• Hyaluronic Acid — deep-hydration magnet that plumps skin and maintains moisture elasticity\n• Aloe Vera Extract — soothes irritation and cools reactive skin\n• Glycerin — locks in weightless hydration throughout the day and night\n\nSuitable For\nAll skin types including dull, sensitive, combination, and acne-prone skin.\n\nHow To Use\nDispense 3-4 drops onto clean fingertips. Gently press and smooth across cleansed face and neck until absorbed. Follow with moisturizer and always apply SPF during daytime.\n\nFormulation Highlights\n• 100% Herbal & Botanical actives\n• Paraben-free & Non-sticky formulation\n• Fast-absorbing lightweight serum\n• Suitable for day and night rituals`,
            price: 599.0,
            sale_price: 599.0,
            SKU: "QH-GLOW-VITC-30",
            stock: 60,
            ingredients: "Vitamin C, Vitamin E, Niacinamide, Hyaluronic Acid, Aloe Vera Extract, Glycerin, Botanical Actives.",
            benefits: "Brightens Skin Tone • Overnight Radiance • Antioxidant Protection • Fades Blemishes & Dark Spots • Deep Hydration.",
            how_to_use: "Apply 3-4 drops to cleansed face and neck morning and evening. Follow with moisturizer and SPF during daytime.",
            skin_type: "All Skin Types",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_before_after.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg",
            variants: [
              { id: 25, product_id: 6, name: "30ml", sku_suffix: "V30ML", price_override: null, stock: 60 }
            ]
          };
          setProduct(fallbackVitC);
          setSelectedImage(fallbackVitC.thumbnail);
          setSelectedVariant(fallbackVitC.variants[0]);
          setError(false);
          setLoading(false);
          return;
        }
        if (slug === "hair-shine-serum") {
          const fallbackHair: Product = {
            id: 7,
            name: "Hair Shine Serum",
            slug: "hair-shine-serum",
            short_description: "Anti-Frizz Hair Serum for Instant Frizz Control, Smoothness & Glass-Like Shine with Argan, Jojoba & Silk Protein.",
            full_description: `Anti-Frizz Hair Serum — 50ml\n\nInstant Frizz Control • Adds Smoothness & Shine • Protects Against Humidity\n\nA weightless, multi-benefit botanical hair serum expertly crafted to transform dull, coarse, and unruly strands into a silky, light-reflective cascade. Enriched with cold-pressed Argan Oil, Jojoba Oil, Almond Oil, Vitamin E, and hydrolysed Silk Protein, it tames stubborn flyaways, locks out environmental humidity, and restores lustrous shine without greasiness or buildup.\n\nKey Benefits\n• Instant Frizz & Flyaway Control: Calms rebellious texture and seals cuticles for all-day sleekness\n• Glass-Like Smoothness & Shine: Infuses strands with light-catching botanical oils for radiant, healthy gloss\n• Humidity Defense: Forms a weightless protective shield that blocks humidity-induced puffiness and frizz\n• Heat & Environmental Protection: Vitamin E and Silk Protein guard hair fibers against thermal styling stress and pollution\n• Non-Greasy & Ultra-Lightweight: Absorbs effortlessly into hair shafts without weighing down roots or strands\n\nKey Ingredients\n• Argan Oil — liquid gold rich in fatty acids and antioxidants to restore elasticity and natural shine\n• Jojoba Oil — mimics natural scalp sebum to balance moisture and nourish hair ends\n• Sweet Almond Oil — softens rough cuticles and enhances hair strength and silkiness\n• Vitamin E — defends against environmental damage and oxidative stress\n• Aloe Vera Extract — hydrates strands and calms static flyaways\n• Hydrolysed Silk Protein — locks in moisture, smooths cuticles, and provides a salon-smooth finish\n\nSuitable For\nAll hair types including straight, wavy, curly, coily, colored, and chemically treated hair.\n\nHow To Use\nDispense 2-3 pumps onto palms and rub together. Work evenly through towel-dried or dry hair from mid-lengths to ends. Style as usual. Can be used before heat styling or as a finishing touch for mirror-like shine.\n\nFormulation Highlights\n• 100% Herbal & Botanical actives\n• Mineral Oil-free & Paraben-free\n• Non-sticky & Weightless formula\n• Suitable for everyday styling`,
            price: 544.0,
            sale_price: 544.0,
            SKU: "QH-HAIR-SHINE-50",
            stock: 70,
            ingredients: "Argan Oil, Jojoba Oil, Almond Oil, Vitamin E, Aloe Vera Extract, Silk Protein, Botanical Actives.",
            benefits: "Controls Frizz & Flyaways • Adds Smoothness & Shine • Protects Against Humidity • Non-Greasy Finish.",
            how_to_use: "Take 2-3 drops on palms and distribute evenly through damp or dry hair lengths, focusing on mid-lengths to ends.",
            skin_type: "All Hair Types",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_before_after_1.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_before_after_2.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg",
            variants: [
              { id: 26, product_id: 7, name: "50ml", sku_suffix: "V50ML", price_override: null, stock: 70 }
            ]
          };
          setProduct(fallbackHair);
          setSelectedImage(fallbackHair.thumbnail);
          setSelectedVariant(fallbackHair.variants[0]);
          setError(false);
          setLoading(false);
          return;
        }
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-sans text-brand-dark/50 animate-pulse">
        Nourishing product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center text-brand-dark/50 font-sans text-sm">
        Product details not found.{" "}
        <Link href="/shop" className="underline text-brand-accent">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const formatBold = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*|<b>.*?<\/b>)/g);
    return parts.map((part, i) => {
      if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("<b>") && part.endsWith("</b>"))) {
        const content = part.replace(/^\*\*|^\<b\>|\*\*$|\<\/b\>$/g, "");
        return <strong key={i} className="font-semibold text-brand-dark">{content}</strong>;
      }
      return part;
    });
  };

  const renderFormattedText = (text?: string) => {
    if (!text) return <p className="text-brand-cocoa/50 italic">No detailed description specified.</p>;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;
      if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
        const headingText = trimmed.replace(/^#+\s*/, "");
        return (
          <h4 key={idx} className="font-serif text-lg font-medium text-brand-dark pt-3 pb-1">
            {headingText}
          </h4>
        );
      }
      if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const bulletText = trimmed.replace(/^[\•\-\*]\s*/, "");
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-2">
            <span className="text-brand-accent text-sm leading-none pt-1">•</span>
            <span className="text-brand-cocoa">{formatBold(bulletText)}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-brand-cocoa/90 leading-relaxed font-sans font-light my-1.5">
          {formatBold(trimmed)}
        </p>
      );
    });
  };

  const hasDiscount = product.sale_price !== null;
  
  // Calculate price dynamically based on variant selection and base pricing overrides
  const basePrice = selectedVariant?.price_override || product.price;
  const activePrice = hasDiscount && !selectedVariant?.price_override
    ? product.sale_price!
    : basePrice;

  const rawImages = [product.thumbnail, ...(product.product_images || [])].filter(Boolean);
  const allImages = Array.from(new Set(rawImages.map((img) => getImageUrl(img))));

  const currentImgIndex = allImages.indexOf(getImageUrl(selectedImage)) >= 0 
    ? allImages.indexOf(getImageUrl(selectedImage)) + 1 
    : 1;

  return (
    <div className="space-y-16">
      {/* Editorial detail block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Gallery Column (Left) */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4">
          {/* Thumbnails list */}
          <div className="col-span-2 space-y-3">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-full aspect-square border overflow-hidden bg-brand-light flex items-center justify-center p-1 transition-all rounded-sm ${
                  selectedImage === img ? "border-brand-accent scale-95 shadow-sm" : "border-brand-sand/30"
                }`}
              >
                <img src={getImageUrl(img)} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          {/* Featured Large Viewer */}
          <div className="col-span-10 aspect-square w-full bg-brand-light border border-brand-sand/20 overflow-hidden relative rounded-sm group">
            <img src={getImageUrl(selectedImage || product.thumbnail)} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            {/* Image Counter Badge */}
            <div className="absolute bottom-3 right-3 bg-brand-dark/80 text-brand-cream text-[10px] font-sans font-bold px-2.5 py-1 uppercase tracking-widest rounded-full backdrop-blur-sm">
              {currentImgIndex} / {allImages.length}
            </div>
          </div>
        </div>

        {/* Purchase Options Column (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold font-sans">
              {product.skin_type || "All Skin Types"}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-dark leading-snug">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex text-brand-accent">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="text-xs text-brand-dark/50 font-sans font-medium">
                ({reviews.length} Customer Reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 border-y border-brand-sand/15 py-4">
            <span className="text-2xl font-bold font-sans text-brand-dark">
              ₹{activePrice}
            </span>
            {hasDiscount && !selectedVariant?.price_override && (
              <span className="text-sm text-brand-dark/40 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="text-brand-cocoa/80 text-sm leading-relaxed font-sans font-light">
            {product.short_description}
          </p>

          {/* Product SKU */}
          <div className="text-xs font-sans text-brand-dark/40">
            SKU: {product.SKU}{selectedVariant?.sku_suffix ? `-${selectedVariant.sku_suffix}` : ""}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold font-sans">
                Select Volume
              </span>
              <div className="flex gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 border text-xs tracking-wider uppercase font-sans font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? "bg-brand-dark border-brand-dark text-brand-cream"
                        : "border-brand-sand hover:border-brand-dark text-brand-cocoa"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Controls */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-brand-sand/60 bg-white justify-between px-4 py-3 sm:w-32">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-brand-dark/60">-</button>
              <span className="text-xs font-sans font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-brand-dark/60">+</button>
            </div>
            
            {/* Add Button */}
            <button
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: activePrice,
                thumbnail: product.thumbnail,
                variant: selectedVariant?.name
              }, quantity)}
              className="flex-1 bg-brand-dark hover:bg-brand-accent text-brand-cream text-xs uppercase tracking-widest py-4 font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 rounded-none"
            >
              <ShoppingBag size={15} />
              ADD TO RITUAL
            </button>
          </div>

          {/* Trust notes */}
          <div className="flex items-center gap-2.5 text-xs text-brand-dark/50 pt-2 border-t border-brand-sand/10 font-sans font-light">
            <ShieldCheck size={16} className="text-brand-accent" />
            <span>Secure payment via UPI Transfer. Clean clinical purity guarantee.</span>
          </div>
        </div>
      </div>

      {/* Tabs description block (Full Description / Overview, Benefits, Ingredients, How to use) */}
      <div className="border border-brand-sand/20 bg-brand-light p-8 md:p-12 space-y-8">
        <div className="flex border-b border-brand-sand/20 overflow-x-auto">
          {(["overview", "benefits", "ingredients", "how"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 font-serif text-sm uppercase tracking-wider transition-colors duration-300 border-b-2 font-medium -mb-[2px] whitespace-nowrap ${
                activeTab === tab
                  ? "border-brand-dark text-brand-dark font-semibold"
                  : "border-transparent text-brand-dark/40 hover:text-brand-dark"
              }`}
            >
              {tab === "overview"
                ? "Full Description"
                : tab === "benefits"
                ? "Product Benefits"
                : tab === "ingredients"
                ? "Pure Ingredients"
                : "How to Ritual"}
            </button>
          ))}
        </div>

        <div className="font-sans font-light text-sm md:text-base text-brand-cocoa/90 leading-relaxed max-w-4xl">
          {activeTab === "overview" && (
            <div className="space-y-3">
              {renderFormattedText(product.full_description || product.short_description)}
            </div>
          )}
          {activeTab === "benefits" && (
            <div className="space-y-3">
              {renderFormattedText(product.benefits || "No specific benefits listed.")}
            </div>
          )}
          {activeTab === "ingredients" && (
            <div className="space-y-3">
              {renderFormattedText(product.ingredients || "No ingredients specified.")}
            </div>
          )}
          {activeTab === "how" && (
            <div className="space-y-3">
              {renderFormattedText(product.how_to_use || "No usage instructions specified.")}
            </div>
          )}
        </div>
      </div>

      {/* Reviews block */}
      <div className="space-y-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
          Customer Reviews ({reviews.length})
        </h2>
        
        {reviews.length === 0 ? (
          <div className="bg-brand-light border border-brand-sand/20 text-center py-12 text-xs font-sans text-brand-dark/40 rounded-none">
            No reviews yet.
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="border border-brand-sand/20 bg-brand-light p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex text-brand-accent">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-dark/40 font-sans">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-brand-cocoa/80 font-sans font-light leading-relaxed">
                  {rev.review}
                </p>
                {rev.verified_purchase && (
                  <span className="inline-block bg-brand-accent/10 text-brand-accent text-[9px] uppercase tracking-wider font-sans font-semibold px-2 py-0.5">
                    VERIFIED PURCHASE
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
