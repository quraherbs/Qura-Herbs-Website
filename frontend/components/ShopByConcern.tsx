"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl, getImageUrl } from "@/lib/api";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Star, Eye, X, Sparkles, ArrowRight } from "lucide-react";
import {
  CONCERN_CATEGORIES,
  getConcernProducts,
  ConcernDefinition,
  ConcernProduct
} from "@/lib/concerns";

export default function ShopByConcern() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<ConcernDefinition[]>(CONCERN_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<ConcernDefinition | null>(null);
  const [apiProducts, setApiProducts] = useState<ConcernProduct[]>([]);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch categories from backend if available, fallback to CONCERN_CATEGORIES
    fetch(getApiUrl("/api/v1/categories/"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = CONCERN_CATEGORIES.map((localCat) => {
            const remoteCat = data.find(
              (r: any) =>
                r.slug === localCat.slug ||
                r.name?.toLowerCase() === localCat.name.toLowerCase()
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

  // Keyboard Escape listener to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCategory(null);
      }
    };
    if (activeCategory) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeCategory]);

  const modalProducts = activeCategory
    ? getConcernProducts(activeCategory.slug, apiProducts)
    : [];

  const handleAddToCart = (prod: ConcernProduct) => {
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
    );
    setAddedSlug(prod.slug);
    setTimeout(() => setAddedSlug(null), 2000);
  };

  return (
    <section id="concerns" className="bg-brand-light py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-brand-sand/20">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-brand-cream border border-brand-sand/40 px-3.5 py-1 rounded-full">
            <Sparkles size={12} className="text-brand-accent" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-dark">
              TARGETED BOTANICAL CARE
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark">
            Shop by Concern
          </h2>

          <p className="text-brand-cocoa/75 font-sans font-light text-sm sm:text-base leading-relaxed">
            Select your concern below to explore dermatologist-inspired Ayurvedic rituals crafted for your skin and hair needs.
          </p>
        </div>

        {/* Explore All Categories Grid - Main Visible Interface */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="group relative overflow-hidden bg-brand-cream border border-brand-sand/30 rounded-xl cursor-pointer aspect-[3/4] transition-all duration-300 hover:shadow-xl hover:border-brand-accent/50 text-left focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                {/* Background Category Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${getImageUrl(cat.image)}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/25 to-transparent transition-opacity duration-300 group-hover:from-brand-dark/95"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 z-10 text-brand-cream">
                  <span className="text-[9px] uppercase tracking-widest text-brand-accent font-semibold mb-1 opacity-90">
                    Target Concern
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-medium tracking-wide">
                    {cat.name}
                  </h3>
                  <span className="mt-2 text-[10px] uppercase tracking-wider text-brand-cream/80 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View Products →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Polish Modal / Popup for Selected Category */}
      <AnimatePresence>
        {activeCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveCategory(null)}
              className="absolute inset-0 bg-brand-dark/65 backdrop-blur-sm cursor-pointer"
              aria-label="Close modal overlay"
            />

            {/* Modal Dialog Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl bg-brand-cream border border-brand-sand/40 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 bg-white border-b border-brand-sand/25 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-0.5 bg-brand-accent"></span>
                    <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-brand-accent">
                      Concern Ritual Products
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
                    {activeCategory.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-brand-cocoa/80 font-light leading-relaxed max-w-xl">
                    {activeCategory.description}
                  </p>
                </div>

                {/* Close 'X' Button */}
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className="p-2 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-sand/20 rounded-full transition-colors cursor-pointer shrink-0"
                  aria-label="Close popup"
                  title="Close popup (Esc)"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body: Products List */}
              <div className="p-5 sm:p-6 md:p-8 overflow-y-auto space-y-6">
                <div
                  className={`grid gap-5 md:gap-6 ${
                    modalProducts.length === 1
                      ? "grid-cols-1 max-w-md mx-auto"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {modalProducts.map((prod) => {
                    const hasDiscount =
                      prod.sale_price !== null && prod.sale_price < prod.price;
                    const activePrice =
                      prod.sale_price !== null ? prod.sale_price : prod.price;
                    const discountPercent = hasDiscount
                      ? Math.round(
                          ((prod.price - (prod.sale_price ?? 0)) / prod.price) * 100
                        )
                      : 0;

                    return (
                      <div
                        key={prod.slug}
                        className="group flex flex-col bg-white border border-brand-sand/30 rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:border-brand-accent/40"
                      >
                        {/* Image Container with Badge */}
                        <div className="relative aspect-square w-full overflow-hidden bg-brand-light rounded-lg border border-brand-sand/20 mb-4">
                          {hasDiscount && (
                            <span className="absolute top-2.5 left-2.5 bg-brand-accent text-brand-cream text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-0.5 z-10 rounded-xs shadow-xs">
                              SAVE {discountPercent}%
                            </span>
                          )}

                          <img
                            src={getImageUrl(prod.thumbnail)}
                            alt={prod.name}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col space-y-2">
                          <span className="text-[10px] uppercase font-sans tracking-widest text-brand-accent font-semibold">
                            {prod.skin_type || activeCategory.name}
                          </span>

                          <h4 className="font-serif text-base sm:text-lg text-brand-dark font-medium leading-snug">
                            {prod.name}
                          </h4>

                          <p className="text-xs text-brand-cocoa/70 font-sans line-clamp-2 leading-relaxed">
                            {prod.short_description}
                          </p>

                          {/* Star rating */}
                          <div className="flex items-center space-x-1 text-brand-accent pt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={11}
                                fill="currentColor"
                                stroke="none"
                              />
                            ))}
                            <span className="text-[10px] text-brand-dark/40 font-sans ml-1">
                              (4.9)
                            </span>
                          </div>

                          {/* Price */}
                          <div className="pt-2 flex items-baseline space-x-2">
                            <span className="text-base sm:text-lg font-sans font-bold text-brand-dark">
                              ₹{activePrice}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-brand-dark/40 line-through">
                                ₹{prod.price}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: Add to Cart & View Details */}
                          <div className="pt-4 mt-auto grid grid-cols-2 gap-2.5 border-t border-brand-sand/20">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(prod)}
                              className="bg-brand-dark hover:bg-brand-accent text-brand-cream px-3 py-2.5 text-[11px] uppercase tracking-wider transition-colors duration-200 font-semibold flex items-center justify-center gap-1.5 rounded-md cursor-pointer shadow-xs"
                              title="Add to Cart"
                            >
                              <ShoppingBag size={13} />
                              <span>
                                {addedSlug === prod.slug ? "Added!" : "Add to Cart"}
                              </span>
                            </button>

                            <Link
                              href={`/product/${prod.slug}`}
                              className="border border-brand-dark/80 hover:bg-brand-dark hover:text-brand-cream text-brand-dark px-3 py-2.5 text-[11px] uppercase tracking-wider transition-colors duration-200 font-semibold flex items-center justify-center gap-1.5 rounded-md text-center"
                              title="View Product Details"
                            >
                              <Eye size={13} />
                              <span>View Details</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer with Clear Cancel / Close Button */}
              <div className="px-6 py-4 bg-white border-t border-brand-sand/25 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href={`/category/${activeCategory.slug}`}
                  className="text-xs uppercase font-sans font-bold tracking-wider text-brand-dark hover:text-brand-accent inline-flex items-center gap-1 transition-colors"
                >
                  <span>Explore entire {activeCategory.name} ritual</span>
                  <ArrowRight size={13} />
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className="w-full sm:w-auto px-5 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-brand-cocoa hover:text-brand-dark bg-brand-cream hover:bg-brand-sand/30 border border-brand-sand/50 rounded-md transition-colors cursor-pointer text-center"
                >
                  Cancel / Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
