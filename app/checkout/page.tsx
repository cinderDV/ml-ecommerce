import type { Metadata } from 'next';
import CheckoutContent from './CheckoutContent';

export const metadata: Metadata = {
  title: 'Finalizar compra | Muebles Latina',
  description: 'Completa tus datos de envío y método de pago para finalizar tu pedido en Muebles Latina.',
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
