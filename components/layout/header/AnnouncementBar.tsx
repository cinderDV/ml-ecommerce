'use client';

import { useEffect, useState } from 'react';

const mensajes = [
  "Envío gratis en pedidos sobre $50.000",
  "Hasta 12 cuotas sin interés",
  "Garantía de 5 años en toda la tienda",
];

export default function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);
  const [indice, setIndice] = useState(0);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rotación de mensajes
  useEffect(() => {
    const intervalo = setInterval(() => {
      setAnimando(true);
      setTimeout(() => {
        setIndice((prev) => (prev + 1) % mensajes.length);
        setAnimando(false);
      }, 400);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div
      className={`
        overflow-hidden announcement-bar
        ${hidden ? 'announcement-bar-hidden' : ''}
      `}
    >
      <div className="h-9 bg-red-900 text-white text-[11px] tracking-widest uppercase flex items-center justify-center gap-2">
        <span className={`announcement-text ${animando ? 'announcement-text-exit' : ''}`}>
          {mensajes[indice]}
        </span>
      </div>
    </div>
  );
}
