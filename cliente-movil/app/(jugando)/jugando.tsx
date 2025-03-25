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
import useModoDiaNoche from "./hooks/useModoDiaNoche";
import useAnimacionChat from "./hooks/useAnimacionChat";
import useAnimacionHabilidad from "./hooks/useAnimacionHabilidad";
import useMensajeError from "./hooks/useMensajeError";
import * as animacionesPantalla from "./hooks/useAnimacionesPantalla";
import { administrador_animaciones } from "./hooks/useAnimacionesPantalla";

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
  // Ref para almacenar el id de cualquier timeout pendiente (durante los delays)
  const currentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Información derivada del rol del jugador:
  const habilidadInfo = getHabilidadInfo(rolUsuario);
  const roleInfo = getRoleInfo(rolUsuario);

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

    // --- Cadena de animaciones utilizando el helper ejecutarCadenaAnimacion ---
    ejecutarCadenaAnimacion(
      "texto",
      animacionesPantalla.animacionTexto,
      animacionesPantalla.administrador_animaciones.RETRASO_ANIMACION,
      () => {
        TEXTO_YA_MOSTRADO = true;
        setMostrarTextoInicial(false);
        setMostrarRol(true);
        ejecutarCadenaAnimacion(
          "rol",
          animacionesPantalla.animacionRol,
          animacionesPantalla.administrador_animaciones.RETRASO_ANIMACION,
          () => {
            setMostrarInicio(true);
            ejecutarCadenaAnimacion(
              "inicio",
              animacionesPantalla.animacionInicio,
              animacionesPantalla.administrador_animaciones.RETRASO_ANIMACION,
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
    animacionesPantalla.animacionFondo.value.setValue(1);
    setMostrarEmpiezanVotacionesSospechososSerLobo1(true);
    ejecutarCadenaAnimacion(
      "EmpiezanVotacionesSospechososSerLobo1",
      animacionesPantalla.animacionEmpiezanVotacionesSospechososSerLobo1,
      animacionesPantalla.administrador_animaciones.RETRASO_ANIMACION,
      () => {
        setMostrarEmpiezanVotacionesSospechososSerLobo1(false);
        setMostrarVotaciones(true);
        ejecutarCadenaAnimacion(
          "votaciones",
          animacionesPantalla.animacionEmpiezanVotacionesSospechososSerLobo2,
          animacionesPantalla.administrador_animaciones.RETRASO_ANIMACION,
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

  // Definir si hay algún overlay de animación activo (incluyendo las nuevas)
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
                    animacionesPantalla.animacionEmpiezanVotacionesAlguacil
                      .value,
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

          {/* Overlays para las nuevas animaciones */}
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
                LOS HOMBRES LOBO SACIADOS VUELVEN A DORMIRSE Y SUEÑAN CON
                PRÓXIMAS Y SABROSAS VÍCTIMAS
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
                {
                  opacity: animacionesPantalla.animacionVidenteDespierta.value,
                },
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
                  opacity:
                    animacionesPantalla.animacionNocheSupervivientes.value,
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
          style={[
            estilos.superposicion,
            { opacity: animacionesPantalla.animacionFondo.value },
          ]}
        />
        {/* Texto inicial */}
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
            style={[
              estilos.contenedorRol,
              { opacity: animacionesPantalla.animacionRol.value },
            ]}
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
              {/* Capas del borde blanco en 4 direcciones usando transform */}
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
              { opacity: animacionesPantalla.animacionInicio.value },
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
        {/* Botones de debug para animaciones */}
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
                <Text style={{ color: "orange" }}>
                  Has sido curado por la bruja
                </Text>
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
                <Text style={{ color: "orange" }}>
                  La bruja se vuelve a dormir
                </Text>
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
                <Text style={{ color: "purple" }}>
                  La vidente se vuelve a dormir
                </Text>
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
                <Text style={{ color: "white" }}>Jugador 4 es el alguacil</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                animacionesPantalla.ejecutarAnimacionEmpiezanVotacionesAlguacil(
                  setMostrarAlguacil,
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
                  Empiezan Votaciones Alguacil
                </Text>
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
                <Text style={{ color: "white" }}>
                  Las votaciones han concluido
                </Text>
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
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PantallaJugando;
