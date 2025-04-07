/**
 * @file AnimacionGenerica.tsx
 * @description Componente que muestra una animación genérica con el texto recibido como propiedad.
 * @module Componentes/AnimacionGenerica
 */

import React from "react";
import { View, Text, Animated } from "react-native";
import animacionesEstilos from "../../../../utils/jugando/styles.animaciones";

/**
 * @interface AnimacionGenericaProps
 * @description Define las propiedades necesarias para el componente AnimacionGenerica.
 * @property {Animated.Value} opacity - Controla la opacidad del componente (de 0 a 1).
 * @property {boolean} mostrarComponente - Determina si el componente debe renderizarse.
 * @property {string} texto - Texto que se mostrará en la animación.
 */
interface AnimacionGenericaProps {
  opacity: Animated.Value;
  mostrarComponente: boolean;
  texto: string;
}

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
 *   texto="¡Bienvenido a la aventura!"
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
        <Text style={animacionesEstilos.textoAnimacion}>{texto}</Text>
      </Animated.View>
    </View>
  );
};

export default AnimacionGenerica;
