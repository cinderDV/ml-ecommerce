import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductoPorSlug, getProductosRelacionados } from '@/lib/api/woocommerce';
import { mapWcToProductoDetalle, mapWcToProductCard } from '@/lib/api/mappers';
import Breadcrumbs from '@/components/Product/Breadcrumbs';
import ProductoDetalleVista from '@/components/Product/ProductoDetalleVista';
import ProductosRelacionados from '@/components/Product/ProductosRelacionados';

export const revalidate = 60;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wc = await getProductoPorSlug(slug);

  if (!wc) {
    return { title: 'Producto no encontrado — Muebles Latina' };
  }

  const descLimpia = wc.short_description.replace(/<[^>]*>/g, '').trim();

  return {
    title: `${wc.name} — Muebles Latina`,
    description: descLimpia.slice(0, 160) || `${wc.name} disponible en Muebles Latina`,
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const wc = await getProductoPorSlug(slug);

  if (!wc) {
    notFound();
  }

  const producto = mapWcToProductoDetalle(wc);

  // Productos relacionados de la misma categoría
  const catId = wc.categories[0]?.id;
  const relacionadosWc = catId
    ? await getProductosRelacionados(catId, wc.id)
    : [];
  const relacionados = relacionadosWc.map((p) => ({
    ...mapWcToProductCard(p),
    descripcion: '',
    imagenes: p.images.map((img) => img.src),
    categorySlug: p.categories[0]?.slug ?? '',
    subcategory: p.categories[0]?.name ?? '',
  }));

  // Breadcrumbs desde las categorías del producto WC
  const cat = wc.categories[0];
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    ...(cat ? [{ label: cat.name, href: `/categoria/${cat.slug}` }] : []),
    { label: wc.name },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ProductoDetalleVista producto={producto} />
      <ProductosRelacionados productos={relacionados} />
    </>
  );
}
