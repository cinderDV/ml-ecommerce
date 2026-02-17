"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductVariant, ProductCardProps } from "@/lib/types/producto";

// Re-exportar para no romper imports existentes
export type { ProductVariant, ProductCardProps };

export default function ProductCard({
  name,
  slug,
  price,
  salePrice,
  image,
  hoverImage,
  category,
  variants,
}: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(image);
  const [activeHoverImage, setActiveHoverImage] = useState(hoverImage);
  const [activeVariant, setActiveVariant] = useState<number | null>(null);

  const discount = salePrice
    ? Math.round((1 - parseFloat(salePrice.replace(/\./g, "")) / parseFloat(price.replace(/\./g, ""))) * 100)
    : null;

  return (
    <div className="group card-hover rounded-xl overflow-hidden bg-white shadow-[0_2px_3px_rgba(0,0,0,0.15),0_6px_10px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.18),0_12px_20px_rgba(0,0,0,0.15)] transition-shadow duration-300">
      <Link href={`/producto/${slug}`} className="block p-2 pb-0">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-50 rounded-lg">
          {/* Imagen principal */}
          <Image
            src={activeImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-500 ${activeHoverImage ? "group-hover:opacity-0" : ""}`}
          />

          {/* Imagen secundaria — aparece al hover */}
          {activeHoverImage && (
            <Image
              src={activeHoverImage}
              alt={`${name} - vista alternativa`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Badge de descuento */}
          {discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3 min-h-[5.5rem]">
          <div className="min-w-0 space-y-2">
            <div>
              {category && (
                <p className="text-xs text-neutral-400 uppercase tracking-widest mb-0.5">
                  {category}
                </p>
              )}
              <Link href={`/producto/${slug}`}>
                <h3 className="text-sm font-medium text-neutral-900 truncate">
                  {name}
                </h3>
              </Link>
            </div>

            {variants && variants.length > 0 && (
              <div className="flex items-center gap-2">
                {variants.map((variant, i) => (
                  <button
                    key={variant.color}
                    title={variant.color}
                    onClick={() => {
                      setActiveImage(variant.image);
                      setActiveHoverImage(variant.hoverImage);
                      setActiveVariant(i);
                    }}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer swatch-hover ${
                      activeVariant === i
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-500"
                    }`}
                    style={{ backgroundColor: variant.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end justify-between shrink-0 self-stretch">
            <div className="flex items-baseline gap-1.5">
              {salePrice && (
                <p className="text-xs text-neutral-400 line-through">${price}</p>
              )}
              <p className={`text-sm font-semibold ${salePrice ? "text-red-500" : "text-neutral-900"}`}>
                ${salePrice || price}
              </p>
            </div>
            <button className="text-xs font-medium text-white bg-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
