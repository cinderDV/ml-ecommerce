import type { Metadata } from 'next';
import LoginContent from './LoginContent';

export const metadata: Metadata = {
  title: 'Iniciar sesión | Muebles Latina',
  description: 'Inicia sesión en tu cuenta de Muebles Latina para acceder a tus pedidos y perfil.',
};

export default function LoginPage() {
  return <LoginContent />;
}
