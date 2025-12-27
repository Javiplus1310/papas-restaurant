"use client";
import { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setStatus("success");
      setFormData({ nombre: "", telefono: "", mensaje: "" });
      
      setTimeout(() => setStatus("idle"), 5000);

    } catch (error: any) {
      console.error("Error al enviar formulario:", error);
      setStatus("error");
      setErrorMessage(error.message || "Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 pt-28">
      <h1 className="text-3xl font-bold mb-4">Contacto</h1>
      <p className="text-gray-300 mb-6">
        Contáctanos por WhatsApp o completa el formulario y te responderemos a la brevedad.
      </p>

      {/* Botón de WhatsApp */}
      <a
        href="https://wa.me/56978291929?text=Hola,%20quisiera%20hacer%20un%20pedido%20en%20Papa's%20Restaurant"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mb-8 transition"
      >
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Escríbenos por WhatsApp
      </a>

      {/* Mensajes de estado */}
      {status === "success" && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-6">
          ✅ Mensaje enviado correctamente. Te responderemos pronto.
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          ❌ {errorMessage}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="p-3 rounded bg-black/50 border border-gray-800 focus:border-brand outline-none transition"
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="p-3 rounded bg-black/50 border border-gray-800 focus:border-brand outline-none transition"
        />
        <textarea
          name="mensaje"
          placeholder="Mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          required
          className="p-3 rounded h-36 bg-black/50 border border-gray-800 focus:border-brand outline-none transition resize-none"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand px-4 py-3 rounded text-white hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </main>
  );
}