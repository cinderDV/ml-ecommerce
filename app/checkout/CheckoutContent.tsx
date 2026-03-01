'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { procesarPedido } from '@/lib/api/cart';
import type { WcAddress } from '@/lib/api/types';

interface FormErrors {
  [key: string]: string;
}

const REGIONES_CL = [
  { code: 'CL-AP', name: 'Arica y Parinacota' },
  { code: 'CL-TA', name: 'Tarapacá' },
  { code: 'CL-AN', name: 'Antofagasta' },
  { code: 'CL-AT', name: 'Atacama' },
  { code: 'CL-CO', name: 'Coquimbo' },
  { code: 'CL-VS', name: 'Valparaíso' },
  { code: 'CL-RM', name: 'Metropolitana de Santiago' },
  { code: 'CL-LI', name: "O'Higgins" },
  { code: 'CL-ML', name: 'Maule' },
  { code: 'CL-NB', name: 'Ñuble' },
  { code: 'CL-BI', name: 'Biobío' },
  { code: 'CL-AR', name: 'Araucanía' },
  { code: 'CL-LR', name: 'Los Ríos' },
  { code: 'CL-LL', name: 'Los Lagos' },
  { code: 'CL-AI', name: 'Aysén' },
  { code: 'CL-MA', name: 'Magallanes' },
];

const METODOS_PAGO = [
  {
    id: 'transbank_webpay_plus_rest',
    label: 'Webpay Plus',
    description: 'Tarjeta de crédito o débito (Transbank)',
  },
  {
    id: 'bacs',
    label: 'Transferencia bancaria',
    description: 'Transferencia directa a nuestra cuenta',
  },
];

