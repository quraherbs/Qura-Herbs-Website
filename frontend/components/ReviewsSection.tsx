"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle2, Sparkles } from "lucide-react";

interface ReviewItem {
  id: number;
  rating: number;
  review: string;
  customer_name?: string;
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
      product_name: "Avocado Pro Nourish Night Cream",
      verified_purchase: true
    },
    {
      id: 2,
      rating: 5,
      review: "Really liked how lightweight and hydrating this formulation feels during evening routines.",
      customer_name: "Priya M.",
      product_name: "Kumkumadi Radiance Elixir",
      verified_purchase: true
    },
    {
      id: 3,
      rating: 5,
      review: "Packaging was neat and the product fits nicely into my daily skincare ritual.",
      customer_name: "Rohan K.",
      product_name: "Neem Purifying Gel Cleanser",
      verified_purchase: true
    },
    {
      id: 4,
      rating: 5,
      review: "My skin tone feels visibly brighter and more even after 3 weeks of consistent use.",
      customer_name: "Kavya R.",
      product_name: "Saffron Glow Brightening Serum",
      verified_purchase: true
    },
    {
      id: 5,
      rating: 5,
      review: "Delicate natural herbal aroma, non-greasy finish. Perfectly soothing for sensitive skin.",
      customer_name: "Deepak N.",
      product_name: "Gotu Kola Moisture Lock Balm",
      verified_purchase: true
    },
    {
      id: 6,
      rating: 5,
      review: "Clean ingredients and subtle glow! Quickly became an essential part of my morning skincare routine.",
      customer_name: "Meera V.",
      product_name: "Rose Water Hydrosol Toner",
      verified_purchase: true
    }
  ]);

  const [ratingFilter, setRatingFilter] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/reviews/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch((err) => console.log("Failed to load reviews:", err));
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
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

  const filteredReviews = ratingFilter === 0 
    ? reviews 
    : reviews.filter((r) => r.rating === ratingFilter);

  // Helper to ensure enough items for continuous seamless loop without empty gaps
  const prepareRowTrack = (items: ReviewItem[], offsetIndex: number = 0) => {
    if (!items || items.length === 0) return [];
    
    let base = [...items];
    while (base.length < 8) {
      base = [...base, ...items];
    }
    
    const rotated = [...base.slice(offsetIndex % base.length), ...base.slice(0, offsetIndex % base.length)];
    return [...rotated, ...rotated];
  };

  const topTrack = prepareRowTrack(filteredReviews, 0);
  const bottomTrack = prepareRowTrack(filteredReviews, 3);

  return (
    <section className="py-20 md:py-28 bg-[#F7F3E9]/50 border-t border-[#EFE8D8]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#EFE8D8] px-3.5 py-1 rounded-full">
            <Sparkles size={12} className="text-[#C5A059]" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#3D261D]">
              COMMUNITY FEEDBACK
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#2C1A14]">
            Customer Impressions
          </h2>

          <p className="text-[#3D261D]/70 font-sans font-light text-sm leading-relaxed">
            Honest experiences shared by individuals incorporating Qura Herbs into their daily routines.
          </p>

          {/* Rating filter buttons */}
          <div className="flex justify-center flex-wrap gap-2 pt-2">
            <button
              onClick={() => setRatingFilter(0)}
              className={`px-3 py-1 text-xs font-sans font-bold uppercase tracking-wider border rounded-full transition-colors ${
                ratingFilter === 0 ? "bg-[#2C1A14] text-[#FDFBF7] border-[#2C1A14]" : "bg-white text-[#2C1A14] border-[#EFE8D8]"
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setRatingFilter(5)}
              className={`px-3 py-1 text-xs font-sans font-bold uppercase tracking-wider border rounded-full transition-colors ${
                ratingFilter === 5 ? "bg-[#2C1A14] text-[#FDFBF7] border-[#2C1A14]" : "bg-white text-[#2C1A14] border-[#EFE8D8]"
              }`}
            >
              ★ 5 Stars ({reviews.filter((r) => r.rating === 5).length})
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Rows Container */}
      <div className="relative w-full overflow-hidden mt-12 space-y-6 sm:space-y-8">
        {/* Left & Right Edge Gradient Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-[#F7F3E9] via-[#F7F3E9]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-[#F7F3E9] via-[#F7F3E9]/80 to-transparent z-10" />

        {/* TOP ROW: Right to Left */}
        <div className="w-full overflow-hidden py-1">
          <div className="flex space-x-6 w-max animate-marquee-left">
            {topTrack.map((rev, idx) => (
              <div
                key={`top-${rev.id}-${idx}`}
                className="w-[280px] sm:w-[340px] md:w-[380px] flex-shrink-0 bg-white border border-[#EFE8D8] rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {renderStars(rev.rating)}
                    {rev.verified_purchase && (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 font-sans font-semibold uppercase">
                        <CheckCircle2 size={12} />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-sm md:text-base text-[#2C1A14] italic leading-relaxed">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFE8D8] flex items-center justify-between text-xs font-sans">
                  <span className="font-semibold text-[#2C1A14]">{rev.customer_name || "Community Member"}</span>
                  {rev.product_name && (
                    <span className="text-[10px] text-[#3D261D]/60 truncate max-w-[140px]">{rev.product_name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW: Left to Right */}
        <div className="w-full overflow-hidden py-1">
          <div className="flex space-x-6 w-max animate-marquee-right">
            {bottomTrack.map((rev, idx) => (
              <div
                key={`bottom-${rev.id}-${idx}`}
                className="w-[280px] sm:w-[340px] md:w-[380px] flex-shrink-0 bg-white border border-[#EFE8D8] rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {renderStars(rev.rating)}
                    {rev.verified_purchase && (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 font-sans font-semibold uppercase">
                        <CheckCircle2 size={12} />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-sm md:text-base text-[#2C1A14] italic leading-relaxed">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFE8D8] flex items-center justify-between text-xs font-sans">
                  <span className="font-semibold text-[#2C1A14]">{rev.customer_name || "Community Member"}</span>
                  {rev.product_name && (
                    <span className="text-[10px] text-[#3D261D]/60 truncate max-w-[140px]">{rev.product_name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
