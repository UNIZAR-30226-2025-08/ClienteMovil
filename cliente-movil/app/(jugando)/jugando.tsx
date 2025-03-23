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

// Módulos UI
import Chat from "./componentes/Chat";
import HabilidadPopup from "./componentes/HabilidadPopup";
import BarraSuperior from "./componentes/BarraSuperior";
import CirculoVotar from "./componentes/CirculoVotar";
import ControlesAccion from "./componentes/ControlesAccion";
import MensajeError from "./componentes/MensajeError";

// Funciones auxiliares (administradores de estado)
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
  // Estados para controlar la visibilidad e interacciones del UI:
  const [mostrarRol, setMostrarRol] = useState(false); // Muestra u oculta la sección del rol del jugador.
  const [mostrarInicio, setMostrarInicio] = useState(false); // Controla la visualización del mensaje de inicio de partida.
  const [mostrarBotones, setMostrarBotones] = useState(false); // Activa o desactiva los botones de acción.
  const [mostrarChat, setMostrarChat] = useState(false); // Determina si se muestra el componente de chat.
  const [mostrarTextoInicial, setMostrarTextoInicial] = useState(
    !TEXTO_YA_MOSTRADO
  ); // Indica si se debe mostrar el texto inicial.
  const [JugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(
    null
  ); // Guarda el índice del jugador seleccionado para votar.
  const [votes, setVotos] = useState(
    Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0)
  ); // Almacena los votos asignados a cada jugador.
  const [mostrarHabilidad, setMostrarHabilidad] = useState(false); // Muestra u oculta el popup de la habilidad.
  const [imagenes] = useState(
    new Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(
      CONSTANTES.IMAGENES.JUGADORES
    )
  ); // Array con las imágenes predeterminadas para cada jugador.
  const [indiceUsuario] = useState(0); // Índice que identifica al usuario actual.
  const [rolUsuario, setRolUsuario] = useState<Rol>("aldeano"); // Rol asignado al jugador, por defecto "aldeano".
  const [votoRealizado, setVotoRealizado] = useState(false); // Estado que indica si ya se realizó la votación en el turno

  // Nuevo estado: indica si se ha pasado turno
  const [pasoTurno, setPasoTurno] = useState(false);

  // Estado para identificar la animación actual (ej: "texto-fadeIn", "rol-delay", etc.)
  const [currentAnimacion, setCurrentAnimacion] = useState("");

  // Ref para almacenar la función callback de la animación actual (o para iniciar el fadeOut de forma inmediata)
  const startFadeOutNowRef = useRef<(() => void) | null>(null);
  // Ref para almacenar el id de cualquier timeout pendiente (durante los delays)
  const currentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Obtención de información derivada del rol del jugador:
  const habilidadInfo = getHabilidadInfo(rolUsuario); // Datos relacionados con la habilidad del rol.
  const roleInfo = getRoleInfo(rolUsuario); // Datos descriptivos e imagen del rol.

  // Administración de estados temporales y animaciones mediante hooks:
  const { tiempoRestante, reiniciarTemporizador, setTemporizadorActivo } =
    useTemporizador(CONSTANTES.NUMERICAS.TIEMPO_INICIAL, false); // Maneja el temporizador del juego.
  const {
    administrador_animaciones,
    animacionTexto,
    animacionRol,
    animacionInicio,
    animacionFondo,
  } = useAnimacionesPantalla(); // Proporciona y gestiona las animaciones de la pantalla.
  const { esDeNoche, setModoDiaNoche } = useModoDiaNoche(animacionFondo); // Controla la transición entre modo día y noche.
  const { posicionChat, abrirChat, cerrarChat } = useAnimacionChat(); // Administra la animación y posición del chat.
  const { posicionHabilidad, abrirHabilidad, cerrarHabilidad } =
    useAnimacionHabilidad(); // Gestiona la animación del popup de habilidad.
  const { errorMessage, mostrarError, animacionError } = useMensajeError(); // Maneja mensajes de error y sus animaciones.

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
   * Cadena de animaciones para el texto, rol e inicio de partida.
   *
   * Se utiliza startFadeOutNowRef para forzar el inicio inmediato del fadeOut
   * en caso de que se toque durante el fadeIn o durante el delay.
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

    // --- Cadena para el texto ---
    const onTextoFadeOutComplete = () => {
      TEXTO_YA_MOSTRADO = true;
      setMostrarTextoInicial(false);
      setMostrarRol(true);

      // --- Cadena para el rol ---
      setCurrentAnimacion("rol-fadeIn");
      startFadeOutNowRef.current = () => {
        animacionRol.value.stopAnimation(() => {
          animacionRol.value.setValue(1);
          if (currentTimeoutRef.current) {
            clearTimeout(currentTimeoutRef.current);
            currentTimeoutRef.current = null;
          }
          setCurrentAnimacion("rol-fadeOut");
          iniciarAnimacion(
            "rol-fadeOut",
            animacionRol.fadeOut(),
            animacionRol.value,
            0,
            onRolFadeOutComplete
          );
          startFadeOutNowRef.current = null;
        });
      };
      iniciarAnimacion(
        "rol-fadeIn",
        animacionRol.fadeIn(),
        animacionRol.value,
        1,
        () => {
          setCurrentAnimacion("rol-delay");
          iniciarDelay(administrador_animaciones.RETRASO_ANIMACION, () => {
            setCurrentAnimacion("rol-fadeOut");
            iniciarAnimacion(
              "rol-fadeOut",
              animacionRol.fadeOut(),
              animacionRol.value,
              0,
              onRolFadeOutComplete
            );
            startFadeOutNowRef.current = null;
          });
        }
      );
    };

    const onRolFadeOutComplete = () => {
      setMostrarInicio(true);
      // --- Cadena para el inicio ---
      setCurrentAnimacion("inicio-fadeIn");
      startFadeOutNowRef.current = () => {
        animacionInicio.value.stopAnimation(() => {
          animacionInicio.value.setValue(1);
          if (currentTimeoutRef.current) {
            clearTimeout(currentTimeoutRef.current);
            currentTimeoutRef.current = null;
          }
          setCurrentAnimacion("inicio-fadeOut");
          iniciarAnimacion(
            "inicio-fadeOut",
            animacionInicio.fadeOut(),
            animacionInicio.value,
            0,
            onInicioFadeOutComplete
          );
          startFadeOutNowRef.current = null;
        });
      };
      iniciarAnimacion(
        "inicio-fadeIn",
        animacionInicio.fadeIn(),
        animacionInicio.value,
        1,
        () => {
          setCurrentAnimacion("inicio-delay");
          iniciarDelay(administrador_animaciones.RETRASO_ANIMACION, () => {
            setCurrentAnimacion("inicio-fadeOut");
            iniciarAnimacion(
              "inicio-fadeOut",
              animacionInicio.fadeOut(),
              animacionInicio.value,
              0,
              onInicioFadeOutComplete
            );
            startFadeOutNowRef.current = null;
          });
        }
      );
    };

    const onInicioFadeOutComplete = () => {
      // --- Cadena para el fondo (última animación) ---
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
    };

    // Iniciar cadena para el texto:
    setCurrentAnimacion("texto-fadeIn");
    startFadeOutNowRef.current = () => {
      animacionTexto.value.stopAnimation(() => {
        animacionTexto.value.setValue(1);
        if (currentTimeoutRef.current) {
          clearTimeout(currentTimeoutRef.current);
          currentTimeoutRef.current = null;
        }
        setCurrentAnimacion("texto-fadeOut");
        iniciarAnimacion(
          "texto-fadeOut",
          animacionTexto.fadeOut(),
          animacionTexto.value,
          0,
          onTextoFadeOutComplete
        );
        startFadeOutNowRef.current = null;
      });
    };
    iniciarAnimacion(
      "texto-fadeIn",
      animacionTexto.fadeIn(),
      animacionTexto.value,
      1,
      () => {
        setCurrentAnimacion("texto-delay");
        iniciarDelay(administrador_animaciones.RETRASO_ANIMACION, () => {
          setCurrentAnimacion("texto-fadeOut");
          iniciarAnimacion(
            "texto-fadeOut",
            animacionTexto.fadeOut(),
            animacionTexto.value,
            0,
            onTextoFadeOutComplete
          );
          startFadeOutNowRef.current = null;
        });
      }
    );
  }, []);

  /**
   * Efecto: Activa el temporizador una vez que se muestran los botones de acción.
   */
  useEffect(() => {
    if (mostrarBotones) {
      setTemporizadorActivo(true);
    }
  }, [mostrarBotones]);

  // Carga de fuente personalizada.
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });
  if (!fuentesCargadas) return null;

  return (
    // Se envuelve el contenedor principal en TouchableWithoutFeedback para que al tocar se invoque handleSkipAnimaciones
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
              {/* Capas del borde blanco en 4 direcciones usando transform */}
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
              )}
              {/* Texto principal */}
              <Text
                style={[
                  estilos.nombreRol,
                  {
                    color: rolUsuario === "lobo" ? "red" : "blue",
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
              abrirHabilidad={() => {
                setMostrarHabilidad(true);
                abrirHabilidad();
              }}
              abrirChat={() => {
                setMostrarChat(true);
                abrirChat();
              }}
              votarAJugador={() => {
                if (pasoTurno) {
                  mostrarError("Has pasado turno");
                  return;
                }
                if (votoRealizado) {
                  mostrarError("Solo puedes votar a un jugador por turno");
                  return;
                }
                if (JugadorSeleccionado === null) {
                  console.log(
                    "No se ha seleccionado ningún jugador para votar."
                  );
                  return;
                }
                setVotos((votosAnteriores) => {
                  const nuevosVotos = [...votosAnteriores];
                  nuevosVotos[JugadorSeleccionado] += 1;
                  return nuevosVotos;
                });
                console.log(
                  `Votado al jugador ${JugadorSeleccionado + 1}`,
                  votes
                );
                setVotoRealizado(true);
              }}
              manejarPasarTurno={() => {
                if (votoRealizado || pasoTurno) {
                  mostrarError("Has pasado turno");
                  return;
                }
                setPasoTurno(true);
                setVotoRealizado(true);
                setJugadorSeleccionado(null);
              }}
              mostrarBotonesAccion={() => {
                return !MODO_NOCHE_GLOBAL || rolUsuario === "lobo";
              }}
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
              onSelectPlayer={(index: number) => {
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
              }}
            />
          </>
        )}
        {/* Componente de chat */}
        {mostrarChat && (
          <Chat
            mensajes={CONSTANTES.TEXTOS.CHAT.MENSAJES_INICIALES}
            posicionChat={posicionChat}
            onClose={() => {
              cerrarChat();
              setMostrarChat(false);
            }}
          />
        )}
        {/* Popup de habilidad */}
        {mostrarHabilidad && (
          <HabilidadPopup
            habilidadInfo={habilidadInfo}
            posicionHabilidad={posicionHabilidad}
            onClose={() => {
              cerrarHabilidad();
              setMostrarHabilidad(false);
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PantallaJugando;
