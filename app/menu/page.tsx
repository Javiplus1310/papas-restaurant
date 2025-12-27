import ProductCard from "../components/ProductCard";
import { allProducts } from "../data/products";

export default function MenuPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 pt-28">
      <h1 className="text-3xl font-bold mb-6">Menú Completo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </main>
  );
}