"use client";

import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16 space-y-8 font-sans font-light text-sm text-brand-cocoa leading-relaxed">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-dark mb-4">
          Terms of Service
        </h1>
        <div className="w-12 h-[1px] bg-brand-accent"></div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Intellectual Property</h2>
          <p>
            All brand design patterns, typography setups, photography, and text content displayed on this website are owned exclusively by Qura Herbs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Product Use Disclaimer</h2>
          <p>
            Our formulations represent clean botanical skincare. They do not claim to replace prescription pharmaceutical dermatology. Check the ingredients label for allergen testing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-brand-dark">Pricing Updates</h2>
          <p>
            We reserve the right to modify prices and introduce promotional coupon offers based on batch availability and organic harvesting seasons.
          </p>
        </section>
      </main>

      <CartDrawer />
    </div>
  );
}
