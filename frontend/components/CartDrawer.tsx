"use client";

import { useCart } from "../context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/api";

export default function CartDrawer() {
  const { 
    cart, 
    cartCount, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  // Free shipping threshold
  const freeShippingLimit = 1999;
  const shippingCost = cartTotal >= freeShippingLimit || cartTotal === 0 ? 0 : 99;
  const grandTotal = cartTotal + shippingCost;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-brand-dark z-50 cursor-pointer"
          />

          {/* Cart Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-cream border-l border-brand-sand/50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-sand/30 flex justify-between items-center bg-brand-cream">
              <div className="flex items-center space-x-2.5">
                <img src="/logo.png" alt="Qura Herbs Logo" className="h-7 w-auto object-contain" />
                <h2 className="font-serif text-xl uppercase tracking-widest text-brand-dark">
                  Your Ritual ({cartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-brand-dark hover:text-brand-accent p-1 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {cartTotal > 0 && (
              <div className="bg-brand-light px-6 py-3 border-b border-brand-sand/20 text-xs text-brand-cocoa font-sans flex flex-col space-y-1">
                {cartTotal >= freeShippingLimit ? (
                  <span>✨ Congratulations! You qualify for **Free Shipping**</span>
                ) : (
                  <span>
                    Add <strong>₹{freeShippingLimit - cartTotal}</strong> more for <strong>Free Shipping</strong>
                  </span>
                )}
                <div className="w-full bg-brand-sand/30 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-brand-accent h-full transition-all duration-500" 
                    style={{ width: `${Math.min((cartTotal / freeShippingLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                  <span className="font-serif text-lg text-brand-cocoa">Your ritual starts here.</span>
                  <p className="text-xs text-brand-dark/50 max-w-[250px] font-sans">
                    Nourish your skin barrier with botanical elixirs. Browse the collection.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-brand-dark hover:bg-brand-accent text-brand-cream uppercase tracking-widest text-xs py-3 px-8 transition-colors duration-300 font-semibold"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const activePrice = item.sale_price !== undefined && item.sale_price !== null ? item.sale_price : item.price;
                  return (
                    <div 
                      key={`${item.id}-${item.variant}`} 
                      className="flex space-x-4 border-b border-brand-sand/20 pb-6"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-brand-light border border-brand-sand/30 overflow-hidden flex-shrink-0">
                        <img 
                          src={getImageUrl(item.thumbnail)} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-sm font-semibold text-brand-dark line-clamp-1 pr-2">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id, item.variant)}
                              className="text-brand-dark/40 hover:text-red-600 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          {item.variant && (
                            <span className="text-[10px] uppercase font-sans tracking-wider text-brand-accent mt-0.5 block">
                              Size: {item.variant}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-brand-sand/60 px-2 py-1 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                              className="text-brand-dark/60 hover:text-brand-dark p-0.5 focus:outline-none"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-sans font-medium text-brand-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                              className="text-brand-dark/60 hover:text-brand-dark p-0.5 focus:outline-none"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {item.sale_price !== undefined && item.sale_price !== null ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-brand-dark/40 line-through">
                                  ₹{item.price * item.quantity}
                                </span>
                                <span className="text-sm font-sans font-semibold text-brand-dark">
                                  ₹{activePrice * item.quantity}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-sans font-semibold text-brand-dark">
                                ₹{item.price * item.quantity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary (Only if cart has items) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-brand-sand/30 bg-brand-light space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-brand-cocoa font-sans">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-cocoa font-sans">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-brand-dark font-sans pt-2 border-t border-brand-sand/15">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Checkout Link */}
                <div className="pt-2">
                  <Link 
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full bg-brand-dark hover:bg-brand-accent text-brand-cream text-center font-sans text-xs uppercase tracking-widest py-4 font-bold transition-all duration-300 shadow-md hover:shadow-lg rounded-none"
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
                
                <p className="text-[10px] text-center text-brand-dark/40 font-sans">
                  Secure manual checkout via UPI transfer. Duty and taxes included.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
