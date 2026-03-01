"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import type { ProductoDetalle, CartItem, ProductVariationEntry } from "@/lib/types/producto";
import { useCart } from "@/hooks/useCart";

interface ProductoDetalleVistaProps {
  producto: ProductoDetalle;
}

export default function ProductoDetalleVista({ producto }: ProductoDetalleVistaProps) {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const { agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false);
  const [errorVariante, setErrorVariante] = useState(false);

  // --- Multi-attr vs legacy mode ---
  const isMultiAttr = !!(producto.attributeGroups && producto.attributeGroups.length > 0 && producto.variationMap);

  // --- Legacy single-attr state ---
  const [varianteActiva, setVarianteActiva] = useState<number | null>(
    !isMultiAttr && producto.variants?.length === 1 ? 0 : null
  );

  // --- Multi-attr state ---
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    if (!isMultiAttr) return {};
    const initial: Record<string, string> = {};
    // Auto-select attributes with only 1 option
    for (const group of producto.attributeGroups!) {
      if (group.options.length === 1) {
        initial[group.taxonomy] = group.options[0].slug;
      }
    }
    // If only 1 variation total, select all its attributes
    if (producto.variationMap!.length === 1) {
      for (const [tax, slug] of Object.entries(producto.variationMap![0].attributes)) {
        initial[tax] = slug;
      }
    }
    return initial;
  });
  const [variationImages, setVariationImages] = useState<Record<number, string>>({});
  const [fetchingImage, setFetchingImage] = useState(false);

  // --- Multi-attr: matched variation ---
  const matchedVariation = useMemo<ProductVariationEntry | null>(() => {
    if (!isMultiAttr) return null;
    const groups = producto.attributeGroups!;
    const map = producto.variationMap!;
    // All attributes must be selected
    const allSelected = groups.every((g) => selectedAttrs[g.taxonomy]);
    if (!allSelected) return null;
    return map.find((v) =>
      groups.every((g) => v.attributes[g.taxonomy] === selectedAttrs[g.taxonomy])
    ) ?? null;
  }, [isMultiAttr, producto.attributeGroups, producto.variationMap, selectedAttrs]);

  // --- Multi-attr: cross-availability ---
  const isOptionAvailable = useCallback((taxonomy: string, slug: string): boolean => {
    if (!isMultiAttr) return true;
    const map = producto.variationMap!;
    const groups = producto.attributeGroups!;
    // Build partial selection: current selections + proposed option
    const partial: Record<string, string> = { ...selectedAttrs, [taxonomy]: slug };
    // Check if at least one variation matches all selected attributes in the partial
    return map.some((v) =>
      groups.every((g) => {
        const sel = partial[g.taxonomy];
        return !sel || v.attributes[g.taxonomy] === sel;
      })
    );
  }, [isMultiAttr, producto.attributeGroups, producto.variationMap, selectedAttrs]);

  // --- Multi-attr: lazy image fetch ---
  useEffect(() => {
    if (!matchedVariation) return;
    if (variationImages[matchedVariation.id]) return;

    let cancelled = false;
    setFetchingImage(true);

    fetch(`/api/wc/products/${matchedVariation.id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (cancelled || !data) return;
        const imgSrc = data.images?.[0]?.src;
        if (imgSrc) {
          setVariationImages((prev) => ({ ...prev, [matchedVariation.id]: imgSrc }));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setFetchingImage(false); });

    return () => { cancelled = true; };
  }, [matchedVariation, variationImages]);

  const imagenes = producto.imagenes;
  const totalImagenes = imagenes.length;

  // Legacy mode
  const tieneMultiplesVariantes = !isMultiAttr && (producto.variants?.length ?? 0) > 1;
  const requiereSeleccionLegacy = tieneMultiplesVariantes && varianteActiva === null;

  // Multi-attr mode
  const requiereSeleccionMulti = isMultiAttr && !matchedVariation;

  const requiereSeleccion = requiereSeleccionLegacy || requiereSeleccionMulti;

  const irAnterior = useCallback(() => {
    setImagenActiva((prev) => (prev === 0 ? totalImagenes - 1 : prev - 1));
    if (!isMultiAttr) setVarianteActiva(null);
  }, [totalImagenes, isMultiAttr]);

  const irSiguiente = useCallback(() => {
    setImagenActiva((prev) => (prev === totalImagenes - 1 ? 0 : prev + 1));
    if (!isMultiAttr) setVarianteActiva(null);
  }, [totalImagenes, isMultiAttr]);

  // Navegacion con teclado en lightbox
  useEffect(() => {
    if (!lightboxAbierto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") irAnterior();
      else if (e.key === "ArrowRight") irSiguiente();
      else if (e.key === "Escape") setLightboxAbierto(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxAbierto, irAnterior, irSiguiente]);

  // Bloquear scroll del body cuando el lightbox esta abierto
  useEffect(() => {
    if (lightboxAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxAbierto]);

  const handleAgregar = () => {
    if (isMultiAttr) {
      // Multi-attr add to cart
      if (!matchedVariation) {
        setErrorVariante(true);
        return;
      }
      const groups = producto.attributeGroups!;
      // Build variant label: names of selected options joined with " / "
      const labelParts: string[] = [];
      for (const group of groups) {
        const selected = selectedAttrs[group.taxonomy];
        const option = group.options.find((o) => o.slug === selected);
        if (option) labelParts.push(option.name);
      }
      const variantLabel = labelParts.join(" / ");

      // First color-type group for swatch display
      const firstColorGroup = groups.find((g) => g.type === "color");
      const firstColorSlug = firstColorGroup ? selectedAttrs[firstColorGroup.taxonomy] : undefined;
      const firstColorOption = firstColorGroup?.options.find((o) => o.slug === firstColorSlug);

      const variationImage = variationImages[matchedVariation.id];

      const item: CartItem = {
        cartItemId: `${producto.id}-${matchedVariation.id}`,
        productId: matchedVariation.id,
        name: producto.name,
        slug: producto.slug,
        price: producto.salePrice || producto.price,
        originalPrice: producto.salePrice ? producto.price : undefined,
        image: variationImage || producto.imagenes[0],
        quantity: 1,
        variantColor: firstColorOption?.name,
        variantHex: firstColorOption?.hex,
        variantLabel,
      };
      agregarAlCarrito(item);
    } else {
      // Legacy single-attr add to cart
      if (requiereSeleccionLegacy) {
        setErrorVariante(true);
        return;
      }
      const variant = varianteActiva !== null ? producto.variants?.[varianteActiva] : undefined;
      const item: CartItem = {
        cartItemId: variant?.variationId ? `${producto.id}-${variant.variationId}` : `${producto.id}`,
        productId: variant?.variationId ?? producto.id,
        name: producto.name,
        slug: producto.slug,
        price: producto.salePrice || producto.price,
        originalPrice: producto.salePrice ? producto.price : undefined,
        image: variant?.image || producto.imagenes[0],
        quantity: 1,
        variantColor: variant?.color,
        variantHex: variant?.hex,
      };
      agregarAlCarrito(item);
    }
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  const discount = producto.salePrice
    ? Math.round(
        (1 -
          parseFloat(producto.salePrice.replace(/\./g, "")) /
            parseFloat(producto.price.replace(/\./g, ""))) *
          100
      )
    : null;

  // Imagen principal: multi-attr cached image > legacy variant image > gallery image
  const imagenPrincipal = useMemo(() => {
    if (isMultiAttr && matchedVariation && variationImages[matchedVariation.id]) {
      return variationImages[matchedVariation.id];
    }
    if (!isMultiAttr && varianteActiva !== null && producto.variants?.[varianteActiva]) {
      return producto.variants[varianteActiva].image.replace("w=600", "w=1200");
    }
    return imagenes[imagenActiva];
  }, [isMultiAttr, matchedVariation, variationImages, varianteActiva, producto.variants, imagenes, imagenActiva]);

  // Button text
  const botonTexto = agregado
    ? "Agregado al carrito"
    : requiereSeleccion
      ? "Selecciona las opciones"
      : "Agregar al carrito";

  const botonTextoMobile = agregado
    ? "Agregado al carrito"
    : requiereSeleccion
      ? "Selecciona las opciones"
      : `Agregar al carrito — $${producto.salePrice || producto.price}`;

  return (
    <div className="detail-enter px-6 sm:px-10 lg:px-16 py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* === Galeria de imagenes === */}
        <div className="space-y-3">
          {/* Imagen principal con controles */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-50 group/gallery">
            <Image
              key={imagenPrincipal}
              src={imagenPrincipal}
              alt={producto.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover fade-in cursor-zoom-in"
              priority
              onClick={() => setLightboxAbierto(true)}
            />

            {/* Loading spinner for variant image */}
            {fetchingImage && isMultiAttr && matchedVariation && !variationImages[matchedVariation.id] && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-50/60">
                <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
              </div>
            )}

            {discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-lg z-10">
                -{discount}%
              </span>
            )}

            {/* Botones anterior / siguiente */}
            {totalImagenes > 1 && (
              <>
                <button
                  onClick={irAnterior}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-neutral-700 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm"
                  aria-label="Imagen anterior"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={irSiguiente}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-neutral-700 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm"
                  aria-label="Imagen siguiente"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {/* Contador de imagenes */}
            {totalImagenes > 1 && !isMultiAttr && (
              <span className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                {(varianteActiva !== null ? 0 : imagenActiva) + 1} / {totalImagenes}
              </span>
            )}

            {/* Icono de lupa */}
            <button
              onClick={() => setLightboxAbierto(true)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-neutral-600 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm z-10"
              aria-label="Ampliar imagen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </button>
          </div>

          {/* Thumbnails */}
          {totalImagenes > 1 && (
            <div className="flex gap-3 overflow-x-auto pt-2 pb-3 px-1.5">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setImagenActiva(i);
                    if (!isMultiAttr) setVarianteActiva(null);
                  }}
                  className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    imagenActiva === i && (isMultiAttr || varianteActiva === null)
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

        {/* === Informacion del producto === */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
          {/* Categoria + nombre */}
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

          {/* === Selectores de variante === */}
          {isMultiAttr ? (
            // Multi-attribute selectors
            <div className="space-y-4">
              {producto.attributeGroups!.map((group) => {
                const selectedSlug = selectedAttrs[group.taxonomy];
                const selectedOption = group.options.find((o) => o.slug === selectedSlug);
                return (
                  <div key={group.taxonomy} className="space-y-2.5">
                    <p className="text-sm font-medium text-neutral-700">
                      {group.name}:{" "}
                      <span className={`font-normal ${errorVariante && !selectedSlug ? "text-red-500" : "text-neutral-500"}`}>
                        {selectedOption?.name ?? "Seleccionar"}
                      </span>
                    </p>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {group.options.map((option) => {
                        const isSelected = selectedSlug === option.slug;
                        const available = isOptionAvailable(group.taxonomy, option.slug);
                        if (group.type === "color") {
                          return (
                            <button
                              key={option.slug}
                              title={option.name}
                              disabled={!available}
                              onClick={() => {
                                setSelectedAttrs((prev) => ({ ...prev, [group.taxonomy]: option.slug }));
                                setErrorVariante(false);
                              }}
                              className={`w-9 h-9 rounded-full border-2 transition-all ${
                                !available
                                  ? "opacity-30 cursor-not-allowed border-neutral-200"
                                  : isSelected
                                    ? "border-neutral-900 scale-110 cursor-pointer swatch-hover"
                                    : "border-neutral-200 hover:border-neutral-500 cursor-pointer swatch-hover"
                              }`}
                              style={{ backgroundColor: option.hex || "#ccc" }}
                            />
                          );
                        }
                        // button type
                        return (
                          <button
                            key={option.slug}
                            disabled={!available}
                            onClick={() => {
                              setSelectedAttrs((prev) => ({ ...prev, [group.taxonomy]: option.slug }));
                              setErrorVariante(false);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm transition-all ${
                              !available
                                ? "opacity-30 cursor-not-allowed border border-neutral-200 text-neutral-400"
                                : isSelected
                                  ? "border-2 border-neutral-900 text-neutral-900 font-medium cursor-pointer"
                                  : "border border-neutral-200 text-neutral-600 hover:border-neutral-500 cursor-pointer"
                            }`}
                          >
                            {option.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {errorVariante && !matchedVariation && (
                <p className="text-xs text-red-500">Selecciona todas las opciones para continuar</p>
              )}
            </div>
          ) : tieneMultiplesVariantes && producto.variants ? (
            // Legacy single-attr selectors
            <div className="space-y-2.5">
              <p className="text-sm font-medium text-neutral-700">
                Color:{" "}
                <span className={`font-normal ${errorVariante && varianteActiva === null ? "text-red-500" : "text-neutral-500"}`}>
                  {varianteActiva !== null
                    ? producto.variants[varianteActiva].color
                    : "Seleccionar"}
                </span>
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {producto.variants.map((variant, i) => (
                  <button
                    key={variant.color}
                    title={variant.color}
                    onClick={() => { setVarianteActiva(i); setErrorVariante(false); }}
                    className={`w-9 h-9 rounded-full border-2 cursor-pointer swatch-hover transition-all ${
                      varianteActiva === i
                        ? "border-neutral-900 scale-110"
                        : "border-neutral-200 hover:border-neutral-500"
                    }`}
                    style={{ backgroundColor: variant.hex || '#ccc' }}
                  />
                ))}
              </div>
              {errorVariante && varianteActiva === null && (
                <p className="text-xs text-red-500">Selecciona un color para continuar</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-neutral-700">
                Color:{" "}
                <span className="font-normal text-neutral-500">
                  {producto.variants?.[0]?.color ?? "Variante unica"}
                </span>
              </p>
            </div>
          )}

          {/* Descripcion */}
          {producto.descripcion && (
            <p className="text-sm text-neutral-600 leading-relaxed">
              {producto.descripcion}
            </p>
          )}

          {/* Boton agregar al carrito */}
          <button
            onClick={handleAgregar}
            className={`w-full text-sm font-semibold py-4 rounded-xl transition-colors cursor-pointer ${
              agregado
                ? "bg-green-600 text-white"
                : requiereSeleccion
                  ? "bg-neutral-300 text-neutral-500"
                  : "bg-neutral-900 text-white hover:bg-neutral-700 button-pulse"
            }`}
          >
            {botonTexto}
          </button>

          {/* Descripcion HTML de WooCommerce */}
          {producto.descripcionHtml && (
            <div
              className="prose-wc text-sm text-neutral-600 leading-relaxed space-y-3 pt-2 border-t border-neutral-100 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-neutral-900 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-neutral-900 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-neutral-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-neutral-800 [&_img]:rounded-lg [&_img]:my-3"
              dangerouslySetInnerHTML={{ __html: producto.descripcionHtml }}
            />
          )}

          {/* Detalles estructurados (datos mock / backwards compat) */}
          {(producto.caracteristicas || producto.dimensiones || producto.material) && (
            <div className="space-y-5 pt-2 border-t border-neutral-100">
              {producto.caracteristicas && producto.caracteristicas.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                    Caracteristicas
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
              )}

              {producto.dimensiones && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    Dimensiones
                  </h3>
                  <p className="text-sm text-neutral-600">{producto.dimensiones}</p>
                </div>
              )}

              {producto.material && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    Material
                  </h3>
                  <p className="text-sm text-neutral-600">{producto.material}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Boton fijo en mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-neutral-100 lg:hidden z-40">
        <button
          onClick={handleAgregar}
          className={`w-full text-sm font-semibold py-3.5 rounded-xl transition-colors cursor-pointer ${
            agregado
              ? "bg-green-600 text-white"
              : requiereSeleccion
                ? "bg-neutral-300 text-neutral-500"
                : "bg-neutral-900 text-white hover:bg-neutral-700"
          }`}
        >
          {botonTextoMobile}
        </button>
      </div>

      {/* === Lightbox / Visor de imagen (portal para escapar containing block de detail-enter) === */}
      {lightboxAbierto && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxAbierto(false)}
        >
          {/* Cerrar */}
          <button
            onClick={() => setLightboxAbierto(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-10"
            aria-label="Cerrar visor"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contador */}
          <span className="absolute top-5 left-5 text-white/60 text-sm font-medium">
            {imagenActiva + 1} / {totalImagenes}
          </span>

          {/* Imagen ampliada */}
          <div
            className="relative w-[90vw] h-[85vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={`lb-${imagenes[imagenActiva]}`}
              src={imagenes[imagenActiva]}
              alt={producto.name}
              fill
              sizes="90vw"
              className="object-contain fade-in"
              priority
            />
          </div>

          {/* Navegacion lightbox */}
          {totalImagenes > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); irAnterior(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Imagen anterior"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); irSiguiente(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Imagen siguiente"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails en lightbox */}
          {totalImagenes > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm rounded-xl p-2 max-w-[90vw] overflow-x-auto">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImagenActiva(i); }}
                  className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    imagenActiva === i
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Vista ${i + 1}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
