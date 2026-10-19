"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getArticleBySlug, JournalArticle } from "@/lib/journal";
import { Sparkles, Droplets, CheckCircle, Heart, ArrowLeft } from "lucide-react";

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

  const blocks = content.split(/\n\n+/);

  return blocks.map((block, idx) => {
    let trimmed = block.trim();

    if (
      trimmed === "# How to Use Our Avocado Night Cream for Maximum Hydration" ||
      trimmed === "BY QURA HERBS | SKINCARE JOURNAL" ||
      trimmed === "Discover a simple nighttime ritual to nourish your skin, maintain moisture, and wake up to soft, healthy-looking skin."
    ) {
      return null;
    }

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

    if (trimmed.startsWith("# ")) {
      const headingText = trimmed.replace(/^#\s+/, "");
      return (
        <h1 key={idx} className="font-serif text-3xl sm:text-4xl font-light text-brand-dark pt-6 pb-2 border-b border-brand-sand/20">
          {headingText}
        </h1>
      );
    }

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

    if (trimmed.startsWith("Avocado helps")) {
      trimmed = trimmed.replace(/^Avocado/, "**Avocado**");
    } else if (trimmed.startsWith("Sweet Almond Oil helps")) {
      trimmed = trimmed.replace(/^Sweet Almond Oil/, "**Sweet Almond Oil**");
    } else if (trimmed.startsWith("Honey supports")) {
      trimmed = trimmed.replace(/^Honey/, "**Honey**");
    } else if (trimmed.startsWith("Seaweed, Milk Protein, and Wheat Germ Extract")) {
      trimmed = trimmed.replace(/^Seaweed, Milk Protein, and Wheat Germ Extract/, "**Seaweed, Milk Protein, and Wheat Germ Extract**");
    }

    return (
      <p key={idx} className="font-sans font-light text-sm sm:text-base text-brand-cocoa/90 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });
}

export default function ArticleContent({ slug }: { slug: string }) {
  const localArticle = getArticleBySlug(slug);
  const [blog, setBlog] = useState<Blog | null>(localArticle || null);
  const [loading, setLoading] = useState(false);

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
          setBlog(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load article from API, falling back to local registry:", err);
        setLoading(false);
      });
  }, [slug, localArticle]);

  const currentArticle = blog || localArticle;

  if (loading && !currentArticle) {
    return (
      <div className="py-20 text-center text-sm font-sans text-brand-dark/50 animate-pulse">
        Formatting article layout...
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl text-brand-dark">Article Not Found</h1>
        <p className="text-sm font-sans text-brand-cocoa/70">The requested journal entry could not be located.</p>
        <Link
          href="/journal"
          className="inline-block text-xs uppercase tracking-widest text-brand-accent hover:underline font-semibold font-sans pt-2"
        >
          ← Return to Skincare Journal
        </Link>
      </div>
    );
  }

  const isNightCreamArticle =
    slug === "how-to-use-your-night-cream" ||
    currentArticle.slug === "how-to-use-your-night-cream" ||
    currentArticle.title.toLowerCase().includes("how to use your night cream");

  const displayTitle = currentArticle.title;
  const displayExcerpt = currentArticle.excerpt;
  const displayImage = currentArticle.featured_image || "/uploads/how_to_use_your_night_cream_ritual.jpg";
  const authorLine = currentArticle.author || "BY QURA HERBS | SKINCARE JOURNAL";
  const publishDate = currentArticle.published_at || "2026-10-19T00:00:00.000Z";

  // Dedicated High-End Skincare Ritual Editorial Layout for "How to Use Your Night Cream"
  if (isNightCreamArticle) {
    return (
      <article className="space-y-10 sm:space-y-12 max-w-3xl mx-auto">
        {/* Back Link */}
        <div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-brand-accent hover:text-brand-dark font-sans font-semibold transition-colors group"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Journal</span>
          </Link>
        </div>

        {/* Refined Editorial Header */}
        <header className="space-y-4 border-b border-[#EFE8D8] pb-8">
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-brand-accent font-semibold font-sans">
            <span>{authorLine}</span>
            <span className="text-[#3D261D]/30">•</span>
            <span className="text-[#3D261D]/65 font-medium tracking-widest">
              OCT 19, 2026
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark leading-[1.18] tracking-tight">
            How to Use Your Night Cream
          </h1>

          <p className="text-brand-cocoa/90 italic text-base sm:text-lg font-serif leading-relaxed pl-4 border-l-2 border-brand-accent py-1">
            {displayExcerpt || "A simple nighttime ritual for fresh, radiant-looking skin."}
          </p>
        </header>

        {/* First Image / Hero Cover Visual */}
        <div className="w-full aspect-[16/9] overflow-hidden rounded-xs border border-[#EFE8D8] bg-white shadow-xs">
          <img
            src={getImageUrl("/uploads/the_glow_guide_journal.jpg")}
            alt="The Glow Guide - Qura Herbs Night Cream Skincare Ritual"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Skincare Ritual Numbered Sequence */}
        <section className="space-y-6 pt-2">
          <div className="space-y-1 mb-8">
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-brand-accent uppercase block">
              THE NIGHTTIME RITUAL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
              Four Steps to Soft, Nourished Skin
            </h2>
          </div>

          {/* Steps List */}
          <div className="space-y-5">
            {/* Step 01 */}
            <div className="bg-brand-light border border-[#EFE8D8] p-5 sm:p-6 rounded-xs hover:border-brand-accent/40 transition-colors">
              <div className="flex items-start gap-4 sm:gap-5">
                <span className="font-serif text-2xl sm:text-3xl font-light text-brand-accent shrink-0 pt-0.5 select-none">
                  01
                </span>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-brand-dark">
                    CLEANSE
                  </h3>
                  <p className="font-sans font-light text-sm sm:text-[15px] text-brand-cocoa/90 leading-relaxed">
                    Start with a clean face. Wash away dirt, oil and impurities with a gentle face wash.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-brand-light border border-[#EFE8D8] p-5 sm:p-6 rounded-xs hover:border-brand-accent/40 transition-colors">
              <div className="flex items-start gap-4 sm:gap-5">
                <span className="font-serif text-2xl sm:text-3xl font-light text-brand-accent shrink-0 pt-0.5 select-none">
                  02
                </span>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-brand-dark">
                    APPLY
                  </h3>
                  <p className="font-sans font-light text-sm sm:text-[15px] text-brand-cocoa/90 leading-relaxed">
                    Take a small amount of <strong className="font-semibold text-brand-dark">Night Cream</strong> and apply an even, thin layer over your <strong className="font-semibold text-brand-dark">face and neck</strong>. Massage gently until absorbed.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-brand-light border border-[#EFE8D8] p-5 sm:p-6 rounded-xs hover:border-brand-accent/40 transition-colors">
              <div className="flex items-start gap-4 sm:gap-5">
                <span className="font-serif text-2xl sm:text-3xl font-light text-brand-accent shrink-0 pt-0.5 select-none">
                  03
                </span>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-brand-dark">
                    LEAVE OVERNIGHT
                  </h3>
                  <p className="font-sans font-light text-sm sm:text-[15px] text-brand-cocoa/90 leading-relaxed">
                    Let the cream work while you sleep. Leave it on overnight for intensive nighttime care.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-brand-light border border-[#EFE8D8] p-5 sm:p-6 rounded-xs hover:border-brand-accent/40 transition-colors">
              <div className="flex items-start gap-4 sm:gap-5">
                <span className="font-serif text-2xl sm:text-3xl font-light text-brand-accent shrink-0 pt-0.5 select-none">
                  04
                </span>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-brand-dark">
                    RINSE IN THE MORNING
                  </h3>
                  <p className="font-sans font-light text-sm sm:text-[15px] text-brand-cocoa/90 leading-relaxed">
                    Wash your face with clean water in the morning and enjoy skin that feels <strong className="font-semibold text-brand-dark">fresh, soft and nourished</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Week Ritual Callout Block */}
        <section className="bg-brand-light border border-[#EFE8D8] p-6 sm:p-8 rounded-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-brand-accent">
            <Sparkles size={16} />
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase">
              EDITORIAL RECOMMENDATION
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
            YOUR 4-WEEK RITUAL
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-brand-accent font-medium">
            Consistency makes the difference.
          </p>
          <p className="font-sans font-light text-sm sm:text-[15px] text-brand-cocoa/90 leading-relaxed pt-1">
            With regular use, the Night Cream helps improve the appearance of dullness, uneven-looking tone and dark spots, leaving skin looking brighter and more radiant over time.
          </p>
        </section>

        {/* Supporting Image (User Uploaded) */}
        <section className="my-8 sm:my-10 space-y-2">
          <div className="w-full aspect-[16/9] overflow-hidden rounded-xs border border-[#EFE8D8] bg-white shadow-xs">
            <img
              src={getImageUrl("/uploads/how_to_use_your_night_cream_ritual.jpg")}
              alt="Qura Herbs Glow Radiant Plus Night Cream ritual demonstration and before and after results"
              className="w-full h-full object-contain sm:object-cover"
              loading="eager"
            />
          </div>
          <p className="text-[11px] font-sans text-brand-cocoa/60 text-center tracking-wide italic">
            Qura Herbs Night Cream Botanical Ritual &bull; Day to Night Skin Care
          </p>
        </section>

        {/* Better-Results Section (3 Editorial Columns / Cards) */}
        <section className="space-y-6 pt-2">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-brand-accent uppercase block">
              COMPLEMENTARY HABITS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
              FOR BETTER RESULTS
            </h2>
            <div className="w-10 h-[1px] bg-brand-accent sm:ml-0 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
            {/* Card 1 */}
            <div className="bg-brand-light border border-[#EFE8D8] p-5 sm:p-6 rounded-xs flex flex-col justify-between space-y-3 hover:border-brand-accent/40 transition-colors">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] text-brand-accent uppercase block">
                  CLEANSE DAILY
                </span>
                <p className="font-sans font-light text-xs sm:text-sm text-brand-cocoa/90 leading-relaxed">
                  Use a gentle face wash every day. You can choose a suitable cleanser from <strong className="font-semibold text-brand-dark">Qura Herbs</strong>.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-brand-light border border-[#EFE8D8] p-5 sm:p-6 rounded-xs flex flex-col justify-between space-y-3 hover:border-brand-accent/40 transition-colors">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] text-brand-accent uppercase block">
                  STAY HYDRATED
                </span>
                <p className="font-sans font-light text-xs sm:text-sm text-brand-cocoa/90 leading-relaxed">
                  Aim for around <strong className="font-semibold text-brand-dark">3 litres of water daily</strong>, depending on your individual needs.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-brand-light border border-[#EFE8D8] p-5 sm:p-6 rounded-xs flex flex-col justify-between space-y-3 hover:border-brand-accent/40 transition-colors">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] text-brand-accent uppercase block">
                  NOURISH YOUR SKIN FROM WITHIN
                </span>
                <p className="font-sans font-light text-xs sm:text-sm text-brand-cocoa/90 leading-relaxed">
                  Choose balanced, nutritious meals and make healthy food choices part of your everyday routine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Editorial Statement */}
        <section className="bg-brand-light border border-brand-sand/40 p-6 sm:p-8 rounded-xs text-center my-8 shadow-xs space-y-3">
          <h3 className="font-serif text-xl sm:text-2xl font-light text-brand-dark tracking-wide">
            YOUR SKINCARE IS MORE THAN A CREAM.
          </h3>
          <p className="font-sans text-xs sm:text-sm font-semibold tracking-widest text-brand-accent uppercase">
            Consistency &bull; Hydration &bull; Cleansing &bull; Healthy Choices
          </p>
          <div className="w-12 h-0.5 bg-brand-accent mx-auto my-2"></div>
          <p className="font-serif italic text-sm sm:text-base text-brand-cocoa/85">
            Together, they create your best-looking skin.
          </p>
        </section>
      </article>
    );
  }

  // Generic / Default Editorial Layout for other articles (e.g. Avocado Night Cream)
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
        {displayExcerpt && (
          <p className="text-brand-cocoa/85 italic text-base sm:text-lg font-serif leading-relaxed pl-4 border-l-2 border-brand-accent py-1">
            {displayExcerpt}
          </p>
        )}
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
        {renderFormattedContent(currentArticle.content)}
      </div>
    </article>
  );
}
