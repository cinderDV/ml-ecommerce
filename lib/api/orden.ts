// Orden de categorías en la navegación.
// Prioridad de marketing: héroe (ticket alto) → complementos → impulso → otro ambiente.
// Para cambiar el orden, solo modifica los números aquí.

export const ordenCategorias: Record<string, number> = {
  'seccionales': 1,
  'sofas': 2,
  'poltronas': 3,
  'pouf': 4,
  'camas': 5,
};

export const ordenSubcategorias: Record<string, number> = {
  // Seccionales
  'seccional-funcional': 1,
  'seccional-latina': 2,
  'seccional-mustang': 3,
  'seccional-mustang-intercambiable': 4,
  'otros-seccionales': 5,
  // Sofás
  'sofa-living': 1,
  'sofa-cama-funcional': 2,
};
