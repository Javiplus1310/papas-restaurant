"use client";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className="bg-brand px-3 py-2 rounded-md text-white font-medium hover:bg-brand-dark transition"
    >
      Agregar
    </button>
  );
}