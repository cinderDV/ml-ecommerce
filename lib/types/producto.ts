// Interfaces compartidas para productos
// Cuando conectemos WooCommerce, mapearemos su respuesta a estas formas.

export interface ProductVariant {
  color: string;
  hex: string;
  image: string;
  hoverImage?: string;
}

export interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: string;
  salePrice?: string;
  image: string;
  hoverImage?: string;
  category?: string;
  variants?: ProductVariant[];
}

export interface ProductoDetalle extends ProductCardProps {
  descripcion: string;
  caracteristicas: string[];
  dimensiones: string;
  material: string;
  imagenes: string[];
  categorySlug: string;
  subcategory: string;
}
