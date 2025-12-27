"use client";
import Link from "next/link";
import { useState } from "react";
import CartButton from "./CartButton";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full z-40 bg-black/75 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-brand">PR</span>
          </div>
          <div>
            <span className="text-lg font-semibold">Papa's Restaurant</span>
            <div className="text-xs text-gray-400">Comida rápida • Pedidos online</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="hover:text-accent transition">Inicio</Link>
          <Link href="/menu" className="hover:text-accent transition">Menú</Link>
          <Link href="/promos" className="hover:text-accent transition">Promos</Link>
          <Link href="/ubicacion" className="hover:text-accent transition">Ubicación</Link>
          <Link href="/contacto" className="hover:text-accent transition">Contacto</Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartButton />
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black/95 border-t border-gray-800">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link href="/">Inicio</Link>
            <Link href="/menu">Menú</Link>
            <Link href="/promos">Promos</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>
      )}
    </header>
  );
}