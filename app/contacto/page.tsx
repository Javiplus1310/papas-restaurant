export default function ContactoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 pt-28">
      <h1 className="text-3xl font-bold mb-4">Contacto</h1>
      <p className="text-gray-300 mb-6">Contáctanos por WhatsApp o completa el formulario.</p>

      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Nombre" className="p-3 rounded bg-black/50 border border-gray-800"/>
        <input type="tel" placeholder="Teléfono (WhatsApp)" className="p-3 rounded bg-black/50 border border-gray-800"/>
        <textarea placeholder="Mensaje" className="p-3 rounded h-36 bg-black/50 border border-gray-800"></textarea>
        <button className="bg-brand px-4 py-2 rounded text-white">Enviar</button>
      </form>
    </main>
  );
}