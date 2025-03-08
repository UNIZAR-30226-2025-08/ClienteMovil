import React from "react";
import { Animated, Text, TouchableOpacity, TextInput, ScrollView, View } from "react-native";
import { estilos } from "../jugando.styles";
import { CONSTANTES } from "../constants";
const { TEXTOS, DIMENSIONES } = CONSTANTES;
const { ALTO, ANCHO } = DIMENSIONES;
interface ChatComponentProps {
  mensajes: Array<{ id: number; texto: string }>;
  posicionChat: Animated.Value;
  onClose: () => void;
}
const ChatComponent: React.FC<ChatComponentProps> = ({ mensajes, posicionChat, onClose }) => (
  <Animated.View style={[estilos.contenedorChat, { transform: [{ translateY: posicionChat }] }]}>
    <TouchableOpacity style={estilos.botonCerrarChat} onPress={onClose} activeOpacity={0.5} hitSlop={{ top: ALTO * 0.02, bottom: ALTO * 0.02, left: ANCHO * 0.04, right: ANCHO * 0.04 }}>
      <Text style={estilos.textoCerrarChat}>{TEXTOS.CHAT.CERRAR}</Text>
    </TouchableOpacity>
    <Text style={estilos.tituloChat}>{TEXTOS.CHAT.TITULO}</Text>
    <View style={estilos.separadorChat} />
    <ScrollView contentContainerStyle={estilos.contenedorMensajesChat}>
      {mensajes.map((mensaje) => (
        <Text key={mensaje.id} style={estilos.mensajeChat}>{mensaje.texto}</Text>
      ))}
    </ScrollView>
    <View style={estilos.contenedorEntradaChat}>
      <TextInput style={estilos.entradaChat} placeholder={TEXTOS.CHAT.PLACEHOLDER} placeholderTextColor="#CCC" />
      <TouchableOpacity style={estilos.botonEnviarChat}>
        <Text style={estilos.textoBotonEnviarChat}>{TEXTOS.CHAT.ENVIAR}</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);
export default ChatComponent;
