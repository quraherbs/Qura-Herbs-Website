"use client";

import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";

export default function RefundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16 space-y-8 font-sans font-light text-sm text-brand-cocoa leading-relaxed">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-dark mb-4">
          Returns & Refunds Policy
        </h1>
        <div className="w-12 h-[1px] bg-brand-accent"></div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Our Guarantee</h2>
          <p>
            Due to the organic nature of our botanical ingredients, items cannot be returned once opened. We stand behind our clinical formulas and offer replacement solutions for damaged transits.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Damaged or Incorrect Shipments</h2>
          <p>
            If you received a damaged container, please contact our support team at **info@quraherbs.in** or via WhatsApp within **48 hours** of delivery with photos of the package.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Refund Processing</h2>
          <p>
            Approved claims will be refunded directly to your original payment card/UPI details within **5 - 7 working days**.
          </p>
        </section>
      </main>

      <CartDrawer />
    </div>
  );
}
