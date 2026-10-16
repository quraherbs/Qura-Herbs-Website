import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Results & Customer Transformations",
  description:
    "See verified before-and-after skin journeys and authentic customer experiences with Qura Herbs botanical night creams, cleansers, and serums.",
  alternates: {
    canonical: "https://quraherbs.in/results",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://quraherbs.in/results",
    siteName: "Qura Herbs",
    title: "Real Results & Customer Transformations | Qura Herbs",
    description:
      "See verified before-and-after skin journeys and authentic customer experiences with Qura Herbs botanical night creams, cleansers, and serums.",
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
