import Image from "next/image";

interface CategoryHeaderProps {
  title: string;
  description: string;
  backgroundImage: string;
  productCount?: number;
  ctaText?: string;
  ctaHref?: string;
}

export default function CategoryHeader({
  title,
  description,
  backgroundImage,
  productCount,
  ctaText = "Explorar colección",
  ctaHref = "#productos",
}: CategoryHeaderProps) {
  return (
    <div className="mx-6 sm:mx-10 lg:mx-16 mt-6">
      <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-2xl shadow-[0_2px_3px_rgba(0,0,0,0.15),0_6px_10px_rgba(0,0,0,0.12)]">
        {/* Imagen de fondo con zoom sutil */}
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover hero-zoom"
          priority
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Contenido centrado verticalmente */}
        <div className="relative h-full flex flex-col justify-center p-8 md:p-14">
          <div className="max-w-xl space-y-5">
            {productCount !== undefined && (
              <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-white/60 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
                {productCount} productos
              </span>
            )}

            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
              {title}
            </h1>

            <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-md">
              {description}
            </p>

            {/* CTA principal */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={ctaHref}
                className="hero-cta inline-flex items-center gap-2.5 bg-white text-neutral-900 text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                {ctaText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 scroll-indicator">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/60 rounded-full scroll-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
