"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Menu, X, ShoppingBag, Search, User, Heart } from "lucide-react";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EFE8D8] z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
            
            {/* COLUMN 1: LEFT LOGO & HAMBURGER */}
            <div className="flex items-center justify-start min-w-0">
              {/* Mobile Menu Toggle with 44px touch area */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-[#2C1A14] hover:text-[#C5A059] focus:outline-none md:hidden -ml-1 mr-1 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo Only */}
              <Link href="/" className="flex items-center group shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Qura Herbs Logo" 
                  className="h-9 sm:h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                />
              </Link>
            </div>

            {/* COLUMN 2: CENTER ALIGNED NAVIGATION LINKS (Desktop only) */}
            <nav className="hidden md:flex items-center justify-center space-x-6 lg:space-x-8 px-4">
              <Link
                href="/shop"
                className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#2C1A14] hover:text-[#C5A059] transition-colors duration-300 font-semibold py-1 border-b border-transparent hover:border-[#C5A059]"
              >
                Shop
              </Link>

              <Link
                href="/#bestsellers"
                className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#2C1A14] hover:text-[#C5A059] transition-colors duration-300 font-semibold py-1 border-b border-transparent hover:border-[#C5A059]"
              >
                Bestsellers
              </Link>

              <Link
                href="/results"
                className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#2C1A14] hover:text-[#C5A059] transition-colors duration-300 font-semibold py-1 border-b border-transparent hover:border-[#C5A059]"
              >
                Results
              </Link>

              <Link
                href="/about"
                className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#2C1A14] hover:text-[#C5A059] transition-colors duration-300 font-semibold py-1 border-b border-transparent hover:border-[#C5A059]"
              >
                About
              </Link>

              <Link
                href="/journal"
                className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#2C1A14] hover:text-[#C5A059] transition-colors duration-300 font-semibold py-1 border-b border-transparent hover:border-[#C5A059]"
              >
                Journal
              </Link>
            </nav>

            {/* COLUMN 3: RIGHT ALIGNED ACTION BUTTONS */}
            <div className="flex items-center justify-end space-x-0.5 sm:space-x-2 md:space-x-4">
              <Link
                href="/search"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#2C1A14] hover:text-[#C5A059] transition-colors"
                aria-label="Search catalog"
              >
                <Search size={19} strokeWidth={1.7} />
              </Link>
              
              <Link
                href="/wishlist"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#2C1A14] hover:text-[#C5A059] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.7} />
              </Link>

              <Link
                href="/account"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#2C1A14] hover:text-[#C5A059] transition-colors"
                aria-label="Account & orders"
              >
                <User size={19} strokeWidth={1.7} />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#2C1A14] hover:text-[#C5A059] focus:outline-none transition-colors cursor-pointer"
                aria-label="View shopping bag"
              >
                <ShoppingBag size={19} strokeWidth={1.7} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 bg-[#C5A059] text-white text-[9px] sm:text-[10px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold font-sans shadow-sm ring-1 ring-[#FDFBF7]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer with Backdrop */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="md:hidden fixed inset-0 top-16 sm:top-20 bg-[#2C1A14]/30 backdrop-blur-xs z-40 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#EFE8D8] shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-5 pt-3 pb-6 space-y-1">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-3 uppercase tracking-widest font-sans border-b border-[#EFE8D8]/70"
                >
                  <span>Shop Catalog</span>
                  <span className="text-[#C5A059] text-xs">→</span>
                </Link>
                <Link
                  href="/#bestsellers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-3 uppercase tracking-widest font-sans border-b border-[#EFE8D8]/70"
                >
                  <span>Our Bestsellers</span>
                  <span className="text-[#C5A059] text-xs">→</span>
                </Link>
                <Link
                  href="/results"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-3 uppercase tracking-widest font-sans border-b border-[#EFE8D8]/70"
                >
                  <span>Real Results</span>
                  <span className="text-[#C5A059] text-xs">→</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-3 uppercase tracking-widest font-sans border-b border-[#EFE8D8]/70"
                >
                  <span>About Qura Herbs</span>
                  <span className="text-[#C5A059] text-xs">→</span>
                </Link>
                <Link
                  href="/journal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-3 uppercase tracking-widest font-sans border-b border-[#EFE8D8]/70"
                >
                  <span>Skincare Journal</span>
                  <span className="text-[#C5A059] text-xs">→</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-3 uppercase tracking-widest font-sans border-b border-[#EFE8D8]/70"
                >
                  <span>Wishlist</span>
                  <span className="text-[#C5A059] text-xs">→</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-3 uppercase tracking-widest font-sans"
                >
                  <span>Track Order &amp; Account</span>
                  <span className="text-[#C5A059] text-xs">→</span>
                </Link>

                <div className="pt-4 mt-2 border-t border-[#EFE8D8] text-[11px] font-sans text-[#3D261D]/70 space-y-1">
                  <p className="font-medium text-[#2C1A14]">Botanical Skincare &amp; Haircare</p>
                  <p className="text-[10px]">Complimentary Shipping on Orders Above ₹799</p>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
