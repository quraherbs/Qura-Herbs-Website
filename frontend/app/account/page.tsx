"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import ThemeModal from "../../components/ThemeModal";
import { 
  User, 
  LogOut, 
  Package, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Search, 
  Mail, 
  Phone, 
  ArrowRight, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  product_id: number;
  product_name?: string | null;
  quantity: number;
  price: number;
  variant: string | null;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  payment_status: string;
  order_status: string;
  payment_id?: string | null;
  tracking_number: string | null;
  shipping_address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  created_at: string;
  items: OrderItem[];
  customer?: CustomerProfile | null;
}

interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district?: string | null;
  state: string;
  pincode: string;
}

export default function AccountPage() {
  const router = useRouter();

  // Authentication & Profile State
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Guest Lookup States
  const [activeTab, setActiveTab] = useState<"track" | "signin">("track");
  
  // Track Order Form
  const [trackOrderNumber, setTrackOrderNumber] = useState("");
  const [trackContact, setTrackContact] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Sign In / Lookup Form
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState("");

  // Recent order numbers stored on device
  const [recentOrderNumbers, setRecentOrderNumbers] = useState<string[]>([]);

  useEffect(() => {
    // 1. Check if returning customer is saved in localStorage
    try {
      const savedCustomerStr = localStorage.getItem("qura_customer");
      if (savedCustomerStr) {
        const savedCustomer: CustomerProfile = JSON.parse(savedCustomerStr);
        if (savedCustomer && savedCustomer.id) {
          setCustomer(savedCustomer);
          fetchCustomerOrders(savedCustomer.id);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved customer session", e);
    }

    // 2. Load recent order numbers on device if available
    try {
      const recent = JSON.parse(localStorage.getItem("qura_recent_orders") || "[]");
      if (Array.isArray(recent) && recent.length > 0) {
        setRecentOrderNumbers(recent);
      }
    } catch (e) {
      // ignore
    }

    setLoading(false);
  }, []);

  const fetchCustomerOrders = async (customerId: number) => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/v1/orders/customer/${customerId}`));
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = signInIdentifier.trim();
    if (!query) {
      setSignInError("Please enter your registered email address or phone number.");
      return;
    }

    setSignInLoading(true);
    setSignInError("");

    try {
      const res = await fetch(getApiUrl(`/api/v1/customers/lookup/${encodeURIComponent(query)}`));
      if (!res.ok) {
        if (res.status === 404) {
          setSignInError("No account found with this email or phone number. You can place orders as a guest anytime without an account!");
        } else {
          setSignInError("Unable to retrieve account details. Please try again.");
        }
        setSignInLoading(false);
        return;
      }

      const customerData: CustomerProfile = await res.json();
      setCustomer(customerData);
      localStorage.setItem("qura_customer", JSON.stringify(customerData));
      await fetchCustomerOrders(customerData.id);
    } catch (err) {
      console.error("Sign in lookup error:", err);
      setSignInError("Network error while connecting to server. Please try again.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleTrackOrder = async (e?: React.FormEvent, orderNumToTrack?: string) => {
    if (e) e.preventDefault();
    const orderNum = (orderNumToTrack || trackOrderNumber).trim().toUpperCase();
    const contact = trackContact.trim().toLowerCase();

    if (!orderNum) {
      setTrackError("Please enter your Order Number (e.g. QH-2026...)");
      return;
    }

    setTrackLoading(true);
    setTrackError("");
    setTrackedOrder(null);

    try {
      const res = await fetch(getApiUrl(`/api/v1/orders/number/${encodeURIComponent(orderNum)}`));
      if (!res.ok) {
        if (res.status === 404) {
          setTrackError(`Order #${orderNum} was not found. Please verify the order number on your confirmation message.`);
        } else {
          setTrackError("Unable to fetch order status. Please try again.");
        }
        setTrackLoading(false);
        return;
      }

      const orderData: Order = await res.json();

      // Optional verification if contact provided
      if (contact) {
        const orderEmail = orderData.customer?.email?.toLowerCase() || "";
        const orderPhone = orderData.customer?.phone?.replace(/\s+/g, "") || "";
        const cleanContact = contact.replace(/\s+/g, "");

        if (!orderEmail.includes(contact) && !orderPhone.includes(cleanContact)) {
          setTrackError("The email or mobile number does not match this order number. Please check your details.");
          setTrackLoading(false);
          return;
        }
      }

      setTrackedOrder(orderData);
    } catch (err) {
      console.error("Order tracking error:", err);
      setTrackError("Network error while checking order status. Please try again.");
    } finally {
      setTrackLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("qura_customer");
    } catch (e) {
      // ignore
    }
    setCustomer(null);
    setOrders([]);
    setShowLogoutConfirm(false);
  };

  const toggleExpandOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStepStatus = (currentStatus: string, step: "pending" | "confirmed" | "shipped" | "delivered") => {
    const statusOrder = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
    const currentIdx = statusOrder.indexOf(currentStatus.toLowerCase());
    
    let targetIdx = 0;
    if (step === "pending") targetIdx = 0;
    if (step === "confirmed") targetIdx = 1;
    if (step === "shipped") targetIdx = 4;
    if (step === "delivered") targetIdx = 5;

    return currentIdx >= targetIdx ? "active" : "inactive";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1A14]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        
        {/* ======================================================== */}
        {/* CASE 1: AUTHENTICATED / SAVED CUSTOMER VIEW             */}
        {/* ======================================================== */}
        {customer ? (
          <div className="space-y-12 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3">
              <span className="text-xs tracking-[0.3em] font-sans font-semibold text-[#C5A059] uppercase">
                CUSTOMER DASHBOARD
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-light text-[#2C1A14]">
                Welcome, {customer.name}
              </h1>
              <div className="w-12 h-[1px] bg-[#C5A059] mx-auto"></div>
            </div>

            {/* Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Customer Profile Card */}
              <div className="lg:col-span-4 border border-[#EFE8D8] bg-[#F7F3E9] p-6 md:p-8 space-y-6 rounded-sm shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#EFE8D8] flex justify-center items-center text-[#2C1A14]/70">
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-medium text-[#2C1A14]">{customer.name}</h2>
                    <p className="text-xs text-[#3D261D]/70 font-sans">{customer.email}</p>
                  </div>
                </div>

                <div className="border-t border-[#EFE8D8] pt-4 space-y-3 font-sans text-xs text-[#3D261D]">
                  <div className="flex items-center space-x-2.5">
                    <Package size={15} className="text-[#C5A059]" />
                    <span>Orders Placed: {orders.length}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Phone size={15} className="text-[#C5A059]" />
                    <span>{customer.phone || "No phone added"}</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <MapPin size={15} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">
                      {customer.address ? `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}` : "Default shipping address set"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EFE8D8]">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full border border-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#FDFBF7] text-[#2C1A14] text-xs uppercase tracking-widest py-3 font-bold transition-all flex items-center justify-center gap-2 rounded-sm font-sans"
                  >
                    <LogOut size={14} />
                    SIGN OUT
                  </button>
                </div>
              </div>

              {/* Right Column: Customer Orders List */}
              <div className="lg:col-span-8 border border-[#EFE8D8] bg-white p-6 md:p-8 space-y-6 rounded-sm shadow-sm">
                <div className="flex justify-between items-center border-b border-[#EFE8D8] pb-4">
                  <h2 className="font-serif text-xl font-light text-[#2C1A14]">
                    Purchase History & Order Tracking
                  </h2>
                  <span className="text-xs font-sans text-[#3D261D]/60">
                    {orders.length} {orders.length === 1 ? "order" : "orders"}
                  </span>
                </div>
                
                {loading ? (
                  <div className="text-center py-12 text-xs font-sans text-[#3D261D]/60 animate-pulse">
                    Retrieving your purchase history...
                  </div>
                ) : orders.length === 0 ? (
                  /* Elegant Empty State */
                  <div className="text-center py-16 space-y-5 bg-[#FDFBF7] border border-dashed border-[#EFE8D8] p-8 rounded-sm">
                    <div className="w-12 h-12 rounded-full bg-[#F7F3E9] flex items-center justify-center mx-auto text-[#C5A059]">
                      <ShoppingBag size={22} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-lg text-[#2C1A14]">No previous purchases found.</p>
                      <p className="text-xs text-[#3D261D]/70 font-sans max-w-md mx-auto">
                        When you place an order, its real-time preparation, tracking details, and invoice will be accessible here.
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-block bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-widest px-8 py-3 transition-all font-semibold font-sans rounded-sm shadow-sm"
                    >
                      EXPLORE COLLECTION
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const isExpanded = expandedOrderId === ord.id;
                      return (
                        <div key={ord.id} className="border border-[#EFE8D8] bg-[#FDFBF7] rounded-sm overflow-hidden">
                          {/* Order Header / Accordion Trigger */}
                          <button
                            onClick={() => toggleExpandOrder(ord.id)}
                            className="w-full p-5 text-left flex justify-between items-center hover:bg-[#F7F3E9] transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-xs md:text-sm text-[#2C1A14] font-mono">
                                  {ord.order_number}
                                </span>
                                <span className={`text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full font-sans ${
                                  ord.order_status === "delivered" 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : ord.order_status === "confirmed" || ord.order_status === "accepted"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {ord.order_status}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#3D261D]/60 font-sans">
                                Ordered: {new Date(ord.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#2C1A14]">₹{ord.total.toLocaleString("en-IN")}</p>
                                <p className="text-[10px] uppercase font-semibold text-emerald-700">
                                  {ord.payment_status}
                                </p>
                              </div>
                              <div className="text-[#2C1A14]">
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </div>
                            </div>
                          </button>

                          {/* Order Accordion Body */}
                          {isExpanded && (
                            <div className="border-t border-[#EFE8D8] p-5 md:p-6 bg-white space-y-6 text-xs font-sans text-[#3D261D]">
                              
                              {/* 1. Progress timeline */}
                              <div className="space-y-3 bg-[#FDFBF7] border border-[#EFE8D8] p-4 rounded-sm">
                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">
                                  Delivery Progress
                                </h4>
                                <div className="grid grid-cols-4 gap-2 text-center relative pt-4">
                                  <div className="absolute top-[26px] left-[12%] right-[12%] h-0.5 bg-[#EFE8D8] z-0"></div>
                                  
                                  <div className="flex flex-col items-center z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                      getStepStatus(ord.order_status, "pending") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                                    }`}>
                                      <Clock size={12} />
                                    </div>
                                    <span className="text-[10px] font-semibold mt-1">Pending</span>
                                  </div>

                                  <div className="flex flex-col items-center z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                      getStepStatus(ord.order_status, "confirmed") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                                    }`}>
                                      <CheckCircle size={12} />
                                    </div>
                                    <span className="text-[10px] font-semibold mt-1">Confirmed</span>
                                  </div>

                                  <div className="flex flex-col items-center z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                      getStepStatus(ord.order_status, "shipped") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                                    }`}>
                                      <Truck size={12} />
                                    </div>
                                    <span className="text-[10px] font-semibold mt-1">Shipped</span>
                                  </div>

                                  <div className="flex flex-col items-center z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                      getStepStatus(ord.order_status, "delivered") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                                    }`}>
                                      <CheckCircle size={12} />
                                    </div>
                                    <span className="text-[10px] font-semibold mt-1">Delivered</span>
                                  </div>
                                </div>
                              </div>

                              {/* 2. Courier tracking details */}
                              {ord.tracking_number && (
                                <div className="bg-[#F7F3E9] border border-[#EFE8D8] p-3 rounded-sm flex justify-between items-center">
                                  <div>
                                    <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold block">
                                      Courier Tracking Ref
                                    </span>
                                    <p className="font-mono text-xs font-semibold text-[#2C1A14]">{ord.tracking_number}</p>
                                  </div>
                                  <span className="text-[10px] text-[#3D261D]/70 font-sans">Standard Surface Delivery</span>
                                </div>
                              )}

                              {/* 3. Items list */}
                              <div className="space-y-3">
                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] border-b border-[#EFE8D8] pb-1">
                                  Items in Order
                                </h4>
                                <div className="space-y-2">
                                  {ord.items && ord.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-xs border-b border-[#FDFBF7] pb-1.5">
                                      <div>
                                        <span className="font-medium text-[#2C1A14]">
                                          {item.product_name || `Product #${item.product_id}`}
                                        </span>
                                        {item.variant && (
                                          <span className="text-[10px] text-[#C5A059] ml-1.5 font-sans">
                                            ({item.variant})
                                          </span>
                                        )}
                                        <span className="text-[#3D261D]/60 ml-2">x{item.quantity}</span>
                                      </div>
                                      <span className="font-semibold text-[#2C1A14]">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 4. Financial breakdown */}
                              <div className="border-t border-[#EFE8D8] pt-3 space-y-1.5 text-xs text-right font-sans">
                                <div className="flex justify-between">
                                  <span className="text-[#3D261D]/60">Subtotal</span>
                                  <span>₹{ord.subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                {ord.discount > 0 && (
                                  <div className="flex justify-between text-emerald-700 font-medium">
                                    <span>Discount Applied</span>
                                    <span>-₹{ord.discount.toLocaleString("en-IN")}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-[#3D261D]/60">Shipping</span>
                                  <span>{ord.shipping === 0 ? "FREE" : `₹${ord.shipping}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-[#2C1A14] text-sm pt-2 border-t border-[#EFE8D8]">
                                  <span>Total Amount</span>
                                  <span>₹{ord.total.toLocaleString("en-IN")}</span>
                                </div>
                              </div>

                              {/* 5. View order page button */}
                              <div className="pt-2">
                                <Link
                                  href={`/order-success/${ord.order_number}`}
                                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#C5A059] hover:text-[#2C1A14] transition-colors uppercase tracking-wider"
                                >
                                  <span>View Full Order Confirmation & Invoice</span>
                                  <ExternalLink size={13} />
                                </Link>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* CASE 2: GUEST / UNREGISTERED CUSTOMER PORTAL             */
          /* ======================================================== */
          <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <span className="text-xs tracking-[0.3em] font-sans font-semibold text-[#C5A059] uppercase">
                CUSTOMER PORTAL
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-light text-[#2C1A14]">
                Order Tracking & Account
              </h1>
              <p className="text-xs md:text-sm text-[#3D261D]/70 font-sans max-w-lg mx-auto leading-relaxed">
                Track your package delivery status or sign in to access your previous orders and saved details.
              </p>
              <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mt-2"></div>
            </div>

            {/* Reassuring Guest Notice Banner */}
            <div className="bg-[#F7F3E9] border border-[#EFE8D8] p-5 md:p-6 rounded-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#C5A059]">
                  <ShieldCheck size={18} />
                  <span className="font-serif text-sm font-semibold text-[#2C1A14]">Guest Checkout Is Always Enabled</span>
                </div>
                <p className="text-xs text-[#3D261D]/70 font-sans leading-relaxed">
                  Creating an account is never mandatory. You can explore products, add to cart, and checkout seamlessly as a guest anytime.
                </p>
              </div>
              <Link
                href="/shop"
                className="whitespace-nowrap bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-widest px-6 py-2.5 font-bold transition-all rounded-sm font-sans"
              >
                BROWSE SHOP
              </Link>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-[#EFE8D8]">
              <button
                onClick={() => { setActiveTab("track"); setTrackError(""); }}
                className={`flex-1 py-4 text-xs font-sans font-bold uppercase tracking-widest text-center transition-all border-b-2 ${
                  activeTab === "track"
                    ? "border-[#2C1A14] text-[#2C1A14] bg-white"
                    : "border-transparent text-[#3D261D]/50 hover:text-[#2C1A14]"
                }`}
              >
                Track Your Order (Instant)
              </button>
              <button
                onClick={() => { setActiveTab("signin"); setSignInError(""); }}
                className={`flex-1 py-4 text-xs font-sans font-bold uppercase tracking-widest text-center transition-all border-b-2 ${
                  activeTab === "signin"
                    ? "border-[#2C1A14] text-[#2C1A14] bg-white"
                    : "border-transparent text-[#3D261D]/50 hover:text-[#2C1A14]"
                }`}
              >
                Sign In / View Profile
              </button>
            </div>

            {/* TAB CONTENT 1: TRACK ORDER (FOR GUESTS & REGISTERED USERS) */}
            {activeTab === "track" && (
              <div className="bg-white border border-[#EFE8D8] p-6 md:p-10 rounded-sm shadow-sm space-y-8 animate-fade-in">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-[#2C1A14]">Instant Shipment Tracking</h3>
                  <p className="text-xs text-[#3D261D]/70 font-sans">
                    Enter the order number from your WhatsApp or email confirmation to check its live fulfillment status.
                  </p>
                </div>

                <form onSubmit={(e) => handleTrackOrder(e)} className="space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-[#2C1A14]">
                      Order Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. QH-20261016-1234"
                      value={trackOrderNumber}
                      onChange={(e) => setTrackOrderNumber(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#EFE8D8] px-4 py-3 text-xs font-mono text-[#2C1A14] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-[#2C1A14]">
                      Mobile Number or Email (Optional verification)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210 or your email"
                      value={trackContact}
                      onChange={(e) => setTrackContact(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#EFE8D8] px-4 py-3 text-xs font-sans text-[#2C1A14] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>

                  {trackError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-sm">
                      {trackError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={trackLoading}
                    className="w-full bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-widest py-3.5 font-bold transition-all rounded-sm font-sans flex items-center justify-center space-x-2"
                  >
                    {trackLoading ? (
                      <span className="animate-pulse">Checking Order Status...</span>
                    ) : (
                      <>
                        <Search size={15} />
                        <span>TRACK ORDER</span>
                      </>
                    )}
                  </button>
                </form>

                {/* TRACKED ORDER RESULT DISPLAY */}
                {trackedOrder && (
                  <div className="border border-[#C5A059]/40 bg-[#FDFBF7] p-6 rounded-sm space-y-6 animate-fade-in mt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#EFE8D8] pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">
                          ORDER FOUND
                        </span>
                        <h4 className="font-mono text-base font-bold text-[#2C1A14]">
                          #{trackedOrder.order_number}
                        </h4>
                        <p className="text-[11px] text-[#3D261D]/60 font-sans">
                          Placed on: {new Date(trackedOrder.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>

                      <span className={`text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full font-sans ${
                        trackedOrder.order_status === "delivered" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : trackedOrder.order_status === "confirmed" || trackedOrder.order_status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {trackedOrder.order_status}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3 bg-white border border-[#EFE8D8] p-4 rounded-sm">
                      <div className="grid grid-cols-4 gap-2 text-center relative pt-4">
                        <div className="absolute top-[26px] left-[12%] right-[12%] h-0.5 bg-[#EFE8D8] z-0"></div>
                        
                        <div className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                            getStepStatus(trackedOrder.order_status, "pending") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                          }`}>
                            <Clock size={12} />
                          </div>
                          <span className="text-[10px] font-semibold mt-1">Pending</span>
                        </div>

                        <div className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                            getStepStatus(trackedOrder.order_status, "confirmed") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                          }`}>
                            <CheckCircle size={12} />
                          </div>
                          <span className="text-[10px] font-semibold mt-1">Confirmed</span>
                        </div>

                        <div className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                            getStepStatus(trackedOrder.order_status, "shipped") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                          }`}>
                            <Truck size={12} />
                          </div>
                          <span className="text-[10px] font-semibold mt-1">Shipped</span>
                        </div>

                        <div className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                            getStepStatus(trackedOrder.order_status, "delivered") === "active" ? "bg-[#C5A059]" : "bg-[#D6CBB8]"
                          }`}>
                            <CheckCircle size={12} />
                          </div>
                          <span className="text-[10px] font-semibold mt-1">Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Courier Reference */}
                    {trackedOrder.tracking_number && (
                      <div className="bg-[#F7F3E9] border border-[#EFE8D8] p-3 rounded-sm flex justify-between items-center text-xs font-sans">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold block">
                            Courier Tracking Number
                          </span>
                          <span className="font-mono font-bold text-[#2C1A14]">{trackedOrder.tracking_number}</span>
                        </div>
                        <span className="text-[#3D261D]/70 text-[11px]">Speed Courier Dispatch</span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2 border-t border-[#EFE8D8] pt-4">
                      <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Items</h5>
                      {trackedOrder.items && trackedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <span className="text-[#2C1A14]">
                            {item.product_name || `Product #${item.product_id}`} {item.variant ? `(${item.variant})` : ""} x{item.quantity}
                          </span>
                          <span className="font-semibold text-[#2C1A14]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#EFE8D8]">
                      <div>
                        <span className="text-xs text-[#3D261D]/70 font-sans">Order Total: </span>
                        <span className="font-bold text-sm text-[#2C1A14]">₹{trackedOrder.total}</span>
                      </div>
                      <Link
                        href={`/order-success/${trackedOrder.order_number}`}
                        className="bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-wider px-4 py-2 rounded-sm font-semibold"
                      >
                        VIEW FULL DETAILS
                      </Link>
                    </div>
                  </div>
                )}

                {/* Device Recent Orders Quick-Links */}
                {recentOrderNumbers.length > 0 && !trackedOrder && (
                  <div className="border-t border-[#EFE8D8] pt-6 space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                      Recent Orders Placed On This Device
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {recentOrderNumbers.map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setTrackOrderNumber(num);
                            handleTrackOrder(undefined, num);
                          }}
                          className="bg-[#F7F3E9] hover:bg-[#EFE8D8] border border-[#EFE8D8] px-3 py-1.5 text-xs font-mono text-[#2C1A14] rounded-sm transition-colors flex items-center space-x-1.5"
                        >
                          <span>#{num}</span>
                          <ArrowRight size={12} className="text-[#C5A059]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: SIGN IN / PROFILE LOOKUP */}
            {activeTab === "signin" && (
              <div className="bg-white border border-[#EFE8D8] p-6 md:p-10 rounded-sm shadow-sm space-y-8 animate-fade-in">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-[#2C1A14]">Sign In to Your Account</h3>
                  <p className="text-xs text-[#3D261D]/70 font-sans">
                    Enter the email address or phone number associated with your orders to access your customer dashboard.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-[#2C1A14]">
                      Email Address or Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. name@example.com or 9876543210"
                        value={signInIdentifier}
                        onChange={(e) => setSignInIdentifier(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#EFE8D8] px-4 py-3 text-xs font-sans text-[#2C1A14] focus:outline-none focus:border-[#C5A059] rounded-sm"
                      />
                    </div>
                  </div>

                  {signInError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-sm">
                      {signInError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full bg-[#2C1A14] hover:bg-[#3D261D] text-[#FDFBF7] text-xs uppercase tracking-widest py-3.5 font-bold transition-all rounded-sm font-sans flex items-center justify-center space-x-2"
                  >
                    {signInLoading ? (
                      <span className="animate-pulse">Accessing Account...</span>
                    ) : (
                      <>
                        <User size={15} />
                        <span>VIEW ACCOUNT DASHBOARD</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="border-t border-[#EFE8D8] pt-6 space-y-2 text-xs font-sans text-[#3D261D]/70">
                  <p className="font-semibold text-[#2C1A14]">Don&apos;t have an account?</p>
                  <p>
                    No problem! Qura Herbs does not require an account to purchase. You can checkout anytime as a guest, and track your package using the Order Number provided upon order placement.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="text-[#C5A059] hover:text-[#2C1A14] font-semibold uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      <span>Explore Our Formulations</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      <CartDrawer />

      {/* Logout Confirmation Modal */}
      <ThemeModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        subtitle="CUSTOMER ACCOUNT"
        title="Sign Out of Your Profile?"
        iconType="logout"
        message="Are you sure you wish to sign out? Your current cart and saved preferences will remain preserved on this device."
        primaryButtonText="CONFIRM SIGN OUT"
        secondaryButtonText="STAY SIGNED IN"
        onPrimaryClick={handleLogout}
      />
    </div>
  );
}
