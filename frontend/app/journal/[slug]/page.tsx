import type { Metadata } from "next";
import AnnouncementBar from "../../../components/AnnouncementBar";
import Navbar from "../../../components/Navbar";
import CartDrawer from "../../../components/CartDrawer";
import ArticleContent from "./ArticleContent";

import { CANONICAL_JOURNAL_ARTICLES } from "@/lib/journal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CANONICAL_JOURNAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = CANONICAL_JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Skincare Journal | Qura Herbs",
      description: "Read skincare guides and botanical ingredient stories from Qura Herbs.",
      alternates: {
        canonical: `https://quraherbs.in/journal/${slug}`,
      },
    };
  }

  const title = article.title;
  const canonicalUrl = `https://quraherbs.in/journal/${article.slug}`;

  return {
    title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: "Qura Herbs",
      title,
      description: article.excerpt,
      images: [
        {
          url: article.featured_image.startsWith("http")
            ? article.featured_image
            : `https://quraherbs.in${article.featured_image}`,
          alt: article.title,
        },
      ],
      publishedTime: article.published_at,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.excerpt,
    },
  };
}

export default async function JournalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = CANONICAL_JOURNAL_ARTICLES.find((a) => a.slug === slug);

  const articleJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: article.featured_image.startsWith("http")
          ? article.featured_image
          : `https://quraherbs.in${article.featured_image}`,
        datePublished: article.published_at,
        author: {
          "@type": "Organization",
          name: "Qura Herbs",
        },
        publisher: {
          "@type": "Organization",
          name: "Qura Herbs",
          logo: {
            "@type": "ImageObject",
            url: "https://quraherbs.in/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://quraherbs.in/journal/${article.slug}`,
        },
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16">
        <ArticleContent slug={slug} />
      </main>

      <CartDrawer />
    </div>
  );
}
