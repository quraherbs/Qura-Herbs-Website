"use client";

import { useEffect, useState } from "react";
import { getApiUrl, getImageUrl } from "@/lib/api";
import { useCart } from "../../../context/CartContext";
import { ShoppingBag, Star, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductVariant {
  id: number;
  name: string;
  sku_suffix: string;
  price_override: number | null;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  price: number;
  sale_price: number | null;
  SKU: string;
  stock: number;
  ingredients: string;
  benefits: string;
  how_to_use: string;
  skin_type: string;
  product_images: string[];
  thumbnail: string;
  variants: ProductVariant[];
}

interface Review {
  id: number;
  rating: number;
  review: string;
  verified_purchase: boolean;
  created_at: string;
}

export default function ProductDetails({ slug }: { slug: string }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "benefits" | "ingredients" | "how">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(getApiUrl(`/api/v1/products/slug/${slug}`))
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setSelectedImage(data.thumbnail);
        if (data.variants && data.variants.length > 0) {
          // Find standard default variant
          const defaultVar = data.variants[0];
          setSelectedVariant(defaultVar);
        }
        // Fetch reviews
        return fetch(getApiUrl(`/api/v1/reviews/product/${data.id}`));
      })
      .then((res) => res.json())
      .then((reviewData: Review[]) => {
        if (Array.isArray(reviewData)) {
          setReviews(reviewData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load product:", err);
        if (slug === "avocado-night-cream") {
          const fallbackProduct: Product = {
            id: 2,
            name: "Avocado Pro Nourish Night Cream",
            slug: "avocado-night-cream",
            short_description: "Feed your skin. Reveal its natural brightness. A botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep.",
            full_description: `Avocado Pro Nourish Night Cream — 30g\n\nFeed your skin. Reveal its natural brightness.\n\nA botanically rich skin brightening and whitening night cream that deeply nourishes, softens, and restores radiance while you sleep. Powered by avocado, sweet almond oil, honey, wheatgerm, milk protein, and seaweed, it supports healthier-looking, smoother, more luminous skin without harsh bleaching agents.\n\nKey Benefits\n• Deep, sustained nourishment throughout the day\n• Visibly softer and smoother skin with regular use\n• Restores a natural, healthy radiance to dull skin\n• Strengthens the skin barrier over time\n• Supports a more even, luminous complexion\n\nKey Ingredients\n• Avocado - rich in fatty acids that repair the skin barrier and restore suppleness\n• Sweet Almond Oil - lightweight and emollient, softens without congesting pores\n• Honey - a natural humectant that draws and locks moisture into the skin\n• Wheatgerm Extract - packed with Vitamin E to support renewal and reduce dullness\n• Milk Protein - smooths skin tone and refines the complexion\n• Seaweed - marine-derived minerals that firm, hydrate, and restore luminosity\n\nSuitable For\nOily, combination, aging, dull, and normal skin types. Ideal for daily use, overnight.\n\nHow To Use\nCleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.\n\nFormulation Highlights\n• Paraben-free\n• No harsh bleaching agents\n• Botanically sourced actives\n• Suitable for daily use`,
            price: 1299.0,
            sale_price: 1149.0,
            SKU: "QH-HYD-AVONIGHT-35",
            stock: 30,
            ingredients: "Avocado (rich in fatty acids), Sweet Almond Oil, Honey, Wheatgerm Extract, Milk Protein, Seaweed minerals, Botanically Sourced Actives.",
            benefits: "Deep, sustained nourishment throughout the day • Visibly softer and smoother skin with regular use • Restores natural, healthy radiance to dull skin • Strengthens the skin barrier over time • Supports a more even, luminous complexion.",
            how_to_use: "Cleanse and pat your face dry. Take a small amount and warm between fingertips. Apply evenly across face using upward strokes.",
            skin_type: "Oily, combination, aging, dull, and normal skin types",
            product_images: [
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_ingredients.jpg",
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_before_after.jpg"
            ],
            thumbnail: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/Product%20Images/avocado_pro_nourish_main.jpg",
            variants: []
          };
          setProduct(fallbackProduct);
          setSelectedImage(fallbackProduct.thumbnail);
          setError(false);
          setLoading(false);
          return;
        }
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-sans text-brand-dark/50 animate-pulse">
        Nourishing product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center text-brand-dark/50 font-sans text-sm">
        Product details not found.{" "}
        <Link href="/shop" className="underline text-brand-accent">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const formatBold = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*|<b>.*?<\/b>)/g);
    return parts.map((part, i) => {
      if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("<b>") && part.endsWith("</b>"))) {
        const content = part.replace(/^\*\*|^\<b\>|\*\*$|\<\/b\>$/g, "");
        return <strong key={i} className="font-semibold text-brand-dark">{content}</strong>;
      }
      return part;
    });
  };

  const renderFormattedText = (text?: string) => {
    if (!text) return <p className="text-brand-cocoa/50 italic">No detailed description specified.</p>;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;
      if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
        const headingText = trimmed.replace(/^#+\s*/, "");
        return (
          <h4 key={idx} className="font-serif text-lg font-medium text-brand-dark pt-3 pb-1">
            {headingText}
          </h4>
        );
      }
      if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const bulletText = trimmed.replace(/^[\•\-\*]\s*/, "");
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-2">
            <span className="text-brand-accent text-sm leading-none pt-1">•</span>
            <span className="text-brand-cocoa">{formatBold(bulletText)}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-brand-cocoa/90 leading-relaxed font-sans font-light my-1.5">
          {formatBold(trimmed)}
        </p>
      );
    });
  };

  const hasDiscount = product.sale_price !== null;
  
  // Calculate price dynamically based on variant selection and base pricing overrides
  const basePrice = selectedVariant?.price_override || product.price;
  const activePrice = hasDiscount && !selectedVariant?.price_override
    ? product.sale_price!
    : basePrice;

  const rawImages = [product.thumbnail, ...(product.product_images || [])].filter(Boolean);
  const allImages = Array.from(new Set(rawImages.map((img) => getImageUrl(img))));

  const currentImgIndex = allImages.indexOf(getImageUrl(selectedImage)) >= 0 
    ? allImages.indexOf(getImageUrl(selectedImage)) + 1 
    : 1;

  return (
    <div className="space-y-16">
      {/* Editorial detail block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Gallery Column (Left) */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4">
          {/* Thumbnails list */}
          <div className="col-span-2 space-y-3">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-full aspect-square border overflow-hidden bg-brand-light flex items-center justify-center p-1 transition-all rounded-sm ${
                  selectedImage === img ? "border-brand-accent scale-95 shadow-sm" : "border-brand-sand/30"
                }`}
              >
                <img src={getImageUrl(img)} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          {/* Featured Large Viewer */}
          <div className="col-span-10 aspect-square w-full bg-brand-light border border-brand-sand/20 overflow-hidden relative rounded-sm group">
            <img src={getImageUrl(selectedImage || product.thumbnail)} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            {/* Image Counter Badge */}
            <div className="absolute bottom-3 right-3 bg-brand-dark/80 text-brand-cream text-[10px] font-sans font-bold px-2.5 py-1 uppercase tracking-widest rounded-full backdrop-blur-sm">
              {currentImgIndex} / {allImages.length}
            </div>
          </div>
        </div>

        {/* Purchase Options Column (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold font-sans">
              {product.skin_type || "All Skin Types"}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-dark leading-snug">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex text-brand-accent">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="text-xs text-brand-dark/50 font-sans font-medium">
                ({reviews.length} Customer Reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 border-y border-brand-sand/15 py-4">
            <span className="text-2xl font-bold font-sans text-brand-dark">
              ₹{activePrice}
            </span>
            {hasDiscount && !selectedVariant?.price_override && (
              <span className="text-sm text-brand-dark/40 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="text-brand-cocoa/80 text-sm leading-relaxed font-sans font-light">
            {product.short_description}
          </p>

          {/* Product SKU */}
          <div className="text-xs font-sans text-brand-dark/40">
            SKU: {product.SKU}{selectedVariant?.sku_suffix ? `-${selectedVariant.sku_suffix}` : ""}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold font-sans">
                Select Volume
              </span>
              <div className="flex gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 border text-xs tracking-wider uppercase font-sans font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? "bg-brand-dark border-brand-dark text-brand-cream"
                        : "border-brand-sand hover:border-brand-dark text-brand-cocoa"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Controls */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-brand-sand/60 bg-white justify-between px-4 py-3 sm:w-32">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-brand-dark/60">-</button>
              <span className="text-xs font-sans font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-brand-dark/60">+</button>
            </div>
            
            {/* Add Button */}
            <button
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: activePrice,
                thumbnail: product.thumbnail,
                variant: selectedVariant?.name
              }, quantity)}
              className="flex-1 bg-brand-dark hover:bg-brand-accent text-brand-cream text-xs uppercase tracking-widest py-4 font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 rounded-none"
            >
              <ShoppingBag size={15} />
              ADD TO RITUAL
            </button>
          </div>

          {/* Trust notes */}
          <div className="flex items-center gap-2.5 text-xs text-brand-dark/50 pt-2 border-t border-brand-sand/10 font-sans font-light">
            <ShieldCheck size={16} className="text-brand-accent" />
            <span>Secure payment via UPI Transfer. Clean clinical purity guarantee.</span>
          </div>
        </div>
      </div>

      {/* Tabs description block (Full Description / Overview, Benefits, Ingredients, How to use) */}
      <div className="border border-brand-sand/20 bg-brand-light p-8 md:p-12 space-y-8">
        <div className="flex border-b border-brand-sand/20 overflow-x-auto">
          {(["overview", "benefits", "ingredients", "how"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 font-serif text-sm uppercase tracking-wider transition-colors duration-300 border-b-2 font-medium -mb-[2px] whitespace-nowrap ${
                activeTab === tab
                  ? "border-brand-dark text-brand-dark font-semibold"
                  : "border-transparent text-brand-dark/40 hover:text-brand-dark"
              }`}
            >
              {tab === "overview"
                ? "Full Description"
                : tab === "benefits"
                ? "Product Benefits"
                : tab === "ingredients"
                ? "Pure Ingredients"
                : "How to Ritual"}
            </button>
          ))}
        </div>

        <div className="font-sans font-light text-sm md:text-base text-brand-cocoa/90 leading-relaxed max-w-4xl">
          {activeTab === "overview" && (
            <div className="space-y-3">
              {renderFormattedText(product.full_description || product.short_description)}
            </div>
          )}
          {activeTab === "benefits" && (
            <div className="space-y-3">
              {renderFormattedText(product.benefits || "No specific benefits listed.")}
            </div>
          )}
          {activeTab === "ingredients" && (
            <div className="space-y-3">
              {renderFormattedText(product.ingredients || "No ingredients specified.")}
            </div>
          )}
          {activeTab === "how" && (
            <div className="space-y-3">
              {renderFormattedText(product.how_to_use || "No usage instructions specified.")}
            </div>
          )}
        </div>
      </div>

      {/* Reviews block */}
      <div className="space-y-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
          Customer Reviews ({reviews.length})
        </h2>
        
        {reviews.length === 0 ? (
          <div className="bg-brand-light border border-brand-sand/20 text-center py-12 text-xs font-sans text-brand-dark/40 rounded-none">
            No reviews yet.
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="border border-brand-sand/20 bg-brand-light p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex text-brand-accent">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-dark/40 font-sans">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-brand-cocoa/80 font-sans font-light leading-relaxed">
                  {rev.review}
                </p>
                {rev.verified_purchase && (
                  <span className="inline-block bg-brand-accent/10 text-brand-accent text-[9px] uppercase tracking-wider font-sans font-semibold px-2 py-0.5">
                    VERIFIED PURCHASE
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
