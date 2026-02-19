'use client';

import { createContext, useReducer, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { CartItem } from '@/lib/types/producto';

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
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'HYDRATE'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.cartItemId === action.payload.cartItemId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.cartItemId === action.payload.cartItemId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
          drawerOpen: true,
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        drawerOpen: true,
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.cartItemId !== action.payload),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.cartItemId !== action.payload.cartItemId),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.cartItemId === action.payload.cartItemId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };
    case 'HYDRATE':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

// --- Helpers de precio ---

function parsePrecio(precio: string): number {
  return parseFloat(precio.replace(/\./g, ''));
}

function formatPrecio(valor: number): string {
  return valor.toLocaleString('es-CL');
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

const STORAGE_KEY = 'ml-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: 'HYDRATE', payload: items });
      }
    } catch {
      // localStorage no disponible o datos corruptos
    }
    setHydrated(true);
  }, []);

  // Persistir cambios en localStorage (solo después de hidratar)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // localStorage lleno o no disponible
    }
  }, [state.items, hydrated]);

  // Valores computados
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = formatPrecio(
    state.items.reduce((sum, i) => sum + parsePrecio(i.price) * i.quantity, 0)
  );

  // Funciones expuestas
  const agregarAlCarrito = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const eliminarDelCarrito = useCallback((cartItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  }, []);

  const actualizarCantidad = useCallback((cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  }, []);

  const vaciarCarrito = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const abrirDrawer = useCallback(() => {
    dispatch({ type: 'OPEN_DRAWER' });
  }, []);

  const cerrarDrawer = useCallback(() => {
    dispatch({ type: 'CLOSE_DRAWER' });
  }, []);

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
