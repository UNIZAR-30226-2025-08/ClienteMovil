import { useRef } from "react";
import { administradorAnimaciones } from "../utilidades/animaciones";

/**
 * @hook useAnimacionesPantalla
 * @description Crea y devuelve las animaciones usadas en la pantalla de juego.
 */
const useAnimacionesPantalla = () => {
  const animationManager = administradorAnimaciones();

  // Animación para el texto inicial
  const animacionTexto = useRef(animationManager.crearAnimacion(0)).current;
  // Animación para la información del rol
  const animacionRol = useRef(animationManager.crearAnimacion(0)).current;
  // Animación para el inicio de partida
  const animacionInicio = useRef(animationManager.crearAnimacion(0)).current;
  // Animación para el fondo
  const animacionFondo = useRef(animationManager.crearAnimacion(1)).current;

  return {
    animationManager,
    animacionTexto,
    animacionRol,
    animacionInicio,
    animacionFondo,
  };
};

export default useAnimacionesPantalla;
