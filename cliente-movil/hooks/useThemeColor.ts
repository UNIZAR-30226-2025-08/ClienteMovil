/**
 * Hook personalizado para manejar colores basados en el tema de la aplicación.
 * Permite especificar colores diferentes para los modos claro y oscuro.
 *
 * @see https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * Obtiene el color correspondiente según el tema actual de la aplicación
 *
 * @param props - Objeto con colores específicos para cada tema
 * @param props.light - Color a usar en modo claro (opcional)
 * @param props.dark - Color a usar en modo oscuro (opcional)
 * @param colorName - Nombre del color a obtener de la paleta de colores
 * @returns El color correspondiente al tema actual
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
