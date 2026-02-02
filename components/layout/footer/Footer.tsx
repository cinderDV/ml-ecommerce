'use client';

import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

export default function Footer() {
  const { colors } = useTheme();

  return (
    <footer className="bg-[#2D2D2D] text-[#EAEAEA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Subscribe */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">
              Suscripción
            </h3>
            <p className="text-sm text-[#CFCFCF] mb-4 max-w-md">
              Recibe novedades sobre proyectos, catálogos y soluciones de mobiliario corporativo.
            </p>

            <form className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 rounded-md bg-[#1F1F1F] border border-[#444] px-3 py-2 text-sm text-white placeholder-[#888] focus:outline-none focus:border-[#666]"
              />
              <button
                type="submit"
                className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: colors.primary }}
              >
                Suscribirse
              </button>
            </form>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/catalogo', label: 'Catálogo' },
                { href: '#proyectos', label: 'Proyectos' },
                { href: '#contacto', label: 'Contacto' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#CFCFCF] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-[#CFCFCF]">
              <li>+56 9 1234 5678</li>
              <li>contacto@mlcontract.cl</li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#444] mt-10 pt-6 text-center text-xs text-[#AFAFAF]">
          © {new Date().getFullYear()} ML Contract. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
