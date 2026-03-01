'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import SearchBar from './SearchBar';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export interface NavSubcategoria {
  label: string;
  href: string;
}

export interface NavCategory {
  label: string;
  slug: string;
  href: string;
  subcategorias: NavSubcategoria[];
}

interface HeaderProps {
  categorias?: NavCategory[];
}

export default function Header({ categorias = [] }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const pathname = usePathname();
  const { totalItems, abrirDrawer } = useCart();
  const { usuario, estaAutenticado, cerrarSesion } = useAuth();

  const navItems = categorias;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <AnnouncementBar/>
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-6">

        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.svg"
                alt="Muebles Latina"
                width={24}
                height={24}
                className="h-6 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                Muebles Latina
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 ml-6">
            {navItems.map(item => {
              const activo = pathname.startsWith(item.href);

              return (
                <div key={item.slug} className="relative group/nav">
                  <Link
                    href={item.href}
                    className={`nav-link text-[13px] font-medium inline-block tracking-wide ${
                      activo
                        ? "nav-link-activo text-neutral-900"
                        : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>

                  {/* Dropdown de subcategorías */}
                  {item.subcategorias.length > 0 && (
                    <>
                      <div className="absolute top-full left-0 h-3 w-full" />

                      <div className="nav-dropdown absolute top-full left-1/2 pt-3">
                        <div className="bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.16)] border border-neutral-100 overflow-hidden min-w-[180px]">
                          <ul className="py-1.5">
                            {item.subcategorias.map(sub => {
                              const hash = sub.href.includes('#') ? sub.href.split('#')[1] : null;
                              return (
                                <li key={sub.href} className="nav-sub-item opacity-0">
                                  <Link
                                    href={sub.href}
                                    onClick={(e) => {
                                      if (hash && pathname === item.href) {
                                        e.preventDefault();
                                        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }}
                                    className={`block px-4 py-2 text-sm transition-colors ${
                                      "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                                    }`}
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Búsqueda (desktop) — flex-1 ocupa todo el espacio disponible */}
          <div className="hidden md:block flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Acciones (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {estaAutenticado && usuario ? (
              <div className="relative">
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="text-sm font-medium text-neutral-700">{usuario.nombre}</span>
                </button>
                {openUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.16)] border border-neutral-100 overflow-hidden min-w-[160px]">
                      <ul className="py-1.5">
                        <li>
                          <Link
                            href="/cuenta"
                            onClick={() => setOpenUserMenu(false)}
                            className="block px-4 py-2 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                          >
                            Mi cuenta
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => { cerrarSesion(); setOpenUserMenu(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
                          >
                            Cerrar sesión
                          </button>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/cuenta/iniciar-sesion"
                title="Iniciar sesión"
                className="p-2.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            )}
            <button
              onClick={abrirDrawer}
              title="Carrito"
              className="relative p-2.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 -right-1.5 bg-red-500 text-white text-xs font-bold min-w-6 h-6 px-1.5 rounded-full flex items-center justify-center badge-pop">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="text-gray-700 focus:outline-none"
            >
              ☰
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav */}
      {openMenu && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          {navItems.map(item => {
            const activo = pathname.startsWith(item.href);
            return (
              <div key={item.slug}>
                <Link
                  href={item.href}
                  className={`block text-sm py-1 ${
                    activo
                      ? "text-neutral-900 font-semibold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
                {item.subcategorias.length > 0 && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-neutral-100 pl-3">
                    {item.subcategorias.map(sub => {
                      const subActiva = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block text-xs py-0.5 ${
                            subActiva
                              ? "text-neutral-900 font-semibold"
                              : "text-neutral-400 hover:text-neutral-900"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Actions mobile */}
          {estaAutenticado ? (
            <>
              <Link
                href="/cuenta"
                onClick={() => setOpenMenu(false)}
                className="block text-gray-700 hover:text-gray-900 text-sm"
              >
                Mi cuenta
              </Link>
              <button
                onClick={() => { cerrarSesion(); setOpenMenu(false); }}
                className="block text-gray-700 hover:text-gray-900 text-sm cursor-pointer"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/cuenta/iniciar-sesion"
              onClick={() => setOpenMenu(false)}
              className="block text-gray-700 hover:text-gray-900 text-sm"
            >
              Iniciar sesión
            </Link>
          )}
          <button
            onClick={() => { abrirDrawer(); setOpenMenu(false); }}
            className="block text-gray-700 hover:text-gray-900 text-sm cursor-pointer"
          >
            Carrito {totalItems > 0 && `(${totalItems})`}
          </button>
        </div>
      )}
    </header>
  );
}
