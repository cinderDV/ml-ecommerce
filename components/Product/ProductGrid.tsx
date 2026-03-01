import ProductCard from "./ProductCard";
import type { ProductCardProps } from "@/lib/types/producto";
import CategoryCard, { type CategoryCardProps } from "./CategoryCard";

export type GridItem =
  | ({ type: "product" } & ProductCardProps)
  | ({ type: "category" } & CategoryCardProps);

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  items: GridItem[];
}

export default function ProductGrid({ title, subtitle, items }: ProductGridProps) {
  return (
    <div className="mx-auto px-6 sm:px-10 lg:px-16">
      {title && (
        <div className="mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-neutral-400 max-w-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 sm:gap-6">
        {items.map((item) => {
          if (item.type === "category") {
            return <CategoryCard key={`category-${item.id}`} {...item} />;
          }

          return <ProductCard key={`product-${item.id}`} {...item} />;
        })}
      </div>
    </div>
  );
}
