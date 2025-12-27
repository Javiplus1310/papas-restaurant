"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartButton() {
  const { cart } = useCart();
  const count = cart.reduce((s: number, p: any) => s + (p.qty || 0), 0);

  return (
    <Link href="/carrito" className="relative inline-flex items-center px-3 py-2 bg-white/5 rounded-md">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2"><path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <span className="text-sm">Carrito</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}