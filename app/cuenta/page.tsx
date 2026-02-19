'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function CuentaPage() {
  const { usuario, estaAutenticado, cerrarSesion } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!estaAutenticado) {
      router.push('/cuenta/iniciar-sesion');
    }
  }, [estaAutenticado, router]);

  if (!estaAutenticado || !usuario) return null;

  function handleCerrarSesion() {
    cerrarSesion();
    router.push('/');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-900 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-neutral-900">Mi cuenta</span>
      </nav>

      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Mi cuenta</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información del perfil */}
        <div className="border border-neutral-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Información personal</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Nombre completo</p>
              <p className="text-sm text-neutral-900 mt-0.5">{usuario.nombre} {usuario.apellido}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</p>
              <p className="text-sm text-neutral-900 mt-0.5">{usuario.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Miembro desde</p>
              <p className="text-sm text-neutral-900 mt-0.5">Febrero 2026</p>
            </div>
          </div>
        </div>

        {/* Pedidos */}
        <div className="border border-neutral-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Mis pedidos</h2>
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-neutral-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-sm text-neutral-500">No tienes pedidos aún</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleCerrarSesion}
          className="bg-neutral-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
