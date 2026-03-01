'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/lib/types/producto';
import { useCart } from '@/hooks/useCart';

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
}

function parsePrecio(precio: string): number {
  return parseFloat(precio.replace(/\./g, ''));
}

function formatPrecio(valor: number): string {
  return valor.toLocaleString('es-CL');
}

export default function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const { eliminarDelCarrito, actualizarCantidad } = useCart();

  const totalLinea = formatPrecio(parsePrecio(item.price) * item.quantity);

  if (compact) {
    return (
      <div className="py-5">
        <div className="flex gap-4">
          {/* Imagen */}
          <Link
            href={`/producto/${item.slug}`}
            className="relative shrink-0 rounded-xl overflow-hidden bg-neutral-50 w-28 h-28"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/producto/${item.slug}`}
                  className="text-sm font-semibold text-neutral-900 hover:underline line-clamp-2 leading-snug"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-semibold text-neutral-900 shrink-0">${totalLinea}</p>
              </div>
              {item.variantColor && (
                <div className="flex items-center gap-1.5 mt-1">
                  {item.variantHex && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-200"
                      style={{ backgroundColor: item.variantHex }}
                    />
                  )}
                  <span className="text-xs text-neutral-500">{item.variantLabel || item.variantColor}</span>
                </div>
              )}
              {item.quantity > 1 && (
                <p className="text-xs text-neutral-400 mt-0.5">${item.price} c/u</p>
              )}
            </div>

            {/* Cantidad + eliminar */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center border border-neutral-200 rounded-lg">
                <button
                  onClick={() => actualizarCantidad(item.cartItemId, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                  aria-label="Reducir cantidad"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-8 text-center text-sm font-medium text-neutral-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => actualizarCantidad(item.cartItemId, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => eliminarDelCarrito(item.cartItemId)}
                className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Eliminar"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de disponibilidad */}
        <div className="flex items-center gap-1.5 mt-3">
          <svg className="w-3.5 h-3.5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <p className="text-xs text-neutral-400">
            En stock · Envío en 1-3 días hábiles. Producción limitada.
          </p>
        </div>
      </div>
    );
  }

  // --- Modo completo (página del carrito) ---
  return (
    <div className="flex flex-col sm:flex-row gap-5 py-8">
      {/* Imagen grande */}
      <Link
        href={`/producto/${item.slug}`}
        className="relative shrink-0 rounded-2xl overflow-hidden bg-neutral-50 w-full sm:w-44 md:w-52 aspect-[4/3] sm:aspect-square"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, 208px"
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info + controles */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
        {/* Fila superior: nombre + precio */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <Link
              href={`/producto/${item.slug}`}
              className="text-base font-semibold text-neutral-900 hover:underline leading-snug"
            >
              {item.name}
            </Link>
            {item.variantColor && (
              <div className="flex items-center gap-2">
                {item.variantHex && (
                  <span
                    className="w-4 h-4 rounded-full border border-neutral-200"
                    style={{ backgroundColor: item.variantHex }}
                  />
                )}
                <span className="text-sm text-neutral-500">{item.variantLabel || item.variantColor}</span>
              </div>
            )}
            {item.originalPrice && (
              <p className="text-xs text-neutral-400 line-through">${item.originalPrice}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="text-base font-semibold text-neutral-900">${totalLinea}</p>
            {item.quantity > 1 && (
              <p className="text-sm text-neutral-400">${item.price} c/u</p>
            )}
          </div>
        </div>

        {/* Mensaje de disponibilidad */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <p className="text-sm text-neutral-500">
            En stock · Listo para enviar en 1-3 días hábiles. Producción limitada.
          </p>
        </div>

        {/* Fila inferior: cantidad + eliminar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-neutral-200 rounded-xl">
            <button
              onClick={() => actualizarCantidad(item.cartItemId, item.quantity - 1)}
              className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Reducir cantidad"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="w-10 text-center text-sm font-semibold text-neutral-900">
              {item.quantity}
            </span>
            <button
              onClick={() => actualizarCantidad(item.cartItemId, item.quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => eliminarDelCarrito(item.cartItemId)}
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Eliminar producto"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
