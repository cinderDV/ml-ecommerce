"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductoDetalle } from "@/lib/types/producto";

interface ProductoDetalleVistaProps {
  producto: ProductoDetalle;
}

export default function ProductoDetalleVista({ producto }: ProductoDetalleVistaProps) {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [varianteActiva, setVarianteActiva] = useState<number | null>(null);

  const discount = producto.salePrice
    ? Math.round(
        (1 -
          parseFloat(producto.salePrice.replace(/\./g, "")) /
            parseFloat(producto.price.replace(/\./g, ""))) *
          100
      )
    : null;

  // Si hay variante seleccionada, la imagen principal es la de esa variante
  const imagenPrincipal =
    varianteActiva !== null && producto.variants?.[varianteActiva]
      ? producto.variants[varianteActiva].image.replace("w=600", "w=1200")
      : producto.imagenes[imagenActiva];

  return (
    <div className="detail-enter px-6 sm:px-10 lg:px-16 py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* === Galería de imágenes === */}
        <div className="space-y-3">
          {/* Imagen principal */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-50">
            <Image
              key={imagenPrincipal}
              src={imagenPrincipal}
              alt={producto.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover fade-in"
              priority
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {producto.imagenes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {producto.imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setImagenActiva(i);
                    setVarianteActiva(null);
                  }}
                  className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    imagenActiva === i && varianteActiva === null
                      ? "ring-2 ring-neutral-900 ring-offset-2"
                      : "ring-1 ring-neutral-200 hover:ring-neutral-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${producto.name} - vista ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === Información del producto === */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
          {/* Categoría + nombre */}
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1.5">
              {producto.subcategory}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight">
              {producto.name}
            </h1>
          </div>

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            {producto.salePrice ? (
              <>
                <span className="text-2xl font-semibold text-red-500">
                  ${producto.salePrice}
                </span>
                <span className="text-lg text-neutral-400 line-through">
                  ${producto.price}
                </span>
                {discount && (
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                    -{discount}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-semibold text-neutral-900">
                ${producto.price}
              </span>
            )}
          </div>

          {/* Variantes */}
          {producto.variants && producto.variants.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-sm font-medium text-neutral-700">
                Color:{" "}
                <span className="font-normal text-neutral-500">
                  {varianteActiva !== null
                    ? producto.variants[varianteActiva].color
                    : "Seleccionar"}
                </span>
              </p>
              <div className="flex items-center gap-2.5">
                {producto.variants.map((variant, i) => (
                  <button
                    key={variant.color}
                    title={variant.color}
                    onClick={() => setVarianteActiva(i)}
                    className={`w-9 h-9 rounded-full border-2 cursor-pointer swatch-hover ${
                      varianteActiva === i
                        ? "border-neutral-900 scale-110"
                        : "border-neutral-200 hover:border-neutral-500"
                    }`}
                    style={{ backgroundColor: variant.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          <p className="text-sm text-neutral-600 leading-relaxed">
            {producto.descripcion}
          </p>

          {/* Botón agregar al carrito */}
          <button className="w-full bg-neutral-900 text-white text-sm font-semibold py-4 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer button-pulse">
            Agregar al carrito
          </button>

          {/* Detalles expandidos */}
          <div className="space-y-5 pt-2 border-t border-neutral-100">
            {/* Características */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                Características
              </h3>
              <ul className="space-y-1.5">
                {producto.caracteristicas.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                    <svg className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dimensiones */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                Dimensiones
              </h3>
              <p className="text-sm text-neutral-600">{producto.dimensiones}</p>
            </div>

            {/* Material */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                Material
              </h3>
              <p className="text-sm text-neutral-600">{producto.material}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón fijo en mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-neutral-100 lg:hidden z-40">
        <button className="w-full bg-neutral-900 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer">
          Agregar al carrito — ${producto.salePrice || producto.price}
        </button>
      </div>
    </div>
  );
}
