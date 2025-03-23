import { useRef } from "react";
import { administradorAnimaciones } from "../utilidades/animaciones";

/**
 * @hook useAnimacionesPantalla
 * @description Crea y devuelve las animaciones usadas en la pantalla de juego.
 */
const useAnimacionesPantalla = () => {
  const administrador_animaciones = administradorAnimaciones();

  // Animación para el texto inicial
  const animacionTexto = useRef(
    administrador_animaciones.crearAnimacion(0)
  ).current;
  // Animación para la información del rol
  const animacionRol = useRef(
    administrador_animaciones.crearAnimacion(0)
  ).current;
  // Animación para el inicio de partida
  const animacionInicio = useRef(
    administrador_animaciones.crearAnimacion(0)
  ).current;
  // Animación para el fondo
  const animacionFondo = useRef(
    administrador_animaciones.crearAnimacion(1)
  ).current;

  return {
    administrador_animaciones,
    animacionTexto,
    animacionRol,
    animacionInicio,
    animacionFondo,
  };
};

export default useAnimacionesPantalla;
