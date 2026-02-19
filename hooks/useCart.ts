'use client';

import { useContext } from 'react';
import { CartContext, type CartContextValue } from '@/lib/contexts/CartContext';

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>');
  }
  return context;
}
