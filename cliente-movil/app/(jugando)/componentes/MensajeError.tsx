import React from "react";
import { Animated, Text } from "react-native";
import { estilos } from "../styles/jugando.styles";

interface MensajeErrorProps {
  errorMessage: string;
  animacionError: Animated.Value;
}

/**
 * @component MensajeError
 * @description Renderiza el mensaje de error con animación.
 */
const MensajeError: React.FC<MensajeErrorProps> = ({
  errorMessage,
  animacionError,
}) => {
  return (
    <Animated.View
      style={[
        estilos.contenedorError,
        {
          opacity: animacionError,
          transform: [
            {
              translateY: animacionError.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={estilos.textoError}>{errorMessage}</Text>
    </Animated.View>
  );
};

export default MensajeError;
