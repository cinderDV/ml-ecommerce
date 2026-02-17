import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductoPorSlug,
  getProductosRelacionados,
  getTodosLosProductos,
} from "@/lib/data/productos";
import Breadcrumbs from "@/components/Product/Breadcrumbs";
import ProductoDetalleVista from "@/components/Product/ProductoDetalleVista";
import ProductosRelacionados from "@/components/Product/ProductosRelacionados";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Mapa de categorySlug a nombre visible y ruta
const categoryInfo: Record<string, { label: string; href: string }> = {
  asientos: { label: "Asientos", href: "/asientos" },
  dormitorio: { label: "Dormitorio", href: "/dormitorio" },
  "sala-de-estar": { label: "Sala de estar", href: "/sala-de-estar" },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const producto = getProductoPorSlug(slug);

  if (!producto) {
    return { title: "Producto no encontrado — Muebles Latina" };
  }

  return {
    title: `${producto.name} — Muebles Latina`,
    description: producto.descripcion.slice(0, 160),
  };
}

export function generateStaticParams() {
  return getTodosLosProductos().map((p) => ({ slug: p.slug }));
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const producto = getProductoPorSlug(slug);

  if (!producto) {
    notFound();
  }

  const relacionados = getProductosRelacionados(producto.subcategory, producto.slug);
  const cat = categoryInfo[producto.categorySlug];

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    ...(cat ? [{ label: cat.label, href: cat.href }] : []),
    { label: producto.subcategory, href: cat ? `${cat.href}#${producto.subcategory.toLowerCase()}` : undefined },
    { label: producto.name },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ProductoDetalleVista producto={producto} />
      <ProductosRelacionados productos={relacionados} />
    </>
  );
}
