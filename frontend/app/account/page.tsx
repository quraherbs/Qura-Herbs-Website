"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import ThemeModal from "../../components/ThemeModal";
import { User, LogOut, Package, MapPin, ChevronDown, ChevronUp, CheckCircle, Clock, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  product_id: number;
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
  tax: number;
  payment_status: string;
  order_status: string;
  tracking_number: string | null;
  created_at: string;
  items: OrderItem[];
}

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  useEffect(() => {
    // Fetch orders for customer ID = 1
    fetch(getApiUrl("/api/v1/orders/customer/1"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load customer orders:", err);
        setLoading(false);
      });
  }, []);

  const toggleExpandOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Helper to render tracking step styles
  const getStepStatus = (currentStatus: string, step: "pending" | "confirmed" | "shipped" | "delivered") => {
    const statusOrder = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
    const currentIdx = statusOrder.indexOf(currentStatus.toLowerCase());
    
    let targetIdx = 0;
    if (step === "pending") targetIdx = 0;
    if (step === "confirmed") targetIdx = 1; // "confirmed" or "accepted"
    if (step === "shipped") targetIdx = 4;
    if (step === "delivered") targetIdx = 5;

    if (currentIdx >= targetIdx) {
      return "active";
    }
    return "inactive";
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs tracking-[0.3em] font-sans font-semibold text-brand-accent uppercase">
            RITUAL ARCHIVE
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-dark">
            Your Dashboard
          </h1>
          <div className="w-12 h-[1px] bg-brand-accent mx-auto"></div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar / Profile summary */}
          <div className="lg:col-span-4 border border-brand-sand/20 bg-brand-light p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-brand-sand/30 flex justify-center items-center text-brand-dark/50">
                <User size={24} />
              </div>
              <div>
                <h2 className="font-serif text-lg font-medium text-brand-dark">Nanda Velv</h2>
                <p className="text-xs text-brand-dark/40 font-sans">nandavelv@gmail.com</p>
              </div>
            </div>

            <div className="border-t border-brand-sand/15 pt-4 space-y-3 font-sans text-xs">
              <div className="flex items-center space-x-2.5 text-brand-cocoa">
                <Package size={14} className="text-brand-accent" />
                <span>Orders Processed: {orders.length}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-brand-cocoa">
                <MapPin size={14} className="text-brand-accent" />
                <span>Default Address Set</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full border border-brand-dark hover:border-brand-accent text-brand-dark hover:text-brand-accent text-xs uppercase tracking-widest py-3 font-bold transition-all flex items-center justify-center gap-2 rounded-none font-sans"
              >
                <LogOut size={14} />
                LOG OUT
              </button>
            </div>
          </div>

          {/* Customer Orders list */}
          <div className="lg:col-span-8 border border-brand-sand/20 bg-brand-light p-6 md:p-8 space-y-6">
            <h2 className="font-serif text-xl font-light text-brand-dark border-b border-brand-sand/15 pb-4">
              Purchase History & Order Tracking
            </h2>
            
            {loading ? (
              <div className="text-center py-10 text-xs font-sans text-brand-dark/50 animate-pulse">
                Fetching order records...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-xs text-brand-dark/40 font-sans">No transactions recorded under this profile yet.</p>
                <Link
                  href="/shop"
                  className="inline-block bg-brand-dark hover:bg-brand-accent text-brand-cream text-xs uppercase tracking-widest px-6 py-2.5 transition-all font-semibold font-sans"
                >
                  START RITUAL
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const isExpanded = expandedOrderId === ord.id;
                  return (
                    <div key={ord.id} className="border border-brand-sand/20 bg-white">
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleExpandOrder(ord.id)}
                        className="w-full p-5 text-left flex justify-between items-center hover:bg-brand-cream/10 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-xs md:text-sm text-brand-dark font-sans">{ord.order_number}</span>
                            <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 font-sans rounded-none ${
                              ord.order_status === "delivered" 
                                ? "bg-green-100 text-green-800" 
                                : ord.order_status === "confirmed" || ord.order_status === "accepted"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {ord.order_status}
                            </span>
                          </div>
                          <p className="text-[10px] text-brand-dark/40 font-sans">
                            Ordered: {new Date(ord.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-brand-dark">₹{ord.total}</p>
                            <p className="text-[10px] uppercase font-semibold text-green-700">{ord.payment_status}</p>
                          </div>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="border-t border-brand-sand/15 p-5 bg-brand-light/20 space-y-6 text-xs font-sans text-brand-cocoa">
                          
                          {/* 1. Progress timeline tracker */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">Delivery Progress</h4>
                            <div className="grid grid-cols-4 gap-2 text-center relative pt-4">
                              {/* Horizontal Line connector */}
                              <div className="absolute top-[26px] left-1/8 right-1/8 h-0.5 bg-brand-sand/30 z-0"></div>
                              
                              <div className="flex flex-col items-center z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                  getStepStatus(ord.order_status, "pending") === "active" ? "bg-brand-accent" : "bg-brand-sand/50"
                                }`}>
                                  <Clock size={12} />
                                </div>
                                <span className="text-[9px] font-semibold mt-1">Pending</span>
                              </div>

                              <div className="flex flex-col items-center z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                  getStepStatus(ord.order_status, "confirmed") === "active" ? "bg-brand-accent" : "bg-brand-sand/50"
                                }`}>
                                  <CheckCircle size={12} />
                                </div>
                                <span className="text-[9px] font-semibold mt-1">Accepted</span>
                              </div>

                              <div className="flex flex-col items-center z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                  getStepStatus(ord.order_status, "shipped") === "active" ? "bg-brand-accent" : "bg-brand-sand/50"
                                }`}>
                                  <Truck size={12} />
                                </div>
                                <span className="text-[9px] font-semibold mt-1">Shipped</span>
                              </div>

                              <div className="flex flex-col items-center z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                  getStepStatus(ord.order_status, "delivered") === "active" ? "bg-brand-accent" : "bg-brand-sand/50"
                                }`}>
                                  <CheckCircle size={12} />
                                </div>
                                <span className="text-[9px] font-semibold mt-1">Delivered</span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Order Tracking details */}
                          {ord.tracking_number && (
                            <div className="bg-white border border-brand-sand/20 p-3 space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-brand-accent font-bold">Courier Tracking ID</span>
                              <p className="font-mono text-xs font-semibold text-brand-dark">{ord.tracking_number}</p>
                            </div>
                          )}

                          {/* 3. Items list */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-accent border-b border-brand-sand/10 pb-1">Items Summary</h4>
                            <div className="space-y-2">
                              {ord.items && ord.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                  <span>Product ID: {item.product_id} {item.variant ? `(${item.variant})` : ""} x{item.quantity}</span>
                                  <span className="font-semibold text-brand-dark">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Pricing summary */}
                          <div className="border-t border-brand-sand/15 pt-3 space-y-1 text-[11px] text-right font-sans">
                            <div className="flex justify-between">
                              <span className="text-brand-dark/50">Subtotal</span>
                              <span>₹{ord.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-brand-dark/50">Shipping</span>
                              <span>{ord.shipping === 0 ? "FREE" : `₹${ord.shipping}`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-brand-dark/50">Tax (GST)</span>
                              <span>₹{ord.tax}</span>
                            </div>
                            <div className="flex justify-between font-bold text-brand-dark text-xs pt-1">
                              <span>Grand Total</span>
                              <span>₹{ord.total}</span>
                            </div>
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
      </main>

      <CartDrawer />

      {/* Luxury Theme Logout Confirmation Modal */}
      <ThemeModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        subtitle="RITUAL ARCHIVE"
        title="Sign Out of Your Profile?"
        iconType="logout"
        message="Are you sure you wish to sign out of your Qura Herbs account? Your saved shopping cart and wishlist items will remain preserved."
        primaryButtonText="CONFIRM SIGN OUT"
        secondaryButtonText="STAY SIGNED IN"
        onPrimaryClick={() => {
          setShowLogoutConfirm(false);
          setShowLogoutSuccess(true);
        }}
      />

      {/* Luxury Theme Logout Success Modal */}
      <ThemeModal
        isOpen={showLogoutSuccess}
        onClose={() => setShowLogoutSuccess(false)}
        subtitle="SESSION CLOSED"
        title="Signed Out Successfully"
        iconType="success"
        message="You have been signed out of your Qura Herbs ritual account. We look forward to welcoming you back to your skincare journey."
        primaryButtonText="EXPLORE PRODUCTS"
        onPrimaryClick={() => {
          router.push("/shop");
        }}
      />
    </div>
  );
}
