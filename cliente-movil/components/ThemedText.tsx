import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * Propiedades extendidas del componente Text con soporte para temas
 * @extends TextProps
 */
export type ThemedTextProps = TextProps & {
  /** Color del texto en modo claro */
  lightColor?: string;
  /** Color del texto en modo oscuro */
  darkColor?: string;
  /** Tipo de texto que determina el estilo aplicado */
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

/**
 * Componente de texto que soporta temas claro/oscuro y diferentes estilos predefinidos
 *
 * @param props - Propiedades del componente
 * @param props.style - Estilos adicionales a aplicar
 * @param props.lightColor - Color del texto en modo claro
 * @param props.darkColor - Color del texto en modo oscuro
 * @param props.type - Tipo de texto que determina el estilo aplicado
 * @param props.rest - Resto de propiedades del componente Text
 * @returns Componente Text con soporte para temas y estilos predefinidos
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

/**
 * Estilos predefinidos para los diferentes tipos de texto
 */
const styles = StyleSheet.create({
  /** Estilo por defecto para texto normal */
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  /** Estilo para texto seminegrita */
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  /** Estilo para títulos principales */
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  /** Estilo para subtítulos */
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  /** Estilo para enlaces */
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
