/**
 * @file AnimacionInicio.tsx
 * @description Componente que muestra la animación inicial del juego con un mensaje de amanecer.
 * @module Componentes/AnimacionInicio
 */

import React from "react";
import { View, Text, Animated } from "react-native";
import animacionesEstilos from "../../../../utils/jugando/styles.animaciones";

/**
 * @interface AnimacionInicioProps
 * @description Define las propiedades necesarias para el componente AnimacionInicio.
 * @property {Animated.Value} opacity - Controla la opacidad del componente (de 0 a 1).
 * @property {boolean} mostrarComponente - Determina si el componente debe renderizarse.
 */
interface AnimacionInicioProps {
  opacity: Animated.Value;
  mostrarComponente: boolean;
}

/**
 * @component AnimacionInicio
 * @description Componente que muestra una animación de texto con el mensaje de amanecer.
 * Utiliza animación de opacidad para la entrada y salida suave.
 *
 * @param {AnimacionInicioProps} props - Propiedades del componente.
 * @returns {JSX.Element | null} Retorna el componente animado o null si no debe mostrarse.
 *
 * @example
 * <AnimacionInicio
 *   opacity={fadeAnimation}
 *   mostrarComponente={showAnimation}
 * />
 */
const AnimacionInicio: React.FC<AnimacionInicioProps> = ({
  opacity,
  mostrarComponente,
}) => {
  if (!mostrarComponente) return null; // No renderizar si no debe mostrarse

  return (
    <View style={animacionesEstilos.contenedorAnimacion}>
      <Animated.View
        style={[
          { opacity }, // Opacidad animada proporcionada por el padre
          {
            width: "100%", // Ocupa todo el ancho disponible
            alignItems: "center", // Centrado horizontal
          },
        ]}
      >
        <Text style={animacionesEstilos.textoAnimacion}>
          EMPIEZA LA PARTIDA
        </Text>
      </Animated.View>
    </View>
  );
};

export default AnimacionInicio;
