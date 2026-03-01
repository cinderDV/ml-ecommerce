'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import CartItemRow from '@/components/cart/CartItemRow';

export default function CartPageContent() {
  const { items, totalItems, subtotal, vaciarCarrito } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-900 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-neutral-900">Carrito</span>
      </nav>

      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight mb-8">
        Carrito de compras
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-neutral-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-lg text-neutral-600 mb-2">Tu carrito está vacío</p>
          <p className="text-sm text-neutral-400 mb-6">
            Explora nuestro catálogo y agrega productos que te gusten.
          </p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-neutral-500">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </p>
              <button
                onClick={vaciarCarrito}
                className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Vaciar carrito
              </button>
            </div>
            <div className="divide-y divide-neutral-100 border-t border-neutral-100">
              {items.map(item => (
                <CartItemRow key={item.cartItemId} item={item} />
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-neutral-50 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900">Resumen</h2>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">
                    Productos ({totalItems})
                  </span>
                  <span className="font-medium text-neutral-900">${subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Envío</span>
                  <span className="text-neutral-400">Por calcular</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
                <span className="text-base font-semibold text-neutral-900">Subtotal</span>
                <span className="text-xl font-bold text-neutral-900">${subtotal}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center bg-neutral-900 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-neutral-700 transition-colors"
              >
                Finalizar compra
              </Link>

              <Link
                href="/"
                className="block text-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
