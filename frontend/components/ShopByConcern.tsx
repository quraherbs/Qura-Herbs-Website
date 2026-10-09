"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl, getImageUrl } from "@/lib/api";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Star, Eye, Heart, Sparkles, ArrowRight } from "lucide-react";
import {
  CONCERN_CATEGORIES,
  getConcernProducts,
  ConcernDefinition,
  ConcernProduct
} from "@/lib/concerns";

export default function ShopByConcern() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<ConcernDefinition[]>(CONCERN_CATEGORIES);
  const [activeSlug, setActiveSlug] = useState<string>("oily-skin");
  const [apiProducts, setApiProducts] = useState<ConcernProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch categories from backend if available, fallback to CONCERN_CATEGORIES
    fetch(getApiUrl("/api/v1/categories/"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge images and descriptions from CONCERN_CATEGORIES for exact precision
          const merged = CONCERN_CATEGORIES.map((localCat) => {
            const remoteCat = data.find(
              (r: any) => r.slug === localCat.slug || r.name?.toLowerCase() === localCat.name.toLowerCase()
            );
            return {
              ...localCat,
              id: remoteCat?.id || localCat.id,
              description: remoteCat?.description || localCat.description,
              image: remoteCat?.image || localCat.image,
            };
          });
          setCategories(merged);
        }
      })
      .catch((err) => console.log("Failed to load categories:", err));

    // 2. Fetch live products from backend to enrich pricing/stock if available
    fetch(getApiUrl("/api/v1/products/"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApiProducts(data);
        }
      })
      .catch((err) => console.log("Failed to load products for concerns:", err));
  }, []);

  const activeConcern =
    categories.find((c) => c.slug === activeSlug) || CONCERN_CATEGORIES[0];
  const displayedProducts = getConcernProducts(activeSlug, apiProducts);

  return (
    <section id="concerns" className="bg-brand-light py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-brand-sand/20">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-cream border border-brand-sand/40 px-3.5 py-1 rounded-full">
            <Sparkles size={12} className="text-brand-accent" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-dark">
              TARGETED CARE
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark">
            Shop by Concern
          </h2>

          <p className="text-brand-cocoa/70 font-sans font-light text-sm leading-relaxed">
            Curated rituals designed to address specific skin and hair challenges with potent botanical actives.
          </p>
        </div>

        {/* Concern Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5">
          {categories.map((cat) => {
            const isActive = cat.slug === activeSlug;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveSlug(cat.slug)}
                className={`font-sans text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 font-semibold border cursor-pointer ${
                  isActive
                    ? "bg-brand-dark border-brand-dark text-brand-cream shadow-md"
                    : "bg-white border-brand-sand/40 text-brand-cocoa hover:border-brand-dark hover:text-brand-dark"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Active Concern Editorial Context Banner */}
        <div className="bg-brand-cream border border-brand-sand/30 p-6 md:p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="w-5 h-0.5 bg-brand-accent"></span>
              <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-brand-accent">
                Target Concern
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
              {activeConcern.name}
            </h3>
            <p className="text-xs sm:text-sm font-sans text-brand-cocoa/80 font-light leading-relaxed">
              {activeConcern.description}
            </p>
          </div>

          <Link
            href={`/category/${activeConcern.slug}`}
            className="inline-flex items-center space-x-2 text-xs uppercase font-sans font-bold tracking-widest text-brand-dark hover:text-brand-accent border-b border-brand-dark hover:border-brand-accent pb-1 transition-colors whitespace-nowrap"
          >
            <span>View Full Ritual</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Products Grid for Selected Concern */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className={`grid gap-6 md:gap-8 ${
                displayedProducts.length === 1
                  ? "grid-cols-1 max-w-sm sm:max-w-md mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 max-w-3xl lg:max-w-4xl mx-auto"
              }`}
            >
              {displayedProducts.map((prod) => {
                const hasDiscount = prod.sale_price !== null && prod.sale_price < prod.price;
                const activePrice = prod.sale_price !== null ? prod.sale_price : prod.price;
                const discountPercent = hasDiscount
                  ? Math.round(((prod.price - (prod.sale_price ?? 0)) / prod.price) * 100)
                  : 0;

                return (
                  <div
                    key={prod.slug}
                    className="group relative flex flex-col bg-white border border-brand-sand/25 p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:border-brand-accent/30 rounded-xl"
                  >
                    {hasDiscount && (
                      <span className="absolute top-7 left-7 bg-brand-accent text-brand-cream text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-1 z-10 rounded-xs shadow-xs">
                        SAVE {discountPercent}%
                      </span>
                    )}

                    {/* Product Image */}
                    <Link
                      href={`/product/${prod.slug}`}
                      className="relative block aspect-square w-full overflow-hidden bg-brand-cream border border-brand-sand/15 rounded-lg"
                    >
                      <img
                        src={getImageUrl(prod.thumbnail)}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <span
                          className="bg-brand-cream text-brand-dark hover:bg-brand-dark hover:text-brand-cream p-2 shadow-md transition-colors rounded-full"
                          title="View Product"
                        >
                          <Eye size={15} strokeWidth={1.5} />
                        </span>
                        <span
                          className="bg-brand-cream text-brand-dark hover:bg-brand-dark hover:text-brand-cream p-2 shadow-md transition-colors rounded-full"
                          title="Add to Wishlist"
                        >
                          <Heart size={15} strokeWidth={1.5} />
                        </span>
                      </div>
                    </Link>

                    {/* Product Content Details */}
                    <div className="flex-1 flex flex-col pt-5 space-y-2">
                      <span className="text-[10px] uppercase font-sans tracking-widest text-brand-accent font-semibold">
                        {prod.skin_type || activeConcern.name}
                      </span>

                      <Link
                        href={`/product/${prod.slug}`}
                        className="font-serif text-lg text-brand-dark hover:text-brand-accent font-medium leading-snug line-clamp-1 transition-colors"
                      >
                        {prod.name}
                      </Link>

                      <p className="text-xs text-brand-cocoa/70 font-sans line-clamp-2 leading-relaxed">
                        {prod.short_description}
                      </p>

                      {/* Stars Review Indicator */}
                      <div className="flex items-center space-x-1 text-brand-accent pt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} fill="currentColor" stroke="none" />
                        ))}
                        <span className="text-[10px] text-brand-dark/40 font-sans ml-1">(4.9)</span>
                      </div>

                      {/* Price Details & CTA */}
                      <div className="flex justify-between items-center pt-4 border-t border-brand-sand/15 mt-auto">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-base font-sans font-bold text-brand-dark">
                            ₹{activePrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-brand-dark/40 line-through">
                              ₹{prod.price}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            addToCart(
                              {
                                id: prod.id,
                                name: prod.name,
                                slug: prod.slug,
                                price: prod.price,
                                sale_price: prod.sale_price,
                                thumbnail: prod.thumbnail,
                              },
                              1
                            )
                          }
                          className="bg-brand-dark hover:bg-brand-accent text-brand-cream px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-300 font-semibold flex items-center gap-1.5 focus:outline-none cursor-pointer rounded-xs shadow-xs"
                          title="Add to Cart"
                        >
                          <ShoppingBag size={14} />
                          <span className="text-[10px] tracking-widest">ADD TO CART</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Visual Category Navigation Grid */}
        <div className="pt-8 border-t border-brand-sand/20 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-brand-cocoa/70">
              Explore All Categories
            </span>
            <Link
              href="/shop"
              className="text-xs font-sans text-brand-accent hover:underline uppercase tracking-wider font-semibold"
            >
              Browse Complete Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const isSelected = cat.slug === activeSlug;
              return (
                <div
                  key={cat.slug}
                  onClick={() => setActiveSlug(cat.slug)}
                  className={`group relative overflow-hidden bg-brand-cream border rounded-lg cursor-pointer aspect-[4/3] transition-all duration-300 ${
                    isSelected
                      ? "ring-2 ring-brand-accent border-brand-accent shadow-md scale-[1.02]"
                      : "border-brand-sand/30 hover:shadow-md hover:border-brand-dark/40"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${getImageUrl(cat.image)}')` }}
                  >
                    <div className="absolute inset-0 bg-brand-dark/30 transition-opacity duration-300 group-hover:bg-brand-dark/40"></div>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 z-10 text-brand-cream">
                    <h4 className="font-serif text-sm sm:text-base font-medium tracking-wide">
                      {cat.name}
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider text-brand-cream/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Select Concern
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
