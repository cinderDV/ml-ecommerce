import type { WcCart, WcAddress, WcCheckoutResponse } from './types';
import type { CartItem } from '@/lib/types/producto';

// Proxy via Next.js Route Handler (app/api/wc/[...path]/route.ts)
const API_BASE = '/api/wc';

const TOKEN_KEY = 'ml-wc-cart-token';
const NONCE_KEY = 'ml-wc-nonce';

// --- Sesión WC (solo para checkout) ---

function getSessionTokens() {
  return {
    cartToken: localStorage.getItem(TOKEN_KEY),
    nonce: localStorage.getItem(NONCE_KEY),
  };
}

function saveSessionTokens(cartToken: string | null, nonce: string | null) {
  if (cartToken) localStorage.setItem(TOKEN_KEY, cartToken);
  if (nonce) localStorage.setItem(NONCE_KEY, nonce);
}

function clearSessionTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NONCE_KEY);
}

async function wcFetch<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>,
): Promise<T> {
  const { cartToken, nonce } = getSessionTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (nonce) headers['x-nonce'] = nonce;
  if (cartToken) headers['x-cart-token'] = cartToken;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Actualizar tokens desde la respuesta
  saveSessionTokens(res.headers.get('x-cart-token'), res.headers.get('x-nonce'));

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Error ${res.status}`);
  }

  return res.json();
}

/**
 * Crea una sesión WC fresca (GET /cart para obtener Cart-Token + Nonce)
 */
async function crearSesion(): Promise<void> {
  clearSessionTokens();
  const res = await fetch(`${API_BASE}/cart`, {
    headers: { 'Content-Type': 'application/json' },
  });
  saveSessionTokens(res.headers.get('x-cart-token'), res.headers.get('x-nonce'));
}

/**
 * Sincroniza el carrito local con WC y procesa el checkout.
 *
 * Flujo:
 * 1. Crea sesión WC fresca
 * 2. Agrega cada item del carrito local a WC
 * 3. Actualiza datos del cliente (billing + shipping)
 * 4. Procesa checkout con el método de pago seleccionado
 * 5. Limpia sesión WC
 */
export async function procesarPedido(
  items: CartItem[],
  paymentMethod: string,
  address: WcAddress,
): Promise<WcCheckoutResponse> {
  // 1. Sesión fresca (evita problemas de nonce expirado o sesión vieja)
  await crearSesion();

  // 2. Agregar items al carrito WC
  for (const item of items) {
    await wcFetch<WcCart>('/cart/add-item', 'POST', {
      id: item.productId,
      quantity: item.quantity,
    });
  }

  // 3. Actualizar datos del cliente
  await wcFetch<WcCart>('/cart/update-customer', 'POST', {
    billing_address: address,
    shipping_address: address,
  });

  // 4. Checkout
  const result = await wcFetch<WcCheckoutResponse>('/checkout', 'POST', {
    payment_method: paymentMethod,
    billing_address: address,
    shipping_address: address,
  });

  // 5. Limpiar sesión WC
  clearSessionTokens();

  return result;
}
