"use client";

import { useEffect, useState, useMemo } from "react";
import { Star, CheckCircle2, Sparkles } from "lucide-react";
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

  const filteredReviews = useMemo(() => {
    return ratingFilter === 0 
      ? reviews 
      : reviews.filter((r) => r.rating === ratingFilter);
  }, [reviews, ratingFilter]);

  // Distribute reviews across two rows
  const row1Reviews = useMemo(() => {
    return filteredReviews.filter((_, idx) => idx % 2 === 0);
  }, [filteredReviews]);

  const row2Reviews = useMemo(() => {
    return filteredReviews.filter((_, idx) => idx % 2 === 1);
  }, [filteredReviews]);

  // Helper to ensure enough items for continuous seamless loop without empty gaps
  const prepareTrack = (items: ReviewItem[]) => {
    if (!items || items.length === 0) return [];
    let base = [...items];
    while (base.length < 8) {
      base = [...base, ...items];
    }
    // Duplicate once for seamless -50% CSS keyframe translation
    return [...base, ...base];
  };

  const topTrack = useMemo(() => prepareTrack(row1Reviews), [row1Reviews]);
  const bottomTrack = useMemo(() => prepareTrack(row2Reviews.length > 0 ? row2Reviews : row1Reviews), [row2Reviews, row1Reviews]);

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

  const renderCard = (rev: ReviewItem, key: string) => (
    <div
      key={key}
      className="w-[280px] sm:w-[340px] md:w-[380px] h-[220px] sm:h-[230px] flex-shrink-0 bg-white border border-[#EFE8D8] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between select-none"
    >
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
  );

  return (
    <section 
      className="py-14 sm:py-16 md:py-20 bg-[#F7F3E9]/50 border-t border-[#EFE8D8]/60 overflow-hidden max-w-full relative"
      aria-label="Customer Impressions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
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

          {/* Rating filter buttons */}
          <div className="flex justify-center flex-wrap gap-2 pt-2">
            <button
              onClick={() => setRatingFilter(0)}
              className={`px-3.5 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer border ${
                ratingFilter === 0 
                  ? "bg-[#2C1A14] text-[#FDFBF7] border-[#2C1A14] shadow-xs" 
                  : "bg-white text-[#2C1A14] border-[#EFE8D8] hover:border-[#2C1A14]/30"
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setRatingFilter(5)}
              className={`px-3.5 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer border ${
                ratingFilter === 5 
                  ? "bg-[#2C1A14] text-[#FDFBF7] border-[#2C1A14] shadow-xs" 
                  : "bg-white text-[#2C1A14] border-[#EFE8D8] hover:border-[#2C1A14]/30"
              }`}
            >
              ★ 5 Stars ({reviews.filter((r) => r.rating === 5).length})
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Two-Row Continuous Container */}
      <div className="relative w-full max-w-full overflow-hidden mt-8 sm:mt-10 space-y-4 sm:space-y-6">
        
        {/* ROW 1: Moves continuously Right to Left */}
        <div className="w-full max-w-full overflow-hidden py-1">
          <div className="flex space-x-4 sm:space-x-6 w-max animate-marquee-left hover:[animation-play-state:paused]">
            {topTrack.map((rev, idx) => renderCard(rev, `row1-${rev.id}-${idx}`))}
          </div>
        </div>

        {/* ROW 2: Moves continuously Left to Right */}
        <div className="w-full max-w-full overflow-hidden py-1">
          <div className="flex space-x-4 sm:space-x-6 w-max animate-marquee-right hover:[animation-play-state:paused]">
            {bottomTrack.map((rev, idx) => renderCard(rev, `row2-${rev.id}-${idx}`))}
          </div>
        </div>

      </div>
    </section>
  );
}
