import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";

interface BotonesDebugProps {
  ejecutarCadenaAnimacionSospechososSerLobo: () => void;
  animacionesPantalla: any;
  setMostrarCazadorDisparo: (value: boolean) => void;
  setMostrarBrujaCura: (value: boolean) => void;
  setMostrarBrujaVeneno: (value: boolean) => void;
  setMostrarDormir: (value: boolean) => void;
  setMostrarDevoraHombresLobo: (value: boolean) => void;
  setMostrarHombresLoboDormir: (value: boolean) => void;
  setMostrarBrujaDespierta: (value: boolean) => void;
  setMostrarBrujaDuerme: (value: boolean) => void;
  setMostrarVidenteDuerme: (value: boolean) => void;
  setMostrarVidenteDespierta: (value: boolean) => void;
  setMostrarNocheSupervivientes: (value: boolean) => void;
  setMostrarJugadorAlguacil: (value: boolean) => void;
  setMostrarVotacionesConcluidas: (value: boolean) => void;
  setMostrarElegidoPueblo: (value: boolean) => void;
  setCurrentAnimacion: (value: string) => void;
  iniciarAnimacion: (
    nombreAnimacion: string,
    animacion: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void;
  iniciarDelay: (delay: number, callback: () => void) => void;
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>;
}

const BotonesDebug: React.FC<BotonesDebugProps> = (props) => {
  // Si no está en modo de desarrollo, no se renderiza nada
  if (!__DEV__) return null;

  const {
    ejecutarCadenaAnimacionSospechososSerLobo,
    animacionesPantalla,
    setMostrarCazadorDisparo,
    setMostrarBrujaCura,
    setMostrarBrujaVeneno,
    setMostrarDormir,
    setMostrarDevoraHombresLobo,
    setMostrarHombresLoboDormir,
    setMostrarBrujaDespierta,
    setMostrarBrujaDuerme,
    setMostrarVidenteDuerme,
    setMostrarVidenteDespierta,
    setMostrarNocheSupervivientes,
    setMostrarJugadorAlguacil,
    setMostrarVotacionesConcluidas,
    setMostrarElegidoPueblo,
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef,
  } = props;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: "center",
      }}
    >
      <TouchableWithoutFeedback
        onPress={ejecutarCadenaAnimacionSospechososSerLobo}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "white" }}>
            Empiezan Votaciones Sospechosos Ser Lobo
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionCazadorDisparo(
            setMostrarCazadorDisparo,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "blue" }}>
            Has sido disparado por el cazador
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionBrujaCura(
            setMostrarBrujaCura,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "orange" }}>Has sido curado por la bruja</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionBrujaVeneno(
            setMostrarBrujaVeneno,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "orange" }}>
            Has sido envenenado por la bruja
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionDormir(
            setMostrarDormir,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "white" }}>Estás durmiendo</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionDevoraHombresLobo(
            setMostrarDevoraHombresLobo,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "red" }}>
            Has sido el devorado por los hombres lobo
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionHombresLoboDormir(
            setMostrarHombresLoboDormir,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "red" }}>
            Hombres lobo vuelven a dormirse y sueñan con próximas víctimas
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionBrujaDespierta(
            setMostrarBrujaDespierta,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "orange" }}>
            La bruja se despierta (observa nueva víctima)
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionBrujaDuerme(
            setMostrarBrujaDuerme,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "orange" }}>La bruja se vuelve a dormir</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionVidenteDuerme(
            setMostrarVidenteDuerme,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "purple" }}>La vidente se vuelve a dormir</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionVidenteDespierta(
            setMostrarVidenteDespierta,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "purple" }}>
            La vidente se despierta y señala a un jugador
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionNocheSupervivientes(
            setMostrarNocheSupervivientes,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "white" }}>
            Se hace de noche; supervivientes duermen
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionJugadorAlguacil(
            setMostrarJugadorAlguacil,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef,
            4
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "white" }}>Mostrar nuevo alguacil</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionVotacionesConcluidas(
            setMostrarVotacionesConcluidas,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "white" }}>Las votaciones han concluido</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          animacionesPantalla.ejecutarAnimacionElegidoPueblo(
            setMostrarElegidoPueblo,
            animacionesPantalla.animacionFondo,
            setCurrentAnimacion,
            iniciarAnimacion,
            iniciarDelay,
            startFadeOutNowRef
          )
        }
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
          }}
        >
          <Text style={{ color: "yellow" }}>
            Has sido el elegido por el pueblo
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default BotonesDebug;
