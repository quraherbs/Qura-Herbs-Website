"use client";

import { useEffect, useState } from "react";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ShopByConcern from "../components/ShopByConcern";
import TrustedCustomers from "../components/TrustedCustomers";
import ResultsGallery from "../components/ResultsGallery";
import ReviewsSection from "../components/ReviewsSection";
import JournalSection from "../components/JournalSection";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

import { getApiUrl, getImageUrl } from "@/lib/api";

import { ShoppingBag, Eye, Heart, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  SKU: string;
  stock: number;
  thumbnail: string;
  skin_type: string;
}

export default function Home() {
  const { addToCart } = useCart();
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const FALLBACK_FEATURED: Product[] = [
    {
      id: 1,
      name: "Glow Radiant Night Cream",
      slug: "glow-radiant-night-cream",
      short_description: "Deeply restorative night cream for natural skin radiance and clarity.",
      price: 1399.0,
      sale_price: 1199.0,
      SKU: "QH-GLOW-NC-30",
      stock: 50,
      thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/Glow%20Radiant%20Night%20Cream/IMG_20260406_145624.jpg",
      skin_type: "All Skin Types"
    },
    {
      id: 2,
      name: "Avocado Pro Nourish Night Cream",
      slug: "avocado-night-cream",
      short_description: "Feed your skin. Reveal its natural brightness. A botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep.",
      price: 1299.0,
      sale_price: 1149.0,
      SKU: "QH-HYD-AVONIGHT-35",
      stock: 30,
      thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
      skin_type: "Oily, combination, aging, dull, and normal skin types"
    }
  ];

  useEffect(() => {
    // Fetch featured products for bestsellers
    fetch(getApiUrl("/api/v1/products/?featured=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBestsellers(data);
        } else {
          setBestsellers(FALLBACK_FEATURED);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to load bestsellers:", err);
        setBestsellers(FALLBACK_FEATURED);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark overflow-x-hidden w-full max-w-full">
      {/* Navigation Layout */}
      <AnnouncementBar />
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1 overflow-x-hidden w-full max-w-full">
        
        {/* 1. 1st Banner */}
        <HeroSection />

        {/* 2. 2nd Our Bestsellers */}
        <section id="bestsellers" className="py-24 px-4 md:px-8 bg-brand-cream border-t border-brand-sand/20">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-4">
              <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
                THE ICONIC SERIES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark">
                Our Bestsellers
              </h2>
              <p className="text-brand-cocoa/70 font-sans font-light text-sm">
                Bespoke skincare favorites chosen by our community for remarkable skin transformations.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="bg-brand-sand/20 aspect-square w-full"></div>
                    <div className="h-4 bg-brand-sand/20 w-3/4"></div>
                    <div className="h-4 bg-brand-sand/20 w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : bestsellers.length === 0 ? (
              <div className="text-center text-brand-dark/50 py-10 font-sans text-sm">
                No featured products found. Please seed the database.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestsellers.map((prod) => {
                  const hasDiscount = prod.sale_price !== null;
                  const activePrice = hasDiscount ? prod.sale_price : prod.price;
                  const discountPercent = hasDiscount 
                    ? Math.round(((prod.price - (prod.sale_price ?? 0)) / prod.price) * 100) 
                    : 0;

                  return (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="group relative flex flex-col bg-brand-cream border border-brand-sand/25 p-4 transition-all duration-300 hover:shadow-lg hover:border-brand-accent/30"
                    >
                      {/* Badge Overlay */}
                      {hasDiscount && (
                        <span className="absolute top-6 left-6 bg-brand-accent text-brand-cream text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-1 z-10">
                          SAVE {discountPercent}%
                        </span>
                      )}

                      {/* Image Thumbnail with zoom effect */}
                      <Link 
                        href={`/product/${prod.slug}`}
                        className="relative block aspect-square w-full overflow-hidden bg-brand-light border border-brand-sand/10"
                      >
                        <img
                          src={getImageUrl(prod.thumbnail)}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Hover Overlay triggers */}
                        <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center gap-4">
                          <span 
                            className="bg-brand-cream text-brand-dark hover:bg-brand-dark hover:text-brand-cream p-2.5 shadow-md transition-colors"
                            title="Quick View"
                          >
                            <Eye size={18} strokeWidth={1.5} />
                          </span>
                          <span 
                            className="bg-brand-cream text-brand-dark hover:bg-brand-dark hover:text-brand-cream p-2.5 shadow-md transition-colors"
                            title="Add to Wishlist"
                          >
                            <Heart size={18} strokeWidth={1.5} />
                          </span>
                        </div>
                      </Link>

                      {/* Product Content Details */}
                      <div className="flex-1 flex flex-col pt-6 space-y-2">
                        <span className="text-[10px] uppercase font-sans tracking-widest text-brand-accent font-semibold">
                          {prod.skin_type || "All Skin Types"}
                        </span>
                        
                        <Link 
                          href={`/product/${prod.slug}`}
                          className="font-serif text-base text-brand-dark hover:text-brand-accent font-medium leading-snug line-clamp-1 transition-colors"
                        >
                          {prod.name}
                        </Link>
                        
                        <p className="text-xs text-brand-cocoa/70 font-sans line-clamp-1">
                          {prod.short_description}
                        </p>

                        {/* Stars Review Indicator */}
                        <div className="flex items-center space-x-1 text-brand-accent pt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill="currentColor" stroke="none" />
                          ))}
                          <span className="text-[9px] text-brand-dark/40 font-sans ml-1">(4.9)</span>
                        </div>

                        {/* Price Details & CTA */}
                        <div className="flex justify-between items-center pt-3 border-t border-brand-sand/15 mt-auto">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-sm font-sans font-bold text-brand-dark">
                              ₹{activePrice}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-brand-dark/40 line-through">
                                ₹{prod.price}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => addToCart({
                              id: prod.id,
                              name: prod.name,
                              slug: prod.slug,
                              price: prod.price,
                              sale_price: prod.sale_price,
                              thumbnail: prod.thumbnail
                            }, 1)}
                            className="bg-brand-dark hover:bg-brand-accent text-brand-cream p-2 text-xs uppercase tracking-widest transition-colors duration-300 font-semibold flex items-center gap-1.5 focus:outline-none cursor-pointer"
                            title="Add to Cart"
                          >
                            <ShoppingBag size={14} />
                            <span className="hidden xl:inline text-[9px] tracking-widest">ADD</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 3. 3rd Shop by Concern */}
        <ShopByConcern />

        {/* Customer Trust Section */}
        <TrustedCustomers />

        {/* 4. 4th Botanical Routine Journeys */}
        <ResultsGallery />

        {/* 5. From the Journal */}
        <JournalSection />

        {/* 6. Customer Impressions */}
        <ReviewsSection />

      </main>

      {/* Cart Slider Overlay */}
      <CartDrawer />

      {/* 8. Last Footer */}
      <Footer />
    </div>
  );
}

