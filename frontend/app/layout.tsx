import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#2C1A14",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://quraherbs.in"),
  title: {
    default: "Qura Herbs | Botanical Skincare & Haircare",
    template: "%s | Qura Herbs",
  },
  description:
    "Discover Qura Herbs, a Coimbatore-based skincare and haircare brand offering botanical night creams, cleansers, Vitamin C serum, sunscreen and hair serums. Thoughtful care for your skin and hair.",
  applicationName: "Qura Herbs",
  authors: [{ name: "Qura Herbs" }],
  generator: "Next.js",
  keywords: [
    "Qura Herbs",
    "botanical skincare",
    "botanical haircare",
    "Coimbatore skincare",
    "night cream",
    "cleanser",
    "Vitamin C serum",
    "sunscreen SPF 50",
    "hair serum",
    "herbal beauty",
  ],
  alternates: {
    canonical: "https://quraherbs.in/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://quraherbs.in/",
    siteName: "Qura Herbs",
    title: "Qura Herbs | Botanical Skincare & Haircare",
    description:
      "Discover Qura Herbs, a Coimbatore-based skincare and haircare brand offering botanical night creams, cleansers, Vitamin C serum, sunscreen and hair serums. Thoughtful care for your skin and hair.",
    images: [
      {
        url: "https://quraherbs.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Qura Herbs — Botanical Skincare & Haircare",
      },
      {
        url: "https://quraherbs.in/logo.png",
        width: 1080,
        height: 1080,
        alt: "Qura Herbs Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qura Herbs | Botanical Skincare & Haircare",
    description:
      "Discover Qura Herbs, a Coimbatore-based skincare and haircare brand offering botanical night creams, cleansers, Vitamin C serum, sunscreen and hair serums. Thoughtful care for your skin and hair.",
    images: ["https://quraherbs.in/og-image.png"],
    site: "@qura_herbs",
    creator: "@qura_herbs",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://quraherbs.in/#organization",
      "name": "Qura Herbs",
      "url": "https://quraherbs.in/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://quraherbs.in/#logo",
        "url": "https://quraherbs.in/logo.png",
        "caption": "Qura Herbs Official Logo",
        "width": 1080,
        "height": 1080,
      },
      "image": "https://quraherbs.in/logo.png",
      "email": "quraherbs@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Coimbatore",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "IN",
      },
      "sameAs": [
        "https://www.instagram.com/quraherbs",
        "https://x.com/qura_herbs",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://quraherbs.in/#website",
      "url": "https://quraherbs.in/",
      "name": "Qura Herbs",
      "description":
        "Discover Qura Herbs, a Coimbatore-based skincare and haircare brand offering botanical night creams, cleansers, Vitamin C serum, sunscreen and hair serums. Thoughtful care for your skin and hair.",
      "publisher": {
        "@id": "https://quraherbs.in/#organization",
      },
      "inLanguage": "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} font-sans min-h-full bg-brand-cream text-brand-dark antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
