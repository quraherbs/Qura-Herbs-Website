"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getArticleBySlug, JournalArticle } from "@/lib/journal";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  published_at?: string | null;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-brand-dark">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderFormattedContent(content: string) {
  if (!content) return null;

  // Split into paragraph/section blocks
  const blocks = content.split(/\n\n+/);

  return blocks.map((block, idx) => {
    let trimmed = block.trim();

    // Skip duplicating header elements if passed in content body
    if (
      trimmed === "# How to Use Our Avocado Night Cream for Maximum Hydration" ||
      trimmed === "BY QURA HERBS | SKINCARE JOURNAL" ||
      trimmed === "Discover a simple nighttime ritual to nourish your skin, maintain moisture, and wake up to soft, healthy-looking skin."
    ) {
      return null;
    }

    // Check for H2 Heading
    if (trimmed.startsWith("## ")) {
      const headingText = trimmed.replace(/^##\s+/, "");
      const isStep = /^Step\s+\d+/i.test(headingText);

      return (
        <div key={idx} className="pt-6 pb-2 first:pt-2">
          {isStep && (
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
              RITUAL STEP
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark leading-snug border-b border-brand-sand/20 pb-2">
            {headingText}
          </h2>
        </div>
      );
    }

    // Check for H1 Heading (if any)
    if (trimmed.startsWith("# ")) {
      const headingText = trimmed.replace(/^#\s+/, "");
      return (
        <h1 key={idx} className="font-serif text-3xl sm:text-4xl font-light text-brand-dark pt-6 pb-2 border-b border-brand-sand/20">
          {headingText}
        </h1>
      );
    }

    // Check for Bullet List or Tips list
    if (trimmed.startsWith("- ") || trimmed.includes("\n- ")) {
      const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
      const isAllBullets = lines.every((l) => l.trim().startsWith("- "));

      if (isAllBullets) {
        return (
          <ul key={idx} className="space-y-3 my-4 pl-1">
            {lines.map((line, lIdx) => {
              const text = line.trim().replace(/^-\s+/, "");
              return (
                <li key={lIdx} className="flex items-start gap-3 text-sm sm:text-base text-brand-cocoa/90 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0"></span>
                  <span>{renderInlineMarkdown(text)}</span>
                </li>
              );
            })}
          </ul>
        );
      }
    }

    // Check for individual Skincare Tips (rendered as bullet item)
    const isSkincareTip = [
      "Cleanse your face before applying",
      "Use an appropriate amount and spread",
      "Follow your routine consistently rather",
      "Apply broad-spectrum sunscreen during",
      "Patch-test new skincare products before",
    ].some((phrase) => trimmed.includes(phrase));

    if (isSkincareTip) {
      return (
        <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-brand-cocoa/90 leading-relaxed my-2 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0"></span>
          <span>{renderInlineMarkdown(trimmed.replace(/^-\s+/, ""))}</span>
        </div>
      );
    }

    // Brand Tagline or Final Manifesto Callout
    if (trimmed.includes("Qura Herbs — Beauty Rooted in Care, Confidence, and Authenticity")) {
      return (
        <div key={idx} className="bg-brand-light border border-brand-sand/40 p-6 md:p-8 rounded-sm text-center my-8 shadow-xs space-y-2">
          <p className="font-serif italic text-base sm:text-lg text-brand-dark font-medium leading-relaxed">
            Qura Herbs — Beauty Rooted in Care, Confidence, and Authenticity.
          </p>
          <div className="w-10 h-0.5 bg-brand-accent mx-auto mt-2"></div>
        </div>
      );
    }

    // Ingredient descriptions formatting
    if (trimmed.startsWith("Avocado helps")) {
      trimmed = trimmed.replace(/^Avocado/, "**Avocado**");
    } else if (trimmed.startsWith("Sweet Almond Oil helps")) {
      trimmed = trimmed.replace(/^Sweet Almond Oil/, "**Sweet Almond Oil**");
    } else if (trimmed.startsWith("Honey supports")) {
      trimmed = trimmed.replace(/^Honey/, "**Honey**");
    } else if (trimmed.startsWith("Seaweed, Milk Protein, and Wheat Germ Extract")) {
      trimmed = trimmed.replace(/^Seaweed, Milk Protein, and Wheat Germ Extract/, "**Seaweed, Milk Protein, and Wheat Germ Extract**");
    }

    // Normal paragraph
    return (
      <p key={idx} className="font-sans font-light text-sm sm:text-base text-brand-cocoa/90 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });
}

const CANONICAL_AVOCADO_CONTENT = `## Your Nighttime Ritual for Naturally Nourished Skin

Your skin deserves gentle care at the end of the day. A consistent nighttime skincare routine helps maintain hydration and leaves your skin feeling soft, smooth, and refreshed.

Qura Herbs Avocado Pro Nourish Night Cream combines avocado, sweet almond oil, honey, seaweed, milk protein, and wheat germ extract in a nourishing skincare formula designed to complement your nighttime routine.

Follow these four simple steps to make the most of your skincare ritual.

## Step 01 — Cleanse Your Skin

Begin by cleansing your face with a gentle cleanser to remove makeup, sunscreen, excess oil, and everyday impurities. Rinse thoroughly with lukewarm water and pat your skin dry with a clean towel.

Clean skin provides the ideal starting point for your nighttime skincare routine.

## Step 02 — Apply the Night Cream

Take a small amount of Qura Herbs Avocado Pro Nourish Night Cream onto your fingertips. Gently distribute it across your forehead, cheeks, chin, and neck, avoiding direct contact with your eyes.

Apply an even layer without using excessive product.

## Step 03 — Massage Gently

Using your fingertips, massage the cream into your skin with gentle, circular movements until it is evenly distributed. Pay attention to areas that tend to feel dry or tight.

Keep the application gentle to maintain a comfortable and relaxing skincare experience.

## Step 04 — Let Your Skin Rest Overnight

Allow the cream to settle into your skin before going to bed. Overnight, your regular skincare routine can support your skin's moisture needs while you rest.

For best results, follow the product directions consistently and maintain a routine suited to your skin type.

## The Nourishing Ingredients Behind Your Routine

**Avocado** helps condition the skin and maintain a soft, moisturised feel.

**Sweet Almond Oil** helps nourish the skin and reduce the feeling of dryness.

**Honey** supports moisture retention and helps leave the skin feeling soft.

**Seaweed, Milk Protein, and Wheat Germ Extract** complement the formula with a blend of skin-conditioning ingredients.

## Tips for a Better Nighttime Skincare Routine

- Cleanse your face before applying the cream to remove daily impurities.
- Use an appropriate amount and spread it evenly across your skin.
- Follow your routine consistently rather than applying excessive product.
- Apply broad-spectrum sunscreen during the day to help protect your skin from UV exposure.
- Patch-test new skincare products before regular use. Discontinue use if irritation occurs.

## Wake Up to a Nourished-Looking Glow

Beautiful skin begins with consistent care. A gentle nighttime routine, adequate rest, and suitable skincare products can help maintain soft, comfortable, and healthy-looking skin over time.

Make Qura Herbs Avocado Pro Nourish Night Cream part of your evening ritual and give your skin the care it deserves.

Qura Herbs — Beauty Rooted in Care, Confidence, and Authenticity.`;

function isContentComplete(content?: string | null): boolean {
  if (!content) return false;
  return content.includes("Step 01") && content.includes("Step 04");
}

export default function ArticleContent({ slug }: { slug: string }) {
  const localArticle = getArticleBySlug(slug);
  const [blog, setBlog] = useState<Blog | null>(localArticle || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(getApiUrl(`/api/v1/blogs/slug/${slug}`))
      .then((res) => {
        if (!res.ok) {
          if (localArticle) return null;
          throw new Error("Article not found");
        }
        return res.json();
      })
      .then((data: Blog | null) => {
        if (data) {
          if (isContentComplete(data.content)) {
            setBlog(data);
          } else {
            // Retain the rich, full article content if remote database only has old dummy snippet
            setBlog({
              ...data,
              content: CANONICAL_AVOCADO_CONTENT,
              title: "How to Use Our Avocado Night Cream for Maximum Hydration",
              excerpt: "Discover a simple nighttime ritual to nourish your skin, maintain moisture, and wake up to soft, healthy-looking skin.",
              featured_image: "/uploads/the_glow_guide_journal.jpg",
              author: "BY QURA HERBS | SKINCARE JOURNAL",
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load article from API:", err);
        if (!localArticle) {
          setError(true);
        }
        setLoading(false);
      });
  }, [slug, localArticle]);

  if (loading && !blog && !localArticle) {
    return (
      <div className="py-20 text-center text-sm font-sans text-brand-dark/50 animate-pulse">
        Formatting article layout...
      </div>
    );
  }

  // Always resolve complete article content
  const contentToRender = isContentComplete(blog?.content)
    ? blog!.content
    : isContentComplete(localArticle?.content)
      ? localArticle!.content
      : CANONICAL_AVOCADO_CONTENT;

  const displayTitle = "How to Use Our Avocado Night Cream for Maximum Hydration";
  const displayExcerpt = "Discover a simple nighttime ritual to nourish your skin, maintain moisture, and wake up to soft, healthy-looking skin.";
  const displayImage = "/uploads/the_glow_guide_journal.jpg";
  const authorLine = "BY QURA HERBS | SKINCARE JOURNAL";
  const publishDate = blog?.published_at || localArticle?.published_at || "2026-10-10T00:00:00.000Z";

  return (
    <article className="space-y-8 max-w-3xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-brand-accent hover:text-brand-dark font-sans font-semibold transition-colors"
        >
          <span>← Back to Journal</span>
        </Link>
      </div>

      {/* Header & Meta */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-brand-accent font-semibold font-sans">
          <span>{authorLine}</span>
          <span>•</span>
          <span className="text-brand-cocoa/60 font-light">
            {new Date(publishDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark leading-tight">
          {displayTitle}
        </h1>

        {/* Subtitle / Introductory Description */}
        <p className="text-brand-cocoa/85 italic text-base sm:text-lg font-serif leading-relaxed pl-4 border-l-2 border-brand-accent py-1">
          {displayExcerpt}
        </p>
      </div>

      {/* Featured Cover Image */}
      <div className="w-full aspect-[16/9] overflow-hidden bg-brand-sand/15 border border-brand-sand/20 rounded-xs shadow-xs">
        <img
          src={getImageUrl(displayImage)}
          alt={displayTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Body Content with Professional Styling */}
      <div className="space-y-5 pt-4 border-t border-brand-sand/15">
        {renderFormattedContent(contentToRender)}
      </div>
    </article>
  );
}
