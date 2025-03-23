/**
 * @file PantallaJugando - Componente principal de la pantalla de juego.
 * @description Maneja la lógica del juego, incluyendo estados, animaciones, temporizador,
 * votaciones, chat y habilidades.
 */
import React, { useState, useEffect } from "react";
import { View, ImageBackground, Text, Image, Animated } from "react-native";
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
   * Activa y abre el chat, mostrando su animación.
   */
  const handleAbrirChat = () => {
    setMostrarChat(true);
    abrirChat();
  };

  /**
   * Cierra el chat y oculta su animación.
   */
  const handleCerrarChat = () => {
    cerrarChat();
    setMostrarChat(false);
  };

  /**
   * Activa y muestra el popup de habilidad, iniciando su animación.
   */
  const handleAbrirHabilidad = () => {
    setMostrarHabilidad(true);
    abrirHabilidad();
  };

  /**
   * Cierra el popup de habilidad y oculta su animación.
   */
  const handleCerrarHabilidad = () => {
    cerrarHabilidad();
    setMostrarHabilidad(false);
  };

  /**
   * Determina si se deben mostrar los botones de acción.
   *
   * @returns {boolean} True si los botones deben ser visibles, basado en el modo de juego y el rol del usuario.
   */
  const mostrarBotonesAccion = () => {
    return !MODO_NOCHE_GLOBAL || rolUsuario === "lobo";
  };

  /**
   * Maneja la selección de un jugador para votación.
   *
   * @param {number} index - Índice del jugador seleccionado.
   */
  const administrarSeleccionJugadorVotacionDiurna = (index: number) => {
    if (votoRealizado) {
      // Si ya se realizó un voto, no permitir seleccionar otro jugador
      mostrarError("Solo puedes votar a un jugador por turno");
      return;
    }
    if (index === indiceUsuario) {
      mostrarError("¡No puedes votarte a ti mismo!");
      return;
    }
    setJugadorSeleccionado(index);
  };

  /**
   * Incrementa el voto para el jugador seleccionado.
   */
  const votarAJugador = () => {
    if (votoRealizado) {
      // Si ya se realizó la votación, no permitir votar de nuevo
      mostrarError("Solo puedes votar a un jugador por turno");
      return;
    }
    if (JugadorSeleccionado === null) {
      console.log("No se ha seleccionado ningún jugador para votar.");
      return;
    }
    /**
     * TODO_API
     * Probablemente habrá que adaptar la lógica de contar los votos para simplemente leerlos del backend
     */
    setVotos((votosAnteriores) => {
      const nuevosVotos = [...votosAnteriores];
      nuevosVotos[JugadorSeleccionado] += 1;
      return nuevosVotos;
    });
    /**
     * TODO_API
     * backend.vota(indiceUsuario.toString(), JugadorSeleccionado.toString())
     */
    console.log(`Votado al jugador ${JugadorSeleccionado + 1}`, votes);
    // Marcar que ya se realizó la votación en este turno para no permitir más votos
    setVotoRealizado(true);
    // No se limpia la selección para mantener el estado visual (borde rojo en el botón de votar)
  };

  /**
   * Efecto: Reinicia el temporizador cuando llega a 0.
   * Se alterna el modo día/noche al terminar cada ciclo.
   * Cuando se pasa de día a noche o de noche a día, reseteamos:
   * - el array de votos (votes),
   * - el estado de votación (votoRealizado),
   * - y la selección de jugador (JugadorSeleccionado) para que el círculo vuelva a su estilo original.
   */
  useEffect(() => {
    if (tiempoRestante === 0) {
      // Alterna el modo de día a noche al terminar el ciclo
      const nuevoModo = !esDeNoche;
      MODO_NOCHE_GLOBAL = nuevoModo;
      setModoDiaNoche(nuevoModo);

      // Reseteamos los votos y el estado de votación
      setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
      setVotoRealizado(false);
      // Quitamos la selección de jugador para que el círculo recupere su color por defecto
      setJugadorSeleccionado(null);

      reiniciarTemporizador();
    }
  }, [tiempoRestante, esDeNoche]);

  /**
   * TODO_API
   * Habrá que hacer que el backend diga cuando cambiar de día a noche y no el timer visual
   */
  // Se comenta el siguiente efecto ya que provoca que al reiniciar el temporizador se cambie erróneamente el modo,
  // haciendo que tras el segundo ciclo nunca se vuelva a ver el modo día (y por ende los botones de acción no se muestren en día).
  // useEffect(() => {
  //   if (tiempoRestante === CONSTANTES.NUMERICAS.TIEMPO_INICIAL) {
  //     const nuevoModo = !esDeNoche;
  //     MODO_NOCHE_GLOBAL = nuevoModo;
  //     setModoDiaNoche(nuevoModo);
  //   }
  // }, [tiempoRestante]);

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
    animacionTexto.fadeIn().start(() => {
      setTimeout(() => {
        animacionTexto.fadeOut().start(() => {
          // Actualizar la bandera global para que no se vuelva a mostar más esta animación durante la partida
          TEXTO_YA_MOSTRADO = true;
          setMostrarTextoInicial(false);
          setMostrarRol(true);
          animacionRol.fadeIn().start(() => {
            setTimeout(() => {
              animacionRol.fadeOut().start(() => {
                setMostrarInicio(true);
                animacionInicio.fadeIn().start(() => {
                  setTimeout(() => {
                    animacionInicio.fadeOut().start(() => {
                      animacionFondo.fadeOut().start(() => {
                        setMostrarBotones(true);
                      });
                    });
                  }, administrador_animaciones.RETRASO_ANIMACION);
                });
              });
            }, administrador_animaciones.RETRASO_ANIMACION);
          });
        });
      }, administrador_animaciones.RETRASO_ANIMACION);
    });
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
    // Contenedor principal de la pantalla de juego
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
            <Text style={estilos.textoRol}>{CONSTANTES.TEXTOS.ROL_TITULO}</Text>
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
          style={[estilos.contenedorTexto, { opacity: animacionInicio.value }]}
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
            mostrarBotonesAccion={mostrarBotonesAccion}
            votoRealizado={votoRealizado} // Pasar el estado para aplicar borde rojo al botón de votar :)
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
            onSelectPlayer={administrarSeleccionJugadorVotacionDiurna}
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
  );
};

export default PantallaJugando;
