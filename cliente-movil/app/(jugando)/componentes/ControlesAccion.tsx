import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { CONSTANTES } from "../constantes";
import { estilos } from "../styles/jugando.styles";

/**
 * @interface ControlesAccionProps
 * @description Propiedades que recibe el componente ControlesAccion.
 */
interface ControlesAccionProps {
  habilidadInfo: any;
  abrirHabilidad: () => void;
  abrirChat: () => void;
  votarAJugador: () => void;
  mostrarBotonesAccion: () => boolean;
  votoRealizado: boolean;
  manejarPasarTurno: () => void; // Para manejar la acción de pasar turno
  turnoPasado: boolean; // Para indicar si el turno se ha pasado
}

/**
 * @component ControlesAccion
 * @description Renderiza los botones de acción y votación.
 */
const ControlesAccion: React.FC<ControlesAccionProps> = ({
  habilidadInfo,
  abrirHabilidad,
  abrirChat,
  votarAJugador,
  mostrarBotonesAccion,
  votoRealizado,
  manejarPasarTurno,
  turnoPasado,
}) => {
  return (
    <>
      {/* Contenedor de botones principales (Habilidad y Chat) */}
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

      {/* Botones adicionales (Pasar turno y Votar) que sólo se muestran si mostrarBotonesAccion() es true */}
      {mostrarBotonesAccion() && (
        <View style={estilos.contenedorBotonesDerecha}>
          {/*
            Si turnoPasado es true, se aplica un borde rojo al botón de pasar turno.
          */}
          <TouchableOpacity
            style={[
              estilos.botonAccion,
              turnoPasado && { borderWidth: 2, borderColor: "red" },
            ]}
            onPress={manejarPasarTurno}
          >
            <Text style={estilos.textoBoton}>
              {CONSTANTES.TEXTOS.BOTON_PASAR_TURNO}
            </Text>
          </TouchableOpacity>

          {/*
            Si votoRealizado es true, se aplica un borde rojo al botón de votar.
            Esto se logra usando la propiedad style en un array y aplicando un estilo adicional condicionalmente.
          */}
          <TouchableOpacity
            style={[
              estilos.botonAccion,
              estilos.botonVotar,
              votoRealizado && { borderWidth: 2, borderColor: "red" },
            ]}
            onPress={votarAJugador}
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
