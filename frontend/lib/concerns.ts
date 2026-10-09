import { getImageUrl } from "./api";

export interface ConcernDefinition {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productSlugs: string[];
}

export interface ConcernProduct {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  SKU?: string;
  stock?: number;
  thumbnail: string;
  skin_type?: string;
  category_id?: number;
}

export const CONCERN_CATEGORIES: ConcernDefinition[] = [
  {
    id: 1,
    name: "Oily Skin",
    slug: "oily-skin",
    description: "Purifying, sebum-balancing formulas to clarify pores and prevent acne & blemishes.",
    image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_care_concern.jpg",
    productSlugs: ["avocado-night-cream", "tea-tree-pureveil-cleanser"]
  },
  {
    id: 2,
    name: "Dry Skin",
    slug: "dry-skin",
    description: "Deeply replenishing botanical creams and elixirs for moisture locking and barrier repair.",
    image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/dry_skin_concern.jpg",
    productSlugs: ["glow-radiant-plus", "red-wine-glow-cleanser"]
  },
  {
    id: 3,
    name: "Sensitive Skin",
    slug: "sensitive-skin",
    description: "Soothing, hypoallergenic herbal formulas to calm redness and irritation.",
    image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/sensitive_skin_concern.jpg",
    productSlugs: ["vitamin-c-serum", "glow-radiant-plus"]
  },
  {
    id: 4,
    name: "Combination Skin",
    slug: "combination-skin",
    description: "Harmonizing botanical care to balance T-zone oiliness while nourishing dry areas.",
    image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/combination_skin_concern.jpg",
    productSlugs: ["avocado-night-cream", "red-wine-glow-cleanser"]
  },
  {
    id: 5,
    name: "Hair Care",
    slug: "hair-care",
    description: "Nourishing remedies for healthy scalp and lustrous hair roots.",
    image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/oily_skin_concern.png",
    productSlugs: ["hair-shine-serum"]
  }
];

export const CANONICAL_CONCERN_PRODUCTS: Record<string, ConcernProduct> = {
  "avocado-night-cream": {
    id: 2,
    name: "Avocado Pro Nourish Night Cream",
    slug: "avocado-night-cream",
    short_description: "Feed your skin. Reveal its natural brightness. A botanically rich night cream that deeply nourishes and restores radiance while you sleep.",
    price: 799.0,
    sale_price: 799.0,
    SKU: "QH-HYD-AVONIGHT-35",
    stock: 30,
    thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
    skin_type: "Oily, combination, aging, dull, and normal skin types"
  },
  "tea-tree-pureveil-cleanser": {
    id: 3,
    name: "Tea Tree Pureveil Cleanser",
    slug: "tea-tree-pureveil-cleanser",
    short_description: "A purifying, non-stripping face wash for acne control, pore refining, and bright, clear skin.",
    price: 399.0,
    sale_price: 399.0,
    SKU: "QH-ACNE-TEATREE-100",
    stock: 100,
    thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_main.jpg",
    skin_type: "Oily, Acne-Prone & Sensitive Skin"
  },
  "glow-radiant-plus": {
    id: 1,
    name: "Glow Radiant Plus Night Cream",
    slug: "glow-radiant-plus",
    short_description: "A botanically nourishing night cream that deeply hydrates, visibly brightens, and repairs the skin barrier.",
    price: 799.0,
    sale_price: 799.0,
    SKU: "QH-GLOW-RADPLUS-35",
    stock: 50,
    thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_main.jpg",
    skin_type: "Dull, Dry & Uneven Skin Types"
  },
  "red-wine-glow-cleanser": {
    id: 4,
    name: "Red Wine Glow Cleanser",
    slug: "red-wine-glow-cleanser",
    short_description: "Deep cleansing red wine antioxidant face wash that removes dullness and restores a youthful glow.",
    price: 399.0,
    sale_price: 399.0,
    SKU: "QH-GLOW-REDWINE-100",
    stock: 60,
    thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_main.jpg",
    skin_type: "Dull, Normal, Combination & Dry Skin"
  },
  "vitamin-c-serum": {
    id: 6,
    name: "Vitamin C Serum",
    slug: "vitamin-c-serum",
    short_description: "Brightening antioxidant serum that revitalizes skin tone and protects against free radicals.",
    price: 599.0,
    sale_price: 599.0,
    SKU: "QH-VITC-SERUM-30",
    stock: 80,
    thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg",
    skin_type: "Sensitive, Dull & All Skin Types"
  },
  "hair-shine-serum": {
    id: 7,
    name: "Anti-Frizz Hair Shine Serum",
    slug: "hair-shine-serum",
    short_description: "Anti-Frizz Hair Serum for Instant Frizz Control, Smoothness & Glass-Like Shine with Argan, Jojoba & Silk Protein.",
    price: 544.0,
    sale_price: 544.0,
    SKU: "QH-HAIR-SHINE-50",
    stock: 70,
    thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg",
    skin_type: "All Hair Types"
  }
};

export function getConcernProducts(slug: string, apiProducts?: ConcernProduct[]): ConcernProduct[] {
  const normalizedSlug = slug.toLowerCase().trim();
  const concern = CONCERN_CATEGORIES.find((c) => c.slug === normalizedSlug);
  if (!concern) return [];

  return concern.productSlugs
    .map((pSlug) => {
      const canonical = CANONICAL_CONCERN_PRODUCTS[pSlug];
      const fromApi = apiProducts?.find((p) => p.slug === pSlug);
      if (fromApi && canonical) {
        return {
          ...canonical,
          ...fromApi,
          name: canonical.name, // Ensure exact display name requested
          price: fromApi.price || canonical.price,
          sale_price: fromApi.sale_price !== undefined ? fromApi.sale_price : canonical.sale_price,
          thumbnail: fromApi.thumbnail ? getImageUrl(fromApi.thumbnail) : canonical.thumbnail,
        };
      }
      return canonical;
    })
    .filter(Boolean);
}
