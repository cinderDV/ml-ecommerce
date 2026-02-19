'use client';

import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '@/lib/contexts/AuthContext';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return context;
}
