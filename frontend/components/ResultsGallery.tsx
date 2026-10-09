"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2, Eye } from "lucide-react";

interface ResultItem {
  id: number;
  image: string;
  before_image?: string;
  final_image?: string;
  progress_images?: string[];
  title: string;
  description?: string;
  product_used?: string;
  customer_name?: string;
  duration?: string;
  skin_type?: string;
  skin_concern?: string;
  morning_routine?: string;
  night_routine?: string;
  active: boolean;
}

export default function ResultsGallery() {
  const [items, setItems] = useState<ResultItem[]>([
    {
      id: 1,
      image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_journey.jpg",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_before.jpg",
      final_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_after.jpg",
      title: "Overnight Hydration & Barrier Repair",
      description: "Noticeable improvement in skin texture and moisture retention after incorporating Avocado Night Cream into evening routine.",
      product_used: "Avocado Pro Nourish Night Cream",
      customer_name: "Verified Routine Progress",
      duration: "4 Weeks Daily Use",
      active: true
    },
    {
      id: 2,
      image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_journey.jpg",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_before.jpg",
      final_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_after.jpg",
      title: "Shine and Smooth Hair",
      description: "Apply 3-4 drops of Anti-Frizz Serum to your hair and distribute it evenly through the lengths to achieve smooth, shiny hair.",
      product_used: "Anti-Frizz Hair Shine Serum",
      customer_name: "Routine Journey Progress",
      duration: "3 Weeks Ritual",
      active: true
    },
    {
      id: 3,
      image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_journey.jpg",
      before_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_before.jpg",
      final_image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_after.jpg",
      title: "Soothed Skin Barrier & Calming Ritual",
      description: "Helped soothe redness and maintain a comfortable, hydrated complexion without heaviness.",
      product_used: "Glow Radiant Plus Night Cream",
      customer_name: "Daily Skincare Journey",
      duration: "2 Weeks Daily Use",
      active: true
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<ResultItem | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    fetch(getApiUrl("/api/v1/content/botanical-journeys?active_only=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d: any) => {
            const isHairRoutine =
              d.id === 2 ||
              d.title?.toLowerCase().includes("shine") ||
              d.title?.toLowerCase().includes("radiance") ||
              d.title?.toLowerCase().includes("hair");
            const isOvernightRoutine =
              d.id === 1 || d.title?.toLowerCase().includes("overnight");
            const isGlowRoutine =
              d.id === 3 ||
              d.title?.toLowerCase().includes("soothed") ||
              d.title?.toLowerCase().includes("calming") ||
              d.products_used?.toLowerCase().includes("neem") ||
              d.product_used?.toLowerCase().includes("neem") ||
              d.products_used?.toLowerCase().includes("glow radiant") ||
              d.product_used?.toLowerCase().includes("glow radiant");

            return {
              ...d,
              title: isHairRoutine ? "Shine and Smooth Hair" : d.title,
              description: isHairRoutine
                ? "Apply 3-4 drops of Anti-Frizz Serum to your hair and distribute it evenly through the lengths to achieve smooth, shiny hair."
                : d.routine_description || d.description,
              product_used: isHairRoutine
                ? "Anti-Frizz Hair Shine Serum"
                : isGlowRoutine
                ? "Glow Radiant Plus Night Cream"
                : d.products_used || d.product_used,
              image: isOvernightRoutine
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_journey.jpg"
                : isHairRoutine
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_journey.jpg"
                : isGlowRoutine
                ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_journey.jpg"
                : d.final_image || d.image || "/uploads/product_placeholder.jpg",
              before_image:
                d.before_image ||
                (isOvernightRoutine
                  ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_before.jpg"
                  : isHairRoutine
                  ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_before.jpg"
                  : isGlowRoutine
                  ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_before.jpg"
                  : undefined),
              final_image:
                d.final_image ||
                (isOvernightRoutine
                  ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_after.jpg"
                  : isHairRoutine
                  ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_after.jpg"
                  : isGlowRoutine
                  ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_after.jpg"
                  : undefined),
            };
          });
          setItems(mapped);
        } else {
          fetch(getApiUrl("/api/v1/content/results-gallery?active_only=true"))
            .then((r) => r.json())
            .then((resData) => {
              if (Array.isArray(resData) && resData.length > 0) {
                const mapped = resData.map((d: any) => {
                  const isHairRoutine =
                    d.id === 2 ||
                    d.title?.toLowerCase().includes("shine") ||
                    d.title?.toLowerCase().includes("radiance") ||
                    d.title?.toLowerCase().includes("hair");
                  const isOvernightRoutine =
                    d.id === 1 || d.title?.toLowerCase().includes("overnight");
                  const isGlowRoutine =
                    d.id === 3 ||
                    d.title?.toLowerCase().includes("soothed") ||
                    d.title?.toLowerCase().includes("calming") ||
                    d.products_used?.toLowerCase().includes("neem") ||
                    d.product_used?.toLowerCase().includes("neem") ||
                    d.products_used?.toLowerCase().includes("glow radiant") ||
                    d.product_used?.toLowerCase().includes("glow radiant");

                  return {
                    ...d,
                    title: isHairRoutine ? "Shine and Smooth Hair" : d.title,
                    description: isHairRoutine
                      ? "Apply 3-4 drops of Anti-Frizz Serum to your hair and distribute it evenly through the lengths to achieve smooth, shiny hair."
                      : d.routine_description || d.description,
                    product_used: isHairRoutine
                      ? "Anti-Frizz Hair Shine Serum"
                      : isGlowRoutine
                      ? "Glow Radiant Plus Night Cream"
                      : d.products_used || d.product_used,
                    image: isOvernightRoutine
                      ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_journey.jpg"
                      : isHairRoutine
                      ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_journey.jpg"
                      : isGlowRoutine
                      ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_journey.jpg"
                      : d.image || "/uploads/product_placeholder.jpg",
                    before_image:
                      d.before_image ||
                      (isOvernightRoutine
                        ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_before.jpg"
                        : isHairRoutine
                        ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_before.jpg"
                        : isGlowRoutine
                        ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_before.jpg"
                        : undefined),
                    final_image:
                      d.final_image ||
                      (isOvernightRoutine
                        ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/overnight_hydration_after.jpg"
                        : isHairRoutine
                        ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/hair_shine_smooth_after.jpg"
                        : isGlowRoutine
                        ? "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/glow_radiant_after.jpg"
                        : undefined),
                  };
                });
                setItems(mapped);
              }
            });
        }
      })
      .catch((err) => console.log("Failed to load botanical journeys:", err));
  }, []);

  const handleNext = () => {
    setScrollIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setScrollIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] border-t border-[#EFE8D8]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#F7F3E9] border border-[#EFE8D8] px-3.5 py-1 rounded-full">
            <Sparkles size={12} className="text-[#C5A059]" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#3D261D]">
              REAL SKIN • REAL RESULTS
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#2C1A14]">
            Botanical Routine Journeys
          </h2>

          <p className="text-[#3D261D]/70 font-sans font-light text-sm leading-relaxed">
            See how Qura Herbs botanical formulations fit seamlessly into real everyday skincare rituals.
          </p>
        </div>

        {/* Floating Interactive Drag/Swipe Gallery */}
        <div className="relative">
          
          {/* Navigation Controls */}
          {items.length > 3 && (
            <div className="hidden sm:flex justify-between items-center absolute -top-12 right-0 space-x-2 z-20">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full border border-[#EFE8D8] bg-white hover:bg-[#2C1A14] hover:text-[#FDFBF7] text-[#2C1A14] flex items-center justify-center transition-colors shadow-sm"
                title="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full border border-[#EFE8D8] bg-white hover:bg-[#2C1A14] hover:text-[#FDFBF7] text-[#2C1A14] flex items-center justify-center transition-colors shadow-sm"
                title="Scroll Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {items.map((item, idx) => {
              // Subtle vertical stagger for floating card composition
              const isStaggered = idx % 2 === 1;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.15 }}
                  onClick={() => setSelectedItem(item)}
                  className={`group cursor-pointer bg-white border border-[#EFE8D8] rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between ${
                    isStaggered ? "lg:translate-y-4" : ""
                  }`}
                >
                  <div className="space-y-4">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#F7F3E9] border border-[#EFE8D8]">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {item.before_image && item.final_image && (
                        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10 pointer-events-none">
                          <span className="bg-[#2C1A14]/85 backdrop-blur-xs text-[#FDFBF7] text-[9px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
                            Before & After
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#2C1A14]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-[#FDFBF7] text-[#2C1A14] px-4 py-2 text-[10px] uppercase font-bold tracking-widest flex items-center space-x-1.5 shadow-md rounded-full">
                          <Eye size={12} />
                          <span>Inspect Journey</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[#C5A059] font-sans font-bold uppercase tracking-wider">
                        <span>{item.duration || "Daily Routine"}</span>
                        {item.customer_name && <span>{item.customer_name}</span>}
                      </div>

                      <h3 className="font-serif text-lg text-[#2C1A14] font-medium leading-snug group-hover:text-[#C5A059] transition-colors">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-[#3D261D]/75 font-sans font-light line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Product Used Tag */}
                  {item.product_used && (
                    <div className="pt-4 mt-4 border-t border-[#EFE8D8] flex items-center space-x-1.5 text-[11px] font-sans text-[#3D261D]/80">
                      <CheckCircle2 size={13} className="text-[#C5A059]" />
                      <span className="truncate">Formulation: <strong>{item.product_used}</strong></span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-[#2C1A14]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-white border border-[#EFE8D8] rounded-xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-[#3D261D]/60 hover:text-[#2C1A14] p-1 z-10"
              >
                <X size={22} />
              </button>

              <div className="space-y-4">
                {selectedItem.before_image && selectedItem.final_image ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                    <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-[#F7F3E9] border border-[#EFE8D8] rounded-lg overflow-hidden shadow-inner">
                      <img
                        src={getImageUrl(selectedItem.before_image)}
                        alt={`${selectedItem.title} - Before`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#2C1A14]/85 text-[#FDFBF7] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm backdrop-blur-xs">
                        Before
                      </span>
                    </div>
                    <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-[#F7F3E9] border border-[#EFE8D8] rounded-lg overflow-hidden shadow-inner">
                      <img
                        src={getImageUrl(selectedItem.final_image)}
                        alt={`${selectedItem.title} - After`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#C5A059] text-[#2C1A14] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
                        After
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[16/10] bg-[#F7F3E9] border border-[#EFE8D8] rounded-lg overflow-hidden">
                    <img src={getImageUrl(selectedItem.image)} alt={selectedItem.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#C5A059] font-sans font-bold uppercase tracking-wider">
                    <span>{selectedItem.duration || "Verified Routine Journey"}</span>
                    {selectedItem.customer_name && <span>{selectedItem.customer_name}</span>}
                  </div>

                  <h3 className="font-serif text-2xl text-[#2C1A14] font-medium">{selectedItem.title}</h3>

                  {selectedItem.description && (
                    <p className="text-sm text-[#3D261D]/80 font-sans font-light leading-relaxed">
                      {selectedItem.description}
                    </p>
                  )}
                </div>

                {selectedItem.product_used && (
                  <div className="bg-[#F7F3E9] p-3.5 border border-[#EFE8D8] rounded-md text-xs font-sans text-[#2C1A14] flex items-center justify-between">
                    <span>Product Used in Routine: <strong>{selectedItem.product_used}</strong></span>
                    <span className="text-[10px] text-[#C5A059] font-bold uppercase">Botanical Active</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-[#EFE8D8]">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm"
                >
                  Close Lightbox
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
