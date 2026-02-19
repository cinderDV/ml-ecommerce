import type { Metadata } from 'next';
import CartPageContent from './CartPageContent';

export const metadata: Metadata = {
  title: 'Carrito de Compras | Muebles Latina',
  description: 'Revisa los productos en tu carrito antes de finalizar tu compra en Muebles Latina.',
};

export default function CartPage() {
  return <CartPageContent />;
}
