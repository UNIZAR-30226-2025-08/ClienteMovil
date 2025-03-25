import { useRef } from "react";
import { Animated } from "react-native";

/**
 * Hook para controlar la animación de modo día/noche.
 * @param modoInicialNoche - Valor booleano que indica si se inicia en modo noche.
 * @returns { animacionFondo, setModoDiaNoche } - El valor animado y la función para cambiar el modo.
 */
const useDiaNoche = (modoInicialNoche: boolean) => {
  // Se inicializa el Animated.Value a 0.95 si es de noche, o 0 si es de día.
  const animationValue = useRef(
    new Animated.Value(modoInicialNoche ? 0.95 : 0)
  ).current;

  /**
   * Cambia el modo (día/noche) animando la opacidad de la superposición.
   * @param modoNoche - Si es true, se anima a 0.95; de lo contrario, a 0.
   */
  const setModoDiaNoche = (modoNoche: boolean) => {
    Animated.timing(animationValue, {
      toValue: modoNoche ? 0.95 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return { animacionFondo: animationValue, setModoDiaNoche };
};

export default useDiaNoche;
