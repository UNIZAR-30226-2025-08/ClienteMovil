/**
 * @file gestorCadenaAnimaciones - Funciones para ejecutar de forma reutilizable
 * una cadena de animaciones con el patrón fadeIn → delay → fadeOut.
 *
 * Permite que se puedan encadenar n animaciones, sin importar su nombre o cantidad,
 * facilitando la reutilización y extensión de las mismas sin duplicar código.
 */

import { Animated } from "react-native";

/**
 * Ejecuta una secuencia de animación que incluye:
 * - fadeIn (animación de entrada)
 * - delay (tiempo de espera configurable)
 * - fadeOut (animación de salida)
 *
 * Se establecen callbacks para permitir saltar la animación actual mediante startFadeOutNowRef.
 *
 * @param {string} nombre - Nombre base de la animación (ej. "texto", "rol", "inicio").
 * @param {Object} animacion - Objeto que contiene el valor animado y los métodos fadeIn y fadeOut.
 * @param {number} delay - Tiempo de espera en milisegundos entre fadeIn y fadeOut.
 * @param {Function} onFadeOutComplete - Callback a ejecutar al finalizar el fadeOut.
 * @param {Function} setCurrentAnimacion - Función para actualizar el estado de la animación actual.
 * @param {Function} iniciarAnimacion - Función para iniciar una animación (fadeIn o fadeOut).
 * @param {Function} iniciarDelay - Función para iniciar un delay.
 * @param {React.MutableRefObject<(() => void) | null>} startFadeOutNowRef - Ref para almacenar el callback de salto.
 */
export const ejecutarCadenaAnimacion = (
  nombre: string,
  animacion: {
    value: Animated.Value;
    fadeIn: (duration?: number) => Animated.CompositeAnimation;
    fadeOut: (duration?: number) => Animated.CompositeAnimation;
  },
  delay: number,
  onFadeOutComplete: () => void,
  setCurrentAnimacion: (anim: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    animacion: Animated.CompositeAnimation,
    animatedValue: Animated.Value,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) => {
  setCurrentAnimacion(`${nombre}-fadeIn`);
  startFadeOutNowRef.current = () => {
    animacion.value.stopAnimation(() => {
      animacion.value.setValue(1);
      setCurrentAnimacion(`${nombre}-fadeOut`);
      iniciarAnimacion(
        `${nombre}-fadeOut`,
        animacion.fadeOut(),
        animacion.value,
        0,
        onFadeOutComplete
      );
      startFadeOutNowRef.current = null;
    });
  };
  iniciarAnimacion(
    `${nombre}-fadeIn`,
    animacion.fadeIn(),
    animacion.value,
    1,
    () => {
      setCurrentAnimacion(`${nombre}-delay`);
      iniciarDelay(delay, () => {
        setCurrentAnimacion(`${nombre}-fadeOut`);
        iniciarAnimacion(
          `${nombre}-fadeOut`,
          animacion.fadeOut(),
          animacion.value,
          0,
          onFadeOutComplete
        );
        startFadeOutNowRef.current = null;
      });
    }
  );
};
