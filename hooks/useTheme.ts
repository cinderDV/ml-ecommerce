import { theme } from '@/lib/theme';

/**
 * Hook para acceder a los colores del tema actual
 * Uso: const { colors } = useTheme();
 */
export function useTheme() {
  return {
    colors: theme,
  };
}

/**
 * Helper para generar clases de Tailwind con los colores del tema
 * Esto permite usar los colores del tema directamente en style props
 */
export function getThemeColors() {
  return theme;
}
