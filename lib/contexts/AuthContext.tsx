'use client';

import { createContext, useReducer, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Usuario } from '@/lib/types/usuario';

// --- Mock de usuarios ---

interface UsuarioConPassword extends Usuario {
  password: string;
}

const usuariosMock: UsuarioConPassword[] = [
  {
    id: '1',
    nombre: 'Pedrito',
    apellido: 'Demo',
    email: 'cliente@test.com',
    password: '123456',
  },
];

// --- Estado ---

interface AuthState {
  usuario: Usuario | null;
}

const initialState: AuthState = {
  usuario: null,
};

// --- Acciones ---

type AuthAction =
  | { type: 'LOGIN'; payload: Usuario }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: Usuario }
  | { type: 'HYDRATE'; payload: Usuario };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, usuario: action.payload };
    case 'REGISTER':
      return { ...state, usuario: action.payload };
    case 'LOGOUT':
      return { ...state, usuario: null };
    case 'HYDRATE':
      return { ...state, usuario: action.payload };
    default:
      return state;
  }
}

// --- Context ---

export interface AuthContextValue {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  iniciarSesion: (email: string, password: string) => { ok: boolean; error?: string };
  registrarse: (nombre: string, apellido: string, email: string, password: string) => { ok: boolean; error?: string };
  cerrarSesion: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'ml-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const usuario = JSON.parse(stored) as Usuario;
        dispatch({ type: 'HYDRATE', payload: usuario });
      }
    } catch {
      // localStorage no disponible o datos corruptos
    }
    queueMicrotask(() => setHydrated(true));
  }, []);

  // Persistir cambios en localStorage (solo después de hidratar)
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (state.usuario) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.usuario));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage lleno o no disponible
    }
  }, [state.usuario, hydrated]);

  const iniciarSesion = useCallback((email: string, password: string): { ok: boolean; error?: string } => {
    const encontrado = usuariosMock.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!encontrado) {
      return { ok: false, error: 'Email o contraseña incorrectos' };
    }
    const { id, nombre, apellido, email: userEmail } = encontrado;
    dispatch({ type: 'LOGIN', payload: { id, nombre, apellido, email: userEmail } });
    return { ok: true };
  }, []);

  const registrarse = useCallback((nombre: string, apellido: string, email: string, password: string): { ok: boolean; error?: string } => {
    const existe = usuariosMock.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existe) {
      return { ok: false, error: 'Ya existe una cuenta con este email' };
    }
    const nuevoUsuario: UsuarioConPassword = {
      id: String(Date.now()),
      nombre,
      apellido,
      email,
      password,
    };
    usuariosMock.push(nuevoUsuario);
    const { id: newId, nombre: newNombre, apellido: newApellido, email: newEmail } = nuevoUsuario;
    dispatch({ type: 'REGISTER', payload: { id: newId, nombre: newNombre, apellido: newApellido, email: newEmail } });
    return { ok: true };
  }, []);

  const cerrarSesion = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario: state.usuario,
        estaAutenticado: !!state.usuario,
        iniciarSesion,
        registrarse,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
