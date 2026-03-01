'use client';

import { createContext, useReducer, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { CartItem } from '@/lib/types/producto';

const STORAGE_KEY = 'ml-cart';

// --- Helpers ---

function parsePrecio(precio: string): number {
  return parseFloat(precio.replace(/\./g, ''));
}

function formatPrecio(valor: number): string {
  return valor.toLocaleString('es-CL');
}

function loadFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// --- Estado ---

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
}

const initialState: CartState = {
  items: [],
  drawerOpen: false,
};

// --- Acciones ---

type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const item = action.payload;
      const existing = state.items.find(i => i.cartItemId === item.cartItemId);
      const items = existing
        ? state.items.map(i =>
            i.cartItemId === item.cartItemId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...state.items, item];
      saveToStorage(items);
      return { ...state, items };
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.cartItemId !== action.payload);
      saveToStorage(items);
      return { ...state, items };
    }

    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        const items = state.items.filter(i => i.cartItemId !== cartItemId);
        saveToStorage(items);
        return { ...state, items };
      }
      const items = state.items.map(i =>
        i.cartItemId === cartItemId ? { ...i, quantity } : i
      );
      saveToStorage(items);
      return { ...state, items };
    }

    case 'CLEAR':
      saveToStorage([]);
      return { ...state, items: [] };

    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };

    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };

    default:
      return state;
  }
}

// --- Context ---

export interface CartContextValue {
  items: CartItem[];
  drawerOpen: boolean;
  totalItems: number;
  subtotal: string;
  agregarAlCarrito: (item: CartItem) => void;
  eliminarDelCarrito: (cartItemId: string) => void;
  actualizarCantidad: (cartItemId: string, quantity: number) => void;
  vaciarCarrito: () => void;
  abrirDrawer: () => void;
  cerrarDrawer: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const hydratedRef = useRef(false);

  // Hidratar desde localStorage al montar
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const items = loadFromStorage();
    if (items.length > 0) {
      dispatch({ type: 'HYDRATE', payload: items });
    }
  }, []);

  const agregarAlCarrito = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    dispatch({ type: 'OPEN_DRAWER' });
  }, []);

  const eliminarDelCarrito = useCallback((cartItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  }, []);

  const actualizarCantidad = useCallback((cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  }, []);

  const vaciarCarrito = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const abrirDrawer = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), []);
  const cerrarDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = formatPrecio(
    state.items.reduce((sum, item) => sum + parsePrecio(item.price) * item.quantity, 0)
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        drawerOpen: state.drawerOpen,
        totalItems,
        subtotal,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        abrirDrawer,
        cerrarDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
