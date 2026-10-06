"use client";

import React, { useState, useEffect } from "react";
import { getApiUrl, getImageUrl } from "@/lib/api";
import { useCart } from "../../context/CartContext";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import ThemeModal from "../../components/ThemeModal";
import { ShieldCheck, Copy, Check, Lock, ChevronDown, ChevronUp, MapPin, Truck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const INDIAN_STATES = [
  "Tamil Nadu",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [modalNotice, setModalNotice] = useState<{ isOpen: boolean; title: string; message: string; iconType?: "warning" | "logout" | "success" | "info" | "sparkles" }>({
    isOpen: false,
    title: "",
    message: "",
    iconType: "warning"
  });

  const [form, setForm] = useState(() => {
    let initialSaved = {};
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("qura_saved_address");
        if (saved) {
          initialSaved = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to load saved address", e);
      }
    }
    return {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      state: "Tamil Nadu",
      pincode: "",
      addressType: "Home",
      saveAddress: true,
      ...initialSaved
    };
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [placing, setPlacing] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [copied, setCopied] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // --- VOUCHER & OFFERS SYSTEM ---
  interface OfferItem {
    id: number;
    name: string;
    code: string;
    description?: string;
    offer_type: string;
    discount_value: number;
    minimum_order_value: number;
  }

  interface AppliedVoucher {
    valid: boolean;
    voucher_code: string;
    offer_name: string;
    offer_type: string;
    discount_amount: number;
    shipping_discount: number;
    message: string;
    offer_id?: number;
  }

  const [availableOffers, setAvailableOffers] = useState<OfferItem[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  // Helper logic for state-based shipping (Tamil Nadu = ₹80, Else = ₹150)
  const isTamilNaduState = (st: string) => {
    if (!st) return false;
    const clean = st.trim().toLowerCase().replace(" ", "");
    return clean === "tamilnadu" || clean === "tn";
  };

  // Real-time calculated amounts (2 decimal precision)
  const subtotal = Math.round(cartTotal * 100) / 100;
  const shipping = isTamilNaduState(form.state) ? 80 : 150;
  const voucherDiscount = appliedVoucher?.discount_amount || 0;
  const shippingDiscount = appliedVoucher?.shipping_discount || 0;
  const discountedSubtotal = Math.max(0, subtotal - voucherDiscount);
  const grandTotal = Math.round((discountedSubtotal + shipping) * 100) / 100;

  // Load active offers
  useEffect(() => {
    fetch(getApiUrl("/api/v1/offers/?active_only=true"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableOffers(data);
        }
      })
      .catch((err) => console.log("Failed to load offers:", err));
  }, []);

  const handleApplyVoucher = async (codeToApply?: string) => {
    const code = (codeToApply || voucherCode).trim();
    if (!code) {
      setVoucherError("Please enter a voucher code.");
      return;
    }

    setIsValidatingVoucher(true);
    setVoucherError("");

    try {
      const res = await fetch(getApiUrl("/api/v1/offers/validate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucher_code: code,
          cart_subtotal: cartTotal,
          product_ids: cart.map((i) => i.id)
        })
      });

      const data = await res.json();
      if (data.valid) {
        setAppliedVoucher(data);
        setVoucherCode(data.voucher_code);
        setVoucherError("");
      } else {
        setAppliedVoucher(null);
        setVoucherError(data.message || "Invalid voucher code.");
      }
    } catch (e) {
      console.error(e);
      setVoucherError("Failed to validate voucher code.");
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherError("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Please enter your full name";
    if (!form.phone.trim() || form.phone.trim().length < 10) newErrors.phone = "Please enter a valid 10-digit mobile number";
    if (!form.email.trim() || !form.email.includes("@")) newErrors.email = "Please enter a valid email address";
    if (!form.address.trim()) newErrors.address = "Please enter street address / house details";
    if (!form.city.trim()) newErrors.city = "Please enter your city";
    if (!form.state.trim()) newErrors.state = "Please select or enter your state";
    if (!form.pincode.trim() || form.pincode.trim().length < 6) newErrors.pincode = "Please enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!validateForm()) {
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    setPlacing(true);
    setLoadingStep("Creating customer profile...");

    try {
      if (form.saveAddress) {
        localStorage.setItem("qura_saved_address", JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          district: form.district,
          state: form.state,
          pincode: form.pincode,
          addressType: form.addressType
        }));
      }

      // 1. Create or update customer profile
      const customerRes = await fetch(getApiUrl("/api/v1/customers/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          district: form.district || null,
          state: form.state,
          pincode: form.pincode,
        }),
      });
      
      let customerId = 1;
      if (customerRes.ok) {
        const customerData = await customerRes.json();
        customerId = customerData.id;
      }

      setLoadingStep("Placing your secure order...");

      // 2. Submit order to database (Backend recalculates & validates single source of truth)
      const orderPayload = {
        customer_id: customerId,
        subtotal: subtotal,
        discount: voucherDiscount,
        shipping: shipping,
        tax: 0.0,
        total: grandTotal,
        payment_status: "PAYMENT_PENDING",
        order_status: "PAYMENT_PENDING",
        payment_id: "UPI",
        razorpay_order_id: null,
        tracking_number: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
        offer_id: appliedVoucher?.offer_id || null,
        voucher_code: appliedVoucher?.voucher_code || null,
        discount_amount: voucherDiscount,
        shipping_discount: shippingDiscount,
        shipping_address: form.address,
        city: form.city,
        district: form.district || null,
        state: form.state,
        pincode: form.pincode,
        items: cart.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          price: i.sale_price || i.price,
          variant: i.variant || null,
        })),
      };

      const orderRes = await fetch(getApiUrl("/api/v1/orders/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setLoadingStep("Redirecting to order confirmation...");
        clearCart();
        
        // WhatsApp notification URL creation
        const whatsappMessage = `Hi Qura Herbs Team,\n\nI have placed an order through the Qura Herbs website.\n\n*Order Details*\nOrder Number: ${orderData.order_number}\nCustomer Name: ${form.name}\nPhone: ${form.phone}\nState: ${form.state}\n\n*Payment Details*\nPayment Method: UPI\nAmount Paid: ₹${orderData.total}\n\n*Payment Verification*\nI have completed the UPI payment and attached the payment screenshot for verification.\n\nPlease verify the payment and confirm my order. Once the payment has been successfully verified, please proceed with processing my order.\n\nPayment Screenshot:\n[Attach Screenshot Here]\n\nThank you,\nQura Herbs Customer`;
        const whatsappUrl = `https://wa.me/919363739675?text=${encodeURIComponent(whatsappMessage)}`;
        
        try {
          window.open(whatsappUrl, "_blank");
        } catch (e) {
          console.error("Popup blocked by browser", e);
        }
        
        router.push(`/order-success/${orderData.order_number}`);
      } else {
        const errorData = await orderRes.json();
        setModalNotice({
          isOpen: true,
          title: "Order Placement Issue",
          message: errorData.detail || "Unable to process order. Please check item inventory or try again.",
          iconType: "warning"
        });
      }
    } catch (err: unknown) {
      console.error("Checkout error details:", err);
      const detail = err instanceof Error ? `: ${err.message}` : "";
      setModalNotice({
        isOpen: true,
        title: "Communication Error",
        message: `Network communication error with server${detail}. Please try again.`,
        iconType: "warning"
      });
    } finally {
      setPlacing(false);
      setLoadingStep("");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1A14]">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 max-w-md mx-auto flex flex-col justify-center items-center text-center space-y-6 px-4 py-24">
          <div className="w-16 h-16 rounded-full bg-[#F7F3E9] flex items-center justify-center border border-[#EFE8D8] text-[#C5A059]">
            <Sparkles size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-[#2C1A14]">Your Bag is Currently Empty</h1>
            <p className="text-xs font-sans text-[#3D261D]/70 max-w-xs leading-relaxed">
              Explore our laboratory-formulated botanical skincare rituals to nourish your skin.
            </p>
          </div>
          <button 
            onClick={() => router.push("/shop")}
            className="bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-widest px-8 py-3.5 transition-all font-semibold rounded-sm shadow-sm"
          >
            DISCOVER SKINCARE
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1A14]">
      {/* Checkout Minimal Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EFE8D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/logo.png" alt="Qura Herbs Logo" className="h-9 w-auto object-contain" />
            <span className="font-serif text-xl tracking-wider text-[#2C1A14] font-semibold">QURA HERBS</span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-[#C5A059] border-l border-[#EFE8D8] pl-3 font-sans">
              Botanical Chemistry
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[#2C1A14]/70 text-xs font-sans font-medium bg-[#F7F3E9] px-3 py-1.5 rounded-full border border-[#EFE8D8]">
            <Lock size={12} className="text-[#C5A059]" />
            <span>Secure SSL Checkout</span>
          </div>
        </div>
      </header>

      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden border-b border-[#EFE8D8] bg-[#F7F3E9]">
        <button
          type="button"
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-sans text-[#2C1A14]"
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">Order Summary</span>
            <span className="bg-[#EFE8D8] text-[#2C1A14] px-2 py-0.5 rounded text-[10px] font-bold">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} {cart.reduce((acc, item) => acc + item.quantity, 0) === 1 ? "Item" : "Items"}
            </span>
            {showMobileSummary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <span className="font-serif font-bold text-sm text-[#2C1A14]">₹{grandTotal.toLocaleString("en-IN")}</span>
        </button>

        {showMobileSummary && (
          <div className="px-4 py-4 space-y-4 border-t border-[#EFE8D8] bg-[#FDFBF7]">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex items-center space-x-3 text-xs">
                  <div className="w-12 h-12 bg-[#F7F3E9] border border-[#EFE8D8] rounded overflow-hidden flex-shrink-0">
                    <img src={getImageUrl(item.thumbnail || "/uploads/product_placeholder.jpg")} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#2C1A14]">{item.name}</p>
                    <p className="text-[10px] text-[#3D261D]/60 font-sans">
                      Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ""}
                    </p>
                  </div>
                  <p className="font-medium text-[#2C1A14]">₹{((item.sale_price || item.price) * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EFE8D8] pt-3 space-y-2 text-xs text-[#3D261D]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className={voucherDiscount > 0 ? "font-semibold text-emerald-700" : "text-[#3D261D]/70"}>
                  {voucherDiscount > 0 ? `-₹${voucherDiscount.toLocaleString("en-IN")}` : "₹0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span>Shipping</span>
                  <span className="text-[9px] text-[#C5A059] font-medium">
                    {isTamilNaduState(form.state) ? "(Tamil Nadu Rate)" : "(Outside Tamil Nadu Rate)"}
                  </span>
                </div>
                <span className="font-medium">₹{shipping}</span>
              </div>
              <div className="flex justify-between font-serif font-semibold text-sm text-[#2C1A14] pt-2 border-t border-[#EFE8D8]">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Address & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Delivery Details Card */}
            <div className="bg-white border border-[#EFE8D8] p-6 md:p-8 rounded-sm shadow-sm space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#EFE8D8] pb-4">
                <div className="w-8 h-8 rounded-full bg-[#F7F3E9] flex items-center justify-center text-[#2C1A14] text-xs font-serif font-bold border border-[#EFE8D8]">
                  1
                </div>
                <div>
                  <h2 className="font-serif text-xl text-[#2C1A14] font-medium">Delivery Details</h2>
                  <p className="text-[11px] font-sans text-[#3D261D]/60">Where should we deliver your skincare ritual?</p>
                </div>
              </div>

              <form onSubmit={handleCheckout} id="checkout-form" className="space-y-4">
                
                {/* Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleInput}
                      placeholder="e.g. Ananya Sharma"
                      className={`bg-[#FDFBF7] border ${errors.name ? 'border-red-500' : 'border-[#EFE8D8]'} focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm`}
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-sans">{errors.name}</span>}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                      Mobile Number *
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleInput}
                      placeholder="10-digit mobile number"
                      className={`bg-[#FDFBF7] border ${errors.phone ? 'border-red-500' : 'border-[#EFE8D8]'} focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm`}
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 font-sans">{errors.phone}</span>}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInput}
                    placeholder="For order tracking & receipt"
                    className={`bg-[#FDFBF7] border ${errors.email ? 'border-red-500' : 'border-[#EFE8D8]'} focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.email && <span className="text-[10px] text-red-500 font-sans">{errors.email}</span>}
                </div>

                {/* Address */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                    Address / House / Street *
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleInput}
                    placeholder="House/Flat No., Building Name, Street"
                    className={`bg-[#FDFBF7] border ${errors.address ? 'border-red-500' : 'border-[#EFE8D8]'} focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.address && <span className="text-[10px] text-red-500 font-sans">{errors.address}</span>}
                </div>

                {/* City, District, State, Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                      City *
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleInput}
                      placeholder="City / Town"
                      className={`bg-[#FDFBF7] border ${errors.city ? 'border-red-500' : 'border-[#EFE8D8]'} focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm`}
                    />
                    {errors.city && <span className="text-[10px] text-red-500 font-sans">{errors.city}</span>}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                      District
                    </label>
                    <input
                      name="district"
                      value={form.district}
                      onChange={handleInput}
                      placeholder="District"
                      className="bg-[#FDFBF7] border border-[#EFE8D8] focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                        State *
                      </label>
                      <span className="text-[9px] font-semibold text-[#A47148]">
                        {isTamilNaduState(form.state) ? "TN ₹80 Shipping" : "Outside TN ₹150 Shipping"}
                      </span>
                    </div>
                    
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleInput}
                      className={`bg-[#FDFBF7] border ${errors.state ? 'border-red-500' : 'border-[#EFE8D8]'} focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm cursor-pointer`}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st} {st === "Tamil Nadu" ? "(₹80 Shipping)" : "(₹150 Shipping)"}
                        </option>
                      ))}
                    </select>
                    {errors.state && <span className="text-[10px] text-red-500 font-sans">{errors.state}</span>}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#3D261D] font-semibold font-sans">
                      Pincode *
                    </label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleInput}
                      placeholder="6-digit pincode"
                      className={`bg-[#FDFBF7] border ${errors.pincode ? 'border-red-500' : 'border-[#EFE8D8]'} focus:border-[#2C1A14] p-3 text-xs text-[#2C1A14] focus:outline-none transition-colors rounded-sm`}
                    />
                    {errors.pincode && <span className="text-[10px] text-red-500 font-sans">{errors.pincode}</span>}
                  </div>
                </div>

                {/* Address Type Tag & Save Checkbox */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#EFE8D8]">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#3D261D]/70 font-sans font-semibold">Address Tag:</span>
                    {["Home", "Work", "Other"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setForm({ ...form, addressType: tag })}
                        className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded transition-colors ${
                          form.addressType === tag
                            ? "bg-[#2C1A14] text-[#FDFBF7]"
                            : "bg-[#F7F3E9] text-[#3D261D] hover:bg-[#EFE8D8]"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#3D261D] font-sans">
                    <input
                      type="checkbox"
                      name="saveAddress"
                      checked={form.saveAddress}
                      onChange={handleInput}
                      className="accent-[#2C1A14]"
                    />
                    <span>Save address for future purchases</span>
                  </label>
                </div>

              </form>
            </div>

            {/* Payment Section (UPI preserved & visually enhanced) */}
            <div className="bg-white border border-[#EFE8D8] p-6 md:p-8 rounded-sm shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EFE8D8] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#F7F3E9] flex items-center justify-center text-[#2C1A14] text-xs font-serif font-bold border border-[#EFE8D8]">
                    2
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-[#2C1A14] font-medium">Payment</h2>
                    <p className="text-[11px] font-sans text-[#3D261D]/60">Scan QR Code or Copy UPI ID</p>
                  </div>
                </div>

                <span className="bg-[#F7F3E9] text-[#C5A059] text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-[#EFE8D8] rounded-full">
                  UPI Direct
                </span>
              </div>

              {/* UPI Container */}
              <div className="space-y-6">
                
                {/* QR Section */}
                <div className="flex flex-col items-center justify-center p-6 bg-[#FDFBF7] border border-[#EFE8D8] rounded-sm space-y-3">
                  <span className="text-xs font-serif font-medium text-[#2C1A14]">Scan & Pay via any UPI App</span>
                  
                  <div className="relative w-48 h-48 bg-white p-3 border border-[#EFE8D8] shadow-sm rounded-sm">
                    <img
                      src="/upi-qr.png"
                      alt="Qura Herbs UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-[11px] text-[#3D261D]/60 font-sans text-center">
                    GPay • PhonePe • Paytm • BHIM • CRED
                  </p>
                </div>

                {/* UPI ID Copy Block */}
                <div className="flex items-center justify-between bg-[#F7F3E9] border border-[#EFE8D8] p-3.5 rounded-sm">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold font-sans">Official UPI ID</span>
                    <span className="text-xs font-semibold text-[#2C1A14] font-mono tracking-wider">quraherbs@okicici</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("quraherbs@okicici");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    className="bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-[10px] uppercase tracking-widest px-4 py-2 transition-all font-semibold font-sans flex items-center gap-1.5 rounded-sm shadow-sm active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-[#C5A059]" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>COPY ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Step Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans text-[#3D261D]/80">
                  <div className="flex items-start space-x-2 bg-[#FDFBF7] p-3 border border-[#EFE8D8] rounded-sm">
                    <span className="font-bold text-[#C5A059]">1.</span>
                    <span>Pay exact total <strong>₹{grandTotal.toLocaleString("en-IN")}</strong> via UPI.</span>
                  </div>
                  <div className="flex items-start space-x-2 bg-[#FDFBF7] p-3 border border-[#EFE8D8] rounded-sm">
                    <span className="font-bold text-[#C5A059]">2.</span>
                    <span>Click <strong>PLACE ORDER</strong> & share screenshot on WhatsApp.</span>
                  </div>
                </div>

                {/* Submission CTA */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={placing}
                  className="w-full bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-widest py-4 font-bold transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center space-x-2 rounded-sm group"
                >
                  {placing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#FDFBF7] border-t-transparent rounded-full animate-spin"></div>
                      <span>{loadingStep || "PROCESSING ORDER..."}</span>
                    </div>
                  ) : (
                    <>
                      <span>PAY & PLACE ORDER • ₹{grandTotal.toLocaleString("en-IN")}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Order Summary (Desktop) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24">
            <div className="bg-white border border-[#EFE8D8] p-6 rounded-sm shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#EFE8D8] pb-4">
                <h2 className="font-serif text-lg text-[#2C1A14] font-medium">Order Summary</h2>
                <span className="text-[11px] font-sans text-[#3D261D]/60 bg-[#F7F3E9] px-2.5 py-0.5 rounded border border-[#EFE8D8]">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                </span>
              </div>

              {/* Product List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex items-center space-x-3 text-xs">
                    <div className="w-14 h-14 bg-[#F7F3E9] border border-[#EFE8D8] rounded overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.thumbnail || "/uploads/product_placeholder.jpg")}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2C1A14] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#3D261D]/60 font-sans mt-0.5">
                        Qty: {item.quantity} {item.variant ? `• Variant: ${item.variant}` : ""}
                      </p>
                    </div>

                    <p className="font-medium text-[#2C1A14]">
                      ₹{((item.sale_price || item.price) * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* VOUCHER & OFFERS SECTION */}
              <div className="border-t border-[#EFE8D8] pt-4 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#2C1A14] font-sans">
                  Have a Voucher Code?
                </span>

                {appliedVoucher ? (
                  <div className="bg-[#F7F3E9] border border-[#C5A059]/40 p-3 rounded-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#2C1A14]">✓ {appliedVoucher.voucher_code} Applied</p>
                      <p className="text-[10px] text-[#C5A059] font-medium">{appliedVoucher.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-[10px] text-red-600 font-bold uppercase tracking-wider hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="ENTER VOUCHER CODE"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#FDFBF7] border border-[#EFE8D8] focus:border-[#2C1A14] p-2 text-xs uppercase text-[#2C1A14] focus:outline-none rounded-sm font-mono tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyVoucher()}
                        disabled={isValidatingVoucher}
                        className="bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-[10px] uppercase tracking-widest px-4 font-bold rounded-sm disabled:opacity-50"
                      >
                        {isValidatingVoucher ? "..." : "APPLY"}
                      </button>
                    </div>
                    {voucherError && <p className="text-[10px] text-red-600 font-sans">{voucherError}</p>}
                  </div>
                )}

                {/* Available Offers Pills */}
                {!appliedVoucher && availableOffers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#3D261D]/60 font-sans">Available Offers</p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {availableOffers.map((off) => (
                        <div key={off.id} className="bg-[#FDFBF7] border border-[#EFE8D8] p-2 rounded-sm flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-bold text-[#2C1A14] text-[11px]">{off.code}</span>
                            <p className="text-[9px] text-[#3D261D]/70">{off.description || off.name}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setVoucherCode(off.code);
                              handleApplyVoucher(off.code);
                            }}
                            className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider hover:underline ml-2"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[#EFE8D8] pt-4 space-y-2.5 text-xs font-sans text-[#3D261D]">
                <div className="flex justify-between items-center">
                  <span className="text-[#3D261D]/70">Subtotal</span>
                  <span className="font-medium text-[#2C1A14]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#3D261D]/70">Discount</span>
                  <span className={voucherDiscount > 0 ? "font-semibold text-emerald-700" : "text-[#3D261D]/70"}>
                    {voucherDiscount > 0 ? `-₹${voucherDiscount.toLocaleString("en-IN")}` : "₹0"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[#3D261D]/70">Shipping</span>
                    <span className="text-[9px] text-[#C5A059] font-medium">
                      {isTamilNaduState(form.state) ? "(Tamil Nadu Rate)" : "(Outside Tamil Nadu Rate)"}
                    </span>
                  </div>
                  <span className="font-medium text-[#2C1A14]">₹{shipping}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#EFE8D8] text-sm">
                  <span className="font-serif font-medium text-[#2C1A14]">Total</span>
                  <span className="font-serif font-bold text-lg text-[#2C1A14]">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Guarantees Badge */}
              <div className="bg-[#F7F3E9] border border-[#EFE8D8] p-3 rounded-sm space-y-2 text-[10px] font-sans text-[#3D261D]/80">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={14} className="text-[#C5A059]" />
                  <span className="font-semibold text-[#2C1A14]">100% Authentic Botanical Formulations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-[#C5A059]" />
                  <span>Dermatologically Tested • Clean Active Chemistry</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <ThemeModal
        isOpen={modalNotice.isOpen}
        onClose={() => setModalNotice((prev) => ({ ...prev, isOpen: false }))}
        subtitle="CHECKOUT NOTICE"
        title={modalNotice.title}
        message={modalNotice.message}
        iconType={modalNotice.iconType || "warning"}
        primaryButtonText="UNDERSTOOD"
      />
    </div>
  );
}
