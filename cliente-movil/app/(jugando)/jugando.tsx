/**
 * @file PantallaJugando - Componente principal de la pantalla de juego.
 * @description Maneja la lógica del juego, incluyendo estados, animaciones, temporizador,
 * votaciones, chat y habilidades.
 */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useFonts } from "expo-font";
import { CONSTANTES, Rol } from "./constantes";
import { estilos } from "./styles/jugando.styles";

// Funciones auxiliares (puras)
import { getInfoRol } from "./utilidades/rolesUtilidades";

// Módulos UI
import Chat from "./componentes/Chat";
import HabilidadPopup from "./componentes/HabilidadPopup";
import BarraSuperior from "./componentes/BarraSuperior";
import CirculoVotar from "./componentes/CirculoVotar";
import ControlesAccion from "./componentes/ControlesAccion";
import MensajeError from "./componentes/MensajeError";
import BotonesDebug from "./componentes/BotonesDebug";
import Animaciones from "./componentes/Animaciones";

// Hooks y administradores de estado
import useTemporizador from "./hooks/useTemporizador";
import useModoDiaNoche from "./hooks/useModoDiaNoche";
import useAnimacionChat from "./hooks/useAnimacionChat";
import useAnimacionHabilidad from "./hooks/useAnimacionHabilidad";
import useMensajeError from "./hooks/useMensajeError";
import * as animacionesPantalla from "./hooks/useAnimacionesPantalla";
import { administradorAnimaciones } from "./hooks/animaciones";

/**
 * @constant {boolean} MODO_NOCHE_GLOBAL - Indica si el juego está en modo noche. Si es falso, es de día.
 */
export let MODO_NOCHE_GLOBAL = false;

/**
 * @constant {boolean} TEXTO_YA_MOSTRADO - Bandera que indica si el texto de inicio ya se ha mostrado.
 * Si es verdadera, se omitirá la presentación inicial.
 */
export let TEXTO_YA_MOSTRADO = false;

