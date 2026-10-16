import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Brand & Leadership",
  description:
    "Learn about Qura Herbs, founded in Coimbatore in 2025. Discover our founders Nandavel V and Pranavi GY, botanical philosophy, and commitment to skin confidence.",
  alternates: {
    canonical: "https://quraherbs.in/about",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://quraherbs.in/about",
    siteName: "Qura Herbs",
    title: "About Our Brand & Leadership | Qura Herbs",
    description:
      "Learn about Qura Herbs, founded in Coimbatore in 2025. Discover our founders Nandavel V and Pranavi GY, botanical philosophy, and commitment to skin confidence.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
