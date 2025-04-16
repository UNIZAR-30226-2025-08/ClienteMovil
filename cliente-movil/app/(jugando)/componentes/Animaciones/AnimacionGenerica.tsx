/**
 * @file AnimacionGenerica.tsx
 * @description Componente que muestra una animación genérica con el texto recibido como propiedad.
 * @module Componentes/AnimacionGenerica
 */

import React from "react";
import { View, Text, Animated } from "react-native";
import animacionesEstilos from "../../../../utils/jugando/styles.animaciones";

interface AnimacionGenericaProps {
  opacity: Animated.Value;
  mostrarComponente: boolean;
  texto: string;
}

/**
 * Función auxiliar que recibe un texto y devuelve un array de componentes <Text>
 * en el que cada aparición de las palabras clave se pinta con su color correspondiente,
 * mientras que el resto del texto se mantiene con el estilo por defecto.
 *
 * @param {string} texto - Texto a analizar y renderizar.
 * @returns {React.ReactNode[]} Array de elementos <Text> con estilos aplicados.
 */
const subrayarTexto = (texto: string): React.ReactNode[] => {
  // Definimos las palabras clave en una expresión regular (ignora mayúsculas/minúsculas)
  const regex = /(hombres? lobo|cazador|vidente|bruja|alguacil|pueblo)/gi;
  const partes = texto.split(regex);

  return partes.map((parte, index) => {
    // Si la parte coincide con alguna palabra clave, se pinta con el color asignado.
    if (parte.match(regex)) {
      const parteLower = parte.toLowerCase();
      let color = "white"; // color por defecto
      switch (parteLower) {
        case "hombres lobo":
          color = "red";
          break;
        case "hombre lobo":
          color = "red";
          break;
        case "cazador":
          color = "blue";
          break;
        case "vidente":
          color = "purple";
          break;
        case "bruja":
          color = "orange";
          break;
        case "alguacil":
          color = "yellow";
          break;
        case "pueblo":
          color = "yellow";
          break;
        default:
          break;
      }
      return (
        <Text key={index} style={{ color }}>
          {parte}
        </Text>
      );
    }
    // La parte que no es palabra clave se pinta con el estilo por defecto
    return <Text key={index}>{parte}</Text>;
  });
};

/**
 * @component AnimacionGenerica
 * @description Componente que muestra una animación con el texto recibido como propiedad.
 * Utiliza animación de opacidad para una entrada y salida suave.
 *
 * @param {AnimacionGenericaProps} props - Propiedades del componente.
 * @returns {JSX.Element | null} Retorna el componente animado o null si no debe mostrarse.
 *
 * @example
 * <AnimacionGenerica
 *   opacity={fadeAnimation}
 *   mostrarComponente={showAnimation}
 *   texto="Bienvenido a la aventura. Los Hombres lobo están al acecho"
 * />
 */
const AnimacionGenerica: React.FC<AnimacionGenericaProps> = ({
  opacity,
  mostrarComponente,
  texto,
}) => {
  if (!mostrarComponente) return null; // No renderizar si no debe mostrarse

  return (
    <View style={animacionesEstilos.contenedorAnimacion}>
      <Animated.View
        style={[
          { opacity },
          {
            width: "100%",
            alignItems: "center",
          },
        ]}
      >
        <Text style={animacionesEstilos.textoAnimacion}>
          {subrayarTexto(texto)}
        </Text>
      </Animated.View>
    </View>
  );
};

export default AnimacionGenerica;
