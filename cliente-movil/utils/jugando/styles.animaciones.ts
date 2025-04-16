import { StyleSheet, Dimensions } from "react-native";

const { width: ancho, height: alto } = Dimensions.get("window");

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
   * @description Estilos para el texto de las animaciones en general
   */
  textoAnimacion: {
    color: "white",
    fontFamily: "Corben",
    textAlign: "center",
    includeFontPadding: false,
    paddingHorizontal: ancho * 0.05,
    fontSize: ancho * 0.1,
  },

  /**
   * @style textoRol
   * @description Estilos para el texto del rol de la animación inicial 2 (aldeano, hombre lobo, ...)
   */
  textoRol: {
    fontFamily: "Corben",
    textAlign: "center",
    includeFontPadding: false,
    paddingHorizontal: ancho * 0.05,
    fontSize: ancho * 0.12,
  },

  /**
   * @style imagenRol
   * @description Estilos para la imagen del rol de la animación inicial 2
   */
  imagenRol: {
    width: ancho * 0.6,
    height: ancho * 0.6,
    marginVertical: alto * 0.02,
    resizeMode: "contain", // Para que la imagen no se corte
  },
});

export default animacionesEstilos;
