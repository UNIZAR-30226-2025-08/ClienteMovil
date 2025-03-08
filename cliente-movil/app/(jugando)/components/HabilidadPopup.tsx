import React from "react";
import { Animated, Text, TouchableOpacity, Image, ScrollView, View } from "react-native";
import { estilos } from "../jugando.styles";
import { CONSTANTES } from "../constants";
const { TEXTOS, DIMENSIONES } = CONSTANTES;
const { ALTO, ANCHO } = DIMENSIONES;
interface HabilidadPopupProps {
  habilidadInfo: { descripcion: string; recuerda: string; imagen: any };
  posicionHabilidad: Animated.Value;
  onClose: () => void;
}
const HabilidadPopup: React.FC<HabilidadPopupProps> = ({ habilidadInfo, posicionHabilidad, onClose }) => (
  <Animated.View style={[estilos.contenedorHabilidad, { transform: [{ translateY: posicionHabilidad }] }]}>
    <TouchableOpacity style={estilos.botonCerrarHabilidad} onPress={onClose} activeOpacity={0.5} hitSlop={{ top: ALTO * 0.02, bottom: ALTO * 0.02, left: ANCHO * 0.04, right: ANCHO * 0.04 }}>
      <Text style={estilos.textoCerrarHabilidad}>{TEXTOS.HABILIDAD.CERRAR}</Text>
    </TouchableOpacity>
    <View style={estilos.contenedorTituloHabilidad}>
      <Image source={habilidadInfo.imagen} style={estilos.iconoHabilidadPopup} />
      <Text style={estilos.tituloHabilidad}>{TEXTOS.HABILIDAD.TITULO}</Text>
    </View>
    <View style={estilos.separadorHabilidad} />
    <ScrollView contentContainerStyle={estilos.contenedorInfoHabilidad}>
      <Text style={estilos.textoHabilidad}>{habilidadInfo.descripcion}</Text>
      {habilidadInfo.recuerda !== "" && (
        <Text style={estilos.textoRecuerda}>{habilidadInfo.recuerda}</Text>
      )}
    </ScrollView>
  </Animated.View>
);
export default HabilidadPopup;
