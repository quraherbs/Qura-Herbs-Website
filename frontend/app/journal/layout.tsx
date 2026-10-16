import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skincare Journal & Editorial",
  description:
    "Expert skincare guides, botanical ingredient spotlights, and self-care rituals from the Qura Herbs team in Coimbatore.",
  alternates: {
    canonical: "https://quraherbs.in/journal",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://quraherbs.in/journal",
    siteName: "Qura Herbs",
    title: "Skincare Journal & Editorial | Qura Herbs",
    description:
      "Expert skincare guides, botanical ingredient spotlights, and self-care rituals from the Qura Herbs team in Coimbatore.",
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
