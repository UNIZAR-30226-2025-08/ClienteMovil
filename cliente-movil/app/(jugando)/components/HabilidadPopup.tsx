/**
 * @file HabilidadPopup - Popup animado que muestra la información de una habilidad.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {Object} props.habilidadInfo - Objeto con información de la habilidad (descripción, recordatorio e imagen).
 * @param {Animated.Value} props.posicionHabilidad - Valor animado que controla la posición vertical del popup.
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el popup.
 */
import React from "react";
import { 
  Animated, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  View 
} from "react-native";

import { estilos } from "../jugando.styles";
import { CONSTANTES } from "../constantes";
const { TEXTOS, DIMENSIONES } = CONSTANTES;
const { ALTO, ANCHO } = DIMENSIONES;

/**
 * @interface HabilidadPopupProps
 * Define las propiedades esperadas por el componente HabilidadPopup.
 */
interface HabilidadPopupProps {
  habilidadInfo: { descripcion: string; recuerda: string; imagen: any };
  posicionHabilidad: Animated.Value;
  onClose: () => void;
}

/**
 * Componente funcional que representa un popup animado con información de una habilidad.
 *
 * @param {HabilidadPopupProps} props - Propiedades del componente.
 * @returns {JSX.Element} Popup animado con detalles de una habilidad.
 */
const HabilidadPopup: React.FC<HabilidadPopupProps> = ({ habilidadInfo, posicionHabilidad, onClose }) => (
  // Contenedor principal animado que se desliza verticalmente según el valor de posicionHabilidad
  <Animated.View style={[estilos.contenedorHabilidad, { transform: [{ translateY: posicionHabilidad }] }]}>
    
    {/* Botón para cerrar el popup, con hitSlop para facilitar el toque */}
    <TouchableOpacity 
      style={estilos.botonCerrarHabilidad} 
      onPress={onClose} 
      activeOpacity={0.5} 
      hitSlop={{ top: ALTO * 0.02, bottom: ALTO * 0.02, left: ANCHO * 0.04, right: ANCHO * 0.04 }}
    >
      <Text style={estilos.textoCerrarHabilidad}>{TEXTOS.CHAT.CERRAR}</Text>
    </TouchableOpacity>
    
    {/* Título del popup que incluye un icono y el nombre de la habilidad */}
    <View style={estilos.contenedorTituloHabilidad}>
      <Image source={habilidadInfo.imagen} style={estilos.iconoHabilidadPopup} />
      <Text style={estilos.tituloHabilidad}>{TEXTOS.BOTON_HABILIDAD}</Text>
    </View>
    
    {/* Separador visual entre el título y la información de la habilidad */}
    <View style={estilos.separadorHabilidad} />
    
    {/* Contenedor scrollable que muestra la descripción y el recordatorio de la habilidad */}
    <ScrollView contentContainerStyle={estilos.contenedorInfoHabilidad}>
      <Text style={estilos.textoHabilidad}>{habilidadInfo.descripcion}</Text>
      {/* Condicional: Muestra el recordatorio si no está vacío */}
      {habilidadInfo.recuerda !== "" && (
        <Text style={estilos.textoRecuerda}>{habilidadInfo.recuerda}</Text>
      )}
    </ScrollView>
  </Animated.View>
);

export default HabilidadPopup;
