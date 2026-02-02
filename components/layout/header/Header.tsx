'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import AnnouncementBar from './AnnouncementBar';

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);

  const navItems = [
    { label: 'Asientos', href: '/asientos' },
    { label: 'Sala de Estar', href: '/sala-de-estar' },
    { label: 'Dormitorio', href: '/dormitorio' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <AnnouncementBar/>
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-6">
        
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo.svg" 
                alt="Muebles Latina" 
                width={20}  // Ajusta según el tamaño que desees
                height={20} // Mantén la proporción
                className="h-5 w-auto transition-transform group-hover:scale-105" 
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Muebles Latina 
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/account"
              className="text-gray-700 hover:text-gray-900 text-sm"
            >
              Cuenta
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-gray-900 text-sm"
            >
              Carrito
            </Link>
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
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-gray-700 hover:text-gray-900 text-sm"
            >
              {item.label}
            </Link>
          ))}

          {/* Actions mobile */}
          <Link
            href="/account"
            className="block text-gray-700 hover:text-gray-900 text-sm"
          >
            Cuenta
          </Link>
          <Link
            href="/cart"
            className="block text-gray-700 hover:text-gray-900 text-sm"
          >
            Carrito
          </Link>
        </div>
      )}
    </header>
  );
}
