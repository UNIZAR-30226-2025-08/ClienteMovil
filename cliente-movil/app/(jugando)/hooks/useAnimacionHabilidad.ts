import { useRef } from "react";
import { Animated } from "react-native";
import { ALTO } from "../constantes";

/**
 * @hook useAnimacionHabilidad
 * @description Gestiona la animación para abrir y cerrar el popup de habilidad.
 */
const useAnimacionHabilidad = () => {
  const posicionHabilidad = useRef(new Animated.Value(ALTO)).current;

  /**
   * @function abrirHabilidad
   * @description Abre el popup de habilidad animándolo desde la parte inferior.
   */
  const abrirHabilidad = () => {
    Animated.timing(posicionHabilidad, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  /**
   * @function cerrarHabilidad
   * @description Cierra el popup de habilidad animándolo hacia la parte inferior.
   */
  const cerrarHabilidad = () => {
    Animated.timing(posicionHabilidad, {
      toValue: ALTO,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return { posicionHabilidad, abrirHabilidad, cerrarHabilidad };
};

export default useAnimacionHabilidad;
