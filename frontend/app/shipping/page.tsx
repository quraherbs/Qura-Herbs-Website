"use client";

import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";

export default function ShippingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16 space-y-8 font-sans font-light text-sm text-brand-cocoa leading-relaxed">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-dark mb-4">
          Shipping & Delivery
        </h1>
        <div className="w-12 h-[1px] bg-brand-accent"></div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Dispatch Timelines</h2>
          <p>
            All Qura Herbs editorial skincare elixirs are freshly inspected and dispatched within **1 - 2 business days** from our botanical laboratories.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Shipping Charges</h2>
          <p>
            We offer **Free Standard Shipping** across India for all purchases above **₹999**. For orders under ₹999, a flat shipping fee of ₹99 is applied at checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Delivery Estimates</h2>
          <p>
            Standard transit takes **3 - 5 business days** for metro areas, and **5 - 7 business days** for regional pin codes.
          </p>
        </section>
      </main>

      <CartDrawer />
    </div>
  );
}
