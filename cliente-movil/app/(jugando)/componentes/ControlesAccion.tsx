import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { CONSTANTES } from "../constantes"; // Asegúrate de ajustar la importación de estilos y constantes según tu proyecto
import { estilos } from "../styles/jugando.styles";

interface ControlesAccionProps {
  habilidadInfo: any;
  abrirHabilidad: () => void;
  abrirChat: () => void;
  voteForPlayer: () => void;
  mostrarBotonesAccion: () => boolean;
}

/**
 * @component ControlesAccion
 * @description Renderiza los botones de acción y votación.
 */
const ControlesAccion: React.FC<ControlesAccionProps> = ({
  habilidadInfo,
  abrirHabilidad,
  abrirChat,
  voteForPlayer,
  mostrarBotonesAccion,
}) => {
  return (
    <>
      <View style={estilos.contenedorBotones}>
        <TouchableOpacity
          style={estilos.botonHabilidad}
          onPress={abrirHabilidad}
        >
          <Image source={habilidadInfo.imagen} style={estilos.iconoBoton} />
          <Text style={estilos.textoBoton}>
            {CONSTANTES.TEXTOS.BOTON_HABILIDAD}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonChat} onPress={abrirChat}>
          <Text style={estilos.textoBoton}>{CONSTANTES.TEXTOS.BOTON_CHAT}</Text>
        </TouchableOpacity>
      </View>
      {mostrarBotonesAccion() && (
        <View style={estilos.contenedorBotonesDerecha}>
          <TouchableOpacity style={estilos.botonAccion}>
            <Text style={estilos.textoBoton}>
              {CONSTANTES.TEXTOS.BOTON_PASAR_TURNO}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[estilos.botonAccion, estilos.botonVotar]}
            onPress={voteForPlayer}
          >
            <Text style={estilos.textoBoton}>
              {CONSTANTES.TEXTOS.BOTON_VOTAR}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ControlesAccion;
