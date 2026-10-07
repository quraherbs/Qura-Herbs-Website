"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getApiUrl, getImageUrl } from "@/lib/api";

export default function BrandStory() {
  const [content, setContent] = useState({
    founder_quote: "Skincare should not be about changing who you are. It should be about taking better care of the skin you already have.",
    founder_name: "Nandavel V",
    founder_designation: "Founder",
    founder_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/nandavel_founder.jpg",
    founder_bio: "Founded by Nandavel V in Coimbatore in 2025, Qura Herbs began as a vision to create herbal skincare that feels genuine, practical, and accessible. Combining creativity, nature, and customer understanding, Qura focuses on healthier-looking skin, consistent care, and self-acceptance."
  });

  useEffect(() => {
    // 1. Fetch founder story from CMS endpoint
    fetch(getApiUrl("/api/v1/content/founder"))
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setContent((prev) => ({
            ...prev,
            founder_quote: data.founder_quote || data.quote || prev.founder_quote,
            founder_name: data.founder_name || data.name || prev.founder_name,
            founder_designation: data.founder_designation || data.title || prev.founder_designation,
            founder_image: data.image || data.founder_image || prev.founder_image,
            founder_bio: data.founder_bio || data.description || prev.founder_bio
          }));
        }
      })
      .catch((err) => {
        // Fallback to settings endpoint if founder endpoint is empty
        fetch(getApiUrl("/api/v1/admin/settings/homepage"))
          .then((res) => res.json())
          .then((data) => {
            if (data && data.value && data.value.founder_quote) {
              setContent((prev) => ({
                ...prev,
                founder_quote: data.value.founder_quote,
                founder_name: data.value.founder_name || prev.founder_name,
                founder_designation: data.value.founder_designation || prev.founder_designation,
                founder_image: data.value.image || data.value.founder_image || "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/nandavel_founder.jpg",
                founder_bio: data.value.founder_bio || prev.founder_bio
              }));
            }
          })
          .catch((e) => console.log("Failed to load founder settings:", e));
      });
  }, []);

  return (
    <section className="bg-brand-cream py-24 md:py-32 px-4 border-t border-brand-sand/20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Story Text Left */}
        <div className="lg:col-span-6 space-y-8 max-w-xl">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark leading-snug">
            Skincare rooted in nature, created for modern skin.
          </h2>
          
          <div className="border-l-2 border-brand-accent pl-6 py-2 italic font-serif text-lg text-brand-cocoa/90 leading-relaxed">
            &ldquo;{content.founder_quote}&rdquo;
          </div>
          
          <p className="text-brand-cocoa/70 font-light text-sm md:text-base leading-relaxed font-sans">
            {content.founder_bio}
          </p>

          <div>
            <Link 
              href="/about" 
              className="inline-block border-b-2 border-brand-dark hover:border-brand-accent text-brand-dark hover:text-brand-accent font-sans text-xs uppercase tracking-widest py-1 font-semibold transition-colors duration-300"
            >
              DISCOVER OUR STORY
            </Link>
          </div>
        </div>

        {/* Founder Portrait & Frame Right */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-md h-[400px] sm:h-[500px]">
            {/* Visual Frame Background */}
            <div className="absolute inset-0 border border-brand-accent/30 translate-x-4 translate-y-4"></div>
            
            {/* Main Founder Image container */}
            <div 
              className="absolute inset-0 bg-cover bg-center border border-brand-sand shadow-lg" 
              style={{ backgroundImage: `url('${getImageUrl(content.founder_image)}')` }}
            >
            </div>
            
            {/* Signature Badge */}
            <div className="absolute bottom-4 right-4 bg-brand-cream border border-brand-sand/50 p-4 shadow-md max-w-xs">
              <p className="font-serif text-base text-brand-dark">{content.founder_name}</p>
              <p className="text-[10px] tracking-widest text-brand-accent uppercase font-sans mt-0.5">{content.founder_designation}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
