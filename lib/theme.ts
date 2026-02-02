/**
 * Sistema de temas centralizado 
 * Permite cambiar fácilmente entre diferentes paletas de colores
 */

export interface ThemeColors {
  // Marca principal
  primary: string;
  primaryHover: string;

  // Fondos
  background: string;
  surface: string;
  surfaceHover: string;

  // Textos
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Bordes
  border: string;
  borderLight: string;

  // Estados
  success: string;
  warning: string;
  error: string;
}

// ============================================
// OPCIONES DE PALETAS DE COLORES
// ============================================

// Opción 3: Verde Profesional
export const professionalGreenTheme: ThemeColors = {
  primary: '#059669', // Verde esmeralda
  primaryHover: '#047857',

  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceHover: '#F3F4F6',

  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',

  border: '#E5E7EB',
  borderLight: '#D1D5DB',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};


// Opción 6: Gris Minimalista
export const minimalistGrayTheme: ThemeColors = {
  primary: '#18181B', // Negro suave
  primaryHover: '#27272A',

  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceHover: '#F4F4F5',

  textPrimary: '#09090B',
  textSecondary: '#3F3F46',
  textMuted: '#71717A',

  border: '#E4E4E7',
  borderLight: '#D4D4D8',

  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
};

// ============================================
// TEMA ACTIVO
// ============================================

// Cambia esta línea para probar diferentes paletas
export const theme = minimalistGrayTheme;

// Utilidades para usar en Tailwind
export const colors = {
  primary: theme.primary,
  'primary-hover': theme.primaryHover,

  background: theme.background,
  surface: theme.surface,
  'surface-hover': theme.surfaceHover,

  'text-primary': theme.textPrimary,
  'text-secondary': theme.textSecondary,
  'text-muted': theme.textMuted,

  border: theme.border,
  'border-light': theme.borderLight,

  success: theme.success,
  warning: theme.warning,
  error: theme.error,
};
