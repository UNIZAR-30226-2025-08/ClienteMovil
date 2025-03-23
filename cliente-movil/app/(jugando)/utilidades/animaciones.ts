/**
 * @file Hook (maneja estado) de gestión de animaciones durante la partida.
 *
 * @hook
 * @returns {Object} Métodos y constantes para manejar animaciones.
 * @returns {Function} crearAnimacion - Crea una nueva animación con un valor inicial.
 * @returns {Function} ejecutarSecuenciaAnimaciones - Ejecuta una secuencia de animaciones.
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

  // Flag para determinar si se deben saltar las animaciones
  let skipAnimaciones = false;

  /**
   * Permite establecer el flag para saltar las animaciones.
   * @param {boolean} skip - True para saltar las animaciones, false para ejecutarlas normalmente.
   */
  const setSkipAnimaciones = (skip: boolean) => {
    skipAnimaciones = skip;
  };

  /**
   * Crea una animación con un valor inicial y métodos de control.
   *
   * @param {number} [initialValue=0] - Valor inicial de la animación (0 = invisible, 1 = visible).
   * @returns {Object} Objeto con valor animado y métodos.
   */
  const crearAnimacion = (initialValue = 0) => {
    const value = new Animated.Value(initialValue);

    /**
     * Inicia una animación de entrada.
     * @param {number} [duration=DURACION_ANIMACION] - Duración de la animación en milisegundos.
     * @returns {Animated.CompositeAnimation} La animación configurada.
     */
    const fadeIn = (duration = DURACION_ANIMACION) => {
      if (skipAnimaciones) {
        // Solo se salta esta animación y se reinicia el flag
        skipAnimaciones = false;
        value.setValue(1);
        return {
          start: (callback?: () => void) => callback && callback(),
        };
      }
      return Animated.timing(value, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      });
    };

    /**
     * Inicia una animación de salida.
     * @param {number} [duration=DURACION_ANIMACION] - Duración de la animación en milisegundos.
     * @returns {Animated.CompositeAnimation} La animación configurada.
     */
    const fadeOut = (duration = DURACION_ANIMACION) => {
      if (skipAnimaciones) {
        // Solo se salta esta animación y se reinicia el flag
        skipAnimaciones = false;
        value.setValue(0);
        return {
          start: (callback?: () => void) => callback && callback(),
        };
      }
      return Animated.timing(value, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      });
    };

    /**
     * Ejecuta una secuencia de animaciones en orden.
     * @param {Animated.CompositeAnimation[]} animations - Lista de animaciones a ejecutar en orden.
     * @returns {Animated.CompositeAnimation} La secuencia de animaciones configurada.
     */
    const sequence = (animations: Animated.CompositeAnimation[]) => {
      if (skipAnimaciones) {
        // Solo se salta esta secuencia y se reinicia el flag
        skipAnimaciones = false;
        return {
          start: (callback?: () => void) => callback && callback(),
        };
      }
      return Animated.sequence(animations);
    };

    /**
     * Ejecuta una secuencia de animaciones con un retraso entre cada una.
     * @param {Animated.CompositeAnimation[]} animations - Lista de animaciones a ejecutar.
     * @param {number} [delay=RETRASO_ANIMACION] - Tiempo de retraso entre cada animación en milisegundos.
     * @returns {Animated.CompositeAnimation} La secuencia de animaciones con retraso.
     */
    const stagger = (
      animations: Animated.CompositeAnimation[],
      delay = RETRASO_ANIMACION
    ) => {
      if (skipAnimaciones) {
        // Solo se salta esta secuencia y se reinicia el flag
        skipAnimaciones = false;
        return {
          start: (callback?: () => void) => callback && callback(),
        };
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

  /**
   * Ejecuta una secuencia de animaciones.
   *
   * @param {Animated.CompositeAnimation[]} animations - Lista de animaciones a ejecutar en orden.
   * @param {Function} [onComplete] - Callback al finalizar la secuencia.
   */
  const ejecutarSecuenciaAnimaciones = (
    animations: Animated.CompositeAnimation[],
    onComplete?: () => void
  ) => {
    if (skipAnimaciones) {
      // Solo se salta esta secuencia y se reinicia el flag
      skipAnimaciones = false;
      if (onComplete) onComplete();
      return;
    }
    Animated.sequence(animations).start(onComplete);
  };

  return {
    crearAnimacion,
    ejecutarSecuenciaAnimaciones,
    DURACION_ANIMACION,
    RETRASO_ANIMACION,
    setSkipAnimaciones,
  };
};
