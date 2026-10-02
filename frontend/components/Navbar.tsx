"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Menu, X, ShoppingBag, Search, User, Heart } from "lucide-react";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EFE8D8] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            
            {/* COLUMN 1: LEFT LOGO */}
            <div className="flex-1 flex items-center justify-start">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#2C1A14] p-2 focus:outline-none md:hidden mr-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo Only */}
              <Link href="/" className="flex items-center group">
                <img 
                  src="/logo.png" 
                  alt="Qura Herbs Logo" 
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                />
              </Link>
            </div>

            {/* COLUMN 2: CENTER ALIGNED NAVIGATION LINKS */}
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
            <div className="flex-1 flex items-center justify-end space-x-3 sm:space-x-5">
              <Link href="/search" className="text-[#2C1A14] hover:text-[#C5A059] transition-colors p-1" aria-label="Search">
                <Search size={20} strokeWidth={1.5} />
              </Link>
              
              <Link href="/account" className="text-[#2C1A14] hover:text-[#C5A059] transition-colors p-1" aria-label="Account">
                <User size={20} strokeWidth={1.5} />
              </Link>

              <Link href="/wishlist" className="text-[#2C1A14] hover:text-[#C5A059] transition-colors p-1 hidden sm:block" aria-label="Wishlist">
                <Heart size={20} strokeWidth={1.5} />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-[#2C1A14] hover:text-[#C5A059] p-2 focus:outline-none transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C5A059] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#EFE8D8] shadow-xl z-50">
            <div className="px-6 pt-4 pb-8 space-y-3">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-2 uppercase tracking-widest font-sans border-b border-[#EFE8D8]"
              >
                Shop
              </Link>
              <Link
                href="/results"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-2 uppercase tracking-widest font-sans border-b border-[#EFE8D8]"
              >
                Results
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-2 uppercase tracking-widest font-sans border-b border-[#EFE8D8]"
              >
                About
              </Link>
              <Link
                href="/journal"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-2 uppercase tracking-widest font-sans border-b border-[#EFE8D8]"
              >
                Journal
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#2C1A14] hover:text-[#C5A059] py-2 uppercase tracking-widest font-sans"
              >
                Wishlist
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
