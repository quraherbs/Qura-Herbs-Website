"use client";

import Link from "next/link";
import { Leaf, Mail } from "lucide-react";

const InstagramIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const XIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.498 14.382c-.301-.15-1.781-.88-2.056-.98-.275-.1-.475-.15-.675.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.488-.893-.795-1.496-1.777-1.671-2.077-.175-.3-.019-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.494-.506-.675-.515-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.113 3.226 5.118 4.525.714.309 1.272.494 1.707.632.717.228 1.37.196 1.886.119.576-.086 1.78-.727 2.03-1.428.25-.701.25-1.302.175-1.428-.075-.126-.275-.226-.575-.376z"/>
    <path d="M12 2a9.93 9.93 0 0 0-7.029 2.929 9.93 9.93 0 0 0-2.616 7.647L1.05 21.65l9.284-1.282A9.934 9.934 0 0 0 12 22a10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream border-t border-brand-sand/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Leaf size={22} className="text-brand-accent" />
              <span className="font-serif text-xl tracking-[0.2em] text-brand-cream block font-medium">QURA HERBS</span>
            </Link>
            <p className="text-xs text-brand-cream/60 leading-relaxed font-sans font-light max-w-sm">
              An expression of botanical sophistication—where nature’s finest ingredients meet the precision of contemporary skincare science.
            </p>
            <p className="text-xs text-brand-cream/50 font-sans font-medium text-brand-accent/90">
              Authorized Reseller of Qura Herbs.
            </p>
            <p className="text-xs text-brand-cream/40 font-sans pt-2">
              © {new Date().getFullYear()} Qura Herbs. All rights reserved.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-accent">Menu</h4>
            <ul className="space-y-2.5 text-xs text-brand-cream/60 font-sans font-light">
              <li><Link href="/shop" className="hover:text-brand-accent transition-colors">Shop All Products</Link></li>
              <li><Link href="/#concerns" className="hover:text-brand-accent transition-colors">Shop by Concern</Link></li>
              <li><Link href="/results" className="hover:text-brand-accent transition-colors">Real Results Gallery</Link></li>
              <li><Link href="/about" className="hover:text-brand-accent transition-colors">About Qura Herbs</Link></li>
              <li><Link href="/journal" className="hover:text-brand-accent transition-colors">Skincare Journal</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-accent">Support</h4>
            <ul className="space-y-2.5 text-xs text-brand-cream/60 font-sans font-light">
              <li><Link href="/shipping" className="hover:text-brand-accent transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/refund" className="hover:text-brand-accent transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Form */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider font-semibold text-brand-accent">Newsletter</h4>
            <p className="text-xs text-brand-cream/60 font-sans font-light">
              Join in Community to claim 10% off your first skincare ritual purchase.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center pt-2">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="bg-brand-cream/10 border border-brand-cream/20 text-xs px-3 py-3 w-full text-brand-cream focus:outline-none focus:border-brand-accent rounded-none font-sans"
              />
              <button
                type="submit"
                className="bg-brand-accent text-brand-dark px-4 py-3 font-sans text-xs font-semibold uppercase hover:bg-brand-cream hover:text-brand-dark transition-all rounded-none"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Dedicated Social & Contact Action Buttons Bar */}
        <div className="pt-8 border-t border-brand-sand/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-cream/50 font-serif font-medium">
            Connect With Us
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/quraherbs?stkn=cDM3cWV2eWN5N3gw&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cream/5 hover:bg-brand-cream/10 border border-brand-cream/15 hover:border-brand-accent/50 text-brand-cream text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 rounded-none group focus:outline-none focus:ring-1 focus:ring-brand-accent"
              aria-label="Instagram"
            >
              <InstagramIcon size={15} className="text-brand-accent group-hover:scale-110 transition-transform" />
              <span>Instagram</span>
            </a>

            {/* X */}
            <a
              href="https://x.com/qura_herbs?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cream/5 hover:bg-brand-cream/10 border border-brand-cream/15 hover:border-brand-accent/50 text-brand-cream text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 rounded-none group focus:outline-none focus:ring-1 focus:ring-brand-accent"
              aria-label="X"
            >
              <XIcon size={14} className="text-brand-accent group-hover:scale-110 transition-transform" />
              <span>X</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919363739675"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cream/5 hover:bg-brand-cream/10 border border-brand-cream/15 hover:border-brand-accent/50 text-brand-cream text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 rounded-none group focus:outline-none focus:ring-1 focus:ring-brand-accent"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={15} className="text-brand-accent group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href="mailto:quraherbs@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cream/5 hover:bg-brand-cream/10 border border-brand-cream/15 hover:border-brand-accent/50 text-brand-cream text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 rounded-none group focus:outline-none focus:ring-1 focus:ring-brand-accent"
              aria-label="Email"
            >
              <Mail size={15} className="text-brand-accent group-hover:scale-110 transition-transform" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
