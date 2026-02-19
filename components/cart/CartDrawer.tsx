'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import CartItemRow from './CartItemRow';

export default function CartDrawer() {
  const { items, drawerOpen, cerrarDrawer, totalItems, subtotal } = useCart();

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Cerrar con Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && drawerOpen) {
        cerrarDrawer();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, cerrarDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={cerrarDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-3xl bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-900">
            Carrito ({totalItems})
          </h2>
          <button
            onClick={cerrarDrawer}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg className="w-16 h-16 text-neutral-200 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-neutral-500 text-sm mb-1">Tu carrito está vacío</p>
              <p className="text-neutral-400 text-xs">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {items.map(item => (
                <CartItemRow key={item.cartItemId} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Pie */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Subtotal</span>
              <span className="text-lg font-semibold text-neutral-900">${subtotal}</span>
            </div>
            <Link
              href="/cart"
              onClick={cerrarDrawer}
              className="block w-full text-center bg-neutral-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-neutral-700 transition-colors"
            >
              Ver carrito
            </Link>
            <Link
              href="/checkout"
              onClick={cerrarDrawer}
              className="block w-full text-center border border-neutral-200 text-neutral-700 text-sm font-medium py-3 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Finalizar compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