const PantallaJugando: React.FC = () => {
  // Estados para controlar la visibilidad e interacciones de la UI:
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mostrarTextoInicial, setMostrarTextoInicial] = useState(
    !TEXTO_YA_MOSTRADO
  );
  const [JugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(
    null
  );
  const [votes, setVotos] = useState(
    Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0)
  );
  const [mostrarHabilidad, setMostrarHabilidad] = useState(false);
  const [imagenes] = useState(
    new Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(
      CONSTANTES.IMAGENES.JUGADORES
    )
  );
  const [indiceUsuario] = useState(0);
  const [rolUsuario, setRolUsuario] = useState<Rol>("aldeano");
  const [votoRealizado, setVotoRealizado] = useState(false);
  const [pasoTurno, setPasoTurno] = useState(false);
  const [currentAnimacion, setCurrentAnimacion] = useState("");

  // Estados para las animaciones ya existentes
  const [mostrarAlguacil, setMostrarAlguacil] = useState(false);
  const [
    mostrarEmpiezanVotacionesSospechososSerLobo1,
    setMostrarEmpiezanVotacionesSospechososSerLobo1,
  ] = useState(false);
  const [mostrarVotaciones, setMostrarVotaciones] = useState(false);

  // NUEVOS ESTADOS para las animaciones agregadas
  const [mostrarCazadorDisparo, setMostrarCazadorDisparo] = useState(false);
  const [mostrarBrujaCura, setMostrarBrujaCura] = useState(false);
  const [mostrarBrujaVeneno, setMostrarBrujaVeneno] = useState(false);
  const [mostrarDormir, setMostrarDormir] = useState(false);
  const [mostrarDevoraHombresLobo, setMostrarDevoraHombresLobo] =
    useState(false);
  const [mostrarHombresLoboDormir, setMostrarHombresLoboDormir] =
    useState(false);
  const [mostrarBrujaDespierta, setMostrarBrujaDespierta] = useState(false);
  const [mostrarBrujaDuerme, setMostrarBrujaDuerme] = useState(false);
  const [mostrarVidenteDuerme, setMostrarVidenteDuerme] = useState(false);
  const [mostrarVidenteDespierta, setMostrarVidenteDespierta] = useState(false);
  const [mostrarNocheSupervivientes, setMostrarNocheSupervivientes] =
    useState(false);
  const [mostrarJugadorAlguacil, setMostrarJugadorAlguacil] = useState(false);
  const [mostrarVotacionesConcluidas, setMostrarVotacionesConcluidas] =
    useState(false);
  const [mostrarElegidoPueblo, setMostrarElegidoPueblo] = useState(false);

  // Refs para callbacks y timeouts en animaciones
  const startFadeOutNowRef = useRef<(() => void) | null>(null);
  const currentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Información derivada del rol del jugador:
  const { habilidadInfo, roleInfo } = getInfoRol(rolUsuario);

  // Administración de estados temporales y animaciones mediante hooks:
  const { tiempoRestante, reiniciarTemporizador, setTemporizadorActivo } =
    useTemporizador(CONSTANTES.NUMERICAS.TIEMPO_INICIAL, false);
  const { esDeNoche, setModoDiaNoche } = useModoDiaNoche(
    animacionesPantalla.animacionFondo
  );
  const { posicionChat, abrirChat, cerrarChat } = useAnimacionChat();
  const { posicionHabilidad, abrirHabilidad, cerrarHabilidad } =
    useAnimacionHabilidad();
  const { errorMessage, mostrarError, animacionError } = useMensajeError();

  // Se crea la instancia del hook unificado de animaciones.
  const adminAnimaciones = administradorAnimaciones();

  /**
   * Función para iniciar una animación y almacenar su callback.
   */
  const iniciarAnimacion = (
    nombreAnimacion: string,
    animacion: Animated.CompositeAnimation,
    animatedValue: Animated.Value,
    valorFinal: number,
    callback: () => void
  ) => {
    setCurrentAnimacion(nombreAnimacion);
    animacion.start(() => {
      callback();
    });
  };

  /**
   * Función para iniciar un delay (tiempo de espera) que se pueda saltar.
   */
  const iniciarDelay = (delay: number, callback: () => void) => {
    setCurrentAnimacion("delay");
    currentTimeoutRef.current = setTimeout(() => {
      currentTimeoutRef.current = null;
      callback();
    }, delay);
  };

  /**
   * Handler global para saltar la animación o delay actual.
   */
  const handleSkipAnimaciones = () => {
    if (currentTimeoutRef.current) {
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
      if (startFadeOutNowRef.current) {
        startFadeOutNowRef.current();
        return;
      }
    }
    if (startFadeOutNowRef.current) {
      startFadeOutNowRef.current();
      return;
    }
    if (currentAnimacion.includes("fadeOut")) {
      if (currentAnimacion.includes("texto")) {
        animacionesPantalla.animacionTexto.value.stopAnimation(() => {
          animacionesPantalla.animacionTexto.value.setValue(0);
        });
      } else if (currentAnimacion.includes("rol")) {
        animacionesPantalla.animacionRol.value.stopAnimation(() => {
          animacionesPantalla.animacionRol.value.setValue(0);
        });
      } else if (currentAnimacion.includes("inicio")) {
        animacionesPantalla.animacionInicio.value.stopAnimation(() => {
          animacionesPantalla.animacionInicio.value.setValue(0);
        });
      } else if (currentAnimacion.includes("fondo")) {
        animacionesPantalla.animacionFondo.value.stopAnimation(() => {
          animacionesPantalla.animacionFondo.value.setValue(0);
        });
      }
    }
  };

  /**
   * Efecto: Cadena de animaciones iniciales (texto, rol, inicio).
   */
  useEffect(() => {
    const roles: Rol[] = ["aldeano", "lobo", "bruja", "cazador"];
    const indiceAleatorio = Math.floor(Math.random() * roles.length);
    setRolUsuario(roles[indiceAleatorio]);

    if (TEXTO_YA_MOSTRADO) {
      setMostrarTextoInicial(false);
      setMostrarRol(false);
      setMostrarInicio(false);
      setMostrarBotones(true);
      return;
    }

    // Se invoca la cadena de animación a través de adminAnimaciones.
    adminAnimaciones.ejecutarCadenaAnimacion(
      "texto",
      animacionesPantalla.animacionTexto,
      adminAnimaciones.RETRASO_ANIMACION,
      () => {
        TEXTO_YA_MOSTRADO = true;
        setMostrarTextoInicial(false);
        setMostrarRol(true);
        adminAnimaciones.ejecutarCadenaAnimacion(
          "rol",
          animacionesPantalla.animacionRol,
          adminAnimaciones.RETRASO_ANIMACION,
          () => {
            setMostrarInicio(true);
            adminAnimaciones.ejecutarCadenaAnimacion(
              "inicio",
              animacionesPantalla.animacionInicio,
              adminAnimaciones.RETRASO_ANIMACION,
              () => {
                setCurrentAnimacion("fondo-fadeOut");
                iniciarAnimacion(
                  "fondo-fadeOut",
                  animacionesPantalla.animacionFondo.fadeOut(),
                  animacionesPantalla.animacionFondo.value,
                  0,
                  () => {
                    setMostrarBotones(true);
                    setCurrentAnimacion("");
                  }
                );
              },
              setCurrentAnimacion,
              iniciarAnimacion,
              iniciarDelay,
              startFadeOutNowRef
            );
          },
          setCurrentAnimacion,
          iniciarAnimacion,
          iniciarDelay,
          startFadeOutNowRef
        );
      },
      setCurrentAnimacion,
      iniciarAnimacion,
      iniciarDelay,
      startFadeOutNowRef
    );
  }, []);

  /**
   * Activa el temporizador cuando se muestran los botones.
   */
  useEffect(() => {
    if (mostrarBotones) {
      setTemporizadorActivo(true);
    }
  }, [mostrarBotones]);

  /**
   * Alterna el modo día/noche y reinicia estados al finalizar el temporizador.
   */
  useEffect(() => {
    if (tiempoRestante === 0) {
      const nuevoModo = !esDeNoche;
      MODO_NOCHE_GLOBAL = nuevoModo;
      setModoDiaNoche(nuevoModo);
      setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
      setVotoRealizado(false);
      setPasoTurno(false);
      setJugadorSeleccionado(null);
      reiniciarTemporizador();
    }
  }, [tiempoRestante, esDeNoche, reiniciarTemporizador, setModoDiaNoche]);

  // Manejo del chat y popup de habilidad
  const handleAbrirChat = () => {
    setMostrarChat(true);
    abrirChat();
  };

  const handleCerrarChat = () => {
    cerrarChat();
    setMostrarChat(false);
  };

  const handleAbrirHabilidad = () => {
    setMostrarHabilidad(true);
    abrirHabilidad();
  };

  const handleCerrarHabilidad = () => {
    cerrarHabilidad();
    setMostrarHabilidad(false);
  };

  // Selección de jugador para votación
  const administrarSeleccionJugadorVotacion = (index: number) => {
    if (esDeNoche && rolUsuario !== "lobo") {
      mostrarError(
        "Solo los lobos pueden seleccionar jugadores durante la noche"
      );
      return;
    }
    if (pasoTurno) {
      mostrarError("Has pasado turno");
      return;
    }
    if (votoRealizado) {
      mostrarError("Solo puedes votar a un jugador por turno");
      return;
    }
    if (index === indiceUsuario) {
      mostrarError("¡No puedes votarte a ti mismo!");
      return;
    }
    setJugadorSeleccionado(index);
  };

  // Votación de jugador
  const votarAJugador = () => {
    if (pasoTurno) {
      mostrarError("Has pasado turno");
      return;
    }
    if (votoRealizado) {
      mostrarError("Solo puedes votar a un jugador por turno");
      return;
    }
    if (JugadorSeleccionado === null) {
      console.log("No se ha seleccionado ningún jugador para votar.");
      return;
    }
    setVotos((votosAnteriores) => {
      const nuevosVotos = [...votosAnteriores];
      nuevosVotos[JugadorSeleccionado] += 1;
      return nuevosVotos;
    });
    console.log(`Votado al jugador ${JugadorSeleccionado + 1}`, votes);
    setVotoRealizado(true);
    setJugadorSeleccionado(null);
  };

  // Pasar turno
  const manejarPasarTurno = () => {
    if (votoRealizado || pasoTurno) {
      mostrarError("Has pasado turno");
      return;
    }
    setPasoTurno(true);
    setVotoRealizado(true);
    setJugadorSeleccionado(null);
  };

  /**
   * Función que encadena las dos animaciones de "Sospechosos Ser Lobo" de forma secuencial.
   */
  const ejecutarCadenaAnimacionSospechososSerLobo = () => {
    animacionesPantalla.animacionFondo.value.setValue(1);
    setMostrarEmpiezanVotacionesSospechososSerLobo1(true);
    adminAnimaciones.ejecutarCadenaAnimacion(
      "EmpiezanVotacionesSospechososSerLobo1",
      animacionesPantalla.animacionEmpiezanVotacionesSospechososSerLobo1,
      adminAnimaciones.RETRASO_ANIMACION,
      () => {
        setMostrarEmpiezanVotacionesSospechososSerLobo1(false);
        setMostrarVotaciones(true);
        adminAnimaciones.ejecutarCadenaAnimacion(
          "votaciones",
          animacionesPantalla.animacionEmpiezanVotacionesSospechososSerLobo2,
          adminAnimaciones.RETRASO_ANIMACION,
          () => {
            setCurrentAnimacion("fondo-fadeOut");
            iniciarAnimacion(
              "fondo-fadeOut",
              animacionesPantalla.animacionFondo.fadeOut(),
              animacionesPantalla.animacionFondo.value,
              0,
              () => {
                setMostrarVotaciones(false);
                setCurrentAnimacion("");
              }
            );
          },
          setCurrentAnimacion,
          iniciarAnimacion,
          iniciarDelay,
          startFadeOutNowRef
        );
      },
      setCurrentAnimacion,
      iniciarAnimacion,
      iniciarDelay,
      startFadeOutNowRef
    );
  };

  // Carga de fuente personalizada
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });
  if (!fuentesCargadas) return null;

  // Si hay algún overlay de animación activo, delegamos el renderizado al componente Animaciones.
  const debugOverlayActive =
    mostrarAlguacil ||
    mostrarEmpiezanVotacionesSospechososSerLobo1 ||
    mostrarVotaciones ||
    mostrarCazadorDisparo ||
    mostrarBrujaCura ||
    mostrarBrujaVeneno ||
    mostrarDormir ||
    mostrarDevoraHombresLobo ||
    mostrarHombresLoboDormir ||
    mostrarBrujaDespierta ||
    mostrarBrujaDuerme ||
    mostrarVidenteDuerme ||
    mostrarVidenteDespierta ||
    mostrarNocheSupervivientes ||
    mostrarJugadorAlguacil ||
    mostrarVotacionesConcluidas ||
    mostrarElegidoPueblo;

  if (debugOverlayActive) {
    return (
      <Animaciones
        handleSkipAnimaciones={handleSkipAnimaciones}
        estilos={estilos}
        animacionesPantalla={animacionesPantalla}
        mostrarAlguacil={mostrarAlguacil}
        mostrarEmpiezanVotacionesSospechososSerLobo1={
          mostrarEmpiezanVotacionesSospechososSerLobo1
        }
        mostrarVotaciones={mostrarVotaciones}
        mostrarCazadorDisparo={mostrarCazadorDisparo}
        mostrarBrujaCura={mostrarBrujaCura}
        mostrarBrujaVeneno={mostrarBrujaVeneno}
        mostrarDormir={mostrarDormir}
        mostrarDevoraHombresLobo={mostrarDevoraHombresLobo}
        mostrarHombresLoboDormir={mostrarHombresLoboDormir}
        mostrarBrujaDespierta={mostrarBrujaDespierta}
        mostrarBrujaDuerme={mostrarBrujaDuerme}
        mostrarVidenteDuerme={mostrarVidenteDuerme}
        mostrarVidenteDespierta={mostrarVidenteDespierta}
        mostrarNocheSupervivientes={mostrarNocheSupervivientes}
        mostrarJugadorAlguacil={mostrarJugadorAlguacil}
        mostrarVotacionesConcluidas={mostrarVotacionesConcluidas}
        mostrarElegidoPueblo={mostrarElegidoPueblo}
      />
    );
  }

  // Renderizado normal de la UI cuando no hay overlay activo.
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
        {mostrarTextoInicial && (
          <Animated.View
            style={[
              estilos.contenedorTexto,
              { opacity: animacionesPantalla.animacionTexto.value },
            ]}
          >
            <Text style={estilos.texto}>{CONSTANTES.TEXTOS.INICIAL}</Text>
          </Animated.View>
        )}
        {errorMessage && (
          <MensajeError
            errorMessage={errorMessage}
            animacionError={animacionError}
          />
        )}
        {mostrarRol && (
          <Animated.View
            style={[
              estilos.contenedorRol,
              { opacity: animacionesPantalla.animacionRol.value },
            ]}
          >
            <View style={estilos.contenedorTextoRol}>
              <Text style={estilos.textoRol}>
                {CONSTANTES.TEXTOS.ROL_TITULO}
              </Text>
            </View>
            <Image source={roleInfo.image} style={estilos.imagenRol} />
            <View
              style={{
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  estilos.nombreRol,
                  {
                    color: rolUsuario === "lobo" ? "red" : "rgb(0, 42, 252)",
                    position: "absolute",
                    textAlign: "center",
                  },
                ]}
              >
                {roleInfo.roleName}
              </Text>
            </View>
          </Animated.View>
        )}
        {mostrarInicio && (
          <Animated.View
            style={[
              estilos.contenedorTexto,
              { opacity: animacionesPantalla.animacionInicio.value },
            ]}
          >
            <Text style={estilos.textoInicio}>
              {CONSTANTES.TEXTOS.INICIO_PARTIDA}
            </Text>
          </Animated.View>
        )}
        {mostrarBotones && (
          <>
            <ControlesAccion
              habilidadInfo={habilidadInfo}
              abrirHabilidad={handleAbrirHabilidad}
              abrirChat={handleAbrirChat}
              votarAJugador={votarAJugador}
              manejarPasarTurno={manejarPasarTurno}
              mostrarBotonesAccion={() =>
                !MODO_NOCHE_GLOBAL || rolUsuario === "lobo"
              }
              votoRealizado={votoRealizado}
              turnoPasado={pasoTurno}
            />
            <BarraSuperior />
            <View style={estilos.contenedorTemporizador}>
              <View style={estilos.circuloTemporizador}>
                <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
              </View>
            </View>
            <CirculoVotar
              imagenes={imagenes}
              votes={votes}
              JugadorSeleccionado={JugadorSeleccionado}
              onSelectPlayer={administrarSeleccionJugadorVotacion}
            />
          </>
        )}
        {mostrarChat && (
          <Chat
            mensajes={CONSTANTES.TEXTOS.CHAT.MENSAJES_INICIALES}
            posicionChat={posicionChat}
            onClose={handleCerrarChat}
          />
        )}
        {mostrarHabilidad && (
          <HabilidadPopup
            habilidadInfo={habilidadInfo}
            posicionHabilidad={posicionHabilidad}
            onClose={handleCerrarHabilidad}
          />
        )}
        <BotonesDebug
          ejecutarCadenaAnimacionSospechososSerLobo={
            ejecutarCadenaAnimacionSospechososSerLobo
          }
          animacionesPantalla={animacionesPantalla}
          setMostrarCazadorDisparo={setMostrarCazadorDisparo}
          setMostrarBrujaCura={setMostrarBrujaCura}
          setMostrarBrujaVeneno={setMostrarBrujaVeneno}
          setMostrarDormir={setMostrarDormir}
          setMostrarDevoraHombresLobo={setMostrarDevoraHombresLobo}
          setMostrarHombresLoboDormir={setMostrarHombresLoboDormir}
          setMostrarBrujaDespierta={setMostrarBrujaDespierta}
          setMostrarBrujaDuerme={setMostrarBrujaDuerme}
          setMostrarVidenteDuerme={setMostrarVidenteDuerme}
          setMostrarVidenteDespierta={setMostrarVidenteDespierta}
          setMostrarNocheSupervivientes={setMostrarNocheSupervivientes}
          setMostrarJugadorAlguacil={setMostrarJugadorAlguacil}
          setMostrarVotacionesConcluidas={setMostrarVotacionesConcluidas}
          setMostrarElegidoPueblo={setMostrarElegidoPueblo}
          setCurrentAnimacion={setCurrentAnimacion}
          iniciarAnimacion={iniciarAnimacion}
          iniciarDelay={iniciarDelay}
          startFadeOutNowRef={startFadeOutNowRef}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PantallaJugando;
