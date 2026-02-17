import CategoryHeader from "@/components/Product/CategoryHeader";
import ProductGrid, { type GridItem } from "@/components/Product/ProductGrid";
import SubcategoryNav from "@/components/layout/header/SubcategoryNav";
import { productosAsientos } from "@/lib/data/productos";

const subcategorias = [
  { label: "Sofás", id: "sofas" },
  { label: "Sillones", id: "sillones" },
  { label: "Sillas", id: "sillas" },
  { label: "Bancos", id: "bancos" },
];

// Filtrar productos por subcategoría y mapear a GridItem
function productosPorSubcategoria(sub: string): GridItem[] {
  return productosAsientos
    .filter((p) => p.subcategory === sub)
    .map((p) => ({ type: "product" as const, ...p }));
}

// La tarjeta de colección "Línea Nórdica" no es un producto — se define inline
const categoriaLineaNordica: GridItem = {
  type: "category",
  id: 100,
  name: "Línea Nórdica",
  description: "Diseño escandinavo con líneas limpias y materiales naturales",
  image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
};

const mockSofas: GridItem[] = [categoriaLineaNordica, ...productosPorSubcategoria("Sofás")];
const mockSillones: GridItem[] = productosPorSubcategoria("Sillones");
const mockSillas: GridItem[] = productosPorSubcategoria("Sillas");
const mockBancos: GridItem[] = productosPorSubcategoria("Bancos");

export default function CatalogoAsientos() {
  return (
    <>
      <CategoryHeader
        title="Asientos"
        description="Descubre nuestra colección completa de asientos modulares, desde sofás compactos hasta seccionales amplios. Todo se arma en minutos."
        backgroundImage="/images/AsientosCategoryImage.png"
        ctaHref="#sofas"
      />

      <SubcategoryNav items={subcategorias} />

      <section id="sofas" className="pt-14 pb-4 scroll-mt-28">
        <ProductGrid
          title="Sofás"
          subtitle="Confort y diseño para tu sala de estar"
          items={mockSofas}
        />
      </section>

      <section id="sillones" className="pt-14 pb-4 scroll-mt-28">
        <ProductGrid
          title="Sillones"
          subtitle="El complemento perfecto para tu rincón de lectura"
          items={mockSillones}
        />
      </section>

      <section id="sillas" className="pt-14 pb-4 scroll-mt-28">
        <ProductGrid
          title="Sillas"
          subtitle="Funcionalidad y estilo para comedor y escritorio"
          items={mockSillas}
        />
      </section>

      <section id="bancos" className="pt-14 pb-10 scroll-mt-28">
        <ProductGrid
          title="Bancos"
          subtitle="Versatilidad en madera maciza para cualquier espacio"
          items={mockBancos}
        />
      </section>
    </>
  );
}
