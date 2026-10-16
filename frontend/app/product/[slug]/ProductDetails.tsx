"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, getImageUrl } from "@/lib/api";
import { useCart } from "../../../context/CartContext";
import { ShoppingBag, Star, ShieldCheck, Heart, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Check } from "lucide-react";
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
  product_id?: number;
  customer_id?: number;
  customer_name?: string;
  customer_city?: string;
  rating: number;
  review: string;
  verified_purchase: boolean;
  created_at: string;
}

const FALLBACK_REVIEWS: Record<string, Review[]> = {
  "avocado-night-cream": [
    {
      id: 101,
      customer_name: "Meera Kalyanasundaram",
      customer_city: "Chennai, TN",
      rating: 5,
      review: "I have been using this Avocado cream for nearly a month now. Night time apply pannittu thoongina, morning skin feels very soft and plump. Skin dullness is visibly reduced and there is a healthy glow.",
      verified_purchase: true,
      created_at: "2026-03-24T10:30:00Z"
    },
    {
      id: 102,
      customer_name: "Deepa Natarajan",
      customer_city: "Coimbatore, TN",
      rating: 5,
      review: "Romba rich yet absorbs without being sticky. After waking up, dry patches around my nose and cheeks are gone. My skin feels thoroughly nourished and moisturised.",
      verified_purchase: true,
      created_at: "2026-03-29T14:15:00Z"
    },
    {
      id: 103,
      customer_name: "Shruthi Venkatesh",
      customer_city: "Bengaluru, KA",
      rating: 4,
      review: "Good night cream for tired skin. Dark spots have softened in appearance over 3-4 weeks of regular use. Texture is very soothing and mild botanical fragrance.",
      verified_purchase: true,
      created_at: "2026-04-02T09:20:00Z"
    },
    {
      id: 104,
      customer_name: "Priya Sundar",
      customer_city: "Madurai, TN",
      rating: 5,
      review: "Enoda skin konjam sensitive and acne-prone. Usually heavy creams breakout tharum, but this one didn't cause any pimples. Woke up with calm and fresh-looking skin.",
      verified_purchase: true,
      created_at: "2026-04-06T18:45:00Z"
    },
    {
      id: 105,
      customer_name: "Ananya Raman",
      customer_city: "Salem, TN",
      rating: 5,
      review: "Skin feels so supple and hydrated. I noticed my morning complexion looks clearer and less dull. Definitely staying in my evening ritual.",
      verified_purchase: true,
      created_at: "2026-04-10T11:00:00Z"
    },
    {
      id: 106,
      customer_name: "Karthiga Devi",
      customer_city: "Tiruchirappalli, TN",
      rating: 4,
      review: "Subtle natural herbal scent and deep moisturizing feel. My skin texture feels smoother and makeup sits much better during the day now.",
      verified_purchase: true,
      created_at: "2026-04-12T16:30:00Z"
    }
  ],
  "glow-radiant-plus": [
    {
      id: 201,
      customer_name: "Pavithra Sridhar",
      customer_city: "Chennai, TN",
      rating: 5,
      review: "Using this cream for 3 weeks every night. Face-la irundha pigmentation marks konjam light aagirukku and skin tone looks much more even and radiant.",
      verified_purchase: true,
      created_at: "2026-03-22T08:15:00Z"
    },
    {
      id: 202,
      customer_name: "Archana Krishnan",
      customer_city: "Bengaluru, KA",
      rating: 5,
      review: "Really impressed with how bright my skin looks in the mornings. It helped fade stubborn post-blemish marks without irritating my combination skin.",
      verified_purchase: true,
      created_at: "2026-03-27T12:00:00Z"
    },
    {
      id: 203,
      customer_name: "Gayathri Mohan",
      customer_city: "Coimbatore, TN",
      rating: 5,
      review: "Lightweight feel on skin but deeply moisturising. Saffron and licorice fragrance is so soothing. My face doesn't look dull even after long work hours.",
      verified_purchase: true,
      created_at: "2026-04-01T17:10:00Z"
    },
    {
      id: 204,
      customer_name: "Nithya Balaji",
      customer_city: "Madurai, TN",
      rating: 4,
      review: "Gentle on sensitive skin. Took around 20 days to notice difference, but skin definitely feels softer, clearer, and has a natural healthy radiance.",
      verified_purchase: true,
      created_at: "2026-04-05T19:30:00Z"
    },
    {
      id: 205,
      customer_name: "Swetha R.",
      customer_city: "Tiruppur, TN",
      rating: 5,
      review: "Nalla texture, quickly absorbs. Acne scars appearance konjam konjama reduce aavudhu. Skin feels super hydrated when I wash my face next morning.",
      verified_purchase: true,
      created_at: "2026-04-09T14:40:00Z"
    },
    {
      id: 206,
      customer_name: "Vimala Chandran",
      customer_city: "Erode, TN",
      rating: 4,
      review: "A little goes a long way. My skin tone appears more luminous and nourished. No harsh peeling or burning feeling at all.",
      verified_purchase: true,
      created_at: "2026-04-13T10:15:00Z"
    }
  ],
  "tea-tree-pureveil-cleanser": [
    {
      id: 301,
      customer_name: "Harish Raghavan",
      customer_city: "Chennai, TN",
      rating: 5,
      review: "Perfect daily cleanser for humid weather. Cleans off oil and daily commute dirt completely without leaving that stretchy or dry feeling on the face.",
      verified_purchase: true,
      created_at: "2026-03-25T11:20:00Z"
    },
    {
      id: 302,
      customer_name: "Sneha Murugan",
      customer_city: "Coimbatore, TN",
      rating: 5,
      review: "Enoda oily T-zone-ku romba nalla suit aachu. Gentle tea tree cooling effect is so refreshing after coming back from office. Pores feel clean.",
      verified_purchase: true,
      created_at: "2026-03-30T15:45:00Z"
    },
    {
      id: 303,
      customer_name: "Divya Prasad",
      customer_city: "Bengaluru, KA",
      rating: 4,
      review: "Pleasant mild gel lather that washes off cleanly. It controls excess sebum and makes my face feel instantly fresh and bright.",
      verified_purchase: true,
      created_at: "2026-04-03T08:50:00Z"
    },
    {
      id: 304,
      customer_name: "Keerthana Vijay",
      customer_city: "Salem, TN",
      rating: 5,
      review: "Doesn't strip moisture like regular foaming cleansers. Skin feels surprisingly soft and calmed down after washing. Great for acne-prone skin.",
      verified_purchase: true,
      created_at: "2026-04-07T13:10:00Z"
    },
    {
      id: 305,
      customer_name: "Arvind Sethupathi",
      customer_city: "Madurai, TN",
      rating: 4,
      review: "Very easy pump bottle and refreshing botanical aroma. Removed sunscreen and sweat without stinging eyes or drying out my cheeks.",
      verified_purchase: true,
      created_at: "2026-04-11T16:25:00Z"
    },
    {
      id: 306,
      customer_name: "Roshini K.",
      customer_city: "Kochi, KL",
      rating: 5,
      review: "Daily evening routine-la regular use pandren. Impurities clear pannudhu, and breakouts have reduced significantly over the past month.",
      verified_purchase: true,
      created_at: "2026-04-13T18:00:00Z"
    }
  ],
  "red-wine-glow-cleanser": [
    {
      id: 401,
      customer_name: "Malathi Sundaresan",
      customer_city: "Chennai, TN",
      rating: 5,
      review: "Rich antioxidant feel with a lovely mild aroma. Washes away pollutants easily and leaves the skin with an instant fresh, soft brightness.",
      verified_purchase: true,
      created_at: "2026-03-26T09:40:00Z"
    },
    {
      id: 402,
      customer_name: "Janani Narayanan",
      customer_city: "Bengaluru, KA",
      rating: 5,
      review: "Face wash pannadhukku appram skin feels hydrated, not dry at all. Daily dullness completely remove aaguthu. Really luxurious everyday experience.",
      verified_purchase: true,
      created_at: "2026-03-31T14:05:00Z"
    },
    {
      id: 403,
      customer_name: "Abinaya R.",
      customer_city: "Coimbatore, TN",
      rating: 4,
      review: "Silky gel texture that lathers gently. My skin looks cleaner and softer after every wash. Ideal morning face wash before stepping out.",
      verified_purchase: true,
      created_at: "2026-04-04T10:30:00Z"
    },
    {
      id: 404,
      customer_name: "Radhika Suresh",
      customer_city: "Tiruchirappalli, TN",
      rating: 5,
      review: "Removes makeup residue and grime effortlessly. My skin feels fresh, bright, and nourished rather than tight. Very gentle on dry skin.",
      verified_purchase: true,
      created_at: "2026-04-08T17:15:00Z"
    },
    {
      id: 405,
      customer_name: "Sowmya Venkat",
      customer_city: "Madurai, TN",
      rating: 5,
      review: "Smells subtle and high-end. Skin looks noticeably less tired after a long day in the sun. Gives a smooth, clean canvas for my night serums.",
      verified_purchase: true,
      created_at: "2026-04-11T12:50:00Z"
    },
    {
      id: 406,
      customer_name: "Preethi Kumar",
      customer_city: "Vellore, TN",
      rating: 4,
      review: "Good gentle cleanser for daily routine. Easy to rinse off, no sticky residue, and skin feels velvety soft to touch.",
      verified_purchase: true,
      created_at: "2026-04-14T09:15:00Z"
    }
  ],
  "vitamin-c-serum": [
    {
      id: 501,
      customer_name: "Aishwarya Rajan",
      customer_city: "Chennai, TN",
      rating: 5,
      review: "Enoda dark spots and tanning konjam light aagiduchu after 3 weeks of morning use. Texture is water-light, not sticky at all, and absorbs very fast.",
      verified_purchase: true,
      created_at: "2026-03-23T11:10:00Z"
    },
    {
      id: 502,
      customer_name: "Lavanya Sekar",
      customer_city: "Bengaluru, KA",
      rating: 5,
      review: "One of the few Vitamin C serums that didn't oxidize fast or irritate my skin. Visibly brightens morning dullness and layers beautifully under sunscreen.",
      verified_purchase: true,
      created_at: "2026-03-28T16:25:00Z"
    },
    {
      id: 503,
      customer_name: "Revathi Muthu",
      customer_city: "Coimbatore, TN",
      rating: 4,
      review: "Lightweight and non-greasy drops. Skin has developed a very healthy natural glow. Subtle reduction in cheek pigmentation marks.",
      verified_purchase: true,
      created_at: "2026-04-02T13:40:00Z"
    },
    {
      id: 504,
      customer_name: "Pooja Nair",
      customer_city: "Kochi, KL",
      rating: 5,
      review: "Fits right into my AM routine before moisturizer. My complexion looks fresher and more radiant throughout the day. Worth every drop.",
      verified_purchase: true,
      created_at: "2026-04-06T10:00:00Z"
    },
    {
      id: 505,
      customer_name: "Deepthi Mohan",
      customer_city: "Madurai, TN",
      rating: 5,
      review: "Sun spots around forehead have become noticeably less prominent. Quick absorbing serum and gives a dewy finish without any oily residue.",
      verified_purchase: true,
      created_at: "2026-04-09T17:50:00Z"
    },
    {
      id: 506,
      customer_name: "Shweta Anand",
      customer_city: "Salem, TN",
      rating: 4,
      review: "Gentle formula with botanical boosters. Doesn't cause tingling or breakouts. Skin looks more awake and even-toned.",
      verified_purchase: true,
      created_at: "2026-04-12T12:15:00Z"
    }
  ],
  "hair-shine-serum": [
    {
      id: 601,
      customer_name: "Rohini Subramanian",
      customer_city: "Chennai, TN",
      rating: 5,
      review: "Chennai humidity-la enoda hair romba frizz aagum. Just 3 drops of this serum on damp hair keeps it smooth, manageable, and silky all day.",
      verified_purchase: true,
      created_at: "2026-03-25T15:30:00Z"
    },
    {
      id: 602,
      customer_name: "Varsha Anand",
      customer_city: "Bengaluru, KA",
      rating: 5,
      review: "Tamed flyaways without weighing down my fine hair or making it greasy. Hair feels so much softer and has a glossy, healthy shine.",
      verified_purchase: true,
      created_at: "2026-03-29T10:45:00Z"
    },
    {
      id: 603,
      customer_name: "Nandhini Prakash",
      customer_city: "Coimbatore, TN",
      rating: 5,
      review: "Dry, split ends look noticeably healthier and smoother. It spreads easily through lengths and smells delicate and natural.",
      verified_purchase: true,
      created_at: "2026-04-03T18:15:00Z"
    },
    {
      id: 604,
      customer_name: "Krithika S.",
      customer_city: "Madurai, TN",
      rating: 4,
      review: "Frizz control is excellent even on monsoon days. Hair looks shinier, detangles quickly, and feels feather-light.",
      verified_purchase: true,
      created_at: "2026-04-07T12:00:00Z"
    },
    {
      id: 605,
      customer_name: "Meenakshi Sundaram",
      customer_city: "Tiruchirappalli, TN",
      rating: 5,
      review: "Hair wash pannitu apply panna, blow dry or heat illamale hair stays soft and neat. Huge improvement in rough hair texture.",
      verified_purchase: true,
      created_at: "2026-04-10T16:40:00Z"
    },
    {
      id: 606,
      customer_name: "Bhavani Govind",
      customer_city: "Hyderabad, TS",
      rating: 4,
      review: "Non-sticky formulation that adds an instant polished sheen to dull lengths. Makes combing effortless and hair feels velvety.",
      verified_purchase: true,
      created_at: "2026-04-13T11:25:00Z"
    }
  ],
  "spf-50-sunscreen": [
    {
      id: 701,
      customer_name: "Shalini Mahesh",
      customer_city: "Chennai, TN",
      rating: 5,
      review: "Zero white cast! Spreads like a light moisturiser and doesn't sweat off in Chennai heat. My skin stays hydrated and protected the whole day.",
      verified_purchase: true,
      created_at: "2026-03-24T09:10:00Z"
    },
    {
      id: 702,
      customer_name: "Dhivya Karthik",
      customer_city: "Coimbatore, TN",
      rating: 5,
      review: "Enoda daily routine-ku idhu must-have. No greasy layer, no heavy feel on face, and reapplication is super easy over makeup too.",
      verified_purchase: true,
      created_at: "2026-03-28T14:35:00Z"
    },
    {
      id: 703,
      customer_name: "Anitha Krishnan",
      customer_city: "Bengaluru, KA",
      rating: 4,
      review: "Gives broad spectrum protection with a comfortable dewy finish. Doesn't pill under foundation and keeps dry areas well moisturised.",
      verified_purchase: true,
      created_at: "2026-04-01T11:55:00Z"
    },
    {
      id: 704,
      customer_name: "Sneha Paul",
      customer_city: "Kochi, KL",
      rating: 5,
      review: "Lightweight fluid texture that sinks in within seconds. Very soothing on sensitive skin and doesn't sting the eye area.",
      verified_purchase: true,
      created_at: "2026-04-05T17:20:00Z"
    },
    {
      id: 705,
      customer_name: "Vinothini R.",
      customer_city: "Madurai, TN",
      rating: 5,
      review: "Sunburn and redness thadukudhu very effectively. Daily college wear-ku perfect, feels completely weightless like a light day cream.",
      verified_purchase: true,
      created_at: "2026-04-08T15:05:00Z"
    },
    {
      id: 706,
      customer_name: "Madhumitha S.",
      customer_city: "Salem, TN",
      rating: 4,
      review: "Moisturizing without clogging pores. No breakouts so far. Keeps my face comfortable and hydrated during long outdoor commutes.",
      verified_purchase: true,
      created_at: "2026-04-12T10:45:00Z"
    }
  ]
};

