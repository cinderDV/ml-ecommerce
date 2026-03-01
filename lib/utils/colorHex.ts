/**
 * Resuelve un hex representativo a partir de un nombre de color en español.
 *
 * Estrategia:
 * 1. Ignora prefijos de material (Felpa, Lino, PU, Tela, Cuero, etc.)
 * 2. Busca el color base en un mapa de colores en español
 * 3. Aplica modificadores (Claro → más claro, Oscuro → más oscuro)
 * 4. Si nada coincide, genera un hue estable a partir del hash del nombre
 */

const COLORES_BASE: Record<string, string> = {
  negro: '#1a1a1a',
  blanco: '#f5f5f5',
  gris: '#888888',
  rojo: '#c0392b',
  azul: '#2c6fbb',
  verde: '#27ae60',
  amarillo: '#f1c40f',
  naranja: '#e67e22',
  marron: '#6d4c2f',
  cafe: '#6d4c2f',
  chocolate: '#5c3317',
  beige: '#d4b896',
  crema: '#f5e6cc',
  turqueza: '#1abc9c',
  turquesa: '#1abc9c',
  petroleo: '#1b4f5c',
  rosa: '#e84393',
  morado: '#8e44ad',
  lila: '#a370c4',
  burdeo: '#722f37',
  bordo: '#722f37',
  celeste: '#74b9ff',
  arena: '#c9b18c',
  natural: '#c8b28a',
  camel: '#c19a6b',
  terracota: '#b94e31',
  grafito: '#4a4a4a',
  humo: '#6e6e6e',
  plata: '#b0b0b0',
  dorado: '#c5a44e',
  cobre: '#b87333',
  oliva: '#708238',
  mostaza: '#c49b1a',
  salmon: '#e8836b',
  coral: '#e36d5e',
  menta: '#7ecfb3',
  lavanda: '#b39ddb',
  piedra: '#8e8279',
  ceniza: '#9e9e9e',
  avellana: '#8b6f4e',
  nogal: '#5c4033',
  roble: '#8b6d3f',
  cerezo: '#7b3030',
  wenge: '#3c2415',
};

const MATERIALES = /^(felpa|lino|pu|tela|cuero|eco.?cuero|pana|terciopelo|chenille)\s+/i;

/**
 * Ajusta luminosidad de un hex. factor > 1 aclara, < 1 oscurece.
 */
function ajustarLuminosidad(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const ajustar = (c: number) => {
    if (factor > 1) {
      return Math.min(255, Math.round(c + (255 - c) * (factor - 1)));
    }
    return Math.max(0, Math.round(c * factor));
  };

  const rr = ajustar(r).toString(16).padStart(2, '0');
  const gg = ajustar(g).toString(16).padStart(2, '0');
  const bb = ajustar(b).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}

/**
 * Genera un hex estable desde un string (para colores no reconocidos).
 */
function hashToHex(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const h = Math.abs(hash) % 360;
  // HSL con saturación media y luminosidad media → color reconocible
  return hslToHex(h, 45, 45);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Dado un nombre de color (ej: "Felpa Gris Claro", "PU Negro", "Lino Turqueza"),
 * devuelve un hex representativo.
 */
export function resolverHexColor(nombre: string): string {
  // Quitar material del inicio
  const sinMaterial = nombre.replace(MATERIALES, '').trim().toLowerCase();

  // Detectar modificadores
  const esClaro = /\bclaro\b/.test(sinMaterial);
  const esOscuro = /\boscuro\b/.test(sinMaterial);
  const sinModificador = sinMaterial
    .replace(/\b(claro|oscuro)\b/g, '')
    .trim();

  // Buscar en mapa de colores base (priorizar coincidencias más específicas)
  const entradas = Object.entries(COLORES_BASE).sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [clave, hex] of entradas) {
    if (sinModificador === clave || sinModificador.includes(clave)) {
      if (esClaro) return ajustarLuminosidad(hex, 1.4);
      if (esOscuro) return ajustarLuminosidad(hex, 0.6);
      return hex;
    }
  }

  // Fallback: hash del nombre completo
  return hashToHex(nombre.toLowerCase());
}
