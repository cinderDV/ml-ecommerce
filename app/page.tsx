import Image from "next/image";
import Link from "next/link";
import { getCategorias, getProductosPorCategoria } from "@/lib/api/woocommerce";
import { mapWcToProductCard } from "@/lib/api/mappers";
import { ordenCategorias } from "@/lib/api/orden";
import ProductCard from "@/components/Product/ProductCard";

export const revalidate = 60;

/* ── Layouts para el bento grid de categorías ────────────────────────── */
const bentoLayouts = [
  // Cada layout es un array de { colSpan, rowSpan, aspect } para cada card
  // Se cicla si hay más categorías que items en el layout
  { col: "md:col-span-7", row: "md:row-span-2", aspect: "aspect-[4/3] md:aspect-auto", h: "md:h-full" },
  { col: "md:col-span-5", row: "", aspect: "aspect-[4/3] md:aspect-auto", h: "md:h-[280px]" },
  { col: "md:col-span-5", row: "", aspect: "aspect-[4/3] md:aspect-auto", h: "md:h-[280px]" },
  { col: "md:col-span-4", row: "", aspect: "aspect-[4/3] md:aspect-auto", h: "md:h-[320px]" },
  { col: "md:col-span-8", row: "", aspect: "aspect-[4/3] md:aspect-auto", h: "md:h-[320px]" },
];

