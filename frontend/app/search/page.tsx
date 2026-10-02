"use client";

import { useEffect, useState } from "react";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import { useCart } from "../../context/CartContext";
import { Search, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";

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

export default function SearchPage() {
  const { addToCart } = useCart();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(() => {
      fetch(`http://localhost:8000/api/v1/products/?search=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setResults(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setLoading(false);
        });
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const displayResults = query.trim() ? results : [];

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            RITUAL DIRECTORY
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-dark">
            Search Our Catalog
          </h1>
          <div className="w-12 h-[1px] bg-brand-accent mx-auto"></div>
        </div>

        {/* Input box */}
        <div className="max-w-2xl mx-auto relative border border-brand-sand/50 bg-white">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-dark/40">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, concern or ingredient..."
            className="w-full pl-12 pr-4 py-4 bg-transparent text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none rounded-none font-sans"
            autoFocus
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-sm font-sans text-brand-dark/50 animate-pulse">
            Searching skin catalog...
          </div>
        ) : query && displayResults.length === 0 ? (
          <div className="text-center py-20 text-brand-dark/50 font-sans text-sm">
            No matching products found. Try looking up &ldquo;Glow&rdquo;, &ldquo;Cream&rdquo; or &ldquo;Cleanser&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayResults.map((prod) => {
              const hasDiscount = prod.sale_price !== null;
              const activePrice = hasDiscount ? prod.sale_price : prod.price;

              return (
                <div
                  key={prod.id}
                  className="group relative flex flex-col bg-brand-cream border border-brand-sand/25 p-4 transition-all duration-300 hover:shadow-lg hover:border-brand-accent/30"
                >
                  <Link
                    href={`/product/${prod.slug}`}
                    className="relative block aspect-square w-full overflow-hidden bg-brand-light border border-brand-sand/10"
                  >
                    <img
                      src={prod.thumbnail}
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
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-brand-sand/15 mt-auto">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-sans font-bold text-brand-dark">
                          ₹{activePrice}
                        </span>
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
