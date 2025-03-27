/**
 * @file AnimacionInicio.tsx
 * @description Componente que muestra la animación inicial del juego con un mensaje de amanecer.
 * Utiliza Animated para efectos de fade in/out y muestra el mensaje centrado vertical y horizontalmente.
 * @module Componentes/AnimacionInicio
 */

import React from "react";
import { View, Text, Animated } from "react-native";
import animacionesEstilos from "../../../../utils/jugando/styles.animaciones";

/**
 * @interface AnimacionInicioProps
 * @description Define las propiedades necesarias para el componente AnimacionInicio
 * @property {Animated.Value} opacity - Valor animado que controla la opacidad del componente (0 a 1)
 * @property {boolean} mostrarComponente - Bandera que determina si el componente debe renderizarse
 */
interface AnimacionInicioProps {
  opacity: Animated.Value;
  mostrarComponente: boolean;
}

/**
 * @component AnimacionInicio
 * @description Componente que muestra una animación de texto de inicio con el mensaje de amanecer.
 *
 * @param {AnimacionInicioProps} props - Propiedades del componente
 * @returns {JSX.Element | null} Retorna el componente animado o null si no debe mostrarse
 *
 * @example
 * // Ejemplo de uso básico
 * <AnimacionInicio
 *   opacity={fadeAnimation}
 *   mostrarComponente={showAnimation}
 * />
 */
const AnimacionInicio: React.FC<AnimacionInicioProps> = ({
  opacity,
  mostrarComponente,
}) => {
  // Si no debe mostrarse, retornar null para no renderizar nada
  if (!mostrarComponente) return null;

  return (
    /**
     * Contenedor principal que cubre toda la pantalla.
     */
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
          ¡AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS!
        </Text>
      </Animated.View>
    </View>
  );
};

export default AnimacionInicio;
