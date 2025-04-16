import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const useDiaNoche = (modoInicialNoche: boolean, opacity: number) => {
  // Create the animated value once.
  const animationValue = useRef(
    new Animated.Value(modoInicialNoche ? opacity : 0)
  ).current;

  /**
   * Automatically update the animation whenever the mode or opacity changes.
   */
  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: modoInicialNoche ? opacity : 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [modoInicialNoche, opacity, animationValue]);

  // Optionally still return the function so you can manually trigger the animation
  const setModoDiaNoche = (modoNoche: boolean) => {
    Animated.timing(animationValue, {
      toValue: modoNoche ? opacity : 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Updates the animated opacity value directly to a new value.
   * This method can be used when you want to set a custom opacity,
   * regardless of the current mode.
   *
   * @param newOpacity - The new opacity value to animate to.
   */
  const setOpacity = (newOpacity: number) => {
    Animated.timing(animationValue, {
      toValue: newOpacity,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return { animacionFondo: animationValue, setModoDiaNoche, setOpacity };
};

export default useDiaNoche;
