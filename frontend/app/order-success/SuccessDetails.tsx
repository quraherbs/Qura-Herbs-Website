"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, MessageCircle, ShoppingBag, MapPin, CreditCard, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function SuccessDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("order_number") || "QH-20260903-8492";
  const total = searchParams.get("total") || "";
  const name = searchParams.get("name") || "";

  useEffect(() => {
    // If order_number is provided in search params, redirect to dynamic route for full experience
    if (searchParams.get("order_number")) {
      router.replace(`/order-success/${searchParams.get("order_number")}`);
    }
  }, [searchParams, router]);

  const whatsappUrl = getWhatsAppOrderUrl({
    orderNumber: orderNumber,
    orderDate: new Date(),
    customerName: name ? decodeURIComponent(name) : "Customer",
    customerPhone: "",
    shippingAddress: "",
    items: [],
    paymentMethod: "UPI",
    subtotal: Number(total) || 0,
    discount: 0,
    shippingCharge: 0,
    orderTotal: Number(total) || 0,
    paymentStatus: "PAYMENT_PENDING",
  });

  return (
    <div className="w-full space-y-8 animate-fade-in text-[#2C1A14]">
      
      {/* HERO SECTION */}
      <div className="text-center space-y-4 bg-white border border-[#EFE8D8] p-8 md:p-12 rounded-sm shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A059] via-[#2C1A14] to-[#C5A059]"></div>
        
        <div className="w-16 h-16 rounded-full bg-[#F7F3E9] border border-[#EFE8D8] flex items-center justify-center mx-auto text-[#C5A059]">
          <CheckCircle2 size={36} strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#C5A059]">
            ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#2C1A14]">
            Thank you for choosing Qura Herbs.
          </h1>
          <p className="text-xs md:text-sm text-[#3D261D]/80 font-sans max-w-lg mx-auto leading-relaxed pt-1">
            Your order has been recorded in our laboratory database and is preparing for dispatch.
          </p>
        </div>

        <div className="pt-4 flex flex-col items-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#F7F3E9] border border-[#EFE8D8] px-4 py-2 rounded-full">
            <span className="text-xs font-sans text-[#3D261D]/70">Order Number:</span>
            <span className="font-mono text-xs font-bold text-[#2C1A14] tracking-wider">#{orderNumber}</span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-serif italic text-[#C5A059] pt-1">
            <Sparkles size={14} />
            <span>Congratulations! Your skincare ritual is on its way.</span>
          </div>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white border border-[#EFE8D8] p-6 rounded-sm shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs font-sans border-b border-[#F7F3E9] pb-2">
          <span className="text-[#3D261D]/60">Order Number</span>
          <span className="font-mono font-bold text-[#2C1A14]">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-sans border-b border-[#F7F3E9] pb-2">
          <span className="text-[#3D261D]/60">Payment Status</span>
          <span className="font-bold text-[#C5A059] bg-[#F7F3E9] px-2 py-0.5 rounded border border-[#EFE8D8]">
            Pending Verification
          </span>
        </div>
        <div className="flex justify-between items-center text-xs font-sans border-b border-[#F7F3E9] pb-2">
          <span className="text-[#3D261D]/60">Shipping Method</span>
          <span className="font-medium text-[#2C1A14]">Standard Free Delivery</span>
        </div>
        <div className="flex justify-between items-center text-xs font-sans">
          <span className="text-[#3D261D]/60">Estimated Delivery</span>
          <span className="font-medium text-[#2C1A14]">3 - 5 Business Days</span>
        </div>
      </div>

      {/* BRAND MESSAGE & ACTIONS */}
      <div className="bg-[#F7F3E9] border border-[#EFE8D8] p-8 text-center space-y-6 rounded-sm">
        <div className="space-y-2">
          <p className="font-serif text-lg text-[#2C1A14]">
            &ldquo;Thank you for choosing Qura Herbs.&rdquo;
          </p>
          <p className="text-xs text-[#3D261D]/70 font-sans italic">
            Your skin deserves a ritual rooted in nature.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-widest px-8 py-4 font-bold transition-all font-sans flex items-center justify-center space-x-2 rounded-sm shadow-md"
          >
            <MessageCircle size={16} />
            <span>SEND WHATSAPP CONFIRMATION</span>
          </a>

          <button
            onClick={() => router.push("/shop")}
            className="w-full sm:w-auto border border-[#2C1A14] text-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#FDFBF7] text-xs uppercase tracking-widest px-8 py-4 font-bold transition-all font-sans rounded-sm"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
}


