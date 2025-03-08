import { Animated } from "react-native";
import { CONSTANTES } from "./constants";

export const useAnimationManager = () => {
  const DURACION_ANIMACION = CONSTANTES.NUMERICAS.DURACION_ANIMACION;
  const RETRASO_ANIMACION = CONSTANTES.NUMERICAS.RETRASO_ANIMACION;

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