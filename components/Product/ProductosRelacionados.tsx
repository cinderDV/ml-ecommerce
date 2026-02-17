import ProductCard from "./ProductCard";
import type { ProductoDetalle } from "@/lib/types/producto";

interface ProductosRelacionadosProps {
  productos: ProductoDetalle[];
}

export default function ProductosRelacionados({ productos }: ProductosRelacionadosProps) {
  if (productos.length === 0) return null;

  return (
    <section className="px-6 sm:px-10 lg:px-16 pb-16 lg:pb-20">
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight mb-6">
        Productos relacionados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 sm:gap-6">
        {productos.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
