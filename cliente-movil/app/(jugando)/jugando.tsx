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
import { getHabilidadInfo, getRoleInfo } from "./utilidades/rolesUtilidades";
import { ejecutarCadenaAnimacion } from "./utilidades/gestorCadenaAnimaciones";

// Módulos UI
import Chat from "./componentes/Chat";
import HabilidadPopup from "./componentes/HabilidadPopup";
import BarraSuperior from "./componentes/BarraSuperior";
import CirculoVotar from "./componentes/CirculoVotar";
import ControlesAccion from "./componentes/ControlesAccion";
import MensajeError from "./componentes/MensajeError";

// Hooks y administradores de estado
import useTemporizador from "./hooks/useTemporizador";
import useAnimacionesPantalla from "./hooks/useAnimacionesPantalla";
import useModoDiaNoche from "./hooks/useModoDiaNoche";
import useAnimacionChat from "./hooks/useAnimacionChat";
import useAnimacionHabilidad from "./hooks/useAnimacionHabilidad";
import useMensajeError from "./hooks/useMensajeError";

/**
 * @constant {boolean} MODO_NOCHE_GLOBAL - Indica si el juego está en modo noche. Si es falso, es de día.
 */
export let MODO_NOCHE_GLOBAL = false;

/**
 * @constant {boolean} TEXTO_YA_MOSTRADO - Bandera que indica si el texto de inicio ya se ha mostrado.
 * Si es verdadera, se omitirá la presentación inicial.
 */
export let TEXTO_YA_MOSTRADO = false;

