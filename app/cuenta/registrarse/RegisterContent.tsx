'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterContent() {
  const { registrarse, estaAutenticado } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (estaAutenticado) {
      router.push('/cuenta');
    }
  }, [estaAutenticado, router]);

  function clearFieldError(field: string) {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validar(): boolean {
    const errors: Record<string, string> = {};

    if (!nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!apellido.trim()) errors.apellido = 'El apellido es obligatorio';

    if (!email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ingresa un email válido';
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!validar()) return;

    const resultado = registrarse(nombre.trim(), apellido.trim(), email.trim(), password);
    if (!resultado.ok) {
      setError(resultado.error || 'Error al crear la cuenta');
    }
  }

  if (estaAutenticado) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-900 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-neutral-900">Crear cuenta</span>
      </nav>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={e => { setNombre(e.target.value); clearFieldError('nombre'); }}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              {fieldErrors.nombre && <p className="text-xs text-red-500 mt-1">{fieldErrors.nombre}</p>}
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={e => { setApellido(e.target.value); clearFieldError('apellido'); }}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              {fieldErrors.apellido && <p className="text-xs text-red-500 mt-1">{fieldErrors.apellido}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearFieldError('email'); }}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              placeholder="tu@email.com"
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); clearFieldError('password'); }}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              placeholder="Repite tu contraseña"
            />
            {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-neutral-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/cuenta/iniciar-sesion" className="text-neutral-900 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
