"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("viper_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCart(items);
    try {
      localStorage.setItem("viper_cart", JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  const addToCart = (item: CartItem) => {
    if (!cart.some((c) => c.id === item.id)) {
      const updated = [...cart, item];
      saveCart(updated);
    }
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter((c) => c.id !== id);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);
  const totalItems = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
