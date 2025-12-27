export default function UbicacionPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 pt-28">
      <h1 className="text-3xl font-bold mb-4">Ubicación</h1>
      <p className="text-gray-300 mb-6">Estamos en tu barrio — abre horarios y dirección aquí.</p>
      <div className="w-full h-64 bg-white/5 rounded-xl flex items-center justify-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1665.1361393942905!2d-70.67601470516603!3d-33.41614506564097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c42e1261715b%3A0xb600376d062a7e43!2sRincon%20Sabroso!5e0!3m2!1ses-419!2scl!4v1765341794997!5m2!1ses-419!2scl"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  );
}
