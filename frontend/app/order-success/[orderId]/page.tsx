"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";

import React, { useEffect, useState, use } from "react";
import AnnouncementBar from "../../../components/AnnouncementBar";
import Navbar from "../../../components/Navbar";
import { CheckCircle2, MessageCircle, ShoppingBag, MapPin, CreditCard, PackageCheck, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  variant?: string;
}

interface OrderData {
  id: number;
  order_number: string;
  customer_id: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  payment_status: string;
  order_status: string;
  payment_id?: string;
  tracking_number?: string;
  shipping_address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  created_at: string;
  items: OrderItem[];
}

interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ProductDetails {
  [id: number]: {
    name: string;
    thumbnail?: string;
  };
}

export default function OrderSuccessDynamicPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [productMap, setProductMap] = useState<ProductDetails>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) return;
      try {
        setLoading(true);
        // Fetch order by order number
        const orderRes = await fetch(getApiUrl(`/api/v1/orders/number/${orderId}`));
        if (!orderRes.ok) {
          throw new Error("Order not found");
        }
        const data: OrderData = await orderRes.json();
        setOrder(data);

        // Fetch customer details
        if (data.customer_id) {
          try {
            const custRes = await fetch(getApiUrl(`/api/v1/customers/${data.customer_id}`));
            if (custRes.ok) {
              const custData = await custRes.json();
              setCustomer(custData);
            }
          } catch (e) {
            console.error("Failed to fetch customer", e);
          }
        }

        // Fetch product names & images for items
        const prodMap: ProductDetails = {};
        for (const item of data.items || []) {
          try {
            const prodRes = await fetch(getApiUrl(`/api/v1/products/${item.product_id}`));
            if (prodRes.ok) {
              const prodData = await prodRes.json();
              prodMap[item.product_id] = {
                name: prodData.name,
                thumbnail: prodData.thumbnail || prodData.product_images?.[0]
              };
            }
          } catch (e) {
            console.error("Failed to fetch product", e);
          }
        }
        setProductMap(prodMap);

      } catch (err: unknown) {
        console.error("Error loading order:", err);
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  const fullAddress = order?.shipping_address
    ? `${order.shipping_address}, ${order.city || ""}${order.district ? `, ${order.district}` : ""}, ${order.state || ""} - ${order.pincode || ""}`
    : customer?.address
    ? `${customer.address}, ${customer.city || ""}, ${customer.state || ""} - ${customer.pincode || ""}`
    : "";

  const itemsList = (order?.items || []).map((item) => ({
    name: productMap[item.product_id]?.name || `Product #${item.product_id}`,
    quantity: item.quantity,
    price: item.price,
    variant: item.variant || null,
  }));

  const whatsappUrl = order
    ? getWhatsAppOrderUrl({
        orderNumber: String(orderId),
        orderDate: order.created_at,
        customerName: customer?.name || "",
        customerPhone: customer?.phone || "",
        shippingAddress: fullAddress,
        items: itemsList,
        paymentMethod: order.payment_id || "UPI",
        subtotal: order.subtotal,
        discount: order.discount,
        shippingCharge: order.shipping,
        orderTotal: order.total,
        paymentStatus: order.payment_status || "PAYMENT_PENDING",
      })
    : `https://wa.me/919363739675?text=${encodeURIComponent("Hi Qura Herbs Team, Order Number: " + orderId)}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1A14]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
        
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-[#2C1A14] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-sans text-[#3D261D]/70 tracking-widest uppercase font-semibold">
              Retrieving Order Summary...
            </p>
          </div>
        ) : error || !order ? (
          <div className="bg-white border border-[#EFE8D8] p-8 text-center space-y-4 rounded-sm">
            <h1 className="font-serif text-2xl text-[#2C1A14]">Order Confirmation</h1>
            <p className="text-xs text-[#3D261D]/70 font-sans">
              Thank you! Your order <strong>#{orderId}</strong> has been received and is being processed.
            </p>
            <button
              onClick={() => router.push("/shop")}
              className="bg-[#2C1A14] text-[#FDFBF7] text-xs uppercase tracking-widest px-8 py-3 rounded-sm font-semibold"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            
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
                  Thank you for your order!
                </h1>
                <p className="text-xs md:text-sm text-[#3D261D]/80 font-sans max-w-lg mx-auto leading-relaxed pt-1">
                  Your Qura Herbs order has been recorded in our laboratory database and is preparing for dispatch.
                </p>
              </div>

              {/* Order Badge & Ritual Message */}
              <div className="pt-4 flex flex-col items-center space-y-3">
                <div className="inline-flex items-center space-x-2 bg-[#F7F3E9] border border-[#EFE8D8] px-4 py-2 rounded-full">
                  <span className="text-xs font-sans text-[#3D261D]/70">Order Number:</span>
                  <span className="font-mono text-xs font-bold text-[#2C1A14] tracking-wider">#{order.order_number}</span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-serif italic text-[#C5A059] pt-1">
                  <Sparkles size={14} />
                  <span>Congratulations! Your skincare ritual is on its way.</span>
                </div>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Completed Order Summary */}
              <div className="bg-white border border-[#EFE8D8] p-6 rounded-sm shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-[#EFE8D8] pb-3">
                  <ShoppingBag size={18} className="text-[#C5A059]" />
                  <h2 className="font-serif text-lg text-[#2C1A14] font-medium">Your Order</h2>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {order.items.map((item) => {
                    const info = productMap[item.product_id];
                    return (
                      <div key={item.id} className="flex items-center justify-between text-xs font-sans border-b border-[#F7F3E9] pb-2">
                        <div className="flex items-center space-x-3">
                          {info?.thumbnail && (
                            <img src={getImageUrl(info.thumbnail)} alt={info.name} className="w-10 h-10 object-cover rounded bg-[#F7F3E9] border border-[#EFE8D8]" />
                          )}
                          <div>
                            <p className="font-medium text-[#2C1A14]">{info?.name || `Product #${item.product_id}`}</p>
                            <p className="text-[10px] text-[#3D261D]/60">
                              Qty: {item.quantity} {item.variant ? `(${item.variant})` : ""}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-[#2C1A14]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#EFE8D8] pt-3 space-y-1.5 text-xs font-sans text-[#3D261D]">
                  <div className="flex justify-between">
                    <span className="text-[#3D261D]/70">Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-[#3D261D]/70">Shipping</span>
                    <span className="text-[#C5A059] font-bold uppercase text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between font-serif font-bold text-base text-[#2C1A14] pt-2 border-t border-[#EFE8D8]">
                    <span>Total Paid</span>
                    <span>₹{order.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Payment Card */}
              <div className="space-y-6">
                
                {/* Delivery Address Card */}
                {customer && (
                  <div className="bg-white border border-[#EFE8D8] p-6 rounded-sm shadow-sm space-y-3">
                    <div className="flex items-center space-x-2 border-b border-[#EFE8D8] pb-3">
                      <MapPin size={18} className="text-[#C5A059]" />
                      <h2 className="font-serif text-lg text-[#2C1A14] font-medium">Delivery Address</h2>
                    </div>
                    <div className="text-xs font-sans text-[#3D261D] space-y-1 leading-relaxed">
                      <p className="font-bold text-[#2C1A14]">{customer.name}</p>
                      <p>{customer.address}</p>
                      <p>{customer.city}, {customer.state} - {customer.pincode}</p>
                      <p className="text-[11px] text-[#3D261D]/70 pt-1">Phone: {customer.phone} • Email: {customer.email}</p>
                    </div>
                  </div>
                )}

                {/* Payment Details */}
                <div className="bg-white border border-[#EFE8D8] p-6 rounded-sm shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 border-b border-[#EFE8D8] pb-3">
                    <CreditCard size={18} className="text-[#C5A059]" />
                    <h2 className="font-serif text-lg text-[#2C1A14] font-medium">Payment Details</h2>
                  </div>
                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex justify-between items-center">
                      <span className="text-[#3D261D]/70">Payment Method:</span>
                      <span className="font-semibold text-[#2C1A14]">UPI Transfer</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#3D261D]/70">Payment Status:</span>
                      <span className="font-bold text-[#C5A059] bg-[#F7F3E9] px-2 py-0.5 rounded border border-[#EFE8D8]">
                        Pending Verification
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#3D261D]/70">Tracking Ref:</span>
                      <span className="font-mono text-[11px] font-semibold text-[#2C1A14]">{order.tracking_number}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* BRAND MESSAGE & ACTIONS */}
            <div className="bg-[#F7F3E9] border border-[#EFE8D8] p-8 text-center space-y-6 rounded-sm">
              <div className="space-y-2">
                <p className="font-serif text-lg text-[#2C1A14]">
                  &ldquo;Thank you for choosing Qura Herbs.&rdquo;
                </p>
                <p className="text-xs text-[#3D261D]/70 font-sans italic">
                  Your skin deserves a ritual rooted in nature and backed by modern active science.
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
        )}

      </main>
    </div>
  );
}