export default async function Home() {
  const wcCategorias = await getCategorias();

  // Categorías raíz con productos
  const categoriasRaiz = wcCategorias
    .filter((c) => c.parent === 0)
    .filter((c) => c.count > 0 || wcCategorias.some((h) => h.parent === c.id && h.count > 0))
    .sort((a, b) => (ordenCategorias[a.slug] ?? 99) - (ordenCategorias[b.slug] ?? 99));

  // Subcategorías de la primera categoría
  const categoriaPrincipal = categoriasRaiz[0];
  const subcatsPrincipal = wcCategorias.filter((c) => c.parent === categoriaPrincipal?.id && c.count > 0);
  const primerSubcatId = subcatsPrincipal[0]?.id ?? categoriaPrincipal?.id;

  // Traer productos de varias categorías en paralelo
  const categoriasFetch = categoriasRaiz.slice(0, 3);
  const [productosCat0, productosCat1, productosCat2] = await Promise.all([
    primerSubcatId ? getProductosPorCategoria(primerSubcatId, 1, 8) : Promise.resolve([]),
    categoriasFetch[1] ? getProductosPorCategoria(categoriasFetch[1].id, 1, 6) : Promise.resolve([]),
    categoriasFetch[2] ? getProductosPorCategoria(categoriasFetch[2].id, 1, 4) : Promise.resolve([]),
  ]);

  const destacados = productosCat0.slice(0, 4).map(mapWcToProductCard);
  const novedades = [
    ...productosCat1.slice(0, 4).map(mapWcToProductCard),
    ...productosCat2.slice(0, 2).map(mapWcToProductCard),
  ].slice(0, 4);

  // Imágenes para heros/banners: preferir imágenes de productos (más lifestyle)
  const heroImage =
    productosCat0[0]?.images[0]?.src ??
    categoriaPrincipal?.image?.src ??
    "";

  const bannerImage =
    productosCat1[0]?.images[0]?.src ??
    categoriasRaiz[1]?.image?.src ??
    "";

  const bannerImage2 =
    productosCat2[0]?.images[0]?.src ??
    categoriasRaiz[2]?.image?.src ??
    productosCat0[3]?.images[0]?.src ??
    "";

  return (
    <div className="flex flex-col gap-0">

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO — full viewport, editorial
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[90vh] min-h-[600px] max-h-[1000px] w-full overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt="Muebles Latina"
            fill
            className="object-cover hero-zoom"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="relative h-full flex flex-col justify-end p-8 md:p-16 lg:p-20 pb-24 md:pb-28">
          <div className="max-w-2xl space-y-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
              Nueva colección
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[1.0]">
              Diseño que{" "}
              <span className="italic font-normal text-white/70">transforma</span>
            </h1>
            <p className="text-base md:text-lg text-white/50 max-w-md leading-relaxed">
              Mobiliario pensado para la vida real. Confort, estilo y calidad en cada pieza.
            </p>
            <div className="flex items-center gap-4 pt-3">
              <Link
                href={`/categoria/${categoriaPrincipal?.slug ?? "seccionales"}`}
                className="inline-flex items-center gap-2.5 bg-white text-neutral-900 text-sm font-semibold px-8 py-4 rounded-full hover:bg-neutral-100 transition-colors"
              >
                Explorar colección
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="#categorias"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden md:inline-flex items-center gap-1.5"
              >
                Ver categorías
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/50 rounded-full scroll-dot" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. BENTO GRID — categorías con tamaños asimétricos
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="categorias" className="px-4 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="mb-10 md:mb-14 px-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 mb-2.5">
            Categorías
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">
            Encuentra tu estilo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
          {categoriasRaiz.map((cat, i) => {
            const layout = bentoLayouts[i % bentoLayouts.length];
            const catImage =
              cat.image?.src ??
              (i === 0 ? productosCat0[1]?.images[0]?.src : "") ??
              "";

            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={`group relative overflow-hidden rounded-2xl ${layout.col} ${layout.row} ${layout.aspect} ${layout.h}`}
              >
                {catImage && (
                  <Image
                    src={catImage}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 mb-1">
                    {cat.count} productos
                  </p>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-white tracking-tight">
                    {cat.name}
                  </h3>
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. FULL-WIDTH CTA BANNER — estilo editorial
      ═══════════════════════════════════════════════════════════════════ */}
      {bannerImage && (
        <section className="px-4 sm:px-8 lg:px-12 pb-6">
          <Link
            href={`/categoria/${categoriasRaiz[1]?.slug ?? "sofas"}`}
            className="group relative block overflow-hidden rounded-2xl h-[400px] md:h-[500px]"
          >
            <Image
              src={bannerImage}
              alt={categoriasRaiz[1]?.name ?? "Colección"}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-20">
              <div className="max-w-lg space-y-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                  Colección destacada
                </p>
                <h2 className="font-serif text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05]">
                  {categoriasRaiz[1]?.name ?? "Sofás"}
                </h2>
                <p className="text-sm md:text-base text-white/50 max-w-sm leading-relaxed">
                  Comodidad y estilo para cada rincón de tu hogar.
                </p>
                <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-white bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full group-hover:bg-white/25 transition-colors mt-2">
                  Descubrir
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          4. PRODUCTOS DESTACADOS
      ═══════════════════════════════════════════════════════════════════ */}
      {destacados.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-12 py-16 md:py-24">
          <div className="flex items-end justify-between mb-8 md:mb-10 px-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 mb-2.5">
                Selección
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">
                Productos destacados
              </h2>
            </div>
            <Link
              href={`/categoria/${categoriaPrincipal?.slug ?? "seccionales"}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-5">
            {destacados.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          5. DOBLE BANNER — dos CTAs lado a lado, full width
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Banner izquierdo — alto, vertical */}
          {categoriasRaiz[2] && (
            <Link
              href={`/categoria/${categoriasRaiz[2].slug}`}
              className="group relative overflow-hidden rounded-2xl h-[360px] md:h-[480px]"
            >
              {bannerImage2 && (
                <Image
                  src={bannerImage2}
                  alt={categoriasRaiz[2].name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Colección</p>
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
                  {categoriasRaiz[2].name}
                </h3>
                <span className="inline-flex items-center gap-2 text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                  Explorar
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          )}

          {/* Banner derecho — propuesta de valor / marca */}
          <div className="relative overflow-hidden rounded-2xl h-[360px] md:h-[480px] bg-neutral-950 flex flex-col justify-center p-8 md:p-12">
            <div className="space-y-6 max-w-sm">
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                Muebles Latina
              </p>
              <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                Calidad que{" "}
                <span className="italic font-normal text-neutral-400">se siente</span>
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Cada pieza es seleccionada pensando en durabilidad, confort y diseño. Materiales que resisten el día a día sin perder su esencia.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                <div>
                  <p className="text-2xl font-semibold text-white">+80</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Productos</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">5</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Categorías</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">100%</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Garantía</p>
                </div>
              </div>
            </div>
            {/* Detalle decorativo */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-neutral-800/50" />
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border border-neutral-800/30" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. MÁS PRODUCTOS — segunda tanda
      ═══════════════════════════════════════════════════════════════════ */}
      {novedades.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-12 py-16 md:py-24">
          <div className="flex items-end justify-between mb-8 md:mb-10 px-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 mb-2.5">
                Novedades
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">
                Recién llegados
              </h2>
            </div>
            {categoriasRaiz[1] && (
              <Link
                href={`/categoria/${categoriasRaiz[1].slug}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-5">
            {novedades.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          7. BANNER FINAL — CTA a todo el catálogo
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-2xl h-[300px] md:h-[380px] bg-neutral-100">
          {productosCat0[2]?.images[0]?.src && (
            <Image
              src={productosCat0[2].images[0].src}
              alt="Catálogo completo"
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
              Catálogo completo
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight mb-4 max-w-lg">
              Explora todo nuestro mobiliario
            </h2>
            <p className="text-sm text-neutral-500 mb-6 max-w-md">
              Desde seccionales hasta camas, encuentra la pieza perfecta para tu proyecto.
            </p>
            <Link
              href={`/categoria/${categoriaPrincipal?.slug ?? "seccionales"}`}
              className="inline-flex items-center gap-2.5 bg-neutral-900 text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-neutral-700 transition-colors"
            >
              Ver catálogo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          8. PROPUESTA DE VALOR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 py-10 border-t border-neutral-100">
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">Despacho a todo Chile</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Envíos seguros a la puerta de tu hogar</p>
          </div>
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">Garantía de calidad</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Materiales resistentes con respaldo</p>
          </div>
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">Atención personalizada</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Asesoría directa para tu proyecto</p>
          </div>
        </div>
      </section>
    </div>
  );
}
