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

  let skipAnimaciones = false;

  const setSkipAnimaciones = (skip: boolean) => {
    skipAnimaciones = skip;
  };

  const crearAnimacion = (initialValue = 0) => {
    const value = new Animated.Value(initialValue);

    const fadeIn = (duration = DURACION_ANIMACION) => {
      if (skipAnimaciones) {
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

    const fadeOut = (duration = DURACION_ANIMACION) => {
      if (skipAnimaciones) {
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

    const sequence = (animations: Animated.CompositeAnimation[]) => {
      if (skipAnimaciones) {
        skipAnimaciones = false;
        return {
          start: (callback?: () => void) => callback && callback(),
        };
      }
      return Animated.sequence(animations);
    };

    const stagger = (
      animations: Animated.CompositeAnimation[],
      delay = RETRASO_ANIMACION
    ) => {
      if (skipAnimaciones) {
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

  return {
    crearAnimacion,
    ejecutarSecuenciaAnimaciones,
    DURACION_ANIMACION,
    RETRASO_ANIMACION,
    setSkipAnimaciones,
  };
};
