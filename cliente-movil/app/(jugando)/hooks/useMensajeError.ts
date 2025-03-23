import { useState, useRef } from "react";
import { Animated } from "react-native";

/**
 * @hook useMensajeError
 * @description Maneja el estado y animación del mensaje de error.
 */
const useMensajeError = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const animacionError = useRef(new Animated.Value(0)).current;

  /**
   * @function showError
   * @description Muestra un mensaje de error temporalmente.
   * @param {string} message - Mensaje de error a mostrar.
   */
  const showError = (message: string) => {
    setErrorMessage(message);
    Animated.sequence([
      Animated.timing(animacionError, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(animacionError, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setErrorMessage(null));
  };

  return { errorMessage, showError, animacionError };
};

export default useMensajeError;
