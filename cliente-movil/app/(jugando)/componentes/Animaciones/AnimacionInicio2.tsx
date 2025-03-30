/**
 * @file AnimacionInicio.tsx
 * @description Componente que muestra la animación inicial del juego, presentando el rol del jugador con su imagen y nombre.
 * @module Componentes/AnimacionInicio
 */

import React from "react";
import { View, Text, Animated, Image } from "react-native";
import animacionesEstilos from "../../../../utils/jugando/styles.animaciones";
import { getInfoRol } from "../../../../utils/jugando/rolesUtilidades";
import { Rol } from "../../../../utils/jugando/constantes";

/**
 * @interface AnimacionInicioProps
 * @description Define las propiedades requeridas para el componente AnimacionInicio.
 * @property {Animated.Value} opacity - Controla la opacidad del componente (de 0 a 1).
 * @property {boolean} mostrarComponente - Determina si el componente debe renderizarse.
 * @property {Rol} rol - Rol del jugador que determinará la imagen y el nombre.
 */
interface AnimacionInicioProps {
  opacity: Animated.Value;
  mostrarComponente: boolean;
  rol: Rol;
}

/**
 * @component AnimacionInicio
 * @description Componente que presenta la animación de inicio con el rol del jugador.
 * Utiliza una animación de opacidad para la entrada y salida del contenido.
 *
 * @param {AnimacionInicioProps} props - Propiedades del componente.
 * @returns {JSX.Element | null} Retorna el componente animado o null si no debe mostrarse.
 *
 * @example
 * <AnimacionInicio
 *   opacity={fadeAnimation}
 *   mostrarComponente={showAnimation}
 *   rol="aldeano"
 * />
 */
const AnimacionInicio: React.FC<AnimacionInicioProps> = ({
  opacity,
  mostrarComponente,
  rol,
}) => {
  if (!mostrarComponente) return null; // No renderizar si no debe mostrarse

  // Obtención de la información del rol
  const { roleInfo } = getInfoRol(rol);

  // Si no hay información del rol, se retorna null para evitar renderizar sin datos.
  if (!roleInfo) {
    return null;
  }

  // Función para determinar el color del texto según el rol
  const getColorTexto = () => {
    switch (rol) {
      case "Hombre lobo":
        return "red";
      case "Cazador":
        return "blue";
      case "Vidente":
        return "purple";
      case "Bruja":
        return "orange";
      default:
        return "white";
    }
  };

  return (
    <View style={animacionesEstilos.contenedorAnimacion}>
      <Animated.View
        style={[
          { opacity },
          {
            width: "100%", // Ocupa todo el ancho disponible
            alignItems: "center", // Centrado horizontal
          },
        ]}
      >
        <Text style={animacionesEstilos.textoAnimacion}>TU ROL ES:</Text>

        {roleInfo.image && (
          <Image
            source={roleInfo.image}
            style={animacionesEstilos.imagenRol} // Imagen ajustada
          />
        )}

        <Text style={[animacionesEstilos.textoRol, { color: getColorTexto() }]}>
          {roleInfo.roleName}
        </Text>
      </Animated.View>
    </View>
  );
};

export default AnimacionInicio;