interface ParsedProductContent {
  tagline: string;
  intro: string;
  benefits: string[];
  ingredients: { name: string; description: string }[];
  suitableFor: string;
  howToUse: string;
  highlights: string[];
}

function parseProductContent(
  fullDesc?: string,
  shortDesc?: string,
  fallbackBenefits?: string,
  fallbackIngredients?: string,
  fallbackHow?: string,
  fallbackSkin?: string
): ParsedProductContent {
  if (!fullDesc) {
    const rawBenefits = fallbackBenefits ? fallbackBenefits.split(/[•\n]/).map((b) => b.trim()).filter(Boolean) : [];
    const rawIngs = fallbackIngredients ? fallbackIngredients.split(/[,•\n]/).map((i) => i.trim()).filter(Boolean) : [];
    return {
      tagline: "",
      intro: shortDesc || "",
      benefits: rawBenefits,
      ingredients: rawIngs.map((item) => {
        const parts = item.split(/\s*[\u2014\u2013\-:]\s*(.+)/);
        return parts.length >= 2 ? { name: parts[0].trim(), description: parts[1].trim() } : { name: item, description: "" };
      }),
      suitableFor: fallbackSkin || "",
      howToUse: fallbackHow || "",
      highlights: [],
    };
  }

  const sectionHeaders = [
    "Key Benefits",
    "Key Ingredients",
    "Suitable For",
    "How To Use",
    "Formulation Highlights",
  ];

  let currentHeader = "INTRO";
  const headerContent: Record<string, string[]> = { INTRO: [] };

  const lines = fullDesc.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    const matchedHeader = sectionHeaders.find(
      (h) =>
        trimmed.toLowerCase() === h.toLowerCase() ||
        trimmed.toLowerCase().startsWith(h.toLowerCase() + ":") ||
        trimmed.toLowerCase() === "### " + h.toLowerCase() ||
        trimmed.toLowerCase() === "## " + h.toLowerCase()
    );

    if (matchedHeader) {
      currentHeader = matchedHeader;
      headerContent[currentHeader] = [];
    } else {
      headerContent[currentHeader].push(line);
    }
  }

  const introLines = (headerContent["INTRO"] || []).map((l) => l.trim()).filter(Boolean);
  let tagline = "";
  let intro = "";

  if (introLines.length >= 3) {
    tagline = introLines[1];
    intro = introLines.slice(2).join("\n\n");
  } else if (introLines.length === 2) {
    tagline = introLines[0];
    intro = introLines[1];
  } else if (introLines.length === 1) {
    intro = introLines[0];
  }

  if (!intro && shortDesc) {
    intro = shortDesc;
  }

  const benefits = (headerContent["Key Benefits"] || [])
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[\•\-\*]\s*/, ""));

  const rawIngredients = (headerContent["Key Ingredients"] || [])
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[\•\-\*]\s*/, ""));

  const ingredients = rawIngredients.map((item) => {
    const match = item.split(/\s*[\u2014\u2013\-:]\s*(.+)/);
    if (match.length >= 2) {
      return { name: match[0].trim(), description: match[1].trim() };
    }
    return { name: item, description: "" };
  });

  const suitableFor = (headerContent["Suitable For"] || [])
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");

  const howToUse = (headerContent["How To Use"] || [])
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n\n");

  const highlights = (headerContent["Formulation Highlights"] || [])
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[\•\-\*]\s*/, ""));

  return {
    tagline: tagline || "",
    intro: intro || shortDesc || "",
    benefits:
      benefits.length > 0
        ? benefits
        : fallbackBenefits
        ? fallbackBenefits.split(/[•\n]/).map((b) => b.trim()).filter(Boolean)
        : [],
    ingredients:
      ingredients.length > 0
        ? ingredients
        : fallbackIngredients
        ? fallbackIngredients.split(/[,•\n]/).map((i) => ({ name: i.trim(), description: "" })).filter((i) => i.name)
        : [],
    suitableFor: suitableFor || fallbackSkin || "",
    howToUse: howToUse || fallbackHow || "",
    highlights,
  };
}

