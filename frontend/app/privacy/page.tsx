"use client";

import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16 space-y-8 font-sans font-light text-sm text-brand-cocoa leading-relaxed">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-dark mb-4">
          Privacy Policy
        </h1>
        <div className="w-12 h-[1px] bg-brand-accent"></div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Information Collection</h2>
          <p>
            We collect personal details (name, phone, shipping address, email) strictly to process your skincare checkout transactions and coordinate updates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Payment Security</h2>
          <p>
            We process transactions securely via direct UPI transfer. Qura Herbs does not store or process card details. All orders are manually validated via WhatsApp confirmation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Cookies Policy</h2>
          <p>
            We use localized browser variables (LocalStorage) to persist your active cart and wishlist selections. No cross-site advertisement trackings are utilized.
          </p>
        </section>
      </main>

      <CartDrawer />
    </div>
  );
}
