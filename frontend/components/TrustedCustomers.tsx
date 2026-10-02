"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Award, HeartHandshake, Sparkles } from "lucide-react";

export default function TrustedCustomers() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const target = 300;
    const duration = 1300; // 1.3 seconds smooth count
    let startTimestamp: number | null = null;

    // Fast initial count with smooth deceleration (ease-out cubic)
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentCount = Math.floor(easedProgress * target);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const animationFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInView]);

  return (
    <section ref={ref} className="bg-brand-cream py-20 px-4 md:px-8 border-t border-brand-sand/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-brand-light border border-brand-sand/35 p-8 sm:p-12 md:p-14 overflow-hidden rounded-none shadow-sm"
        >
          {/* Subtle Botanical Decorative Accents */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-sand/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-3 border border-brand-sand/20 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left/Top Number Display Block */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left justify-center border-b lg:border-b-0 lg:border-r border-brand-sand/30 pb-8 lg:pb-0 lg:pr-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cream border border-brand-sand/40 mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-brand-accent uppercase">
                  TRUSTED &amp; LOYAL
                </span>
              </div>

              {/* Large Animated Number */}
              <div className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-brand-dark tracking-tight leading-none tabular-nums select-none my-3">
                <span className="inline-block min-w-[3ch] text-right">{count}</span>
                <span className="text-brand-accent font-normal ml-0.5">+</span>
              </div>

              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-brand-cocoa/60 font-medium">
                Verified Botanical Community
              </span>
            </div>

            {/* Right/Bottom Content Block */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-brand-dark leading-snug">
                300+ Customers Trusting Qura Herbs
              </h2>

              <p className="text-brand-cocoa/80 font-sans font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Hundreds of skincare enthusiasts continue to choose Qura Herbs for their everyday botanical skincare routine.
              </p>

              {/* Feature Badges */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-brand-sand/25 mt-6">
                <div className="flex items-center justify-center lg:justify-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                  <span className="text-xs font-sans text-brand-dark/85 font-medium">100% Botanical Actives</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2.5">
                  <Award className="w-4 h-4 text-brand-accent shrink-0" />
                  <span className="text-xs font-sans text-brand-dark/85 font-medium">Clean Clinical Formulas</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2.5">
                  <HeartHandshake className="w-4 h-4 text-brand-accent shrink-0" />
                  <span className="text-xs font-sans text-brand-dark/85 font-medium">98% Reorder Rate</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