export default function CheckoutContent() {
  const { items, totalItems, subtotal, vaciarCarrito } = useCart();
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(METODOS_PAGO[0].id);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-neutral-900 transition-colors">Carrito</Link>
          <span>/</span>
          <span className="text-neutral-900">Finalizar compra</span>
        </nav>
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-neutral-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-lg text-neutral-600 mb-2">Tu carrito está vacío</p>
          <p className="text-sm text-neutral-400 mb-6">
            Agrega productos antes de finalizar tu compra.
          </p>
          <Link
            href="/cart"
            className="inline-block bg-neutral-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors"
          >
            Ir al carrito
          </Link>
        </div>
      </div>
    );
  }

  function validate(form: HTMLFormElement): FormErrors {
    const errs: FormErrors = {};
    const data = new FormData(form);

    const email = (data.get('email') as string)?.trim();
    if (!email) {
      errs.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Ingresa un email válido';
    }

    const telefono = (data.get('telefono') as string)?.trim();
    if (!telefono) {
      errs.telefono = 'El teléfono es obligatorio';
    } else if (!/^[+\d\s()-]{7,20}$/.test(telefono)) {
      errs.telefono = 'Ingresa un teléfono válido';
    }

    if (!(data.get('nombre') as string)?.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!(data.get('apellido') as string)?.trim()) errs.apellido = 'El apellido es obligatorio';
    if (!(data.get('direccion') as string)?.trim()) errs.direccion = 'La dirección es obligatoria';
    if (!(data.get('region') as string)?.trim()) errs.region = 'La región es obligatoria';
    if (!(data.get('comuna') as string)?.trim()) errs.comuna = 'La comuna es obligatoria';
    if (!(data.get('codigoPostal') as string)?.trim()) errs.codigoPostal = 'El código postal es obligatorio';

    return errs;
  }

  function buildAddress(form: HTMLFormElement): WcAddress {
    const data = new FormData(form);
    const depto = (data.get('depto') as string)?.trim() || '';
    return {
      first_name: (data.get('nombre') as string).trim(),
      last_name: (data.get('apellido') as string).trim(),
      company: '',
      address_1: (data.get('direccion') as string).trim(),
      address_2: depto,
      city: (data.get('comuna') as string).trim(),
      state: (data.get('region') as string).trim(),
      postcode: (data.get('codigoPostal') as string).trim(),
      country: 'CL',
      email: (data.get('email') as string).trim(),
      phone: (data.get('telefono') as string).trim(),
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = validate(form);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrorField = form.querySelector(`[name="${Object.keys(errs)[0]}"]`) as HTMLElement;
      firstErrorField?.focus();
      return;
    }

    setErrors({});
    setCheckoutError(null);
    setSubmitting(true);

    try {
      const address = buildAddress(form);

      // procesarPedido: crea sesión WC → agrega items → checkout → limpia sesión
      const response = await procesarPedido(items, selectedPayment, address);

      // Limpiar carrito local
      vaciarCarrito();

      // Redirigir según resultado
      if (response.payment_result.redirect_url) {
        window.location.href = response.payment_result.redirect_url;
      } else {
        router.push(`/checkout/confirmacion?order_id=${response.order_id}`);
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Error al procesar el pedido');
      setSubmitting(false);
    }
  }

  const inputClass = 'w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-900 transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-neutral-900 transition-colors">Carrito</Link>
        <span>/</span>
        <span className="text-neutral-900">Finalizar compra</span>
      </nav>

      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight mb-8">
        Finalizar compra
      </h1>

      {/* Error general */}
      {checkoutError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {checkoutError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Formulario */}
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-2 space-y-8"
        >
          {/* Datos de contacto */}
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Datos de contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@email.com"
                  className={`${inputClass} ${errors.email ? 'border-red-400 focus:ring-red-500' : ''}`}
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="telefono" className={labelClass}>Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="+56 9 1234 5678"
                  className={`${inputClass} ${errors.telefono ? 'border-red-400 focus:ring-red-500' : ''}`}
                />
                {errors.telefono && <p className={errorClass}>{errors.telefono}</p>}
              </div>
            </div>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Datos de envío */}
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Datos de envío</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className={labelClass}>Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Juan"
                    className={`${inputClass} ${errors.nombre ? 'border-red-400 focus:ring-red-500' : ''}`}
                  />
                  {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
                </div>
                <div>
                  <label htmlFor="apellido" className={labelClass}>Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    placeholder="Pérez"
                    className={`${inputClass} ${errors.apellido ? 'border-red-400 focus:ring-red-500' : ''}`}
                  />
                  {errors.apellido && <p className={errorClass}>{errors.apellido}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="direccion" className={labelClass}>Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Av. Providencia 1234"
                  className={`${inputClass} ${errors.direccion ? 'border-red-400 focus:ring-red-500' : ''}`}
                />
                {errors.direccion && <p className={errorClass}>{errors.direccion}</p>}
              </div>

              <div>
                <label htmlFor="depto" className={labelClass}>
                  Depto / Oficina <span className="text-neutral-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="depto"
                  name="depto"
                  placeholder="Depto 502"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="region" className={labelClass}>Región</label>
                  <select
                    id="region"
                    name="region"
                    defaultValue=""
                    className={`${inputClass} ${errors.region ? 'border-red-400 focus:ring-red-500' : ''}`}
                  >
                    <option value="" disabled>Seleccionar región</option>
                    {REGIONES_CL.map(r => (
                      <option key={r.code} value={r.code}>{r.name}</option>
                    ))}
                  </select>
                  {errors.region && <p className={errorClass}>{errors.region}</p>}
                </div>
                <div>
                  <label htmlFor="comuna" className={labelClass}>Comuna</label>
                  <input
                    type="text"
                    id="comuna"
                    name="comuna"
                    placeholder="Providencia"
                    className={`${inputClass} ${errors.comuna ? 'border-red-400 focus:ring-red-500' : ''}`}
                  />
                  {errors.comuna && <p className={errorClass}>{errors.comuna}</p>}
                </div>
              </div>

              <div className="sm:max-w-[calc(50%-0.5rem)]">
                <label htmlFor="codigoPostal" className={labelClass}>Código postal</label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  placeholder="7500000"
                  className={`${inputClass} ${errors.codigoPostal ? 'border-red-400 focus:ring-red-500' : ''}`}
                />
                {errors.codigoPostal && <p className={errorClass}>{errors.codigoPostal}</p>}
              </div>
            </div>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Método de pago */}
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Método de pago</h2>
            <div className="space-y-3">
              {METODOS_PAGO.map(method => {
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 flex items-center gap-4 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-900 shrink-0">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm2 0v2h16V7H4zm0 4v6h16v-6H4zm2 2h4v2H6v-2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">{method.label}</p>
                      <p className="text-xs text-neutral-500">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-neutral-900' : 'border-neutral-300'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Botón submit mobile */}
          <button
            type="submit"
            disabled={submitting}
            className="lg:hidden w-full bg-neutral-900 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Procesando pago...' : 'Confirmar pedido'}
          </button>
        </form>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-28 bg-neutral-50 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">Resumen del pedido</h2>

            {/* Lista de items */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.cartItemId} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                    {item.variantColor && (
                      <p className="text-xs text-neutral-400">{item.variantLabel || item.variantColor}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-neutral-900 shrink-0">${item.price}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Productos ({totalItems})</span>
                <span className="font-medium text-neutral-900">${subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Envío</span>
                <span className="text-neutral-500">Por calcular</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
              <span className="text-base font-semibold text-neutral-900">Subtotal</span>
              <span className="text-xl font-bold text-neutral-900">${subtotal}</span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="hidden lg:block w-full bg-neutral-900 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Procesando pago...' : 'Confirmar pedido'}
            </button>

            <Link
              href="/cart"
              className="block text-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
