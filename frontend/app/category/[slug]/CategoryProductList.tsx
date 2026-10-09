"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";

import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";
import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";

import { CONCERN_CATEGORIES, getConcernProducts, ConcernDefinition, ConcernProduct } from "@/lib/concerns";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  thumbnail: string;
  skin_type: string;
}

export default function CategoryProductList({ slug }: { slug: string }) {
  const { addToCart } = useCart();
  const normalizedSlug = slug.toLowerCase().trim();
  const localConcern = CONCERN_CATEGORIES.find((c) => c.slug === normalizedSlug);

  const [category, setCategory] = useState<Category | null>(localConcern || null);
  const [products, setProducts] = useState<Product[]>(getConcernProducts(normalizedSlug) as Product[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Fetch category from API if available to enrich metadata
    fetch(getApiUrl(`/api/v1/categories/slug/${normalizedSlug}`))
      .then((res) => {
        if (!res.ok) throw new Error("Category not found in API");
        return res.json();
      })
      .then((catData: Category) => {
        setCategory((prev) => ({
          ...catData,
          image: localConcern?.image || catData.image,
          description: localConcern?.description || catData.description,
        }));
      })
      .catch((err) => {
        if (!localConcern) {
          setError(true);
        }
      });

    // 2. Fetch live products from backend to enrich pricing/stock
    fetch(getApiUrl(`/api/v1/products/`))
      .then((res) => res.json())
      .then((apiProds) => {
        if (Array.isArray(apiProds) && apiProds.length > 0) {
          const mapped = getConcernProducts(normalizedSlug, apiProds);
          if (mapped.length > 0) {
            setProducts(mapped as Product[]);
          }
        }
      })
      .catch((err) => console.log("Failed to enrich category products:", err));
  }, [normalizedSlug, localConcern]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-sans text-brand-dark/50 animate-pulse">
        Loading Concern Rituals...
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="py-20 text-center text-brand-dark/50 font-sans text-sm">
        Concern category not found.{" "}
        <Link href="/shop" className="underline text-brand-accent">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Category banner/editorial header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-light border border-brand-sand/20 p-8 md:p-12">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            TARGET CONCERN
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-dark">
            {category.name}
          </h1>
          <p className="text-brand-cocoa/80 text-sm md:text-base font-light font-sans max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>
        {category.image && (
          <div className="lg:col-span-4 h-48 relative overflow-hidden bg-brand-sand/10 border border-brand-sand/20">
            <img 
              src={getImageUrl(category.image)} 
              alt={category.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-brand-dark/50 font-sans text-sm border border-brand-sand/10 bg-brand-cream">
          No products currently available for this concern ritual. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((prod) => {
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
    </div>
  );
}
