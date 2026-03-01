// Interfaces compartidas para productos
// Cuando conectemos WooCommerce, mapearemos su respuesta a estas formas.

export interface ProductVariant {
  color: string;
  hex?: string;
  image: string;
  hoverImage?: string;
  variationId?: number;
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

export interface AttributeOption {
  name: string;   // "Felpa Negro"
  slug: string;   // "felpa-negro"
  hex?: string;   // solo para tipo 'color'
}

export interface ProductAttributeGroup {
  name: string;       // "Color", "Lado", "Color Brazo"
  taxonomy: string;   // "pa_color", "pa_lado", "pa_color-brazo"
  type: 'color' | 'button';
  options: AttributeOption[];
}

export interface ProductVariationEntry {
  id: number;
  attributes: Record<string, string>; // taxonomy → slug
}

export interface ProductoDetalle extends ProductCardProps {
  descripcion: string;
  descripcionHtml?: string;
  caracteristicas?: string[];
  dimensiones?: string;
  material?: string;
  imagenes: string[];
  categorySlug: string;
  subcategory: string;
  attributeGroups?: ProductAttributeGroup[];
  variationMap?: ProductVariationEntry[];
}

export interface CartItem {
  cartItemId: string;
  productId: number;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string;
  image: string;
  quantity: number;
  variantColor?: string;
  variantHex?: string;
  variantLabel?: string;
}
