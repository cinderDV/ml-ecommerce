import type { WcProduct } from './types';
import type {
  ProductCardProps,
  ProductoDetalle,
  ProductVariant,
  ProductAttributeGroup,
  ProductVariationEntry,
} from '@/lib/types/producto';
import { resolverHexColor } from '@/lib/utils/colorHex';

/**
 * Formatea un precio del Store API (string en unidades menores) a formato legible.
 * Con currency_minor_unit = 0, "400990" → "400.990"
 */
export function formatPrecioWc(priceStr: string, minorUnit: number): string {
  const raw = Number(priceStr);
  const valor = minorUnit > 0 ? raw / Math.pow(10, minorUnit) : raw;
  return valor.toLocaleString('es-CL');
}

/**
 * Extrae variantes del atributo visual principal (color/color compose).
 * Busca pa_color o pa_color-compose. Solo incluye terms que tengan una
 * variación real asociada (evita swatches rotos por datos inconsistentes en WC).
 */
function extraerVariantes(wc: WcProduct): ProductVariant[] | undefined {
  if (wc.variations.length === 0) return undefined;

  const colorAttr = wc.attributes.find(
    (a) => a.has_variations && (a.taxonomy === 'pa_color' || a.taxonomy === 'pa_color-compose'),
  );
  if (!colorAttr || colorAttr.terms.length === 0) return undefined;

  const matched: ProductVariant[] = [];
  for (const term of colorAttr.terms) {
    const variation = wc.variations.find((v) =>
      v.attributes.some((a) => a.name === colorAttr.name && a.value === term.slug),
    );
    if (variation) {
      matched.push({
        color: term.name,
        hex: resolverHexColor(term.name),
        image: wc.images[0]?.src ?? '',
        variationId: variation.id,
      });
    }
  }

  // Si ningun term coincide, usar la primera variacion como fallback
  if (matched.length === 0) {
    const fallbackName = wc.variations[0].attributes[0]?.value ?? 'Default';
    matched.push({
      color: fallbackName,
      hex: resolverHexColor(fallbackName),
      image: wc.images[0]?.src ?? '',
      variationId: wc.variations[0].id,
    });
  }

  return matched;
}

const COLOR_TAXONOMIES = new Set(['pa_color', 'pa_color-compose', 'pa_color-brazo']);

/**
 * Extrae todos los atributos de variación y construye el mapa de variaciones.
 * Para la página de detalle — soporta multi-atributo (Color + Lado + Color Brazo).
 */
function extraerAtributosYVariaciones(
  wc: WcProduct,
): { attributeGroups: ProductAttributeGroup[]; variationMap: ProductVariationEntry[] } | undefined {
  if (wc.variations.length === 0) return undefined;

  const varAttrs = wc.attributes.filter((a) => a.has_variations);
  if (varAttrs.length === 0) return undefined;

  const attributeGroups: ProductAttributeGroup[] = varAttrs.map((attr) => {
    const isColor = COLOR_TAXONOMIES.has(attr.taxonomy);
    return {
      name: attr.name,
      taxonomy: attr.taxonomy,
      type: isColor ? 'color' : 'button',
      options: attr.terms.map((t) => ({
        name: t.name,
        slug: t.slug,
        ...(isColor ? { hex: resolverHexColor(t.name) } : {}),
      })),
    };
  });

  // Construir variationMap: para cada variación de WC, mapear sus atributos
  // WcVariationAttribute.name es el label ("Color"), necesitamos encontrar la taxonomy
  const nameToTaxonomy: Record<string, string> = {};
  for (const attr of varAttrs) {
    nameToTaxonomy[attr.name] = attr.taxonomy;
  }

  const variationMap: ProductVariationEntry[] = wc.variations.map((v) => {
    const attributes: Record<string, string> = {};
    for (const va of v.attributes) {
      const taxonomy = nameToTaxonomy[va.name];
      if (taxonomy) {
        attributes[taxonomy] = va.value;
      }
    }
    return { id: v.id, attributes };
  });

  return { attributeGroups, variationMap };
}

export function mapWcToProductCard(wc: WcProduct): ProductCardProps {
  const { prices } = wc;
  const price = formatPrecioWc(prices.regular_price, prices.currency_minor_unit);
  const salePrice = wc.on_sale
    ? formatPrecioWc(prices.sale_price, prices.currency_minor_unit)
    : undefined;

  return {
    id: wc.id,
    name: wc.name,
    slug: wc.slug,
    price,
    salePrice,
    image: wc.images[0]?.src ?? '',
    hoverImage: wc.images[1]?.src,
    category: wc.categories[0]?.name,
    variants: extraerVariantes(wc),
  };
}

export function mapWcToProductoDetalle(wc: WcProduct): ProductoDetalle {
  const card = mapWcToProductCard(wc);
  const multiAttr = extraerAtributosYVariaciones(wc);

  return {
    ...card,
    descripcion: wc.short_description.replace(/<[^>]*>/g, '').trim(),
    descripcionHtml: wc.description || undefined,
    imagenes: wc.images.map((img) => img.src),
    categorySlug: wc.categories[0]?.slug ?? '',
    subcategory: wc.categories[0]?.name ?? '',
    ...(multiAttr ? {
      attributeGroups: multiAttr.attributeGroups,
      variationMap: multiAttr.variationMap,
    } : {}),
  };
}
