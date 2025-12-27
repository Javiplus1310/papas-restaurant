export default function Footer() {
  return (
    <footer className="mt-16 bg-black/80 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
        <div>
          <div className="text-white font-semibold">Papa's Restaurant</div>
          <div className="text-sm">Menú y pedidos online</div>
        </div>

        <div className="text-sm mt-4 md:mt-0">
          © {new Date().getFullYear()} Papa's Restaurant — Hecho con ❤️
        </div>
      </div>
    </footer>
  );
}