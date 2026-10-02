"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import { Star } from "lucide-react";

interface ResultCard {
  id: number;
  customer_name?: string;
  customer_location?: string;
  skin_concern?: string;
  duration?: string;
  product_used?: string;
  before_image?: string;
  after_image?: string;
  description: string;
}

export default function ResultsPage() {
  const [transformations, setTransformations] = useState<ResultCard[]>([
    {
      id: 1,
      customer_name: "Ananya S.",
      customer_location: "Coimbatore, TN",
      skin_concern: "Hyperpigmentation & Dullness",
      duration: "4 Weeks",
      product_used: "Glow Radiant Plus",
      before_image: "/uploads/product_placeholder.jpg",
      after_image: "/uploads/product_placeholder.jpg",
      description: "My dark spots faded dramatically and my overall complexion got an intense radiant boost. The saffron formulation feels so luxury."
    },
    {
      id: 2,
      customer_name: "Rohan M.",
      customer_location: "Bengaluru, KA",
      skin_concern: "Acne Breakouts & Redness",
      duration: "2 Weeks",
      product_used: "Tea Tree Pureveil Cleanser",
      before_image: "/uploads/product_placeholder.jpg",
      after_image: "/uploads/product_placeholder.jpg",
      description: "My active breakouts cleared up within days without drying out my skin. The gel texture is so soothing on irritated pores."
    },
    {
      id: 3,
      customer_name: "Meera K.",
      customer_location: "Chennai, TN",
      skin_concern: "Dry Flaky Patches",
      duration: "3 Weeks",
      product_used: "Avocado Night Cream",
      before_image: "/uploads/product_placeholder.jpg",
      after_image: "/uploads/product_placeholder.jpg",
      description: "Absolutely resolved my winter dry flakes. I wake up with very soft, bouncy, and hydrated skin every single morning."
    }
  ]);

  useEffect(() => {
    fetch(getApiUrl("/api/v1/content/real-results?active_only=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTransformations(data);
        }
      })
      .catch((err) => console.log("Failed to load real results:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            REAL SKIN JOURNALS
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-dark">
            Real Results
          </h1>
          <div className="w-12 h-[1px] bg-brand-accent mx-auto"></div>
          <p className="text-brand-cocoa/70 font-sans font-light text-sm max-w-lg mx-auto">
            Honest transformations from our community. Actual results achieved through daily botanical skincare rituals.
          </p>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((item) => (
            <div key={item.id} className="border border-brand-sand/35 bg-brand-light p-6 space-y-6 flex flex-col rounded-xl shadow-sm">
              {/* Double Before/After Split */}
              <div className="grid grid-cols-2 gap-2 h-52">
                <div className="relative border border-brand-sand/20 overflow-hidden bg-brand-sand/10 flex flex-col items-center justify-center rounded-lg">
                  <span className="absolute top-2 left-2 bg-brand-dark/65 text-brand-cream text-[9px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 z-10 rounded">
                    Before
                  </span>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${item.before_image || "/uploads/product_placeholder.jpg"}')` }}></div>
                </div>
                <div className="relative border border-brand-sand/20 overflow-hidden bg-brand-sand/10 flex flex-col items-center justify-center rounded-lg">
                  <span className="absolute top-2 left-2 bg-brand-accent text-brand-cream text-[9px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 z-10 rounded">
                    After
                  </span>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${item.after_image || "/uploads/product_placeholder.jpg"}')` }}></div>
                </div>
              </div>

              {/* Transformation metadata */}
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-lg text-brand-dark">{item.customer_name || "Verified Customer"}</h3>
                    {item.customer_location && (
                      <span className="text-[10px] text-brand-cocoa/60 font-sans block">{item.customer_location}</span>
                    )}
                  </div>
                  {item.duration && (
                    <span className="text-[10px] uppercase font-sans tracking-widest text-brand-accent font-semibold bg-white border border-[#EFE8D8] px-2 py-0.5 rounded-full">
                      {item.duration}
                    </span>
                  )}
                </div>
                <div className="text-xs text-brand-cocoa font-sans font-medium flex flex-wrap gap-2 pt-1">
                  {item.skin_concern && (
                    <span className="bg-brand-sand/20 px-2.5 py-1 text-[10px] rounded">Concern: {item.skin_concern}</span>
                  )}
                  {item.product_used && (
                    <span className="bg-brand-sand/20 px-2.5 py-1 text-[10px] rounded">Ritual: {item.product_used}</span>
                  )}
                </div>
                <p className="text-xs text-brand-cocoa/80 font-sans font-light leading-relaxed pt-2 italic">
                  &ldquo;{item.description}&rdquo;
                </p>
              </div>

              {/* Review Stars */}
              <div className="flex text-brand-accent pt-4 border-t border-brand-sand/15">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={11} fill="currentColor" stroke="none" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <CartDrawer />
    </div>
  );
}

