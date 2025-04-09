import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { CONSTANTES } from "../../../utils/jugando/constantes";
import { estilos } from "../../../utils/jugando/jugando.styles";

interface ControlesAccionProps {
  habilidadInfo: any;
  abrirHabilidad: () => void;
  abrirChat: () => void;
  votarAJugador: () => void;
  mostrarBotonesAccion: () => boolean;
  votoRealizado: boolean;
  manejarPasarTurno: () => void;
  turnoPasado: boolean;
  mostrarVotacion: boolean;
  mostrarBotellaVida: boolean;
  mostrarBotellaMuerte: boolean;
  botellaVidaUsada: boolean;
  botellaMuerteUsada: boolean;
  manejarBotellaVida: () => void;
  manejarBotellaMuerte: () => void;
  botellaSeleccionada: "vida" | "muerte" | null;
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
  mostrarVotacion,
  mostrarBotellaVida,
  mostrarBotellaMuerte,
  botellaVidaUsada,
  botellaMuerteUsada,
  manejarBotellaVida,
  manejarBotellaMuerte,
  botellaSeleccionada,
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

      {/* Botones adicionales (Pasar turno y Votar) que sólo se muestran si mostrarBotonesAccion() es true y mostrarVotacion es true */}
      {mostrarBotonesAccion() && mostrarVotacion && (
        <View style={estilos.contenedorBotonesDerecha}>
          {/*
            Si turnoPasado es true, se aplica un borde rojo al botón de pasar turno.
          */}

          {/*
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
          */}

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

      {/* Contenedor de las botellas */}
      {mostrarBotonesAccion() && mostrarBotellaMuerte && mostrarBotellaVida && (
        <View
          style={
            mostrarVotacion
              ? estilos.contenedorBotellas
              : estilos.contenedorBotellasSinVotar
          }
        >
          <TouchableOpacity
            style={[
              estilos.botonBotella,
              !mostrarBotellaVida && estilos.botonOculto,
              botellaVidaUsada && estilos.botonUsado,
              botellaSeleccionada === "vida" && estilos.botonSeleccionado,
            ]}
            onPress={manejarBotellaVida}
          >
            <Image
              source={require("../../../assets/images/botella-vida.png")}
              style={estilos.iconoBotella}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botonBotella,
              !mostrarBotellaMuerte && estilos.botonOculto,
              botellaMuerteUsada && estilos.botonUsado,
              botellaSeleccionada === "muerte" && estilos.botonSeleccionado,
            ]}
            onPress={manejarBotellaMuerte}
          >
            <Image
              source={require("../../../assets/images/botella-muerte.png")}
              style={estilos.iconoBotella}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ControlesAccion;
