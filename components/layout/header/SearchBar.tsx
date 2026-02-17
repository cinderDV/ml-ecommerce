"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTodosLosProductos } from "@/lib/data/productos";

// Resultado de búsqueda simplificado.
// Cuando conectemos WooCommerce, mapearemos su respuesta a esta forma.
interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
}

// Función que simula una búsqueda.
// Más adelante esto será un fetch a WooCommerce:
//   const res = await fetch(`${NEXT_PUBLIC_WC_URL}/wp-json/wc/v3/products?search=${query}`);
//   const data = await res.json();
function buscarProductos(query: string): SearchResult[] {
  const termino = query.toLowerCase();
  return getTodosLosProductos()
    .filter((p) => p.name.toLowerCase().includes(termino))
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.salePrice || p.price,
      image: p.image.replace("w=600", "w=100"),
    }));
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [placeholderCorto, setPlaceholderCorto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Placeholder adaptativo según el ancho disponible
  useEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setPlaceholderCorto(entry.contentRect.width < 200);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --- DEBOUNCE ---
  // ¿Qué es? En vez de buscar en cada tecla (c-a-m-a = 4 búsquedas),
  // esperamos 300ms después de que el usuario deja de escribir.
  // Así solo hacemos 1 búsqueda con "cama".
  // Esto es CRÍTICO cuando conectemos la API para no saturar el servidor.
  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      setAbierto(false);
      return;
    }

    const timer = setTimeout(() => {
      const encontrados = buscarProductos(query);
      setResultados(encontrados);
      setAbierto(true);
    }, 300);

    // Cleanup: si el usuario sigue escribiendo, cancelamos el timer anterior
    return () => clearTimeout(timer);
  }, [query]);

  // Cerrar el dropdown al hacer click afuera
  useEffect(() => {
    function handleClickAfuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, []);

  return (
    <div ref={contenedorRef} className="relative">
      {/* Input de búsqueda */}
      <div className="flex items-center bg-neutral-100 rounded-xl px-3 py-1.5 gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(0,0,0,0.08)]">
        {/* Ícono de lupa (SVG inline para no agregar dependencias) */}
        <svg
          className="w-4 h-4 text-neutral-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setAbierto(true)}
          placeholder={placeholderCorto ? "Buscar..." : "Buscar productos..."}
          className="bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none w-full"
        />
      </div>

      {/* Dropdown de resultados */}
      {abierto && (
        <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-[0_2px_3px_rgba(0,0,0,0.15),0_6px_10px_rgba(0,0,0,0.12)] overflow-hidden z-50">
          {resultados.length > 0 ? (
            <ul>
              {resultados.map((producto) => (
                <li key={producto.id}>
                  <Link
                    href={`/producto/${producto.slug}`}
                    onClick={() => {
                      setAbierto(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-50 shrink-0">
                      <Image
                        src={producto.image}
                        alt={producto.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {producto.name}
                      </p>
                      <p className="text-xs text-neutral-500">${producto.price}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-neutral-400">
                No se encontraron resultados para &quot;{query}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
