"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";

import { useEffect, useState } from "react";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Star, Heart } from "lucide-react";
import Link from "next/link";

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
  category_id?: number;
  category_ids?: number[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const FALLBACK_PRODUCTS: Product[] = [
    {
      id: 1,
      name: "Glow Radiant Plus",
      slug: "glow-radiant-plus",
      short_description: "A botanically nourishing night cream that deeply hydrates, visibly brightens, and repairs the skin barrier.",
      price: 799.0,
      sale_price: 799.0,
      SKU: "QH-GLOW-RADPLUS-35",
      stock: 50,
      thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_plus_main.jpg",
      skin_type: "All Skin Types"
    },
    {
      id: 2,
      name: "Avocado Pro Nourish Night Cream",
      slug: "avocado-night-cream",
      short_description: "Feed your skin. Reveal its natural brightness. A botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep.",
      price: 799.0,
      sale_price: 799.0,
      SKU: "QH-HYD-AVONIGHT-35",
      stock: 30,
      thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
      skin_type: "Oily, combination, aging, dull, and normal skin types"
    }
  ];

  useEffect(() => {
    // Fetch categories
    fetch(getApiUrl("/api/v1/categories/"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.log("Failed to load categories:", err));

    // Fetch products
    fetch(getApiUrl("/api/v1/products/"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p: Product) => {
            if (p.slug === "spf-50-sunscreen" && (p.thumbnail?.includes("unsplash") || !p.thumbnail)) {
              return {
                ...p,
                thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/spf_50_sunscreen_main.jpg"
              };
            }
            if (p.slug === "vitamin-c-serum" && (p.thumbnail?.includes("unsplash") || !p.thumbnail)) {
              return {
                ...p,
                thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/vitamin_c_serum_main.jpg"
              };
            }
            if (p.slug === "hair-shine-serum" && (p.thumbnail?.includes("unsplash") || !p.thumbnail)) {
              return {
                ...p,
                thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_serum_main.jpg"
              };
            }
            return p;
          });
          setProducts(mapped);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to load products:", err);
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory || (p.category_ids && p.category_ids.includes(selectedCategory)))
    : products;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            ESTABLISHED SKIN RITUALS
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-dark">
            The Collection
          </h1>
          <div className="w-12 h-[1px] bg-brand-accent mx-auto"></div>
        </div>

        {/* Concern Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 border-b border-brand-sand/20 pb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`font-sans text-xs uppercase tracking-widest px-5 py-2.5 transition-all duration-300 font-semibold border ${
              selectedCategory === null
                ? "bg-brand-dark border-brand-dark text-brand-cream"
                : "border-brand-sand/50 text-brand-cocoa hover:border-brand-dark"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-sans text-xs uppercase tracking-widest px-5 py-2.5 transition-all duration-300 font-semibold border ${
                selectedCategory === cat.id
                  ? "bg-brand-dark border-brand-dark text-brand-cream"
                  : "border-brand-sand/50 text-brand-cocoa hover:border-brand-dark"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-brand-sand/20 aspect-square w-full"></div>
                <div className="h-4 bg-brand-sand/20 w-3/4"></div>
                <div className="h-4 bg-brand-sand/20 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-brand-dark/50 font-sans text-sm">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((prod) => {
              const hasDiscount = prod.sale_price !== null;
              const activePrice = hasDiscount ? prod.sale_price : prod.price;
              const discountPercent = hasDiscount
                ? Math.round(((prod.price - (prod.sale_price ?? 0)) / prod.price) * 100)
                : 0;

              return (
                <div
                  key={prod.id}
                  className="group relative flex flex-col bg-brand-cream border border-brand-sand/25 p-4 transition-all duration-300 hover:shadow-lg hover:border-brand-accent/30"
                >
                  {hasDiscount && (
                    <span className="absolute top-6 left-6 bg-brand-accent text-brand-cream text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-1 z-10">
                      SAVE {discountPercent}%
                    </span>
                  )}

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

                    <div className="flex items-center space-x-1 text-brand-accent pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill="currentColor" stroke="none" />
                      ))}
                      <span className="text-[9px] text-brand-dark/40 font-sans ml-1">(4.9)</span>
                    </div>

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