/**
 * Componente principal de la pantalla de juego.
 *
 * @component
 * @returns {JSX.Element} La interfaz de la pantalla de juego.
 */
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

  // Estados para las nuevas animaciones (que se comportan como las iniciales)
  const [mostrarAlguacil, setMostrarAlguacil] = useState(false);
  const [
    mostrarEmpiezanVotacionesSospechososSerLobo1,
    setMostrarEmpiezanVotacionesSospechososSerLobo1,
  ] = useState(false);
  const [mostrarVotaciones, setMostrarVotaciones] = useState(false);

  // Refs para callbacks y timeouts en animaciones
  const startFadeOutNowRef = useRef<(() => void) | null>(null);
  // Ref para almacenar el id de cualquier timeout pendiente (durante los delays)
  const currentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Información derivada del rol del jugador:
  const habilidadInfo = getHabilidadInfo(rolUsuario);
  const roleInfo = getRoleInfo(rolUsuario);

  // Administración de estados temporales y animaciones mediante hooks:
  const { tiempoRestante, reiniciarTemporizador, setTemporizadorActivo } =
    useTemporizador(CONSTANTES.NUMERICAS.TIEMPO_INICIAL, false);
  const {
    administrador_animaciones,
    animacionTexto,
    animacionRol,
    animacionInicio,
    animacionFondo,
    animacionEmpiezanVotacionesAlguacil,
    animacionEmpiezanVotacionesSospechososSerLobo1,
    animacionEmpiezanVotacionesSospechososSerLobo2,
  } = useAnimacionesPantalla();
  const { esDeNoche, setModoDiaNoche } = useModoDiaNoche(animacionFondo);
  const { posicionChat, abrirChat, cerrarChat } = useAnimacionChat();
  const { posicionHabilidad, abrirHabilidad, cerrarHabilidad } =
    useAnimacionHabilidad();
  const { errorMessage, mostrarError, animacionError } = useMensajeError();

  /**
   * Función para iniciar una animación y almacenar su callback.
   *
   * @param {string} nombreAnimacion - Identificador de la animación (ej. "texto-fadeIn").
   * @param {Animated.CompositeAnimation} animacion - La animación a ejecutar.
   * @param {Animated.Value} animatedValue - El valor animado correspondiente.
   * @param {number} valorFinal - El valor final que debe tomar el animatedValue.
   * @param {Function} callback - Función a ejecutar al finalizar la animación.
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
   *
   * @param {number} delay - Milisegundos a esperar.
   * @param {Function} callback - Función a ejecutar al finalizar el delay.
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
   *
   * Si se toca durante un fadeIn o durante un delay, se invoca la función almacenada
   * en startFadeOutNowRef para iniciar inmediatamente el fadeOut. Si ya se está en fadeOut,
   * se fuerza la finalización.
   */
  const handleSkipAnimaciones = () => {
    // Si hay un timeout activo (delay), cancelarlo y pasar al fadeOut
    if (currentTimeoutRef.current) {
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
      if (startFadeOutNowRef.current) {
        startFadeOutNowRef.current();
        return;
      }
    }
    // Si se tiene una función para saltar al fadeOut, ejecutarla
    if (startFadeOutNowRef.current) {
      startFadeOutNowRef.current();
      return;
    }
    // Si se está en fadeOut, detener la animación y fijar el valor final
    if (currentAnimacion.includes("fadeOut")) {
      if (currentAnimacion.includes("texto")) {
        animacionTexto.value.stopAnimation(() => {
          animacionTexto.value.setValue(0);
        });
      } else if (currentAnimacion.includes("rol")) {
        animacionRol.value.stopAnimation(() => {
          animacionRol.value.setValue(0);
        });
      } else if (currentAnimacion.includes("inicio")) {
        animacionInicio.value.stopAnimation(() => {
          animacionInicio.value.setValue(0);
        });
      } else if (currentAnimacion.includes("fondo")) {
        animacionFondo.value.stopAnimation(() => {
          animacionFondo.value.setValue(0);
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

    // --- Cadena de animaciones utilizando el helper ejecutarCadenaAnimacion ---
    ejecutarCadenaAnimacion(
      "texto",
      animacionTexto,
      administrador_animaciones.RETRASO_ANIMACION,
      () => {
        TEXTO_YA_MOSTRADO = true;
        setMostrarTextoInicial(false);
        setMostrarRol(true);
        ejecutarCadenaAnimacion(
          "rol",
          animacionRol,
          administrador_animaciones.RETRASO_ANIMACION,
          () => {
            setMostrarInicio(true);
            ejecutarCadenaAnimacion(
              "inicio",
              animacionInicio,
              administrador_animaciones.RETRASO_ANIMACION,
              () => {
                setCurrentAnimacion("fondo-fadeOut");
                iniciarAnimacion(
                  "fondo-fadeOut",
                  animacionFondo.fadeOut(),
                  animacionFondo.value,
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
      // Reiniciar valores de votación y estados asociados
      setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
      setVotoRealizado(false);
      setPasoTurno(false);
      setJugadorSeleccionado(null);
      reiniciarTemporizador();
    }
  }, [tiempoRestante, esDeNoche, reiniciarTemporizador, setModoDiaNoche]);

  // Manejo del chat
  const handleAbrirChat = () => {
    setMostrarChat(true);
    abrirChat();
  };

  const handleCerrarChat = () => {
    cerrarChat();
    setMostrarChat(false);
  };

  // Manejo del popup de habilidad
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

  const ejecutaranimacionEmpiezanVotacionesAlguacil = () => {
    // Reiniciamos la opacidad del fondo para que se oscurezca
    animacionFondo.value.setValue(1);
    setMostrarAlguacil(true);
    ejecutarCadenaAnimacion(
      "alguacil",
      animacionEmpiezanVotacionesAlguacil,
      administrador_animaciones.RETRASO_ANIMACION,
      () => {
        setCurrentAnimacion("fondo-fadeOut");
        iniciarAnimacion(
          "fondo-fadeOut",
          animacionFondo.fadeOut(),
          animacionFondo.value,
          0,
          () => {
            setMostrarAlguacil(false);
            setCurrentAnimacion("");
          }
        );
      },
      setCurrentAnimacion,
      iniciarAnimacion,
      iniciarDelay,
      startFadeOutNowRef
    );
  };

  /**
   * Función que encadena las dos animaciones de "Sospechosos Ser Lobo" de forma
   * secuencial, tal como se encadenan las animaciones del inicio:
   *
   * 1. Se muestra la animación "EmpiezanVotacionesSospechososSerLobo1". Al finalizar,
   *    se oculta su contenedor.
   * 2. Se muestra la animación "votaciones" (textoEmpiezanVotacionesSospechososSerLobo2).
   * 3. Finalizadas ambas animaciones, se aplica el efecto de oscurecimiento (fadeOut) al fondo.
   */
  const ejecutarCadenaAnimacionSospechososSerLobo = () => {
    animacionFondo.value.setValue(1);
    setMostrarEmpiezanVotacionesSospechososSerLobo1(true);
    ejecutarCadenaAnimacion(
      "EmpiezanVotacionesSospechososSerLobo1",
      animacionEmpiezanVotacionesSospechososSerLobo1,
      administrador_animaciones.RETRASO_ANIMACION,
      () => {
        setMostrarEmpiezanVotacionesSospechososSerLobo1(false);
        setMostrarVotaciones(true);
        ejecutarCadenaAnimacion(
          "votaciones",
          animacionEmpiezanVotacionesSospechososSerLobo2,
          administrador_animaciones.RETRASO_ANIMACION,
          () => {
            setCurrentAnimacion("fondo-fadeOut");
            iniciarAnimacion(
              "fondo-fadeOut",
              animacionFondo.fadeOut(),
              animacionFondo.value,
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

  const debugOverlayActive =
    mostrarAlguacil ||
    mostrarEmpiezanVotacionesSospechososSerLobo1 ||
    mostrarVotaciones;

  if (debugOverlayActive) {
    return (
      <TouchableWithoutFeedback onPress={handleSkipAnimaciones}>
        <View style={estilos.contenedor}>
          <ImageBackground
            source={CONSTANTES.IMAGENES.FONDO}
            style={estilos.fondo}
            resizeMode="cover"
          />
          <Animated.View
            style={[estilos.superposicion, { opacity: animacionFondo.value }]}
          />

          {mostrarAlguacil && (
            <Animated.View
              style={[
                estilos.contenedorEmpiezanVotacionesAlguacil,
                { opacity: animacionEmpiezanVotacionesAlguacil.value },
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
                  opacity: animacionEmpiezanVotacionesSospechososSerLobo1.value,
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
                  opacity: animacionEmpiezanVotacionesSospechososSerLobo2.value,
                },
              ]}
            >
              <Text style={estilos.textoEmpiezanVotacionesSospechososSerLobo2}>
                {CONSTANTES.TEXTOS.VOTACIONES}
              </Text>
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // Renderizado normal de la UI cuando no hay overlay de animación activa
  return (
    <TouchableWithoutFeedback onPress={handleSkipAnimaciones}>
      {/* Contenedor principal de la pantalla de juego */}
      <View style={estilos.contenedor}>
        {/* Fondo */}
        <ImageBackground
          source={CONSTANTES.IMAGENES.FONDO}
          style={estilos.fondo}
          resizeMode="cover"
        />
        {/* Superposición animada para efectos visuales en el fondo */}
        <Animated.View
          style={[estilos.superposicion, { opacity: animacionFondo.value }]}
        />
        {/* Texto inicial */}
        {mostrarTextoInicial && (
          <Animated.View
            style={[estilos.contenedorTexto, { opacity: animacionTexto.value }]}
          >
            <Text style={estilos.texto}>{CONSTANTES.TEXTOS.INICIAL}</Text>
          </Animated.View>
        )}
        {/* Mensaje de error */}
        {errorMessage && (
          <MensajeError
            errorMessage={errorMessage}
            animacionError={animacionError}
          />
        )}
        {/* Información del rol del usuario */}
        {mostrarRol && (
          <Animated.View
            style={[estilos.contenedorRol, { opacity: animacionRol.value }]}
          >
            {/* Título "Tu rol es..." */}
            <View style={estilos.contenedorTextoRol}>
              <Text style={estilos.textoRol}>
                {CONSTANTES.TEXTOS.ROL_TITULO}
              </Text>
            </View>
            {/* Imagen del rol (bruja, lobo, etc.) */}
            <Image source={roleInfo.image} style={estilos.imagenRol} />
            {/* Nombre del rol con borde blanco simulado */}
            <View
              style={{
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Capas del borde blanco en 4 direcciones usando transform
              {[-1, 1].map((dx) =>
                [-1, 1].map((dy) => (
                  <Text
                    key={`${dx}-${dy}`}
                    style={[
                      estilos.nombreRol,
                      {
                        color: "white",
                        position: "absolute",
                        transform: [{ translateX: dx }, { translateY: dy }],
                        textAlign: "center",
                      },
                    ]}
                  >
                    {roleInfo.roleName}
                  </Text>
                ))
              )} */}
              {/* Texto principal */}
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
        {/* Mensaje de inicio de partida animado */}
        {mostrarInicio && (
          <Animated.View
            style={[
              estilos.contenedorTexto,
              { opacity: animacionInicio.value },
            ]}
          >
            <Text style={estilos.textoInicio}>
              {CONSTANTES.TEXTOS.INICIO_PARTIDA}
            </Text>
          </Animated.View>
        )}
        {/* Controles y componentes de juego */}
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
            {/* Temporizador */}
            <View style={estilos.contenedorTemporizador}>
              <View style={estilos.circuloTemporizador}>
                <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
              </View>
            </View>
            {/* Componente para votación de jugadores */}
            <CirculoVotar
              imagenes={imagenes}
              votes={votes}
              JugadorSeleccionado={JugadorSeleccionado}
              onSelectPlayer={administrarSeleccionJugadorVotacion}
            />
          </>
        )}
        {/* Componente de chat */}
        {mostrarChat && (
          <Chat
            mensajes={CONSTANTES.TEXTOS.CHAT.MENSAJES_INICIALES}
            posicionChat={posicionChat}
            onClose={handleCerrarChat}
          />
        )}
        {/* Popup de habilidad */}
        {mostrarHabilidad && (
          <HabilidadPopup
            habilidadInfo={habilidadInfo}
            posicionHabilidad={posicionHabilidad}
            onClose={handleCerrarHabilidad}
          />
        )}
        {__DEV__ && (
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
              onPress={ejecutaranimacionEmpiezanVotacionesAlguacil}
            >
              <View
                style={{
                  padding: 10,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  margin: 5,
                }}
              >
                <Text style={{ color: "white" }}>
                  Empiezan Votaciones Alguacil
                </Text>
              </View>
            </TouchableWithoutFeedback>
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
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PantallaJugando;
