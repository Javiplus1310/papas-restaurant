import ProductCard from "../components/ProductCard";
import { promoProduct } from "../data/products";

export default function PromosPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 pt-28">
      <h1 className="text-3xl font-bold mb-6">Promociones</h1>
      <p className="text-gray-300 mb-8">Aprovecha nuestras ofertas especiales del día.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promoProduct && <ProductCard product={promoProduct} />}
      </div>
    </main>
  );
}