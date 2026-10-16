import type { Metadata } from "next";
import AnnouncementBar from "../../../components/AnnouncementBar";
import Navbar from "../../../components/Navbar";
import CartDrawer from "../../../components/CartDrawer";
import CategoryProductList from "./CategoryProductList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "oily-skin" },
    { slug: "dry-skin" },
    { slug: "sensitive-skin" },
    { slug: "combination-skin" },
    { slug: "hair-care" },
    { slug: "normal-skin" },
  ];
}

const CATEGORY_METADATA: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  "oily-skin": {
    title: "Oily Skin Care Rituals",
    description:
      "Clarifying, lightweight botanical cleansers and balancing treatments specially curated for oily and acne-prone skin.",
  },
  "dry-skin": {
    title: "Dry Skin Hydration & Barrier Repair",
    description:
      "Deeply moisturizing botanical night creams and gentle cleansers that restore hydration and nourish dry skin.",
  },
  "sensitive-skin": {
    title: "Sensitive Skin Calming Rituals",
    description:
      "Gentle, botanical skincare formulated without harsh additives to soothe, calm, and protect delicate, sensitive skin.",
  },
  "combination-skin": {
    title: "Combination Skin Balancing Care",
    description:
      "Harmonizing botanical formulations designed to hydrate dry zones while maintaining clarity across the T-zone.",
  },
  "hair-care": {
    title: "Botanical Hair Care Collection",
    description:
      "Herbal and botanical hair serums that eliminate frizz, impart glass-like shine, and nourish hair strands naturally.",
  },
  "normal-skin": {
    title: "Normal Skin Daily Botanical Rituals",
    description:
      "Everyday botanical skincare rituals designed to preserve natural glow, skin barrier health, and vitality.",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_METADATA[slug];

  const title = cat ? cat.title : "Shop by Concern";
  const description = cat
    ? cat.description
    : "Explore Qura Herbs botanical skincare rituals curated for specific skin and hair concerns.";
  const canonicalUrl = `https://quraherbs.in/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: "Qura Herbs",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <CategoryProductList slug={slug} />
      </main>

      <CartDrawer />
    </div>
  );
}
