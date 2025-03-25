/**
 * @file Chat - Componente de chat animado que muestra mensajes y permite enviar nuevos.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {Array<{ id: number; texto: string }>} props.mensajes - Lista de mensajes a mostrar en el chat.
 * @param {Animated.Value} props.posicionChat - Valor animado que controla la posición vertical del chat.
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el chat.
 */
import React from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  View,
} from "react-native";

import { estilos } from "../../../utils/jugando/jugando.styles";
import { CONSTANTES } from "../../../utils/jugando/constantes";
const { TEXTOS, DIMENSIONES } = CONSTANTES;
const { ALTO, ANCHO } = DIMENSIONES;

/**
 * @interface ChatComponentProps
 * Define las propiedades que recibe el componente ChatComponent.
 */
interface ChatComponentProps {
  mensajes: Array<{ id: number; texto: string }>;
  posicionChat: Animated.Value;
  onClose: () => void;
}

/**
 * Componente funcional que representa el chat animado.
 *
 * @param {ChatComponentProps} props - Propiedades del componente.
 * @returns {JSX.Element} Componente de chat animado.
 */
const ChatComponent: React.FC<ChatComponentProps> = ({
  mensajes,
  posicionChat,
  onClose,
}) => (
  // Vista principal animada que se desliza verticalmente usando el valor de posicionChat
  <Animated.View
    style={[
      estilos.contenedorChat,
      { transform: [{ translateY: posicionChat }] },
    ]}
  >
    {/* Botón para cerrar el chat, con hitSlop para ampliar el área de toque */}
    <TouchableOpacity
      style={estilos.botonCerrarChat}
      onPress={onClose}
      activeOpacity={0.5}
      hitSlop={{
        top: ALTO * 0.02,
        bottom: ALTO * 0.02,
        left: ANCHO * 0.04,
        right: ANCHO * 0.04,
      }}
    >
      <Text style={estilos.textoCerrarChat}>{TEXTOS.CHAT.CERRAR}</Text>
    </TouchableOpacity>

    {/* Título del chat */}
    <Text style={estilos.tituloChat}>{TEXTOS.CHAT.TITULO}</Text>

    {/* Separador visual entre el título y los mensajes */}
    <View style={estilos.separadorChat} />

    {/* Contenedor scrollable para los mensajes del chat */}
    <ScrollView contentContainerStyle={estilos.contenedorMensajesChat}>
      {mensajes.map((mensaje) => (
        <Text key={mensaje.id} style={estilos.mensajeChat}>
          {mensaje.texto}
        </Text>
      ))}
    </ScrollView>

    {/* Contenedor para la entrada de texto y botón de enviar mensaje */}
    <View style={estilos.contenedorEntradaChat}>
      <TextInput
        style={estilos.entradaChat}
        placeholder={TEXTOS.CHAT.PLACEHOLDER}
        placeholderTextColor="#CCC"
      />
      <TouchableOpacity style={estilos.botonEnviarChat}>
        <Text style={estilos.textoBotonEnviarChat}>{TEXTOS.CHAT.ENVIAR}</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

export default ChatComponent;
