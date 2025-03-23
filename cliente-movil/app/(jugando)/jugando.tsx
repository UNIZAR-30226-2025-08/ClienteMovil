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

  // Ref para almacenar la función callback de la animación actual o iniciar el fadeOut inmediatamente
  const startFadeOutNowRef = useRef<(() => void) | null>(null);
  // Ref para almacenar el id de cualquier timeout pendiente (durante los delays)
  const currentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Obtención de información derivada del rol del jugador:
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
   * Efecto: Ejecuta la secuencia de animaciones para mostrar el texto inicial, el rol, el inicio de partida y los botones.
   * También establece el rol del usuario de forma aleatoria.
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
   * Efecto: Activa el temporizador una vez que se muestran los botones de acción.
   */
  useEffect(() => {
    if (mostrarBotones) {
      setTemporizadorActivo(true);
    }
  }, [mostrarBotones]);

  /**
   * Efecto: Alterna el modo día/noche al terminar el ciclo del temporizador.
   * Además, resetea los valores de votación y los estados de voto para permitir una nueva ronda.
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

  // Funciones para el manejo del chat
  const handleAbrirChat = () => {
    setMostrarChat(true);
    abrirChat();
  };

  const handleCerrarChat = () => {
    cerrarChat();
    setMostrarChat(false);
  };

  // Funciones para el manejo del popup de habilidad
  const handleAbrirHabilidad = () => {
    setMostrarHabilidad(true);
    abrirHabilidad();
  };

  const handleCerrarHabilidad = () => {
    cerrarHabilidad();
    setMostrarHabilidad(false);
  };

  // Función para administrar la selección del jugador para la votación.
  const administrarSeleccionJugadorVotacion = (index: number) => {
    // Si es de noche y el usuario no es lobo, no se permite seleccionar jugadores
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

  // Función para votar a un jugador.
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

  // Función para pasar turno.
  const manejarPasarTurno = () => {
    if (votoRealizado || pasoTurno) {
      mostrarError("Has pasado turno");
      return;
    }
    setPasoTurno(true);
    setVotoRealizado(true);
    setJugadorSeleccionado(null);
  };

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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PantallaJugando;
