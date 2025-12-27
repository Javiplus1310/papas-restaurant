"use client";
import Link from "next/link";
import Image from "next/image";

const HERO_IMG = "/images/2151985511.jpg";

export default function Hero() {
  return (
    <section className="pt-28">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            ¡Rápido, caliente y delicioso!
          </h1>
          <p className="text-gray-300 mb-6">
            Menú diario con combos y promos. Pide por WhatsApp o haz tu pedido online en pocos clicks.
          </p>

          <div className="flex gap-3">
            <Link href="/menu" className="bg-brand px-6 py-3 rounded-md font-semibold hover:bg-brand-dark transition">
              Ver menú
            </Link>
            <Link href="/contacto" className="bg-white/5 px-6 py-3 rounded-md text-white hover:bg-white/10 transition">
              Contacto
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            Promoción: <strong className="text-accent ml-1">$2.990 Combo Hamburguesa + Papas</strong>
          </div>
        </div>

        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-xl">
          <Image src={HERO_IMG} alt="Hero imagen" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}