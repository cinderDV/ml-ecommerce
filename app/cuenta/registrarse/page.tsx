import type { Metadata } from 'next';
import RegisterContent from './RegisterContent';

export const metadata: Metadata = {
  title: 'Crear cuenta | Muebles Latina',
  description: 'Crea tu cuenta en Muebles Latina para gestionar tus pedidos y perfil.',
};

export default function RegisterPage() {
  return <RegisterContent />;
}
