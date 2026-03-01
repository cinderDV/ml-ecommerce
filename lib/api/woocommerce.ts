import type { WcProduct, WcCategory } from './types';

const API_BASE = `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wc/store/v1`;

async function wcFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`WC API error: ${res.status} ${res.statusText} — ${endpoint}`);
  }

  return res.json();
}

// --- Categorías ---

export async function getCategorias(): Promise<WcCategory[]> {
  return wcFetch<WcCategory[]>('/products/categories', { per_page: '100' });
}

export async function getCategoriaPorSlug(slug: string): Promise<WcCategory | undefined> {
  const categorias = await getCategorias();
  return categorias.find((c) => c.slug === slug);
}

// --- Productos ---

export async function getProductosPorCategoria(
  categoryId: number,
  page = 1,
  perPage = 100,
): Promise<WcProduct[]> {
  return wcFetch<WcProduct[]>('/products', {
    category: String(categoryId),
    page: String(page),
    per_page: String(perPage),
  });
}

export async function getProductoPorSlug(slug: string): Promise<WcProduct | undefined> {
  const productos = await wcFetch<WcProduct[]>('/products', { slug });
  return productos[0];
}

export async function getProductosRelacionados(
  categoryId: number,
  excludeId: number,
  limit = 4,
): Promise<WcProduct[]> {
  const productos = await getProductosPorCategoria(categoryId, 1, limit + 1);
  return productos.filter((p) => p.id !== excludeId).slice(0, limit);
}

// --- Búsqueda (client-side) ---

export async function buscarProductosApi(query: string): Promise<WcProduct[]> {
  const url = new URL(`${API_BASE}/products`);
  url.searchParams.set('search', query);
  url.searchParams.set('per_page', '10');

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json();
}
