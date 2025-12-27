"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("cart_v1") : null;
    if (raw) setCart(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("cart_v1", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));
  const updateQty = (id: string, qty: number) => setCart(prev => prev.map(p => p.id === id ? { ...p, qty } : p));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}