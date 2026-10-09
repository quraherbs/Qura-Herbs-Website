"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";

import { useEffect, useState } from "react";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";
import { CANONICAL_JOURNAL_ARTICLES } from "@/lib/journal";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  author: string;
  published_at: string;
}

export default function JournalPage() {
  const [blogs, setBlogs] = useState<Blog[]>(CANONICAL_JOURNAL_ARTICLES as Blog[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(getApiUrl("/api/v1/blogs/?published_only=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data.filter(
            (d: any) =>
              !d.author?.toLowerCase().includes("pranavi") &&
              d.slug !== "how-to-use-our-night-cream" &&
              d.slug !== "Minimal Care Refine You" &&
              d.id !== 1
          );
          const apiSlugs = new Set(filtered.map((d: any) => d.slug));
          const missing = CANONICAL_JOURNAL_ARTICLES.filter((c) => !apiSlugs.has(c.slug));
          setBlogs([...filtered, ...missing] as Blog[]);
        } else {
          setBlogs(CANONICAL_JOURNAL_ARTICLES as Blog[]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to load blogs:", err);
        setBlogs(CANONICAL_JOURNAL_ARTICLES as Blog[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            SKIN EDUCATION
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-dark">
            The Skincare Journal
          </h1>
          <div className="w-12 h-[1px] bg-brand-accent mx-auto"></div>
          <p className="text-brand-cocoa/70 font-sans font-light text-sm max-w-lg mx-auto">
            Phytomedical deep-dives, ingredient highlights, and editorial skin routines developed by our herbal chemists.
          </p>
        </div>

        {/* Blog grid list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-brand-sand/20 aspect-[16/10] w-full"></div>
                <div className="h-4 bg-brand-sand/20 w-3/4"></div>
                <div className="h-4 bg-brand-sand/20 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-brand-dark/50 font-sans text-sm border border-brand-sand/10 bg-brand-light">
            No journal entries currently published. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="group border border-brand-sand/20 bg-brand-light p-4 space-y-4 flex flex-col">
                {/* Image */}
                <Link
                  href={`/journal/${blog.slug}`}
                  className="block aspect-[16/10] overflow-hidden bg-brand-sand/10 border border-brand-sand/10"
                >
                  <img
                    src={getImageUrl(blog.featured_image || "/uploads/the_glow_guide_journal.jpg")}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] uppercase font-sans tracking-widest text-brand-accent font-semibold">
                    <span>
                      {blog.author?.toUpperCase().startsWith("BY ")
                        ? blog.author.toUpperCase()
                        : `BY ${blog.author?.toUpperCase() || "QURA HERBS"}`}
                    </span>
                    <span>
                      {new Date(blog.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  
                  <Link
                    href={`/journal/${blog.slug}`}
                    className="font-serif text-lg text-brand-dark hover:text-brand-accent transition-colors leading-snug line-clamp-2"
                  >
                    {blog.title}
                  </Link>
                  
                  <p className="text-xs text-brand-cocoa/75 font-sans font-light line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  
                  <div className="pt-2 mt-auto">
                    <Link
                      href={`/journal/${blog.slug}`}
                      className="inline-block font-sans text-[10px] uppercase tracking-widest border-b border-brand-dark hover:border-brand-accent hover:text-brand-accent font-semibold transition-all"
                    >
                      READ ARTICLE
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
