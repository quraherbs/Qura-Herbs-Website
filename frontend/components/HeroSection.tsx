"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { getApiUrl } from "@/lib/api";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Leaf, ChevronUp } from "lucide-react";

interface Banner {
  id: number;
  desktop_image: string;
  mobile_image?: string;
  heading: string;
  subheading?: string;
  cta_text: string;
  cta_link: string;
  active: boolean;
}

export default function HeroSection() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 1,
      desktop_image: "/uploads/hero_main.jpg",
      heading: "Good Skin Starts Here.",
      subheading: "Thoughtfully crafted botanical skincare inspired by nature and made for your everyday skin ritual.",
      cta_text: "SHOP THE RITUAL",
      cta_link: "/shop",
      active: true
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwipingUp, setIsSwipingUp] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Motion value for drag gesture
  const dragY = useMotionValue(0);
  const buttonOpacity = useTransform(dragY, [0, -100], [1, 0.5]);

  useEffect(() => {
    fetch(getApiUrl("/api/v1/content/hero-banners?active_only=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      })
      .catch((err) => console.log("Failed to load hero banners:", err));
  }, []);

  // Auto-slide if multiple banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentIndex] || banners[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Trigger shop navigation when swiped up or clicked
  const triggerShopNavigation = () => {
    setIsSwipingUp(true);
    setTimeout(() => {
      router.push(currentBanner.cta_link || "/shop");
    }, 300);
  };

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y < -35 || info.velocity.y < -200) {
      triggerShopNavigation();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    if (deltaY > 40) {
      triggerShopNavigation();
    }
    setTouchStartY(null);
  };

  return (
    <section className="relative w-full bg-[#FDFBF7] py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Atmosphere Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F7F3E9] rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Swipe Up Transition Overlay */}
      <AnimatePresence>
        {isSwipingUp && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1A14]/40 backdrop-blur-md flex flex-col items-center justify-center text-white pointer-events-none"
          >
            <motion.div 
              animate={{ y: [-10, 0, -10] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="flex flex-col items-center space-y-2"
            >
              <ChevronUp size={40} className="text-white" />
              <span className="font-serif text-2xl font-light tracking-widest uppercase">Opening Shop...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-6">
        
        {/* TOP BRAND HIGHLIGHT RIBBON */}
        <div className="flex items-center justify-between border-b border-[#EFE8D8] pb-3 text-xs font-sans text-[#3D261D]/80">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
            <span className="uppercase tracking-[0.2em] font-bold text-[10px] text-[#2C1A14]">
              QURA HERBS OFFICIAL PLATFORM
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5"><Leaf size={13} className="text-[#C5A059]" /> 100% Herbal</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-[#C5A059]" /> Dermatologically Balanced</span>
            <span className="flex items-center gap-1.5"><Sparkles size={13} className="text-[#C5A059]" /> Certified Products</span>
          </div>
        </div>

        {/* GRAND FULL-WIDTH EDITORIAL BANNER CANVAS */}
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#F7F3E9] border border-[#EFE8D8] shadow-2xl group transition-all duration-500">
          
          {/* Outer Gold Accent Trim */}
          <div className="absolute inset-2 sm:inset-4 border border-[#C5A059]/25 rounded-xl md:rounded-2xl pointer-events-none z-20"></div>

          {/* Banner Aspect Ratio Container */}
          <div className="w-full relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[340px] sm:min-h-[440px] lg:min-h-[500px] flex items-center justify-center">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full absolute inset-0 flex items-center justify-center overflow-hidden"
              >
                {/* Main High-Res Banner Graphic */}
                <img
                  src={currentBanner.desktop_image}
                  alt={currentBanner.heading}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                {/* Gradient Vignette Overlays for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A14]/40 via-transparent to-transparent pointer-events-none z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#2C1A14]/30 via-transparent to-transparent pointer-events-none z-10"></div>
              </motion.div>
            </AnimatePresence>

            {/* OVERLAY ACTION BAR - FLOATING AT BOTTOM */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 right-6 sm:right-10 z-30 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
              
              {/* Floating CTA Pill with WATER TRANSPARENT BUTTON */}
              <motion.div 
                drag="y"
                dragConstraints={{ top: -150, bottom: 0 }}
                dragElastic={0.2}
                dragSnapToOrigin={true}
                onDragEnd={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ opacity: buttonOpacity, y: dragY }}
                className="flex items-center space-x-3 bg-white/20 backdrop-blur-xl border border-white/50 p-2 pr-6 rounded-full shadow-2xl cursor-grab active:cursor-grabbing select-none hover:bg-white/30 transition-all duration-300"
              >
                {/* TRANSPARENT WATER-BASED BUTTON */}
                <button
                  onClick={triggerShopNavigation}
                  className="bg-transparent hover:bg-white/40 text-[#2C1A14] backdrop-blur-md border border-[#2C1A14]/30 font-sans text-xs uppercase tracking-widest px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-sm flex items-center space-x-2 group/btn cursor-pointer"
                >
                  <span>{currentBanner.cta_text || "SHOP THE RITUAL"}</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1 text-[#2C1A14]" />
                </button>
                
                <span className="hidden md:inline-block text-[11px] font-sans font-medium text-[#2C1A14] tracking-wide pr-2">
                  Complimentary Express Shipping on Orders Above ₹799
                </span>

                {/* Micro Swipe Up Hint */}
                <div className="hidden sm:flex items-center space-x-1 text-[10px] text-[#2C1A14]/70 uppercase tracking-wider font-semibold pl-1">
                  <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <ChevronUp size={13} className="text-[#2C1A14]" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Slider Arrows & Slide Indicators */}
              {banners.length > 1 && (
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1 rounded-full text-white shadow-lg">
                  <button
                    onClick={handlePrev}
                    className="p-0.5 hover:text-[#C5A059] transition-all hover:scale-110"
                    title="Previous Slide"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <div className="flex space-x-1 items-center px-1">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === currentIndex ? "w-4 bg-[#C5A059]" : "w-1 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="p-0.5 hover:text-[#C5A059] transition-all hover:scale-110"
                    title="Next Slide"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


