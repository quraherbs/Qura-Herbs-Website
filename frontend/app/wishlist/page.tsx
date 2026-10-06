"use client";

import { useEffect, useState } from "react";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "@/lib/api";
import { ShoppingBag, Star, Heart, Trash2 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  thumbnail: string;
  short_description: string;
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qura_wishlist");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse wishlist:", e);
        }
      }
    }
    return [];
  });

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("qura_wishlist", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            YOUR SELECTIONS
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-dark">
            Your Wishlist
          </h1>
          <div className="w-12 h-[1px] bg-brand-accent mx-auto"></div>
        </div>

        {/* Catalog Grid */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20 space-y-4 border border-brand-sand/15 bg-brand-light">
            <span className="font-serif text-lg text-brand-cocoa">Nothing here yet.</span>
            <p className="text-xs text-brand-dark/40 font-sans max-w-xs mx-auto">
              Save your favorite items here to build your personalized daily skincare routine.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-brand-dark hover:bg-brand-accent text-brand-cream font-sans text-xs uppercase tracking-widest px-8 py-3 transition-colors duration-300 font-semibold"
              >
                BROWSE PRODUCTS
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((prod) => {
              const hasDiscount = prod.sale_price !== null;
              const activePrice = hasDiscount ? prod.sale_price : prod.price;

              return (
                <div
                  key={prod.id}
                  className="group relative flex flex-col bg-brand-cream border border-brand-sand/25 p-4 transition-all duration-300 hover:shadow-lg hover:border-brand-accent/30"
                >
                  <button
                    onClick={() => removeFromWishlist(prod.id)}
                    className="absolute top-6 right-6 bg-white hover:bg-red-50 text-brand-dark/50 hover:text-red-600 p-2 shadow-md transition-colors z-10 border border-brand-sand/20"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={14} />
                  </button>

                  <Link
                    href={`/product/${prod.slug}`}
                    className="relative block aspect-square w-full overflow-hidden bg-brand-light border border-brand-sand/10"
                  >
                    <img
                      src={getImageUrl(prod.thumbnail)}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col pt-6 space-y-2">
                    <Link
                      href={`/product/${prod.slug}`}
                      className="font-serif text-base text-brand-dark hover:text-brand-accent font-medium leading-snug line-clamp-1 transition-colors"
                    >
                      {prod.name}
                    </Link>

                    <p className="text-xs text-brand-cocoa/70 font-sans line-clamp-1">
                      {prod.short_description}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-brand-sand/15 mt-auto">
                      <div className="flex items-baseline space-x-2 font-sans font-semibold">
                        <span>₹{activePrice}</span>
                      </div>

                      <button
                        onClick={() => {
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
                        }}
                        className="bg-brand-dark hover:bg-brand-accent text-brand-cream p-2 text-xs uppercase tracking-widest transition-colors duration-300 font-semibold flex items-center gap-1.5 focus:outline-none"
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
