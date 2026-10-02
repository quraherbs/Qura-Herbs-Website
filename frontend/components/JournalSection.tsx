"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string | null;
  author: string;
  published_at?: string | null;
}

export default function JournalSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl("/api/v1/blogs/?published_only=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to load journal articles for landing page:", err);
        setLoading(false);
      });
  }, []);

  // Display at most 3 blogs on the landing page
  const displayedBlogs = blogs.slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-16 md:py-24 bg-brand-light border-t border-b border-brand-sand/15 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <span className="text-[10px] sm:text-xs tracking-[0.25em] font-sans font-semibold text-brand-accent uppercase">
            SKIN EDUCATION & BOTANICAL ESSAYS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-wide">
            From the Journal
          </h2>
          <div className="w-10 h-[1px] bg-brand-accent mx-auto"></div>
        </div>

        {/* Dynamic Journal Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-4 border border-brand-sand/10 p-5 bg-brand-cream/30">
                <div className="bg-brand-sand/20 aspect-[16/10] w-full rounded-none"></div>
                <div className="h-4 bg-brand-sand/20 w-3/4"></div>
                <div className="h-3 bg-brand-sand/20 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displayedBlogs.length === 0 ? (
          <div className="text-center py-12 text-brand-dark/50 font-sans text-xs border border-brand-sand/15 bg-brand-cream/30 max-w-xl mx-auto">
            <BookOpen size={24} className="mx-auto text-brand-accent/60 mb-2" />
            <p>Our editorial team is crafting new botanical journal entries. Visit again soon.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${displayedBlogs.length === 1 ? 'max-w-3xl mx-auto' : displayedBlogs.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
            {displayedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group border border-brand-sand/20 bg-brand-cream/40 p-5 space-y-4 flex flex-col hover:border-brand-accent/40 hover:bg-brand-cream/70 transition-all duration-300"
              >
                {/* Journal Cover Image */}
                <Link
                  href={`/journal/${blog.slug}`}
                  className="block aspect-[16/10] overflow-hidden bg-brand-sand/10 border border-brand-sand/10 relative"
                >
                  <img
                    src={blog.featured_image || "/uploads/blog_placeholder.jpg"}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* Article Info */}
                <div className="flex-1 flex flex-col space-y-3">
                  <div className="flex justify-between items-center text-[10px] uppercase font-sans tracking-widest text-brand-accent font-semibold">
                    <span>BY {blog.author || "QURA HERBS"}</span>
                    {blog.published_at && (
                      <span>{new Date(blog.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    )}
                  </div>

                  <Link
                    href={`/journal/${blog.slug}`}
                    className="font-serif text-xl text-brand-dark hover:text-brand-accent transition-colors leading-snug line-clamp-2"
                  >
                    {blog.title}
                  </Link>

                  <p className="text-xs text-brand-cocoa/75 font-sans font-light line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="pt-3 mt-auto">
                    <Link
                      href={`/journal/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-widest text-brand-dark font-medium group-hover:text-brand-accent transition-colors border-b border-brand-dark/30 group-hover:border-brand-accent pb-0.5"
                    >
                      <span>Read Article</span>
                      <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Editorial Section CTA */}
        <div className="text-center pt-4">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-dark hover:bg-brand-accent text-brand-cream text-xs font-sans font-semibold uppercase tracking-[0.2em] transition-all duration-300 border border-brand-dark hover:border-brand-accent shadow-sm hover:shadow-md group cursor-pointer"
          >
            <span>Explore the Journal</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
