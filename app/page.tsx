import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import { featuredProducts } from "./data/products";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}