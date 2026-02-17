'use client';

import { useEffect, useState, useRef } from 'react';

export interface SubcategoryLink {
  label: string;
  id: string; // ID de la section (sin #)
}

interface SubcategoryNavProps {
  items: SubcategoryLink[];
}

export default function SubcategoryNav({ items }: SubcategoryNavProps) {
  const [visible, setVisible] = useState(false);
  const [activa, setActiva] = useState<string | null>(null);
  const indicadorRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Mostrar solo cuando la primera sección ha pasado por detrás del header
  useEffect(() => {
    const primerSeccion = document.getElementById(items[0]?.id);
    if (!primerSeccion) return;

    const handleScroll = () => {
      const rect = primerSeccion.getBoundingClientRect();
      // Aparece cuando el top de la sección llega al área del header (~112px)
      setVisible(rect.top <= 112);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  // Detectar cuál sección está activa
  useEffect(() => {
    const secciones = items
      .map(item => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibles = entries.filter(e => e.isIntersecting);
        if (visibles.length > 0) {
          setActiva(visibles[0].target.id);
        }
      },
      {
        rootMargin: '-30% 0px -60% 0px',
      }
    );

    secciones.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  // Mover el indicador al link activo
  useEffect(() => {
    if (!activa || !indicadorRef.current) return;
    const linkEl = linksRef.current.get(activa);
    if (!linkEl) return;

    indicadorRef.current.style.width = `${linkEl.offsetWidth}px`;
    indicadorRef.current.style.left = `${linkEl.offsetLeft}px`;
  }, [activa]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-28 pointer-events-none'
      }`}
    >
      <nav className="relative flex items-center justify-center gap-8 h-11">
        {/* Indicador animado */}
        <div
          ref={indicadorRef}
          className="absolute bottom-0 h-[2px] bg-neutral-900 transition-all duration-300 ease-out"
        />

        {items.map(item => (
          <a
            key={item.id}
            ref={(el) => {
              if (el) linksRef.current.set(item.id, el);
            }}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`shrink-0 text-[13px] font-medium transition-colors whitespace-nowrap ${
              activa === item.id
                ? 'text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
