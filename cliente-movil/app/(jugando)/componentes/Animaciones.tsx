import React from "react";
import {
  View,
  ImageBackground,
  Animated,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { CONSTANTES } from "../constantes";

interface AnimacionesProps {
  handleSkipAnimaciones: () => void;
  estilos: any;
  animacionesPantalla: any;
  mostrarAlguacil: boolean;
  mostrarEmpiezanVotacionesSospechososSerLobo1: boolean;
  mostrarVotaciones: boolean;
  mostrarCazadorDisparo: boolean;
  mostrarBrujaCura: boolean;
  mostrarBrujaVeneno: boolean;
  mostrarDormir: boolean;
  mostrarDevoraHombresLobo: boolean;
  mostrarHombresLoboDormir: boolean;
  mostrarBrujaDespierta: boolean;
  mostrarBrujaDuerme: boolean;
  mostrarVidenteDuerme: boolean;
  mostrarVidenteDespierta: boolean;
  mostrarNocheSupervivientes: boolean;
  mostrarJugadorAlguacil: boolean;
  mostrarVotacionesConcluidas: boolean;
  mostrarElegidoPueblo: boolean;
}

// Mapeo de palabras a colores
const colorMapping: Record<string, string> = {
  "HOMBRES LOBO": "red",
  BRUJA: "orange",
  CAZADOR: "blue",
  VIDENTE: "purple",
  PUEBLO: "yellow",
  ALGUACIL: "yellow",
};

// Función que recibe un texto y retorna un arreglo de <Text> con las palabras coloreadas
const renderColoredText = (text: string) => {
  // Se crea una expresión regular con las palabras clave
  const regex = new RegExp(`(${Object.keys(colorMapping).join("|")})`, "g");
  // Se separa el texto en partes que sean o no palabras clave
  const parts = text.split(regex);
  return parts.map((part, index) => {
    // Si la parte coincide con una palabra clave, se le aplica el color correspondiente
    if (colorMapping[part]) {
      return (
        <Text key={index} style={{ color: colorMapping[part] }}>
          {part}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

const Animaciones: React.FC<AnimacionesProps> = (props) => {
  const {
    handleSkipAnimaciones,
    estilos,
    animacionesPantalla,
    mostrarAlguacil,
    mostrarEmpiezanVotacionesSospechososSerLobo1,
    mostrarVotaciones,
    mostrarCazadorDisparo,
    mostrarBrujaCura,
    mostrarBrujaVeneno,
    mostrarDormir,
    mostrarDevoraHombresLobo,
    mostrarHombresLoboDormir,
    mostrarBrujaDespierta,
    mostrarBrujaDuerme,
    mostrarVidenteDuerme,
    mostrarVidenteDespierta,
    mostrarNocheSupervivientes,
    mostrarJugadorAlguacil,
    mostrarVotacionesConcluidas,
    mostrarElegidoPueblo,
  } = props;

  return (
    <TouchableWithoutFeedback onPress={handleSkipAnimaciones}>
      <View style={estilos.contenedor}>
        <ImageBackground
          source={CONSTANTES.IMAGENES.FONDO}
          style={estilos.fondo}
          resizeMode="cover"
        />
        <Animated.View
          style={[
            estilos.superposicion,
            { opacity: animacionesPantalla.animacionFondo.value },
          ]}
        />

        {mostrarAlguacil && (
          <Animated.View
            style={[
              estilos.contenedorEmpiezanVotacionesAlguacil,
              {
                opacity:
                  animacionesPantalla.animacionEmpiezanVotacionesAlguacil.value,
              },
            ]}
          >
            <Text style={estilos.textoEmpiezanVotacionesAlguacil}>
              {renderColoredText(CONSTANTES.TEXTOS.ALGUACIL)}
            </Text>
          </Animated.View>
        )}

        {mostrarEmpiezanVotacionesSospechososSerLobo1 && (
          <Animated.View
            style={[
              estilos.contenedorEmpiezanVotacionesSospechososSerLobo1,
              {
                opacity:
                  animacionesPantalla
                    .animacionEmpiezanVotacionesSospechososSerLobo1.value,
              },
            ]}
          >
            <Text style={estilos.textoEmpiezanVotacionesSospechososSerLobo1}>
              {renderColoredText(CONSTANTES.TEXTOS.ELIMINAR_LOBO)}
            </Text>
          </Animated.View>
        )}

        {mostrarVotaciones && (
          <Animated.View
            style={[
              estilos.contenedorEmpiezanVotacionesSospechososSerLobo2,
              {
                opacity:
                  animacionesPantalla
                    .animacionEmpiezanVotacionesSospechososSerLobo2.value,
              },
            ]}
          >
            <Text style={estilos.textoEmpiezanVotacionesSospechososSerLobo2}>
              {renderColoredText(CONSTANTES.TEXTOS.VOTACIONES)}
            </Text>
          </Animated.View>
        )}

        {/* DISPARO DEL CAZADOR */}
        {mostrarCazadorDisparo && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionCazador,
              { opacity: animacionesPantalla.animacionCazadorDisparo.value },
            ]}
          >
            <Text style={estilos.textoAnimacionCazador}>
              {renderColoredText(CONSTANTES.TEXTOS.DISPARO_CAZADOR)}
            </Text>
          </Animated.View>
        )}

        {/* BRUJA CURA */}
        {mostrarBrujaCura && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionBrujaCura,
              { opacity: animacionesPantalla.animacionBrujaCura.value },
            ]}
          >
            <Text style={estilos.textoAnimacionBrujaCura}>
              {renderColoredText(CONSTANTES.TEXTOS.BRUJA_CURA)}
            </Text>
          </Animated.View>
        )}

        {/* BRUJA VENENO */}
        {mostrarBrujaVeneno && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionBrujaVeneno,
              { opacity: animacionesPantalla.animacionBrujaVeneno.value },
            ]}
          >
            <Text style={estilos.textoAnimacionBrujaVeneno}>
              {renderColoredText(CONSTANTES.TEXTOS.BRUJA_VENENO)}
            </Text>
          </Animated.View>
        )}

        {/* DORMIR */}
        {mostrarDormir && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionDormir,
              { opacity: animacionesPantalla.animacionDormir.value },
            ]}
          >
            <Text style={estilos.textoAnimacionDormir}>
              {renderColoredText(CONSTANTES.TEXTOS.DORMIR)}
            </Text>
          </Animated.View>
        )}

        {/* DEVORA HOMBRES LOBO */}
        {mostrarDevoraHombresLobo && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionDevora,
              { opacity: animacionesPantalla.animacionDevoraHombresLobo.value },
            ]}
          >
            <Text style={estilos.textoAnimacionDevora}>
              {renderColoredText(CONSTANTES.TEXTOS.DEVORA_LOBOS)}
            </Text>
          </Animated.View>
        )}

        {/* HOMBRES LOBO DORMIR */}
        {mostrarHombresLoboDormir && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionHombresLoboDormir,
              { opacity: animacionesPantalla.animacionHombresLoboDormir.value },
            ]}
          >
            <Text style={estilos.textoAnimacionHombresLoboDormir}>
              {renderColoredText(CONSTANTES.TEXTOS.LOBOS_DORMIR)}
            </Text>
          </Animated.View>
        )}

        {/* BRUJA DESPIERTA */}
        {mostrarBrujaDespierta && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionBrujaDespierta,
              { opacity: animacionesPantalla.animacionBrujaDespierta.value },
            ]}
          >
            <Text style={estilos.textoAnimacionBrujaDespierta}>
              {renderColoredText(CONSTANTES.TEXTOS.BRUJA_DESPIERTA)}
            </Text>
          </Animated.View>
        )}

        {/* BRUJA DUERME */}
        {mostrarBrujaDuerme && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionBrujaDuerme,
              { opacity: animacionesPantalla.animacionBrujaDuerme.value },
            ]}
          >
            <Text style={estilos.textoAnimacionBrujaDuerme}>
              {renderColoredText(CONSTANTES.TEXTOS.BRUJA_DUERME)}
            </Text>
          </Animated.View>
        )}

        {/* VIDENTE DUERME */}
        {mostrarVidenteDuerme && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionVidenteDuerme,
              { opacity: animacionesPantalla.animacionVidenteDuerme.value },
            ]}
          >
            <Text style={estilos.textoAnimacionVidenteDuerme}>
              {renderColoredText(CONSTANTES.TEXTOS.VIDENTE_DUERME)}
            </Text>
          </Animated.View>
        )}

        {/* VIDENTE DESPIERTA */}
        {mostrarVidenteDespierta && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionVidenteDespierta,
              { opacity: animacionesPantalla.animacionVidenteDespierta.value },
            ]}
          >
            <Text style={estilos.textoAnimacionVidenteDespierta}>
              {renderColoredText(CONSTANTES.TEXTOS.VIDENTE_DESPIERTA)}
            </Text>
          </Animated.View>
        )}

        {/* NOCHE SUPERVIVIENTES */}
        {mostrarNocheSupervivientes && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionNocheSupervivientes,
              {
                opacity: animacionesPantalla.animacionNocheSupervivientes.value,
              },
            ]}
          >
            <Text style={estilos.textoAnimacionNocheSupervivientes}>
              {renderColoredText(CONSTANTES.TEXTOS.NOCHE_SUPERVIVIENTES)}
            </Text>
          </Animated.View>
        )}

        {/* JUGADOR ALGUACIL */}
        {mostrarJugadorAlguacil && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionJugadorAlguacil,
              { opacity: animacionesPantalla.animacionJugadorAlguacil.value },
            ]}
          >
            <Text style={estilos.textoAnimacionJugadorAlguacil}>
              {renderColoredText(CONSTANTES.TEXTOS.JUGADOR_ALGUACIL)}
            </Text>
          </Animated.View>
        )}

        {/* VOTACIONES CONCLUIDAS */}
        {mostrarVotacionesConcluidas && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionVotacionesConcluidas,
              {
                opacity:
                  animacionesPantalla.animacionVotacionesConcluidas.value,
              },
            ]}
          >
            <Text style={estilos.textoAnimacionVotacionesConcluidas}>
              {renderColoredText(CONSTANTES.TEXTOS.VOTACIONES_CONCLUIDAS)}
            </Text>
          </Animated.View>
        )}

        {/* ELEGIDO POR EL PUEBLO */}
        {mostrarElegidoPueblo && (
          <Animated.View
            style={[
              estilos.contenedorAnimacionElegidoPueblo,
              { opacity: animacionesPantalla.animacionElegidoPueblo.value },
            ]}
          >
            <Text style={estilos.textoAnimacionElegidoPueblo}>
              {renderColoredText(CONSTANTES.TEXTOS.ELEGIDO_PUEBLO)}
            </Text>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Animaciones;
