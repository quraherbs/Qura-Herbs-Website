"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Star, CheckCircle2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface ReviewItem {
  id: number;
  rating: number;
  review: string;
  customer_name?: string;
  customer_city?: string;
  product_name?: string;
  verified_purchase?: boolean;
  created_at?: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 1,
      rating: 5,
      review: "Texture is very smooth and it feels remarkably comfortable on my skin. Doesn't leave any heavy residue.",
      customer_name: "Ananya S.",
      customer_city: "Bengaluru",
      product_name: "Avocado Pro Nourish Night Cream",
      verified_purchase: true
    },
    {
      id: 2,
      rating: 5,
      review: "Really liked how lightweight and hydrating this formulation feels during evening routines.",
      customer_name: "Priya M.",
      customer_city: "Mumbai",
      product_name: "Kumkumadi Radiance Elixir",
      verified_purchase: true
    },
    {
      id: 3,
      rating: 5,
      review: "Packaging was neat and the product fits nicely into my daily skincare ritual.",
      customer_name: "Rohan K.",
      customer_city: "Delhi",
      product_name: "Neem Purifying Gel Cleanser",
      verified_purchase: true
    },
    {
      id: 4,
      rating: 5,
      review: "My skin tone feels visibly brighter and more even after 3 weeks of consistent use.",
      customer_name: "Kavya R.",
      customer_city: "Hyderabad",
      product_name: "Saffron Glow Brightening Serum",
      verified_purchase: true
    },
    {
      id: 5,
      rating: 5,
      review: "Delicate natural herbal aroma, non-greasy finish. Perfectly soothing for sensitive skin.",
      customer_name: "Deepak N.",
      customer_city: "Chennai",
      product_name: "Gotu Kola Moisture Lock Balm",
      verified_purchase: true
    },
    {
      id: 6,
      rating: 5,
      review: "Clean ingredients and subtle glow! Quickly became an essential part of my morning skincare routine.",
      customer_name: "Meera V.",
      customer_city: "Kochi",
      product_name: "Rose Water Hydrosol Toner",
      verified_purchase: true
    }
  ]);

  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardsPerView, setCardsPerView] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Touch gesture tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    fetch(getApiUrl("/api/v1/reviews/"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch((err) => console.log("Failed to load reviews:", err));
  }, []);

  // Update responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredReviews = ratingFilter === 0 
    ? reviews 
    : reviews.filter((r) => r.rating === ratingFilter);

  const maxIndex = Math.max(0, filteredReviews.length - cardsPerView);

  // Clamp current index if filtered list or cardsPerView changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Gentle autoplay that pauses on hover/touch
  useEffect(() => {
    if (isPaused || filteredReviews.length <= cardsPerView) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, filteredReviews.length, cardsPerView, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    if (deltaX > 40) {
      handleNext();
    } else if (deltaX < -40) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleFilterChange = (rating: number) => {
    setRatingFilter(rating);
    setCurrentIndex(0);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "fill-[#C5A059] text-[#C5A059]" : "text-[#EFE8D8]"}
          />
        ))}
      </div>
    );
  };

  return (
    <section 
      className="py-14 sm:py-18 md:py-22 bg-[#F7F3E9]/50 border-t border-[#EFE8D8]/60 overflow-hidden"
      aria-label="Customer Impressions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#EFE8D8] px-3.5 py-1 rounded-full shadow-2xs">
            <Sparkles size={12} className="text-[#C5A059]" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#3D261D]">
              COMMUNITY FEEDBACK
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#2C1A14]">
            Customer Impressions
          </h2>

          <p className="text-[#3D261D]/75 font-sans font-light text-sm sm:text-base leading-relaxed">
            Honest experiences shared by individuals incorporating Qura Herbs into their daily routines.
          </p>

          {/* Rating filter buttons and Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFilterChange(0)}
                className={`px-3.5 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer border ${
                  ratingFilter === 0 
                    ? "bg-[#2C1A14] text-[#FDFBF7] border-[#2C1A14] shadow-xs" 
                    : "bg-white text-[#2C1A14] border-[#EFE8D8] hover:border-[#2C1A14]/30"
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              <button
                onClick={() => handleFilterChange(5)}
                className={`px-3.5 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer border ${
                  ratingFilter === 5 
                    ? "bg-[#2C1A14] text-[#FDFBF7] border-[#2C1A14] shadow-xs" 
                    : "bg-white text-[#2C1A14] border-[#EFE8D8] hover:border-[#2C1A14]/30"
                }`}
              >
                ★ 5 Stars ({reviews.filter((r) => r.rating === 5).length})
              </button>
            </div>

            {/* Slider Navigation Arrows */}
            {filteredReviews.length > cardsPerView && (
              <div className="flex items-center space-x-1.5 bg-white border border-[#EFE8D8] rounded-full p-1 shadow-2xs ml-0 sm:ml-2">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#FDFBF7] transition-all cursor-pointer"
                  title="Previous Reviews"
                  aria-label="Previous Reviews"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[11px] font-sans font-medium text-[#2C1A14]/70 px-2 select-none tabular-nums">
                  {currentIndex + 1} / {maxIndex + 1}
                </span>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#FDFBF7] transition-all cursor-pointer"
                  title="Next Reviews"
                  aria-label="Next Reviews"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Viewport Container - Zero Fading, Zero Gradient Masking, 100% Readable */}
        <div 
          className="relative w-full overflow-hidden select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                style={{ width: `${100 / cardsPerView}%` }}
                className="flex-shrink-0 px-2 sm:px-3 md:px-3.5 py-1"
              >
                <div className="h-full bg-white border border-[#EFE8D8] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {renderStars(rev.rating)}
                      {rev.verified_purchase && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 font-sans font-semibold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle2 size={12} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <p className="font-serif text-sm sm:text-[15px] text-[#2C1A14] italic leading-relaxed line-clamp-4">
                      &ldquo;{rev.review}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-[#EFE8D8] flex items-center justify-between text-xs font-sans gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-[#2C1A14] truncate">
                        {rev.customer_name || "Community Member"}
                      </span>
                      {rev.customer_city && (
                        <span className="text-[10px] text-[#3D261D]/55 font-normal truncate">
                          {rev.customer_city}
                        </span>
                      )}
                    </div>
                    {rev.product_name && (
                      <span className="text-[10px] text-[#3D261D]/75 font-medium truncate max-w-[130px] sm:max-w-[160px] bg-[#F7F3E9] px-2 py-0.5 rounded-md border border-[#EFE8D8]/70 shrink-0">
                        {rev.product_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Pagination Indicators */}
        {filteredReviews.length > cardsPerView && (
          <div className="flex justify-center items-center space-x-2 pt-1">
            {Array.from({ length: Math.min(8, maxIndex + 1) }).map((_, idx) => {
              // Map index to a spread across total pages if large
              const targetIdx = maxIndex <= 7 
                ? idx 
                : Math.round((idx / 7) * maxIndex);
              const isActive = Math.abs(currentIndex - targetIdx) <= Math.ceil(maxIndex / 8 / 2);

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(targetIdx)}
                  aria-label={`Go to review page ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? "w-6 bg-[#C5A059]" : "w-1.5 bg-[#2C1A14]/20 hover:bg-[#2C1A14]/40"
                  }`}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
