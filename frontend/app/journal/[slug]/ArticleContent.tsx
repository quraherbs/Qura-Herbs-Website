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
    const trimmed = block.trim();

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

    // Check for Bullet List
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

    // Normal paragraph
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
  const [loading, setLoading] = useState(!localArticle);
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
          setBlog(data);
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

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-sans text-brand-dark/50 animate-pulse">
        Formatting article layout...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="py-20 text-center text-brand-dark/50 font-sans text-sm">
        Article not found.{" "}
        <Link href="/journal" className="underline text-brand-accent">
          Return to Journal
        </Link>
      </div>
    );
  }

  // Format author / category line
  const authorLine = blog.author?.toUpperCase().includes("SKINCARE JOURNAL")
    ? (blog.author.toUpperCase().startsWith("BY ") ? blog.author.toUpperCase() : `BY ${blog.author.toUpperCase()}`)
    : `BY QURA HERBS | SKINCARE JOURNAL`;

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
          {blog.published_at && (
            <>
              <span>•</span>
              <span className="text-brand-cocoa/60 font-light">
                {new Date(blog.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark leading-tight">
          {blog.title}
        </h1>

        {/* Subtitle / Introductory Description */}
        {blog.excerpt && (
          <p className="text-brand-cocoa/85 italic text-base sm:text-lg font-serif leading-relaxed pl-4 border-l-2 border-brand-accent py-1">
            {blog.excerpt}
          </p>
        )}
      </div>

      {/* Featured Cover Image */}
      {blog.featured_image && (
        <div className="w-full aspect-[16/9] overflow-hidden bg-brand-sand/15 border border-brand-sand/20 rounded-xs shadow-xs">
          <img
            src={getImageUrl(blog.featured_image)}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Body Content with Professional Styling */}
      <div className="space-y-5 pt-4 border-t border-brand-sand/15">
        {renderFormattedContent(blog.content)}
      </div>
    </article>
  );
}
