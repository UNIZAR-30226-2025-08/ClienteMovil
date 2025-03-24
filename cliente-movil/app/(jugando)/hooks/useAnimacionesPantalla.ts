import { useRef } from "react";
import { administradorAnimaciones } from "../hooks/animaciones";

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
  // Animación para antes de elegir el alguacil
  const animacionEmpiezanVotacionesAlguacil = useRef(
    administrador_animaciones.crearAnimacion(0)
  ).current;
  // Animación para antes de eliminar sospechoso lobo parte 1
  const animacionEmpiezanVotacionesSospechososSerLobo1 = useRef(
    administrador_animaciones.crearAnimacion(0)
  ).current;
  // Animación para antes de eliminar sospechoso lobo parte 2
  const animacionEmpiezanVotacionesSospechososSerLobo2 = useRef(
    administrador_animaciones.crearAnimacion(0)
  ).current;

  return {
    administrador_animaciones,
    animacionTexto,
    animacionRol,
    animacionInicio,
    animacionFondo,
    animacionEmpiezanVotacionesAlguacil,
    animacionEmpiezanVotacionesSospechososSerLobo1,
    animacionEmpiezanVotacionesSospechososSerLobo2,
  };
};

export default useAnimacionesPantalla;
