/**
 * @file styles.animaciones.ts
 * @description Estilos para las animaciones del juego, específicamente para la animación de inicio.
 * Define los estilos del contenedor y texto de la animación de bienvenida.
 * @module Utils/Estilos/Animaciones
 */

import { StyleSheet } from "react-native";

/**
 * @const {object} animacionesEstilos
 * @description Objeto de estilos para la animación de inicio del juego.
 * Utiliza StyleSheet.create para optimizar el rendimiento de los estilos en React Native.
 */
const animacionesEstilos = StyleSheet.create({
  /**
   * @style contenedorAnimacion
   * @description Estilos para el contenedor principal de la animación:
   */
  contenedorAnimacion: {
    ...StyleSheet.absoluteFillObject, // Cubre toda la pantalla
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    backgroundColor: "transparent",
  },

  /**
   * @style textoAnimacion
   * @description Estilos para el texto de la animación:
   */
  textoAnimacion: {
    fontSize: 30,
    color: "white",
    fontFamily: "Corben-Regular",
    textAlign: "center", // Centrado horizontal
    textAlignVertical: "center", // Centrado vertical
    includeFontPadding: false, // Elimina padding innecesario
    paddingHorizontal: 20, // Espaciado a los lados
  },
});

export default animacionesEstilos;
