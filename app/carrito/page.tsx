"use client";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  description?: string;
  image?: string;
};

export default function CarritoPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const total = cart.reduce((s: number, p: any) => s + p.price * p.qty, 0);

  async function handleCheckout() {
    if (cart.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Generar ID único para la orden
      const orderId = `ORDER-${Date.now()}`;
      
      // Crear descripción del pedido
      const subject = cart.map((p: CartItem) => `${p.name} x${p.qty}`).join(", ");

      // Llamar a nuestro endpoint
      const response = await fetch("/api/flow/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          orderId,
          subject: subject.substring(0, 140), // Flow limita a 140 caracteres
          email: "javidx_13@hotmail.cl", // Email obligatorio para Flow
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la orden");
      }

      // Redirigir a Flow para el pago
      const paymentUrl = `${data.url}?token=${data.token}`;
      window.location.href = paymentUrl;

    } catch (err: any) {
      console.error("Error en checkout:", err);
      setError(err.message || "Error al procesar el pago. Intenta nuevamente.");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 pt-28">
      <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-6">Tu carrito está vacío.</p>
          <Link href="/menu" className="bg-brand px-6 py-3 rounded text-white">
            Ver menú
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                {/* Imagen del producto */}
                <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                
                {/* Info del producto */}
                <div className="flex-grow">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-400">
                    ${item.price.toLocaleString('es-CL')} x {item.qty}
                  </div>
                </div>
                
                {/* Controles de cantidad */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))} 
                    className="px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition"
                  >
                    -
                  </button>
                  <div className="px-3 font-semibold">{item.qty}</div>
                  <button 
                    onClick={() => updateQty(item.id, item.qty + 1)} 
                    className="px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-red-400 hover:text-red-300 transition ml-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-6">
            <div>
              <div className="text-gray-400 text-sm">Total</div>
              <div className="text-3xl font-bold text-accent">
                ${total.toLocaleString('es-CL')}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => clearCart()} 
                className="bg-gray-600 px-5 py-3 rounded-md text-white hover:bg-gray-700 transition"
                disabled={loading}
              >
                Vaciar carrito
              </button>
              <button 
                onClick={handleCheckout} 
                className="bg-accent px-6 py-3 rounded-md font-bold text-black hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Pagar ahora"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}