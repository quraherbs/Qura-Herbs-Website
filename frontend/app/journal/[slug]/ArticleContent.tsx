"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  published_at: string;
}

export default function ArticleContent({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(getApiUrl(`/api/v1/blogs/slug/${slug}`))
      .then((res) => {
        if (!res.ok) throw new Error("Article not found");
        return res.json();
      })
      .then((data: Blog) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load article:", err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

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

  return (
    <article className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/journal"
          className="text-xs uppercase tracking-widest text-brand-accent hover:text-brand-dark font-sans font-semibold transition-colors"
        >
          ← Back to Journal
        </Link>
      </div>

      {/* Meta */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-brand-accent font-semibold font-sans">
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{new Date(blog.published_at).toLocaleDateString()}</span>
        </div>
        
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark leading-tight">
          {blog.title}
        </h1>
        
        <p className="text-brand-cocoa/80 italic text-sm md:text-base font-serif leading-relaxed pl-4 border-l-2 border-brand-accent">
          {blog.excerpt}
        </p>
      </div>

      {/* Featured image */}
      {blog.featured_image && (
        <div className="w-full aspect-[16/9] overflow-hidden bg-brand-sand/15 border border-brand-sand/20">
          <img src={getImageUrl(blog.featured_image)} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main body content */}
      <div className="font-sans font-light text-sm md:text-base text-brand-cocoa leading-relaxed space-y-6 pt-4 border-t border-brand-sand/10 whitespace-pre-line">
        {blog.content}
      </div>
    </article>
  );
}