export default function ProductDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>(() => FALLBACK_REVIEWS[slug] || []);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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
        return fetch(getApiUrl(`/api/v1/reviews/product/${data.id}`))
          .then((res) => {
            if (!res.ok) throw new Error("Failed to load reviews");
            return res.json();
          })
          .then((reviewData: Review[]) => {
            if (Array.isArray(reviewData) && reviewData.length > 0) {
              setReviews(reviewData);
            } else {
              return fetch(getApiUrl(`/api/v1/reviews/product-slug/${data.slug}`))
                .then((r) => r.json())
                .then((slugData: Review[]) => {
                  if (Array.isArray(slugData) && slugData.length > 0) {
                    setReviews(slugData);
                  } else if (FALLBACK_REVIEWS[data.slug]) {
                    setReviews(FALLBACK_REVIEWS[data.slug]);
                  }
                })
                .catch(() => {
                  if (FALLBACK_REVIEWS[data.slug]) {
                    setReviews(FALLBACK_REVIEWS[data.slug]);
                  }
                });
            }
          })
          .catch((err) => {
            console.warn("Reviews load notice:", err);
            if (FALLBACK_REVIEWS[data.slug]) {
              setReviews(FALLBACK_REVIEWS[data.slug]);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error("Failed to load product:", err);
        if (slug === "glow-radiant-plus") {
          const fallbackGlow: Product = {
            id: 1,
            name: "Glow Radiant Plus Night Cream",
            slug: "glow-radiant-plus",
            short_description: "Let your skin do its best work while you rest. A botanically nourishing night cream that deeply hydrates, visibly brightens, and repairs the skin barrier.",
            full_description: `Glow Radiant Plus Night Cream — 30g\n\nLet your skin do its best work while you rest. Reveal your natural brightness.\n\nA botanically nourishing skin brightening cream that works in harmony with your skin's natural renewal cycle. Powered by pure botanical extracts, it deeply hydrates, visibly brightens, and steadily repairs a compromised skin barrier, so you wake up to skin that looks and feels genuinely restored.\n\nKey Benefits\n• Deep Hydration: Sustained overnight hydration that locks in moisture without heaviness\n• Brightens Skin: Visibly brightens uneven, dull, or tired-looking skin and fades dark spots\n• Repairs Barrier: Strengthens and repairs the natural skin barrier with consistent use\n• Evens Skin Tone: Targets hyperpigmentation revealing an editorial-level luminous complexion\n\nKey Ingredients\n• Aloe Vera — deeply hydrating and calming, reduces redness and soothes irritated skin\n• Licorice — a well-regarded botanical that gently brightens and evens skin tone over time\n• Sweet Almond Oil — nourishes and softens skin texture without congesting pores\n• Lavender — calms the skin and supports overnight recovery from environmental stress\n• Mango Seed Butter — rich and emollient, restores suppleness and seals in moisture\n• Carrot Seed Oil — high in antioxidants and vitamins, supports skin renewal and a healthy natural glow\n\nSuitable For\nDull, dry, combination, and normal skin types. Particularly beneficial for skin that looks fatigued or uneven. Ideal for daily nighttime rituals.\n\nHow To Use\nCleanse thoroughly and pat your face dry. Take a small amount and warm between your fingertips. Apply evenly across face and neck using gentle upward strokes. Allow the formula to absorb fully overnight. Rinse gently in the morning.\n\nFormulation Highlights\n• Paraben-free & Sulphate-free\n• No harsh bleaching or peeling agents\n• 100% Botanically sourced actives\n• Suitable for nightly ritual`,
            price: 799.0,
            sale_price: 799.0,
            SKU: "QH-GLOW-RADPLUS-30",
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
              { id: 28, product_id: 1, name: "30g", sku_suffix: "V30G", price_override: null, stock: 45 }
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
            short_description: "Feed your skin. Reveal its natural brightness. A botanically rich skin brightening night cream that deeply nourishes, softens, and helps restore radiance while you sleep.",
            full_description: `Avocado Pro Nourish Night Cream — 30g\n\nFeed your skin. Reveal its natural brightness.\n\nA botanically rich skin brightening night cream that deeply nourishes, softens, and helps restore radiance while you sleep. Powered by avocado, sweet almond oil, honey, wheatgerm, milk protein, and seaweed, it supports healthier-looking, smoother, more luminous skin without harsh bleaching agents.\n\nKey Benefits\n• Deep, sustained nourishment throughout the night\n• Visibly softer and smoother skin with regular use\n• Restores a natural, healthy radiance to dull skin\n• Strengthens the skin barrier over time\n• Supports a more even, luminous complexion\n\nKey Ingredients\n• Avocado — rich in fatty acids that repair the skin barrier and restore suppleness\n• Sweet Almond Oil — lightweight and emollient, softens without congesting pores\n• Honey — a natural humectant that draws and locks moisture into the skin\n• Wheatgerm Extract — packed with Vitamin E to support renewal and reduce dullness\n• Milk Protein — smooths skin tone and refines the complexion\n• Seaweed — marine-derived minerals that firm, hydrate, and restore luminosity\n\nSuitable For\nOily, combination, aging, dull, and normal skin types. Ideal for daily use, overnight.\n\nHow To Use\nCleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.\n\nFormulation Highlights\n• 100% Herbal & Botanical actives\n• Paraben-free & Sulphate-free\n• No harsh bleaching agents\n• Suitable for daily nighttime ritual`,
            price: 799.0,
            sale_price: 799.0,
            SKU: "QH-HYD-AVONIGHT-30",
            stock: 30,
            ingredients: "Avocado (rich in fatty acids), Sweet Almond Oil, Honey, Wheatgerm Extract, Milk Protein, Seaweed minerals, Botanically Sourced Actives.",
            benefits: "Deep, sustained nourishment throughout the night • Visibly softer and smoother skin with regular use • Restores natural, healthy radiance to dull skin • Strengthens the skin barrier over time • Supports a more even, luminous complexion.",
            how_to_use: "Cleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.",
            skin_type: "Oily, combination, aging, dull, and normal skin types",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_before_after.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
            variants: [
              { id: 29, product_id: 2, name: "30g", sku_suffix: "V30G", price_override: null, stock: 30 }
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
            name: "Moisturizing Sunscreen SPF 50+",
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
            name: "Advanced Face Serum Vitamin C+ E+",
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
            name: "Instant Anti-Frizz Hair Serum",
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


  const parsedContent = parseProductContent(
    product.full_description,
    product.short_description,
    product.benefits,
    product.ingredients,
    product.how_to_use,
    product.skin_type
  );

  const hasDiscount = product.sale_price !== null;
  
  // Calculate price dynamically based on variant selection and base pricing overrides
  const basePrice = selectedVariant?.price_override || product.price;
  const activePrice = hasDiscount && !selectedVariant?.price_override
    ? product.sale_price!
    : basePrice;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: basePrice,
        sale_price: hasDiscount && !selectedVariant?.price_override ? product.sale_price : null,
        thumbnail: product.thumbnail,
        variant: selectedVariant?.name,
      },
      quantity,
      true
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  const handleBuyNow = () => {
    if (!product) return;
    setIsBuyingNow(true);
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: basePrice,
        sale_price: hasDiscount && !selectedVariant?.price_override ? product.sale_price : null,
        thumbnail: product.thumbnail,
        variant: selectedVariant?.name,
      },
      quantity,
      false
    );
    setIsCartOpen(false);
    router.push("/checkout");
  };

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

          {/* Product Information Area (Collapsed / Expanded See More Experience) */}
          <div className="space-y-4 border-b border-brand-sand/20 pb-4">
            {/* Product Tagline */}
            {parsedContent.tagline && (
              <p className="font-serif italic text-sm sm:text-base text-brand-accent tracking-wide leading-snug">
                "{parsedContent.tagline}"
              </p>
            )}

            {/* Introductory Description */}
            <p className="text-brand-cocoa/85 text-sm sm:text-base leading-relaxed font-sans font-light">
              {parsedContent.intro}
            </p>

            {/* Collapsed view: Important Benefits highlights */}
            {!isDescriptionExpanded && parsedContent.benefits.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold font-sans text-brand-dark/60 block">
                  Key Highlights
                </span>
                <ul className="space-y-1.5">
                  {parsedContent.benefits.slice(0, 2).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-cocoa/90 leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-1.5" />
                      <span>{formatBold(benefit)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expanded view: Full Description with all sections */}
            {isDescriptionExpanded && (
              <div
                id="product-full-description"
                className="space-y-5 pt-3 border-t border-brand-sand/20 transition-all duration-300"
              >
                {/* Key Benefits */}
                {parsedContent.benefits.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-dark">
                      Key Benefits
                    </h3>
                    <ul className="space-y-2 pl-0.5">
                      {parsedContent.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-cocoa/90 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-1.5" />
                          <span>{formatBold(benefit)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Ingredients */}
                {parsedContent.ingredients.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-dark">
                      Key Ingredients
                    </h3>
                    <ul className="space-y-2 pl-0.5">
                      {parsedContent.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-cocoa/90 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-1.5" />
                          <span>
                            <strong className="font-semibold text-brand-dark">{ing.name}</strong>
                            {ing.description ? ` — ${ing.description}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suitable For */}
                {parsedContent.suitableFor && (
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-dark">
                      Suitable For
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-cocoa/85 leading-relaxed font-sans font-light bg-brand-sand/15 p-3 rounded-xs border border-brand-sand/20">
                      {parsedContent.suitableFor}
                    </p>
                  </div>
                )}

                {/* How To Use */}
                {parsedContent.howToUse && (
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-dark">
                      How To Use
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-cocoa/85 leading-relaxed font-sans font-light">
                      {parsedContent.howToUse}
                    </p>
                  </div>
                )}

                {/* Formulation Highlights */}
                {parsedContent.highlights.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-dark">
                      Formulation Highlights
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedContent.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-cream/80 border border-brand-sand/50 text-[11px] sm:text-xs text-brand-dark/80 font-sans rounded-xs"
                        >
                          <Check size={12} className="text-brand-accent shrink-0" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* See More / See Less Control */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-dark hover:text-brand-accent transition-colors py-1.5 border-b border-brand-dark/40 hover:border-brand-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent cursor-pointer group"
                aria-expanded={isDescriptionExpanded}
                aria-controls="product-full-description"
              >
                <span>{isDescriptionExpanded ? "See Less" : "See More"}</span>
                {isDescriptionExpanded ? (
                  <ChevronUp size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5 text-brand-accent" />
                ) : (
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:translate-y-0.5 text-brand-accent" />
                )}
              </button>
            </div>
          </div>

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

          {/* Add to Cart & Buy Now Controls */}
          <div className="space-y-3 pt-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border-2 border-brand-sand/80 bg-white px-1.5 h-[48px] w-full sm:w-28 shrink-0 shadow-2xs">
                <span className="text-[11px] uppercase tracking-wider text-brand-dark/60 font-sans font-semibold pl-2 sm:hidden">
                  Quantity
                </span>
                <div className="flex items-center justify-between w-28 sm:w-full h-full">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-full flex items-center justify-center text-brand-dark/70 hover:text-brand-dark hover:bg-brand-sand/20 text-lg font-bold disabled:opacity-25 disabled:cursor-not-allowed transition-colors select-none"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="text-sm font-sans font-bold text-brand-dark min-w-[20px] text-center select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-brand-dark/70 hover:text-brand-dark hover:bg-brand-sand/20 text-lg font-bold transition-colors select-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row flex-1 gap-3">
                {/* ADD TO CART Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full sm:flex-1 h-[48px] px-3 text-xs sm:text-[13px] uppercase tracking-wider font-bold transition-all duration-300 shadow-2xs flex items-center justify-center gap-2 rounded-none cursor-pointer active:scale-[0.99] whitespace-nowrap ${
                    isAdded
                      ? "bg-brand-dark text-brand-cream border-2 border-brand-dark"
                      : "bg-white hover:bg-brand-dark hover:text-brand-cream border-2 border-brand-dark text-brand-dark"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 animate-in zoom-in-75 duration-200" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} className="shrink-0" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* BUY NOW Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="w-full sm:flex-1 h-[48px] px-3 bg-brand-dark hover:bg-brand-cocoa text-brand-cream border-2 border-brand-dark text-xs sm:text-[13px] uppercase tracking-wider font-bold transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 rounded-none cursor-pointer group active:scale-[0.99] whitespace-nowrap"
                >
                  {isBuyingNow ? (
                    <span className="animate-pulse">Proceeding...</span>
                  ) : (
                    <>
                      <span>Buy Now</span>
                      <ArrowRight size={15} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 text-brand-cream/90" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust notes */}
            <div className="flex items-center gap-2.5 text-xs text-brand-dark/60 pt-2 border-t border-brand-sand/20 font-sans font-light leading-relaxed">
              <ShieldCheck size={16} className="text-brand-accent shrink-0" />
              <span>Secure payment via UPI Transfer. Clean clinical purity guarantee.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-10 pt-10 border-t border-brand-sand/20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-sand/20 pb-6">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#8B6B38] font-medium uppercase font-sans block mb-2">
              Verified Feedback
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
              Customer Reviews ({reviews.length})
            </h2>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-3 bg-[#FAF8F5] border border-[#E5DEC9] px-4 py-2 self-start sm:self-auto">
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((s) => {
                  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
                  return (
                    <Star
                      key={s}
                      size={14}
                      className={s <= Math.round(avg) ? "fill-[#C5A059] text-[#C5A059]" : "fill-transparent text-[#D9CEBA]"}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-sans font-medium text-brand-dark">
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} / 5.0
              </span>
              <span className="text-[11px] text-brand-dark/50 font-sans">
                ({reviews.length} published)
              </span>
            </div>
          )}
        </div>
        
        {reviews.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-brand-sand/20 text-center py-16 px-4 space-y-3">
            <p className="font-serif text-lg text-brand-dark">No reviews published yet.</p>
            <p className="text-xs font-sans text-brand-dark/50 max-w-md mx-auto">
              Be the first to experience this botanical formula and share your routine ritual.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="border border-[#E5DEC9] bg-[#FAF8F5] p-6 flex flex-col justify-between hover:border-[#C5A059]/60 hover:shadow-sm transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-serif text-base text-brand-dark font-medium leading-tight">
                        {rev.customer_name || "Verified Customer"}
                      </h4>
                      {rev.customer_city && (
                        <p className="text-[11px] text-brand-dark/60 font-sans mt-0.5">
                          {rev.customer_city}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={s <= rev.rating ? "fill-[#C5A059] text-[#C5A059]" : "fill-transparent text-[#D9CEBA]"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-brand-cocoa/90 font-sans font-light leading-relaxed">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-brand-sand/15 flex items-center justify-between text-[10px] font-sans">
                  {rev.verified_purchase ? (
                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold text-[#8B6B38] bg-[#F2EADA] px-2.5 py-1 rounded-sm">
                      <CheckCircle2 size={11} className="text-[#8B6B38]" />
                      VERIFIED PURCHASE
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-brand-dark/40 font-sans tracking-wide">
                    {rev.created_at ? new Date(rev.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
