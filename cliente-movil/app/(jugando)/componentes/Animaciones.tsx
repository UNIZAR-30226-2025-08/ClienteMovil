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
              {CONSTANTES.TEXTOS.ALGUACIL}
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
              {CONSTANTES.TEXTOS.ELIMINAR_LOBO}
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
              {CONSTANTES.TEXTOS.VOTACIONES}
            </Text>
          </Animated.View>
        )}

        {mostrarCazadorDisparo && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "15%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionCazadorDisparo.value },
            ]}
          >
            <Text
              style={{
                color: "blue",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              HAS SIDO DISPARADO POR EL CAZADOR
            </Text>
          </Animated.View>
        )}

        {mostrarBrujaCura && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "20%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionBrujaCura.value },
            ]}
          >
            <Text
              style={{
                color: "orange",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              HAS SIDO CURADO POR LA BRUJA
            </Text>
          </Animated.View>
        )}

        {mostrarBrujaVeneno && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "25%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionBrujaVeneno.value },
            ]}
          >
            <Text
              style={{
                color: "orange",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              HAS SIDO ENVENENADO POR LA BRUJA
            </Text>
          </Animated.View>
        )}

        {mostrarDormir && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "30%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionDormir.value },
            ]}
          >
            <Text
              style={{
                color: "white",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              ESTÁS DURMIENDO
            </Text>
          </Animated.View>
        )}

        {mostrarDevoraHombresLobo && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "35%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              {
                opacity: animacionesPantalla.animacionDevoraHombresLobo.value,
              },
            ]}
          >
            <Text
              style={{
                color: "red",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              HAS SIDO EL DEVORADO POR LOS HOMBRES LOBO
            </Text>
          </Animated.View>
        )}

        {mostrarHombresLoboDormir && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "40%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              {
                opacity: animacionesPantalla.animacionHombresLoboDormir.value,
              },
            ]}
          >
            <Text
              style={{
                color: "red",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              LOS HOMBRES LOBO SACIADOS VUELVEN A DORMIRSE Y SUEÑAN CON PRÓXIMAS
              Y SABROSAS VÍCTIMAS
            </Text>
          </Animated.View>
        )}

        {mostrarBrujaDespierta && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "45%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionBrujaDespierta.value },
            ]}
          >
            <Text
              style={{
                color: "orange",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              LA BRUJA SE DESPIERTA, OBSERVA LA NUEVA VÍCTIMA DE LOS HOMBRES
              LOBO. USARÁ SU POCIÓN CURATIVA O SU POCIÓN VENENOSA
            </Text>
          </Animated.View>
        )}

        {mostrarBrujaDuerme && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "50%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionBrujaDuerme.value },
            ]}
          >
            <Text
              style={{
                color: "orange",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              LA BRUJA SE VUELVE A DORMIR
            </Text>
          </Animated.View>
        )}

        {mostrarVidenteDuerme && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "55%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionVidenteDuerme.value },
            ]}
          >
            <Text
              style={{
                color: "purple",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              LA VIDENTE SE VUELVE A DORMIR
            </Text>
          </Animated.View>
        )}

        {mostrarVidenteDespierta && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "60%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionVidenteDespierta.value },
            ]}
          >
            <Text
              style={{
                color: "purple",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              LA VIDENTE SE DESPIERTA Y SEÑALA A UN JUGADOR DEL QUE QUIERE
              CONOCER LA VERDADERA PERSONALIDAD
            </Text>
          </Animated.View>
        )}

        {mostrarNocheSupervivientes && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "65%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              {
                opacity: animacionesPantalla.animacionNocheSupervivientes.value,
              },
            ]}
          >
            <Text
              style={{
                color: "white",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              SE HACE DE NOCHE; LOS SUPERVIVIENTES VUELVEN A DORMIR
            </Text>
          </Animated.View>
        )}

        {mostrarJugadorAlguacil && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "70%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionJugadorAlguacil.value },
            ]}
          >
            <Text
              style={{
                color: "white",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              JUGADOR 4 ES EL AGUACIL
            </Text>
          </Animated.View>
        )}

        {mostrarVotacionesConcluidas && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "75%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              {
                opacity:
                  animacionesPantalla.animacionVotacionesConcluidas.value,
              },
            ]}
          >
            <Text
              style={{
                color: "white",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              LAS VOTACIONES HAN CONCLUIDO
            </Text>
          </Animated.View>
        )}

        {mostrarElegidoPueblo && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "80%",
                top: "80%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
              { opacity: animacionesPantalla.animacionElegidoPueblo.value },
            ]}
          >
            <Text
              style={{
                color: "yellow",
                fontSize: CONSTANTES.NUMERICAS.TAMANIO_ICONO_BOTON,
                textAlign: "center",
              }}
            >
              HAS SIDO EL ELEGIDO POR EL PUEBLO
            </Text>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Animaciones;
