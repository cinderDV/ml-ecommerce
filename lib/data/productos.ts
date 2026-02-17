import type { ProductoDetalle } from "@/lib/types/producto";

// --- DATOS MOCK CENTRALIZADOS ---
// Cuando conectemos WooCommerce, vendrán de:
// GET /wp-json/wc/v3/products
// Cada producto incluye datos para la tarjeta y para la vista de detalle.

export const productosAsientos: ProductoDetalle[] = [
  // === SOFÁS ===
  {
    id: 1,
    name: "Sofá Malmö",
    slug: "sofa-malmo",
    price: "8.900",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80",
    category: "Sofás",
    categorySlug: "asientos",
    subcategory: "Sofás",
    descripcion: "El Sofá Malmö combina la elegancia escandinava con el máximo confort. Su estructura de madera de haya maciza y almohadones de espuma de alta densidad lo convierten en el centro de cualquier sala de estar. Tapizado en tela de lino de alta resistencia, disponible en cuatro tonos inspirados en la naturaleza nórdica.",
    caracteristicas: [
      "Estructura de madera de haya maciza",
      "Espuma de alta densidad (35 kg/m³)",
      "Tapizado en lino de alta resistencia",
      "Patas torneadas en roble natural",
      "Cojines desenfundables con cierre oculto",
    ],
    dimensiones: "220 × 90 × 82 cm (ancho × profundidad × alto)",
    material: "Lino, madera de haya, espuma HR",
    imagenes: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=80",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80",
      "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1200&q=80",
    ],
    variants: [
      { color: "Gris Humo", hex: "#6B7280", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80" },
      { color: "Azul Marino", hex: "#1E3A5F", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=600&q=80" },
      { color: "Verde Oliva", hex: "#556B2F", image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80" },
      { color: "Terracota", hex: "#C65D3E", image: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80" },
    ],
  },
  {
    id: 2,
    name: "Sofá Estocolmo",
    slug: "sofa-estocolmo",
    price: "12.500",
    salePrice: "9.900",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=600&q=80",
    category: "Sofás",
    categorySlug: "asientos",
    subcategory: "Sofás",
    descripcion: "El Sofá Estocolmo es nuestra pieza premium. Con su perfil bajo y líneas depuradas, aporta sofisticación a cualquier ambiente. Relleno de pluma y espuma viscoelástica para un confort excepcional.",
    caracteristicas: [
      "Relleno de pluma y espuma viscoelástica",
      "Tapizado en terciopelo de algodón",
      "Base en acero inoxidable cepillado",
      "Respaldo reclinable en 3 posiciones",
      "Capacidad para 4 personas",
    ],
    dimensiones: "260 × 95 × 75 cm (ancho × profundidad × alto)",
    material: "Terciopelo de algodón, acero inoxidable, espuma viscoelástica",
    imagenes: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
    ],
    variants: [
      { color: "Azul Noche", hex: "#1E3A5F", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=600&q=80" },
      { color: "Gris Perla", hex: "#9CA3AF", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80" },
    ],
  },
  {
    id: 3,
    name: "Sofá Oslo Compacto",
    slug: "sofa-oslo-compacto",
    price: "6.200",
    image: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80",
    category: "Sofás",
    categorySlug: "asientos",
    subcategory: "Sofás",
    descripcion: "Diseñado para espacios reducidos sin sacrificar comodidad. El Oslo Compacto ofrece el mismo nivel de confort que un sofá de tamaño completo en una huella más pequeña. Ideal para departamentos y estudios.",
    caracteristicas: [
      "Diseño compacto para espacios reducidos",
      "Espuma de alta resiliencia",
      "Tapizado antimanchas",
      "Patas en madera de fresno",
      "Fácil armado en 15 minutos",
    ],
    dimensiones: "170 × 85 × 80 cm (ancho × profundidad × alto)",
    material: "Tela antimanchas, madera de fresno, espuma HR",
    imagenes: [
      "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=1200&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80",
    ],
  },
  // === SILLONES ===
  {
    id: 10,
    name: "Sillón Bergen",
    slug: "sillon-bergen",
    price: "5.200",
    salePrice: "3.900",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",
    category: "Sillones",
    categorySlug: "asientos",
    subcategory: "Sillones",
    descripcion: "El Sillón Bergen es un clásico del diseño nórdico reinventado. Su silueta envolvente y apoyabrazos curvados invitan a largas horas de lectura. Tapizado en bouclé de lana premium.",
    caracteristicas: [
      "Tapizado en bouclé de lana premium",
      "Estructura de madera de abedul",
      "Relleno de fibra siliconada",
      "Apoyabrazos curvados ergonómicos",
      "Base giratoria opcional",
    ],
    dimensiones: "80 × 85 × 95 cm (ancho × profundidad × alto)",
    material: "Bouclé de lana, madera de abedul, fibra siliconada",
    imagenes: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80",
    ],
    variants: [
      { color: "Crema", hex: "#F5F0E8", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80" },
      { color: "Caramelo", hex: "#8B6914", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
    ],
  },
  {
    id: 11,
    name: "Sillón Reykjavik",
    slug: "sillon-reykjavik",
    price: "4.800",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    category: "Sillones",
    categorySlug: "asientos",
    subcategory: "Sillones",
    descripcion: "Inspirado en la calidez de los hogares islandeses. El Reykjavik combina líneas minimalistas con un asiento profundo y acogedor. Perfecto como acento visual en salas y dormitorios.",
    caracteristicas: [
      "Asiento extra profundo (55 cm)",
      "Tapizado en tela tejida de alta durabilidad",
      "Patas en metal negro mate",
      "Cojín lumbar incluido",
      "Montaje sin herramientas",
    ],
    dimensiones: "75 × 82 × 90 cm (ancho × profundidad × alto)",
    material: "Tela tejida, metal, espuma de poliuretano",
    imagenes: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    ],
    variants: [
      { color: "Mostaza", hex: "#B8860B", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" },
      { color: "Gris Claro", hex: "#D1D5DB", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80" },
    ],
  },
  {
    id: 12,
    name: "Sillón Turku Reclinable",
    slug: "sillon-turku",
    price: "7.300",
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80",
    category: "Sillones",
    categorySlug: "asientos",
    subcategory: "Sillones",
    descripcion: "Relax total con el Turku Reclinable. Mecanismo de reclinación suave con 5 posiciones, desde lectura hasta siesta. Tapizado en cuero sintético premium de fácil limpieza.",
    caracteristicas: [
      "Reclinación en 5 posiciones",
      "Cuero sintético premium resistente",
      "Reposapiés integrado retráctil",
      "Mecanismo silencioso de alta durabilidad",
      "Fácil limpieza con paño húmedo",
    ],
    dimensiones: "82 × 90 × 105 cm (ancho × profundidad × alto)",
    material: "Cuero sintético, acero, espuma viscoelástica",
    imagenes: [
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1200&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80",
    ],
  },
  // === SILLAS ===
  {
    id: 20,
    name: "Silla Copenhague",
    slug: "silla-copenhague",
    price: "2.450",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80",
    category: "Sillas",
    categorySlug: "asientos",
    subcategory: "Sillas",
    descripcion: "La Silla Copenhague es una obra maestra del diseño danés. Su respaldo curvado en madera laminada se adapta naturalmente a la espalda. Ideal para comedor, escritorio o como silla de acento.",
    caracteristicas: [
      "Respaldo curvado en madera laminada",
      "Asiento acolchado con tela de lino",
      "Patas torneadas en roble",
      "Apilable hasta 4 unidades",
      "Peso: 4.2 kg (ultraligera)",
    ],
    dimensiones: "45 × 52 × 82 cm (ancho × profundidad × alto)",
    material: "Roble, madera laminada, lino",
    imagenes: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200&q=80",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80",
    ],
    variants: [
      { color: "Natural", hex: "#C4A882", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80" },
      { color: "Negro", hex: "#1A1A1A", image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80" },
      { color: "Blanco", hex: "#F5F5F0", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600&q=80" },
    ],
  },
  {
    id: 21,
    name: "Silla Aarhus",
    slug: "silla-aarhus",
    price: "1.890",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80",
    category: "Sillas",
    categorySlug: "asientos",
    subcategory: "Sillas",
    descripcion: "Simplicidad funcional en estado puro. La Silla Aarhus tiene un diseño atemporal que combina con cualquier estilo de decoración. Perfecta para el uso diario en comedor o escritorio.",
    caracteristicas: [
      "Diseño atemporal y versátil",
      "Madera de haya certificada FSC",
      "Acabado con barniz ecológico",
      "Asiento ergonómico curvado",
      "Resistente hasta 120 kg",
    ],
    dimensiones: "43 × 50 × 80 cm (ancho × profundidad × alto)",
    material: "Madera de haya, barniz ecológico",
    imagenes: [
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80",
    ],
  },
  {
    id: 22,
    name: "Silla Tampere",
    slug: "silla-tampere",
    price: "3.100",
    salePrice: "2.490",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80",
    category: "Sillas",
    categorySlug: "asientos",
    subcategory: "Sillas",
    descripcion: "La Silla Tampere fusiona la tradición artesanal finlandesa con materiales contemporáneos. Su asiento tapizado en cuero natural y estructura en madera torneada la convierten en una pieza de colección.",
    caracteristicas: [
      "Asiento tapizado en cuero natural",
      "Estructura en madera torneada a mano",
      "Respaldo con soporte lumbar integrado",
      "Protectores de piso incluidos",
      "Disponible en 2 acabados de madera",
    ],
    dimensiones: "48 × 54 × 85 cm (ancho × profundidad × alto)",
    material: "Cuero natural, madera torneada",
    imagenes: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&q=80",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80",
    ],
    variants: [
      { color: "Roble", hex: "#8B7355", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80" },
      { color: "Nogal", hex: "#4A3728", image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80" },
    ],
  },
  // === BANCOS ===
  {
    id: 30,
    name: "Banco Helsinki",
    slug: "banco-helsinki",
    price: "3.100",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80",
    category: "Bancos",
    categorySlug: "asientos",
    subcategory: "Bancos",
    descripcion: "El Banco Helsinki es pura versatilidad. Sirve como asiento adicional en el comedor, banco de entrada o mesa auxiliar. Fabricado en pino macizo con acabado natural que resalta la belleza de la veta.",
    caracteristicas: [
      "Pino macizo de bosques sostenibles",
      "Acabado natural con aceite de linaza",
      "Capacidad para 3 personas",
      "Superficie lisa sin astillas",
      "Apilable para almacenamiento",
    ],
    dimensiones: "140 × 35 × 45 cm (ancho × profundidad × alto)",
    material: "Pino macizo, aceite de linaza",
    imagenes: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
    ],
  },
  {
    id: 31,
    name: "Banco Gotemburgo",
    slug: "banco-gotemburgo",
    price: "2.750",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
    category: "Bancos",
    categorySlug: "asientos",
    subcategory: "Bancos",
    descripcion: "Inspirado en los bancos de los parques de Gotemburgo. Su diseño combina listones de madera con estructura metálica para un look industrial-nórdico. Perfecto para entradas, pasillos y terrazas cubiertas.",
    caracteristicas: [
      "Combinación de madera y metal",
      "Tratamiento anti-humedad",
      "Apto para interior y exterior cubierto",
      "Patas antideslizantes ajustables",
      "Soporta hasta 200 kg",
    ],
    dimensiones: "120 × 38 × 48 cm (ancho × profundidad × alto)",
    material: "Madera de acacia, metal negro mate",
    imagenes: [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    ],
    variants: [
      { color: "Pino Natural", hex: "#D4A574", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80" },
      { color: "Ébano", hex: "#2C1810", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80", hoverImage: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80" },
    ],
  },
];

// Funciones de acceso a datos

export function getProductoPorSlug(slug: string): ProductoDetalle | undefined {
  return productosAsientos.find((p) => p.slug === slug);
}

export function getProductosRelacionados(
  subcategory: string,
  excludeSlug: string,
  limit = 4
): ProductoDetalle[] {
  return productosAsientos
    .filter((p) => p.subcategory === subcategory && p.slug !== excludeSlug)
    .slice(0, limit);
}

export function getTodosLosProductos(): ProductoDetalle[] {
  return productosAsientos;
}
