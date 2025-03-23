import { useRef } from "react";
import { Animated } from "react-native";
import { ALTO } from "../constantes";

/**
 * @hook useAnimacionChat
 * @description Gestiona la animación para abrir y cerrar el chat.
 */
const useAnimacionChat = () => {
  const posicionChat = useRef(new Animated.Value(ALTO)).current;

  /**
   * @function abrirChat
   * @description Abre el chat animándolo desde la parte inferior.
   */
  const abrirChat = () => {
    Animated.timing(posicionChat, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  /**
   * @function cerrarChat
   * @description Cierra el chat animándolo hacia la parte inferior.
   */
  const cerrarChat = () => {
    Animated.timing(posicionChat, {
      toValue: ALTO,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return { posicionChat, abrirChat, cerrarChat };
};

export default useAnimacionChat;
