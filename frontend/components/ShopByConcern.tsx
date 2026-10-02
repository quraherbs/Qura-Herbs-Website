"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function ShopByConcern() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to load categories:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-sans text-brand-dark/50">
        Loading Skin Concerns...
      </div>
    );
  }

  return (
    <section id="concerns" className="bg-brand-light py-24 px-4 md:px-8 border-t border-brand-sand/20">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            TARGETED CARE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark">
            Shop by Concern
          </h2>
          <p className="text-brand-cocoa/70 font-sans font-light text-sm">
            Curated rituals designed to address specific skin challenges with potent botanical actives.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link 
                href={`/category/${cat.slug}`}
                className="group block relative overflow-hidden bg-brand-cream border border-brand-sand/30 aspect-[4/3] w-full"
              >
                {/* Background Zooming Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                >
                  {/* Backdrop Tint */}
                  <div className="absolute inset-0 bg-brand-dark/20 transition-opacity duration-300 group-hover:bg-brand-dark/30"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10 text-brand-cream">
                  {/* Animated line indicator */}
                  <div className="w-10 h-0.5 bg-brand-accent mb-4 transition-all duration-300 group-hover:w-20"></div>
                  
                  <h3 className="font-serif text-2xl font-light tracking-wide mb-2">
                    {cat.name}
                  </h3>
                  
                  <p className="text-xs font-sans text-brand-cream/80 opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-16 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Inner Thin Border Accent */}
                <div className="absolute inset-3 border border-brand-cream/10 z-10 pointer-events-none group-hover:border-brand-cream/30 transition-colors"></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
