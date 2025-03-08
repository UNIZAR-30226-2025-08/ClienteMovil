/**
 * @file Hook (maneja estado) de gestión de animaciones durante la partida.
 * 
 * @hook
 * @returns {Object} Métodos y constantes para manejar animaciones.
 * @returns {Function} createAnimation - Crea una nueva animación con un valor inicial.
 * @returns {Function} runAnimationSequence - Ejecuta una secuencia de animaciones.
 * @returns {number} DURACION_ANIMACION - Duración predeterminada de las animaciones (500ms).
 * @returns {number} RETRASO_ANIMACION - Tiempo de retraso predeterminado entre animaciones en `stagger` (300ms).
 * 
 * @example Uso básico en componente:
 * // 1. Importar el hook
 * import { useAnimationManager } from "./animaciones";
 * 
 * // 2. Inicializar en componente
 * const animationManager = useAnimationManager();
 * 
 * // 3. Crear animaciones con useRef para persistencia
 * const animacionTexto = useRef(animationManager.createAnimation(0)).current;
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
import { CONSTANTES } from "./constants";

export const useAnimationManager = () => {
  const DURACION_ANIMACION = CONSTANTES.NUMERICAS.DURACION_ANIMACION;
  const RETRASO_ANIMACION = CONSTANTES.NUMERICAS.RETRASO_ANIMACION;

  /**
   * Crea una animación con un valor inicial y métodos de control.
   * 
   * @param {number} [initialValue=0] - Valor inicial de la animación (0 = invisible, 1 = visible).
   * @returns {Object} Objeto con valor animado y métodos.
   */
  const createAnimation = (initialValue = 0) => {
    const value = new Animated.Value(initialValue);
    
    const fadeIn = (duration = DURACION_ANIMACION) => 
      Animated.timing(value, { toValue: 1, duration, useNativeDriver: true });
    
    const fadeOut = (duration = DURACION_ANIMACION) => 
      Animated.timing(value, { toValue: 0, duration, useNativeDriver: true });
    
    const sequence = (animations: Animated.CompositeAnimation[]) => 
      Animated.sequence(animations);

    const stagger = (animations: Animated.CompositeAnimation[], delay = RETRASO_ANIMACION) => 
      Animated.stagger(delay, animations);

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
  const runAnimationSequence = (
    animations: Animated.CompositeAnimation[],
    onComplete?: () => void
  ) => {
    Animated.sequence(animations).start(onComplete);
  };

  return {
    createAnimation,
    runAnimationSequence,
    DURACION_ANIMACION,
    RETRASO_ANIMACION,
  };
};