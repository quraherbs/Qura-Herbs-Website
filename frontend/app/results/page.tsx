"use client";

import { useEffect, useState } from "react";
import { getApiUrl, getImageUrl } from "@/lib/api";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/ananya_s_before.jpg",
      after_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/ananya_s_after.jpg",
      description: "My dark spots faded dramatically and my overall complexion got an intense radiant boost. The saffron formulation feels so luxury."
    },
    {
      id: 2,
      customer_name: "Rohan M.",
      customer_location: "Bengaluru, KA",
      skin_concern: "Acne Breakouts & Redness",
      duration: "2 Weeks",
      product_used: "Tea Tree Pureveil Cleanser",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/rohan_m_before.jpg",
      after_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/rohan_m_after.jpg",
      description: "My active breakouts cleared up within days without drying out my skin. The gel texture is so soothing on irritated pores."
    },
    {
      id: 3,
      customer_name: "Meera K.",
      customer_location: "Chennai, TN",
      skin_concern: "Dry Flaky Patches",
      duration: "3 Weeks",
      product_used: "Avocado Night Cream",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/meera_k_before.jpg",
      after_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/meera_k_after.jpg",
      description: "Absolutely resolved my winter dry flakes. I wake up with very soft, bouncy, and hydrated skin every single morning."
    },
    {
      id: 4,
      customer_name: "Harini R.",
      customer_location: "Madurai, TN",
      skin_concern: "Blemishes & Post-Acne Marks",
      duration: "4 Weeks",
      product_used: "Glow Radiant Plus Night Cream",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_4_before.jpg",
      after_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_4_after.jpg",
      description: "Noticeable reduction in acne marks and visible redness. My cheek area looks remarkably clearer and healthier."
    },
    {
      id: 5,
      customer_name: "Divya M.",
      customer_location: "Bengaluru, KA",
      skin_concern: "Under-Eye Dark Circles & Dullness",
      duration: "3 Weeks",
      product_used: "Avocado Pro Nourish Night Cream",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_5_before.jpg",
      after_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_5_after.jpg",
      description: "The deep hydration helped soothe my under-eye fatigue and brought a natural, refreshed brightness to my entire complexion."
    },
    {
      id: 6,
      customer_name: "Kavya P.",
      customer_location: "Kochi, KL",
      skin_concern: "Uneven Texture & Rough Skin",
      duration: "4 Weeks",
      product_used: "Glow Radiant Plus Night Cream",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_6_before.jpg",
      after_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_6_after.jpg",
      description: "My skin texture smoothed out significantly with daily nighttime use, leaving behind a smooth, radiant glow."
    },
    {
      id: 7,
      customer_name: "Karthik V.",
      customer_location: "Coimbatore, TN",
      skin_concern: "Active Breakouts & Irritation",
      duration: "2 Weeks",
      product_used: "Avocado Pro Nourish Night Cream",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_7_before.jpg",
      after_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_7_after.jpg",
      description: "Calmed down the stubborn bumps on my cheek within two weeks without any greasy feel or dryness."
    }
  ]);

  useEffect(() => {
    fetch(getApiUrl("/api/v1/content/real-results?active_only=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: ResultCard) => {
            const isAnanya =
              item.id === 1 ||
              item.customer_name?.toLowerCase().includes("ananya");
            const isRohan =
              item.id === 2 ||
              item.customer_name?.toLowerCase().includes("rohan");
            const isMeera =
              item.id === 3 ||
              item.customer_name?.toLowerCase().includes("meera");
            const isCustomer4 = item.id === 4;
            const isCustomer5 = item.id === 5;
            const isCustomer6 = item.id === 6;
            const isCustomer7 = item.id === 7;

            return {
              ...item,
              customer_name: isAnanya
                ? "Ananya S."
                : isRohan
                ? "Rohan M."
                : isMeera
                ? "Meera K."
                : isCustomer4
                ? "Harini R."
                : isCustomer5
                ? "Divya M."
                : isCustomer6
                ? "Kavya P."
                : isCustomer7
                ? "Karthik V."
                : (item.customer_name && item.customer_name !== "Verified Customer")
                ? item.customer_name
                : "Customer Story",
              customer_location: isCustomer4
                ? "Madurai, TN"
                : isCustomer5
                ? "Bengaluru, KA"
                : isCustomer6
                ? "Kochi, KL"
                : isCustomer7
                ? "Coimbatore, TN"
                : item.customer_location,
              before_image: isAnanya
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/ananya_s_before.jpg"
                : isRohan
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/rohan_m_before.jpg"
                : isMeera
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/meera_k_before.jpg"
                : isCustomer4
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_4_before.jpg"
                : isCustomer5
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_5_before.jpg"
                : isCustomer6
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_6_before.jpg"
                : isCustomer7
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_7_before.jpg"
                : item.before_image,
              after_image: isAnanya
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/ananya_s_after.jpg"
                : isRohan
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/rohan_m_after.jpg"
                : isMeera
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/meera_k_after.jpg"
                : isCustomer4
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_4_after.jpg"
                : isCustomer5
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_5_after.jpg"
                : isCustomer6
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_6_after.jpg"
                : isCustomer7
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/customer_7_after.jpg"
                : item.after_image,
            };
          });
          setTransformations((prev) => {
            const mappedIds = new Set(mapped.map((m: ResultCard) => m.id));
            const remaining = prev.filter((p) => !mappedIds.has(p.id));
            return [...mapped, ...remaining].sort((a, b) => a.id - b.id);
          });
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
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${getImageUrl(item.before_image || "/uploads/product_placeholder.jpg")}')` }}></div>
                </div>
                <div className="relative border border-brand-sand/20 overflow-hidden bg-brand-sand/10 flex flex-col items-center justify-center rounded-lg">
                  <span className="absolute top-2 left-2 bg-brand-accent text-brand-cream text-[9px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 z-10 rounded">
                    After
                  </span>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${getImageUrl(item.after_image || "/uploads/product_placeholder.jpg")}')` }}></div>
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

      <Footer />
      <CartDrawer />
    </div>
  );
}

