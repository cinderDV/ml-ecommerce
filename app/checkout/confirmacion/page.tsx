'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

function ConfirmacionContent() {
  const { vaciarCarrito } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    vaciarCarrito();
  }, [vaciarCarrito]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
      {/* Icono check */}
      <div className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight mb-3">
        Pedido confirmado
      </h1>
      <p className="text-neutral-500 mb-8">
        Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
      </p>

      {/* Numero de orden */}
      {orderId && (
        <div className="inline-block bg-neutral-50 rounded-2xl px-8 py-5 mb-8">
          <p className="text-sm text-neutral-400 mb-1">Número de pedido</p>
          <p className="text-2xl font-bold text-neutral-900 tracking-wide">#{orderId}</p>
        </div>
      )}

      <p className="text-sm text-neutral-400 mb-8">
        Recibirás un email de confirmación con los detalles de tu pedido.
      </p>

      <Link
        href="/"
        className="inline-block bg-neutral-900 text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-neutral-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <p className="text-neutral-500">Cargando confirmación...</p>
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}
