/**
 * @file AnimacionInicio.tsx
 * @description Componente que muestra la animación inicial del juego con un mensaje de amanecer.
 * Utiliza Animated para efectos de fade in/out y muestra el mensaje centrado vertical y horizontalmente.
 * @module Componentes/AnimacionInicio
 */

import React from "react";
import { View, Text, Animated } from "react-native";
import animacionesEstilos from "../../../utils/jugando/styles.animaciones";

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
 * - Se muestra al comienzo de cada día en el juego
 * - Utiliza animación de opacidad para entrada/salida suave
 * - Texto perfectamente centrado y con la fuente personalizada Corben-Regular
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
     * - Usa posición absoluta y dimensiones completas
     * - Centrado vertical y horizontalmente
     * - Estilo definido en animacionesEstilos.contenedorAnimacion
     */
    <View style={animacionesEstilos.contenedorAnimacion}>
      {/**
       * Vista animada que contiene el texto.
       * - Controla la opacidad mediante la prop opacity
       * - Ocupa el 100% del ancho disponible
       * - Centra su contenido horizontalmente
       */}
      <Animated.View
        style={[
          { opacity }, // Opacidad animada proporcionada por el padre
          {
            width: "100%", // Ocupa todo el ancho disponible
            alignItems: "center", // Centra el contenido horizontalmente
          },
        ]}
      >
        {/**
         * Texto de amanecer con estilos personalizados.
         * - Usa la fuente Corben-Regular cargada previamente
         * - Tamaño de fuente 30
         * - Color blanco para mejor contraste
         * - Centrado vertical y horizontalmente
         * - Padding horizontal para evitar cortes
         * - Estilo definido en animacionesEstilos.textoAnimacion
         */}
        <Text style={animacionesEstilos.textoAnimacion}>
          ¡AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS!
        </Text>
      </Animated.View>
    </View>
  );
};

export default AnimacionInicio;
