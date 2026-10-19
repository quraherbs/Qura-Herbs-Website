import type { Metadata } from "next";
import AnnouncementBar from "../../../components/AnnouncementBar";
import Navbar from "../../../components/Navbar";
import CartDrawer from "../../../components/CartDrawer";
import ProductDetails from "./ProductDetails";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "glow-radiant-plus" },
    { slug: "avocado-night-cream" },
    { slug: "tea-tree-pureveil-cleanser" },
    { slug: "red-wine-glow-cleanser" },
    { slug: "spf-50-sunscreen" },
    { slug: "vitamin-c-serum" },
    { slug: "hair-shine-serum" },
  ];
}

const PRODUCT_METADATA: Record<
  string,
  {
    name: string;
    title: string;
    description: string;
    image: string;
    price: string;
  }
> = {
  "glow-radiant-plus": {
    name: "Glow Radiant Plus Night Cream",
    title: "Glow Radiant Plus Night Cream",
    description:
      "Botanically nourishing night cream that deeply hydrates, visibly brightens, and repairs the skin barrier for an overnight radiant complexion.",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_main.jpg",
    price: "799",
  },
  "avocado-night-cream": {
    name: "Avocado Pro Nourish Night Cream",
    title: "Avocado Pro Nourish Night Cream",
    description:
      "Skin brightening and whitening night cream made with avocado and botanical extracts to nourish, soften, and restore radiance while you sleep.",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
    price: "799",
  },
  "tea-tree-pureveil-cleanser": {
    name: "Tea Tree Pureveil Cleanser",
    title: "Tea Tree Pureveil Cleanser",
    description:
      "Purifying clarifying cleanser formulated with tea tree and neem extracts to remove impurities, control excess oil, and soothe blemishes.",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/tea_tree_pureveil_cleanser_main.jpg",
    price: "449",
  },
  "red-wine-glow-cleanser": {
    name: "Red Wine Glow Cleanser",
    title: "Red Wine Glow Cleanser",
    description:
      "Antioxidant-rich gentle gel cleanser infused with red wine extracts to wash away daily grime, revitalize dull skin, and impart natural glow.",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/red_wine_glow_cleanser_main.jpg",
    price: "449",
  },
  "spf-50-sunscreen": {
    name: "Moisturizing Sunscreen SPF 50+",
    title: "Moisturizing Sunscreen SPF 50+",
    description:
      "Broad-spectrum SPF 50+ sunscreen with UVA/UVB protection, zero white cast, and non-greasy botanical hydration for all Indian skin types.",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg",
    price: "549",
  },
  "vitamin-c-serum": {
    name: "Advanced Face Serum Vitamin C+ E+",
    title: "Advanced Face Serum Vitamin C+ E+",
    description:
      "High-potency antioxidant serum formulated with stabilized Vitamin C and Vitamin E to brighten skin, fade pigmentation, and boost natural radiance.",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg",
    price: "649",
  },
  "hair-shine-serum": {
    name: "Instant Anti-Frizz Hair Serum",
    title: "Instant Anti-Frizz Hair Serum",
    description:
      "Lightweight smoothing hair serum with argan, jojoba, and silk proteins for instant frizz control, split end repair, and glossy shine.",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg",
    price: "544",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCT_METADATA[slug];

  if (!product) {
    return {
      title: "Botanical Skincare",
      description: "Discover Qura Herbs thoughtful botanical skincare and haircare rituals.",
      alternates: {
        canonical: `https://quraherbs.in/product/${slug}`,
      },
    };
  }

  const canonicalUrl = `https://quraherbs.in/product/${slug}`;

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: "Qura Herbs",
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCT_METADATA[slug];

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
          "@type": "Brand",
          name: "Qura Herbs",
        },
        offers: {
          "@type": "Offer",
          url: `https://quraherbs.in/product/${slug}`,
          priceCurrency: "INR",
          price: product.price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
        <ProductDetails slug={slug} />
      </main>

      <CartDrawer />
    </div>
  );
}
