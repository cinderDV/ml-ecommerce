import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategorias, getCategoriaPorSlug, getProductosPorCategoria } from '@/lib/api/woocommerce';
import { mapWcToProductCard } from '@/lib/api/mappers';
import CategoryHeader from '@/components/Product/CategoryHeader';
import ProductGrid, { type GridItem } from '@/components/Product/ProductGrid';
import SubcategoryNav from '@/components/layout/header/SubcategoryNav';
import { ordenSubcategorias } from '@/lib/api/orden';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoriaPorSlug(slug);

  if (!categoria) {
    return { title: 'Categoría no encontrada — Muebles Latina' };
  }

  return {
    title: `${categoria.name} — Muebles Latina`,
    description: `Explora nuestra colección de ${categoria.name.toLowerCase()}`,
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;
  const [categoria, todasCategorias] = await Promise.all([
    getCategoriaPorSlug(slug),
    getCategorias(),
  ]);

  if (!categoria) {
    notFound();
  }

  // Buscar categorías hijas, ordenadas por prioridad
  const hijas = todasCategorias
    .filter((c) => c.parent === categoria.id)
    .sort((a, b) => (ordenSubcategorias[a.slug] ?? 99) - (ordenSubcategorias[b.slug] ?? 99));

  const headerImage = categoria.image?.src ?? '/images/AsientosCategoryImage.png';
  const headerDescription = categoria.description?.replace(/<[^>]*>/g, '').trim()
    || `Explora nuestra colección de ${categoria.name.toLowerCase()}`;

  if (hijas.length > 0) {
    // Categoría con subcategorías: renderizar secciones por cada hija
    const seccionesData = await Promise.all(
      hijas.map(async (hija) => {
        const productos = await getProductosPorCategoria(hija.id);
        const items: GridItem[] = productos.map((p) => ({
          type: 'product' as const,
          ...mapWcToProductCard(p),
        }));
        return { hija, items };
      }),
    );

    // Filtrar secciones vacías
    const secciones = seccionesData.filter((s) => s.items.length > 0);

    const subcategorias = secciones.map((s) => ({
      label: s.hija.name,
      id: s.hija.slug,
    }));

    return (
      <>
        <CategoryHeader
          title={categoria.name}
          description={headerDescription}
          backgroundImage={headerImage}
          productCount={categoria.count}
          ctaHref={`#${secciones[0]?.hija.slug}`}
        />

        {subcategorias.length > 1 && <SubcategoryNav items={subcategorias} />}

        {secciones.map((seccion) => (
          <section
            key={seccion.hija.id}
            id={seccion.hija.slug}
            className="pt-14 pb-4 scroll-mt-28"
          >
            <ProductGrid
              title={seccion.hija.name}
              items={seccion.items}
            />
          </section>
        ))}
      </>
    );
  }

  // Categoría sin hijas: grid plano
  const productos = await getProductosPorCategoria(categoria.id);
  const items: GridItem[] = productos.map((p) => ({
    type: 'product' as const,
    ...mapWcToProductCard(p),
  }));

  return (
    <>
      <CategoryHeader
        title={categoria.name}
        description={headerDescription}
        backgroundImage={headerImage}
        productCount={categoria.count}
      />

      <section className="pt-14 pb-10">
        <ProductGrid items={items} />
      </section>
    </>
  );
}
