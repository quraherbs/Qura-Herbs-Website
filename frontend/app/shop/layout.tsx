import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Botanical Skincare & Haircare",
  description:
    "Explore Qura Herbs' complete collection of herbal night creams, cleansers, face serums, sunscreens, and hair serums. Thoughtful care for everyday rituals.",
  alternates: {
    canonical: "https://quraherbs.in/shop",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://quraherbs.in/shop",
    siteName: "Qura Herbs",
    title: "Shop Botanical Skincare & Haircare | Qura Herbs",
    description:
      "Explore Qura Herbs' complete collection of herbal night creams, cleansers, face serums, sunscreens, and hair serums. Thoughtful care for everyday rituals.",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
