/**
 * @file Hook (maneja estado) de gestión de animaciones durante la partida.
 *
 * @hook
 * @returns {Object} Métodos y constantes para manejar animaciones.
 * @returns {Function} crearAnimacion - Crea una nueva animación con un valor inicial.
 * @returns {Function} ejecutarSecuenciaAnimaciones - Ejecuta una secuencia de animaciones.
 * @returns {Function} ejecutarCadenaAnimacion - Ejecuta una cadena de animaciones (fadeIn → delay → fadeOut).
 * @returns {number} DURACION_ANIMACION - Duración predeterminada de las animaciones (500ms).
 * @returns {number} RETRASO_ANIMACION - Tiempo de retraso predeterminado entre animaciones en `stagger` (300ms).
 *
 * @example Uso básico en componente:
 * // 1. Importar el hook
 * import { administradorAnimaciones } from "./animaciones";
 *
 * // 2. Inicializar en componente
 * const administrador_animaciones = administradorAnimaciones();
 *
 * // 3. Crear animaciones con useRef para persistencia
 * const animacionTexto = useRef(administrador_animaciones.crearAnimacion(0)).current;
 *
 * // 4. Usar en efectos
 * useEffect(() => {
 *   animacionTexto.fadeIn().start(() => {
 *     animacionTexto.fadeOut().start();
 *   });
 * }, []);
 *
 * @module animationss
 */
import { Animated } from "react-native";
import { CONSTANTES } from "../constantes";

export const administradorAnimaciones = () => {
  const DURACION_ANIMACION = CONSTANTES.NUMERICAS.DURACION_ANIMACION;
  const RETRASO_ANIMACION = CONSTANTES.NUMERICAS.RETRASO_ANIMACION;

  let skipAnimaciones = false;

  const setSkipAnimaciones = (skip: boolean) => {
    skipAnimaciones = skip;
  };

  // Objeto dummy que implementa la interfaz CompositeAnimation
  const dummyAnimation: Animated.CompositeAnimation = {
    start: (callback?: (result: { finished: boolean }) => void) => {
      if (callback) callback({ finished: true });
    },
    stop: () => {},
    reset: () => {},
  };

  const crearAnimacion = (initialValue = 0) => {
    const value = new Animated.Value(initialValue);

    const fadeIn = (duration = DURACION_ANIMACION) => {
      if (skipAnimaciones) {
        skipAnimaciones = false;
        value.setValue(1);
        return dummyAnimation;
      }
      return Animated.timing(value, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      });
    };

    const fadeOut = (duration = DURACION_ANIMACION) => {
      if (skipAnimaciones) {
        skipAnimaciones = false;
        value.setValue(0);
        return dummyAnimation;
      }
      return Animated.timing(value, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      });
    };

    const sequence = (animations: Animated.CompositeAnimation[]) => {
      if (skipAnimaciones) {
        skipAnimaciones = false;
        return dummyAnimation;
      }
      return Animated.sequence(animations);
    };

    const stagger = (
      animations: Animated.CompositeAnimation[],
      delay = RETRASO_ANIMACION
    ) => {
      if (skipAnimaciones) {
        skipAnimaciones = false;
        return dummyAnimation;
      }
      return Animated.stagger(delay, animations);
    };

    return {
      value,
      fadeIn,
      fadeOut,
      sequence,
      stagger,
    };
  };

  // para ejecutar animaciones genéricas, lo dejo por si es útil
  /*
  const ejecutarSecuenciaAnimaciones = (
    animations: Animated.CompositeAnimation[],
    onComplete?: () => void
  ) => {
    if (skipAnimaciones) {
      skipAnimaciones = false;
      if (onComplete) onComplete();
      return;
    }
    Animated.sequence(animations).start(onComplete);
  };

  */

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
  const ejecutarCadenaAnimacion = (
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

  return {
    crearAnimacion,
    //ejecutarSecuenciaAnimaciones,
    ejecutarCadenaAnimacion,
    DURACION_ANIMACION,
    RETRASO_ANIMACION,
    setSkipAnimaciones,
  };
};
