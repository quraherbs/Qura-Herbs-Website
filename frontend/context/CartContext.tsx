"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number | null;
  thumbnail: string;
  quantity: number;
  variant?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: number, variant?: string | null) => void;
  updateQuantity: (id: number, quantity: number, variant?: string | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("qura_cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart items:", e);
        }
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to LocalStorage whenever it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("qura_cart", JSON.stringify(newCart));
  };

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    const existingIndex = cart.findIndex(
      (i) => i.id === item.id && i.variant === item.variant
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      saveCart(newCart);
    } else {
      saveCart([...cart, { ...item, quantity }]);
    }
    // Automatically open cart drawer to verify addition
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number, variant?: string | null) => {
    const newCart = cart.filter((i) => !(i.id === id && i.variant === variant));
    saveCart(newCart);
  };

  const updateQuantity = (id: number, quantity: number, variant?: string | null) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }
    const newCart = cart.map((i) =>
      i.id === id && i.variant === variant ? { ...i, quantity } : i
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cart.reduce((total, item) => {
    const price = item.sale_price !== undefined && item.sale_price !== null ? item.sale_price : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
