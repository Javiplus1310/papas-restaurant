"use client";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: any }) {
  return (
    <article className="bg-white/5 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      <div className="w-full h-40 relative">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-300 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-accent">${product.price.toLocaleString('es-CL')}</div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}