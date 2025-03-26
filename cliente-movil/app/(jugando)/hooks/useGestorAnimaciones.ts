import { useState, useEffect } from "react";
import { Animated } from "react-native";

const useGestorAnimaciones = ({
  duracionFadeIn,
  duracionEspera,
  duracionFadeOut,
}) => {
  const [opacity] = useState(new Animated.Value(0)); // Initial opacity is 0
  const [mostrarComponente, setMostrarComponente] = useState(true);

  useEffect(() => {
    if (mostrarComponente) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: duracionFadeIn,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          // After fade-in, start the fade-out
          Animated.timing(opacity, {
            toValue: 0,
            duration: duracionFadeOut,
            useNativeDriver: true,
          }).start(() => {
            setMostrarComponente(false); // Hide the component after fade-out completes
          });
        }, duracionEspera); // Wait before starting fade-out
      });
    }
  }, [
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    opacity,
    mostrarComponente,
  ]);

  return { opacity, mostrarComponente };
};

export default useGestorAnimaciones;
