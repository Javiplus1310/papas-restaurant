"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmacionPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      return;
    }

    // Verificar el estado del pago
    async function verifyPayment() {
      try {
        const response = await fetch("/api/flow/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success && data.status === 2) {
          // status 2 = Pagado
          setStatus("success");
          setOrderInfo(data);
          
          // Limpiar el carrito del localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("cart_v1");
          }
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error al verificar pago:", error);
        setStatus("error");
      }
    }

    verifyPayment();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 pt-28 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Verificando pago...</h1>
          <p className="text-gray-400">Por favor espera un momento</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 pt-28 text-center">
        <div className="bg-red-500/10 border border-red-500 rounded-xl p-8">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2 text-red-500">Error en el pago</h1>
          <p className="text-gray-300 mb-6">
            Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/carrito" className="bg-brand px-6 py-3 rounded-md text-white">
              Volver al carrito
            </Link>
            <Link href="/menu" className="bg-white/10 px-6 py-3 rounded-md text-white">
              Ver menú
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 pt-28 text-center">
      <div className="bg-green-500/10 border border-green-500 rounded-xl p-8">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2 text-green-500">¡Pago exitoso!</h1>
        <p className="text-gray-300 mb-6">
          Tu pedido ha sido confirmado y será procesado pronto.
        </p>
        
        {orderInfo && (
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-gray-400 mb-1">Número de orden</div>
            <div className="font-mono font-semibold">{orderInfo.commerceOrder}</div>
            
            <div className="text-sm text-gray-400 mb-1 mt-3">Total pagado</div>
            <div className="text-2xl font-bold text-accent">
              ${parseInt(orderInfo.amount).toLocaleString('es-CL')}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link href="/menu" className="bg-brand px-6 py-3 rounded-md text-white">
            Seguir comprando
          </Link>
          <Link href="/" className="bg-white/10 px-6 py-3 rounded-md text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}