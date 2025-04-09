/**
 * @file PantallaJugando.tsx
 * @description Componente principal de la pantalla de juego.
 * Maneja la lógica del juego, incluyendo estados, temporizador, votaciones, chat, habilidades y animaciones.
 * @module PantallaJugando
 */

// React y librerías base
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";

// Carga de fuentes personalizadas
import { useFonts } from "expo-font";

// Navegación y parámetros locales
import { useLocalSearchParams } from "expo-router";

// Conexión vía WebSocket con el servidor del juego, la partida asume que ya está conectado
import socket from "@/app/(sala)/socket";

// Utils (funciones puras, estilos y constantes)
import { getInfoRol } from "../../utils/jugando/rolesUtilidades";
import { estilos } from "../../utils/jugando/jugando.styles";
import { CONSTANTES, Rol } from "../../utils/jugando/constantes";

// Componentes (trozos de UI)
import Chat from "./componentes/Chat";
import HabilidadPopup from "./componentes/HabilidadPopup";
import BarraSuperior from "./componentes/BarraSuperior";
import CirculoVotar from "./componentes/CirculoVotar";
import ControlesAccion from "./componentes/ControlesAccion";
import MensajeError from "./componentes/MensajeError";
import AnimacionInicio1 from "./componentes/Animaciones/AnimacionInicio1";
import AnimacionInicio2 from "./componentes/Animaciones/AnimacionInicio2";
import AnimacionInicio3 from "./componentes/Animaciones/AnimacionInicio3";
import AnimacionGenerica from "./componentes/Animaciones/AnimacionGenerica";

// Hooks (administran estado)
import useTemporizador from "./hooks/useTemporizador";
import useAnimacionChat from "./hooks/useAnimacionChat";
import useAnimacionHabilidad from "./hooks/useAnimacionHabilidad";
import useMensajeError from "./hooks/useMensajeError";
import useDiaNoche from "./hooks/useDiaNoche";
import useGestorAnimaciones from "./hooks/useGestorAnimaciones";

/**
 * @constant {boolean} EFECTO_PANTALLA_OSCURA
 * Indica si el juego está cubierto por un efecto de pantalla oscura transparente.
 + @note Se utiliza tanto para las noches como para las animaciones.
 */
export let EFECTO_PANTALLA_OSCURA = true;

/*
 * Definir el tipo correcto para los mensajes
 *
 * @interface MensajeChat
 * @property {number} id - Identificador único del mensaje.
 * @property {string} texto - Contenido del mensaje.
 */
interface MensajeChat {
  id: number;
  texto: string;
}

/**
 * Componente que representa la pantalla principal de juego.
 *
 * @returns {JSX.Element | null} El componente renderizado o null si las fuentes aún no se han cargado.
 */
const PantallaJugando: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Carga de fuentes
  // ---------------------------------------------------------------------------
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/corben-regular.ttf"),
  });

  const { idSala, salaData, rol, usuarioID } = useLocalSearchParams<{
    idSala: string;
    salaData: string;
    rol: string;
    usuarioID: string;
  }>();
  const sala = JSON.parse(salaData);

  // ---------------------------------------------------------------------------
  // Estados más orientados a la lógica del juego
  // ---------------------------------------------------------------------------

  /**
   * Representa el número de jornada en la que el juego cree que está.
   * Cada jornada se compone por 1 noche y 1 día.
   *
   * @note La jornada 0 representa el día de tiempo libre y votación del alguacil.
   */
  const [jornadaActual, setJornadaActual] = useState<number>(0);

  /**
   * Representa en que etapa cree el juego que está: si es de "Día" o de "Noche".
   *
   * @nota Comienza pensando que es de día, representando el día de la jornada 0.
   */
  const [etapaActual, setEtapaActual] = useState<"Día" | "Noche">("Día");

  /**
   * Lista de mensajes enviados durante la partida.
   */
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);

  /**
   * Estado completo de cada jugador en la sala.
   */
  const [jugadoresEstado, setJugadoresEstado] = useState<
    {
      id: string;
      nombre: string;
      listo: boolean;
      rol: string;
      estaVivo: boolean;
      esAlguacil: boolean;
      haVisto: boolean;
      pocionCuraUsada: boolean;
      pocionMatarUsada: boolean;
    }[]
  >([]);

  /**
   * Índice del usuario local.
   * @type {number}
   */
  const indiceUsuario = jugadoresEstado.findIndex(
    (jugador) => jugador.id === usuarioID
  );

  /**
   * Rol del usuario local.
   * @note Se inicializa a Aldeano, se espera que se inicialice nada más reiniciar el componente.
   * @type {Rol}
   */
  const [rolUsuario, setRolUsuario] = useState<Rol>("Aldeano");

  /**
   * Mensaje informativo recibido del backend relacionado con la elección de alguacil.
   */
  const [mensajeEventoAlguacil, setMensajeEventoAlguacil] =
    useState<string>("");

  /**
   * Mensaje informativo recibido del backend relacionado con las votaciones nocturnas.
   */
  const [mensajeEventoVotacionNocturna, setMensajeEventoVotacionNocturna] =
    useState<string>("");

  /**
   * Mensaje informativo recibido del backend relacionado con las votaciones diurnas.
   */
  const [mensajeEventoVotacionDiurna, setMensajeEventoVotacionDiurna] =
    useState<string>("");

  /**
   * Representa la "fase" en la que cree que el juego cree que está.
   */
  const [backendState, setBackendState] = useState<string>("esperaInicial");

  /**
   * Indica si el usuario ya realizó su voto en una votación diurna.
   * Sirve para no permitirle volver a votar y darle feedback.
   *
   * @type {boolean}
   */
  const [votoRealizado, setVotoRealizado] = useState<boolean>(false);

  /**
   * Indica si el usuario ha pasado su turno.
   * Sirve para no permitirle votar y darle feedback.
   *
   * @type {boolean}
   */
  const [pasoTurno, setPasoTurno] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // Estados más orientados a la Interfaz de Usuario (UI)
  // ---------------------------------------------------------------------------

  /**
   * Controla la visualización de todos los elementos de la partida: barra, botones, timer y jugadores.
   * @type {boolean}
   */
  const [mostrarBotones, setMostrarBotones] = useState<boolean>(false);

  /**
   * Controla la visualización del botón de votar.
   * Solo tiene efecto cuando {@link mostrarBotones} también es true.
   */
  const [mostrarBotonVotar, setMostrarBotonVotar] = useState<boolean>(false);

  /**
   * Controla la visualización del pop-up del chat.
   * @type {boolean}
   */
  const [mostrarChat, setMostrarChat] = useState<boolean>(false);

  /**
   * Controla la visualización del pop-up de habilidad.
   * @type {boolean}
   */
  const [mostrarHabilidad, setMostrarHabilidad] = useState<boolean>(false);

  /**
   * Guarda el índice del jugador seleccionado para votar.
   * @type {number | null}
   */
  const [JugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(
    null
  );

  /**
   * Registra los votos de cada jugador para pasarselos al circulo de jugadores.
   * @warning Actualmente nadie maneja esto, siempre es 0 !!!!!!!!!!!!!!!!!!!!
   * @type {number[]}
   */
  const [votes, setVotos] = useState<number[]>(
    Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0)
  );

  /**
   * Información relacionada con el rol del usuario para mostrarla en componentes.
   */
  const { habilidadInfo, roleInfo } = getInfoRol(rolUsuario);

  // ---------------------------------------------------------------------------
  // Animaciones épicas de la partida
  // ---------------------------------------------------------------------------

  /**
   * Controla si se muestra la primera animación de inicio.
   * @type {boolean}
   */
  const [mostrarAnimacionInicio1, setMostrarAnimacionInicio1] =
    useState<boolean>(true);

  /**
   * Controla si se muestra la segunda animación de inicio.
   * @type {boolean}
   */
  const [mostrarAnimacionInicio2, setMostrarAnimacionInicio2] =
    useState<boolean>(false);

  /**
   * Controla si se muestra la tercera animación de inicio.
   * @type {boolean}
   */
  const [mostrarAnimacionInicio3, setMostrarAnimacionInicio3] =
    useState<boolean>(false);

  /**
   * Duración de la animación de entrada (fade in) en milisegundos de todas las animaciones.
   * @type {number}
   */
  const duracionFadeIn = 1000;

  /**
   * Tiempo de espera entre fases de la animación en milisegundos de todas las animaciones.
   * @type {number}
   */
  const duracionEspera = 2000;

  /**
   * Duración de la animación de salida (fade out) en milisegundos de todas las animaciones.
   * @type {number}
   */
  const duracionFadeOut = 1000;

  /**
   * Valores de opacidad y visibilidad para las 3 animaciones iniciales.
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicio,
    mostrarComponentes: mostrarComponentesInicio,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 3,
    start: true,
  });

  /**
   * Controla si se muestra la animación de votación de alguacil (1ª vez).
   * @type {boolean}
   */
  const [
    mostrarAnimacionInicioVotacionAlguacil,
    setMostrarAnimacionInicioVotacionAlguacil,
  ] = useState(false);

  /**
   * Opacidades y visibilidad para la animación de votación de alguacil (1ª vez).
   */
  const {
    opacities: opacitiesInicioVotacionAlguacil,
    mostrarComponentes: mostrarComponentesInicioVotacionAlguacil,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionInicioVotacionAlguacil,
  });

  /**
   * Controla si se muestra la animación de 2ª votación de alguacil (en caso de empate).
   * @type {boolean}
   */
  const [
    mostrarAnimacionSegundaVotacionAlguacil,
    setMostrarAnimacionSegundaVotacionAlguacil,
  ] = useState(false);

  /**
   * Opacidades y visibilidad para la segunda animación de votación de alguacil.
   */
  const {
    opacities: opacitiesInicioSegundaVotacionAlguacil,
    mostrarComponentes: mostrarComponentesInicioSegundaVotacionAlguacil,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionSegundaVotacionAlguacil,
  });

  /**
   * Controla si se muestra la animación donde la bruja se despierta.
   * @type {boolean}
   */
  const [
    mostrarAnimacionComponentesBrujaSeDespierta,
    setMostrarAnimacionComponentesBrujaSeDespierta,
  ] = useState(false);

  /**
   * Opacidades y visibilidad para la animación de la bruja despertando.
   */
  const {
    opacities: opacitiesBrujaSeDespierta,
    mostrarComponentes: mostrarComponentesBrujaSeDespierta,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionComponentesBrujaSeDespierta,
  });

  /**
   * Controla si se muestra la animación que anuncia los resultados definitivos de las votaciones de alguacil.
   * @type {boolean}
   */
  const [
    mostrarResultadosVotacionAlguacil,
    setMostrarResultadosVotacionAlguacil,
  ] = useState<boolean>(false);

  /**
   * Controla si se muestra la animación que indíca que los jugadores se van a dormir.
   * @type {boolean}
   */
  const [mostrarJugadoresSeDuermen, setMostrarJugadoresSeDuermen] =
    useState<boolean>(false);

  /**
   * Controla si se muestra la animación que anuncia que la vidente se despierta.
   * @type {boolean}
   */
  const [mostrarVidenteSeDespierta, setMostrarVidenteSeDespierta] =
    useState<boolean>(false);

  /**
   * Opacidades y visibilidad para la secuencia animada de la votación del alguacil,
   * noche, y turno de la vidente.
   */
  const {
    opacities: opacidadesVidenteYNoche,
    mostrarComponentes: mostrarComponentesVidenteYNoche,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 3,
    start: mostrarResultadosVotacionAlguacil,
  });

  /**
   * Controla si se muestra la animación donde la vidente se duerme junto con la de los lobos despierta.
   * @type {boolean}
   */
  const [mostrarAnimacionVidenteSeDuerme, setMostrarAnimacionVidenteSeDuerme] =
    useState<boolean>(false);

  /**
   * Controla si se muestra la animación donde los lobos despiertan.
   * @warning No incluye la animación de que la vidente se duerme.
   * @type {boolean}
   */
  const [
    mostrarAnimacionLobosSeDespiertan,
    setMostrarAnimacionLobosSeDespiertan,
  ] = useState<boolean>(false);

  /**
   * Opacidades y visibilidad para la secuencia: la vidente se duerme → los lobos se despiertan.
   */
  const {
    opacities: opacitiesVidenteSeDuermeLobosSeDespiertan,
    mostrarComponentes: mostrarComponentesVidenteSeDuermeLobosSeDespiertan,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 2,
    start: mostrarAnimacionVidenteSeDuerme || mostrarAnimacionLobosSeDespiertan,
  });

  // ---------------------------------------------------------------------------
  // Hooks exportados de los componentes de la UI para manejarlos
  // ---------------------------------------------------------------------------

  /**
   * Hook que administra la animación de transición día/noche en pantalla.
   * Devuelve un valor animado de opacidad y una función para cambiar el modo.
   *
   * @returns {{
   *   animacionFondo: Animated.Value,
   *   setModoDiaNoche: (modoNoche: boolean) => void
   * }}
   */
  const { animacionFondo, setModoDiaNoche } = useDiaNoche(
    EFECTO_PANTALLA_OSCURA
  );

  /**
   * Hook que administra el temporizador del juego.
   * Controla el tiempo restante, permite reiniciar y activar/desactivar el temporizador.
   *
   * @returns {{
   *   tiempoRestante: number,
   *   reiniciarTemporizador: () => void,
   *   setTemporizadorActivo: (activo: boolean) => void,
   *   actualizarMaxTiempo: (nuevoTiempo: number) => void
   * }}
   */
  const {
    tiempoRestante,
    reiniciarTemporizador,
    setTemporizadorActivo,
    actualizarMaxTiempo,
  } = useTemporizador(15, false);

  /**
   * Hook que administra la animación del chat.
   * Controla su posición animada y permite abrir/cerrar el panel del chat.
   *
   * @returns {{
   *   posicionChat: Animated.ValueXY,
   *   abrirChat: () => void,
   *   cerrarChat: () => void
   * }}
   */
  const { posicionChat, abrirChat, cerrarChat } = useAnimacionChat();

  /**
   * Hook que administra la animación de la ventana de habilidad.
   * Similar al del chat, pero para el popup de habilidades.
   *
   * @returns {{
   *   posicionHabilidad: Animated.ValueXY,
   *   abrirHabilidad: () => void,
   *   cerrarHabilidad: () => void
   * }}
   */
  const { posicionHabilidad, abrirHabilidad, cerrarHabilidad } =
    useAnimacionHabilidad();

  /**
   * Hook que administra los mensajes de error en pantalla.
   * Proporciona el mensaje actual, una función para mostrar errores,
   * y el valor de animación asociado al mensaje.
   *
   * @returns {{
   *   errorMessage: string,
   *   mostrarError: (mensaje: string) => void,
   *   animacionError: Animated.Value
   * }}
   */
  const { errorMessage, mostrarError, animacionError } = useMensajeError();

  // ---------------------------------------------------------------------------
  // Logs custom
  // ---------------------------------------------------------------------------

  /**
   * Lista de códigos ANSI para colorear el texto en consola.
   * Cada color se asigna a un jugador usando un hash para mantener consistencia visual.
   *
   * @type {string[]}
   */
  const coloresDisponibles = [
    "\x1b[31m", // Rojo
    "\x1b[32m", // Verde
    "\x1b[33m", // Amarillo
    "\x1b[34m", // Azul
    "\x1b[35m", // Magenta
    "\x1b[36m", // Cyan
  ];

  /**
   * Color por defecto (blanco) usado cuando no se puede determinar el jugador.
   *
   * @type {string}
   */
  const colorJugadorDesconocido = "\x1b[37m";

  /**
   * Genera un hash numérico determinista basado en un string
   * (hecho a medida para que el string sea el ID del jugador).
   * Esto permite asignar colores consistentes y únicos a cada jugador.
   *
   * @param {string} str - Cadena que será transformada en un número hash.
   * @returns {number} Número hash generado a partir de la cadena.
   */
  function hashStringToInt(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
  }

  /**
   * Imprime logs personalizados en consola, con colores únicos por jugador y formato claro.
   * Asigna el color de cada jugador en base a un hash generado a partir de su ID, garantizando
   * consistencia durante la partida.
   *
   * @param {number} jornadaActual - Número actual de la jornada del juego.
   * @param {"Día" | "Noche"} etapaActual - Indica si es día o noche en el juego.
   * @param {string} message - Mensaje específico a mostrar en el log.
   * @param {object} [jugador] - Información del jugador (ID y nombre).
   * @param {string} jugador.id - Identificador único del jugador.
   * @param {string} jugador.nombre - Nombre del jugador.
   */
  function logCustom(
    jornadaActual: number,
    etapaActual: "Día" | "Noche",
    message: string,
    jugador?: { id: string; nombre: string }
  ) {
    const obtenerColorJugador = (id: string | undefined): string => {
      if (!id) return colorJugadorDesconocido;
      const colorIndex = hashStringToInt(id) % coloresDisponibles.length;
      return coloresDisponibles[colorIndex];
    };

    const color = obtenerColorJugador(jugador?.id);
    const infoJugador = jugador
      ? `Jugador: ${jugador.nombre} (ID: ${jugador.id})`
      : "->";

    const etapaParaMostrar = jornadaActual === 0 ? "Día" : etapaActual;

    console.log(
      `${color}[Jornada ${jornadaActual} - ${etapaParaMostrar}] ${infoJugador} - ${message}\x1b[0m`
    );
  }

  // ---------------------------------------------------------------------------
  // Efectos de inicialización
  // ---------------------------------------------------------------------------

  /**
   * Conecta la partida a los sockets y escucha eventos clave como "enPartida" y "actualizarSala".
   *
   * @warning console.logs comentados porque petan la consola
   */
  useEffect(() => {
    socket.on("enPartida", (data) => {
      // console.log("Evento enPartida recibido");
      // console.log("Jugadores recibidos enPartida (raw):", data.sala.jugadores);

      // Versión legible en JSON del estado
      /*
      console.log(
        "Jugadores enPartida (stringify):",
        JSON.stringify(data.sala.jugadores, null, 2)
      );
      */

      setJugadoresEstado(data.sala.jugadores);
    });

    socket.on("actualizarSala", (data) => {
      // console.log("Evento actualizarSala recibido:", data);

      // Si ya estamos en partida, ignorar actualizaciones con jugadores vacíos
      if (
        data.enPartida &&
        (!Array.isArray(data.jugadores) || data.jugadores.length === 0)
      ) {
        /*
        console.log(
          "Ignorando actualizarSala (jugadores vacíos o ya en partida):",
          data.jugadores
        );
        */
        return;
      }

      // console.log("Actualizando jugadoresEstado con:", data.jugadores);
      setJugadoresEstado(data.jugadores);
    });

    return () => {
      socket.off("enPartida");
      socket.off("actualizarSala");
    };
  }, []);

  /**
   * Efecto de inicialización que se ejecuta una única vez al montar el componente.
   *
   * - Asigna el rol recibido por parámetros al jugador local.
   * - Muestra secuencialmente las animaciones de introducción.
   * - Una vez finalizadas, se activan los botones y el temporizador.
   *
   * @warning console.logs comentados porque petan la consola
   */
  useEffect(() => {
    // console.log("Valor de rol:", rol);
    setRolUsuario(rol as Rol);
    // console.log("Sala en juego:", sala);

    setTimeout(() => {
      setMostrarAnimacionInicio1(false);
      setMostrarAnimacionInicio2(true);

      setTimeout(() => {
        setMostrarAnimacionInicio2(false);
        setMostrarAnimacionInicio3(true);

        setTimeout(() => {
          setMostrarAnimacionInicio3(false);
          setMostrarBotones(true);

          EFECTO_PANTALLA_OSCURA = false;
          setModoDiaNoche(EFECTO_PANTALLA_OSCURA);
          reiniciarTemporizador();
        }, 4000);
      }, 4000);
    }, 4000);
  }, []);

  // Posiblemente útil para debug
  /*
  console.log(
        "[Render] Estado de jugadoresEstado antes de renderizar:",
        jugadoresEstado
      );
  */

  /**
   * Efecto que activa el temporizador al montar el componente.
   * Es para poder retrasar su activación hasta después de las animaciones
   */
  useEffect(() => {
    setTemporizadorActivo(true);
  }, []);

  // ---------------------------------------------------------------------------
  // Efectos periódicos de la UI
  // ---------------------------------------------------------------------------

  /**
   * Efecto que avisa cuando el temporizador llega a 0.
   */
  useEffect(() => {
    if (tiempoRestante === 0) {
      logCustom(
        jornadaActual,
        etapaActual,
        "El timer ha llegado a 0",
        jugadoresEstado[indiceUsuario]
      );
    }
  }, [tiempoRestante]);

  // ---------------------------------------------------------------------------
  // Efectos de los pop-ups de la UI :)
  // ---------------------------------------------------------------------------

  /**
   * Abre el chat y activa la animación correspondiente.
   *
   * @returns {void}
   */
  const handleAbrirChat = (): void => {
    if (etapaActual === "Noche" && rolUsuario !== "Hombre lobo") {
      logCustom(
        jornadaActual,
        etapaActual,
        `Error: intentar abrir chat por la noche sin ser hombre lobo, el usuario es ${rolUsuario}`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("Solo los lobos pueden usar el chat durante la noche.");
      return;
    } else {
      logCustom(
        jornadaActual,
        etapaActual,
        `Chat abierto`,
        jugadoresEstado[indiceUsuario]
      );
    }
    setMostrarChat(true);
    abrirChat();
  };

  /**
   * Cierra el chat y desactiva la animación correspondiente.
   *
   * @returns {void}
   */
  const handleCerrarChat = (): void => {
    logCustom(
      jornadaActual,
      etapaActual,
      `Chat cerrado`,
      jugadoresEstado[indiceUsuario]
    );
    cerrarChat();
    setMostrarChat(false);
  };

  /**
   * Abre la ventana de habilidad y activa la animación correspondiente.
   *
   * @returns {void}
   */
  const handleAbrirHabilidad = (): void => {
    logCustom(
      jornadaActual,
      etapaActual,
      `Ventana de habilidad abierta`,
      jugadoresEstado[indiceUsuario]
    );
    setMostrarHabilidad(true);
    abrirHabilidad();
  };

  /**
   * Cierra la ventana de habilidad y desactiva la animación correspondiente.
   *
   * @returns {void}
   */
  const handleCerrarHabilidad = (): void => {
    logCustom(
      jornadaActual,
      etapaActual,
      `Ventana de habilidad cerrada`,
      jugadoresEstado[indiceUsuario]
    );
    cerrarHabilidad();
    setMostrarHabilidad(false);
  };

  // ---------------------------------------------------------------------------
  // Control de la conexión de la partida
  // ---------------------------------------------------------------------------

  /**
   * Avisa si se actualiza el estado de cualquier jugador
   * @warning console.logs comentados porque petan la consola
   */
  useEffect(() => {
    /*console.log(
              "[Effect] jugadoresEstado actualizado (stringify):",
              JSON.stringify(jugadoresEstado, null, 2)
            );*/
  }, [jugadoresEstado]);

  /**
   * Efecto que se ejecuta cuando cambia el ID de la sala (`idSala`).
   *
   * - Solicita al backend el estado actual de la partida mediante el evento `obtenerEstadoPartida`.
   * - Al recibir la respuesta por `estadoPartida`, actualiza el estado local de `jugadoresEstado`.
   * - El listener se limpia al desmontar el componente o cuando `idSala` cambia.
   */
  useEffect(() => {
    if (!idSala) return;

    // Emitir evento al backend para solicitar el estado actual de la partida
    socket.emit("obtenerEstadoPartida", { idPartida: idSala });
    console.log("[PantallaJugando] → Emitiendo obtenerEstadoPartida", idSala);

    // Escuchar la respuesta del backend con los datos de la sala
    socket.on("estadoPartida", (data) => {
      console.log("→ Respuesta estadoPartida:", data);

      if (data.error) {
        console.log("Error al obtener estado de la partida:", data.error);
        return;
      }

      setJugadoresEstado(data.jugadores);
    });

    // Limpiar el listener al desmontar
    return () => {
      socket.off("estadoPartida");
    };
  }, [idSala]);

  // ---------------------------------------------------------------------------
  // Conexión del chat con el backend
  // ---------------------------------------------------------------------------

  /**
   * Texto
   *
   */
  socket.on("mensajeChat", (data) => {
    console.log("LLega el mensaje a Frontend", data);

    // Crear un nuevo objeto mensaje asegurando que tenga la estructura correcta
    const nuevoMensaje: MensajeChat = {
      id: mensajes.length + 1, // Asignar un ID incremental
      texto: data.chat,
    };

    // Agregar el nuevo mensaje a la lista
    setMensajes((prevMensajes) => [...prevMensajes, nuevoMensaje]);
  });

  // ---------------------------------------------------------------------------
  // Fases de la partida según dicta el backend
  // ---------------------------------------------------------------------------

  /**
   * Efecto que administra las fases del juego según los eventos del backend.
   * Maneja que ve el usuario en la UI: animaciones, botones, timer, ...
   *
   * Fases incluídas:
   * - esperaInicial: Maneja la espera inicial.
   * - iniciarVotacionAlguacil: Inicia la votación del alguacil.
   * - nocheComienza: Inicia la etapa de noche.
   * - habilidadVidente: Activa la habilidad del vidente (si hay uno vivo).
   * - turnoHombresLobos: Gestiona la acción de los hombres lobo.
   * - habilidadBruja: Activa la habilidad de la bruja (si está viva).
   * - diaComienza: Maneja el comienzo del día.
   */
  useEffect(() => {
    /**
     * Manejador del evento "esperaInicial".
     * Registra la espera inicial y actualiza el estado del backend a "diaComienza".
     *
     * @param {any} datos - Datos recibidos del evento.
     */
    const manejarEsperaInicial = (datos: any) => {
      setBackendState("diaComienza");

      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: esperaInicial - ${JSON.stringify(datos)}`,
        jugadoresEstado[indiceUsuario]
      );
    };

    /**
     * Manejador del evento "iniciarVotacionAlguacil".
     * Inicia la votación del alguacil en la primera jornada, actualizando el temporizador,
     * mostrando o ocultando animaciones y botones, y reiniciando estados relacionados con la votación.
     *
     * @param {any} datos - Datos recibidos por el socket.
     */
    const manejarIniciarVotacionAlguacil = (datos: any) => {
      setBackendState("iniciarVotacionAlguacil");

      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: iniciarVotacionAlguacil - ${JSON.stringify(datos)}`,
        jugadoresEstado[indiceUsuario]
      );

      // El timer visua de las votaciones del alguacil será de 25 segundos tras su reinicio
      actualizarMaxTiempo(25);

      // Animación épica
      EFECTO_PANTALLA_OSCURA = true;
      setModoDiaNoche(EFECTO_PANTALLA_OSCURA);
      setMostrarBotones(false);
      setMostrarAnimacionInicioVotacionAlguacil(true);
      setTimeout(() => {
        setMostrarAnimacionInicioVotacionAlguacil(false);
        setMostrarBotonVotar(true);
        setMostrarBotones(true);
        EFECTO_PANTALLA_OSCURA = false;
        setModoDiaNoche(EFECTO_PANTALLA_OSCURA);

        reiniciarTemporizador(); // 25 segundos tras el final de la animación épica

        setJornadaActual(1);

        // Reiniciar efectios visuales de cualquier votación previa
        // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
      }, 4000); // 1 animación de 4000 ms
    };

    /**
     * Manejador del evento "nocheComienza".
     * Inicia la etapa de "Noche": actualiza los estados de la interfaz, el temporizador y
     * registra los cambios de etapa.
     *
     * @param {any} datos - Datos recibidos del evento.
     */
    const manejarNocheComienza = (datos: any) => {
      setBackendState("nocheComienza");

      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: nocheComienza - ${JSON.stringify(datos)}`,
        jugadoresEstado[indiceUsuario]
      );

      // Animación épica
      EFECTO_PANTALLA_OSCURA = true;
      setModoDiaNoche(EFECTO_PANTALLA_OSCURA);

      setEtapaActual("Noche");
      setJornadaActual(jornadaActual + 1); // Las jornadas empiezan por la noche

      if (!votoRealizado) {
        logCustom(
          jornadaActual,
          etapaActual,
          "El jugador no ha votado en esta etapa",
          jugadoresEstado[indiceUsuario]
        );
      }

      // Reiniciar efectios visuales de cualquier votación previa
      // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
      setVotoRealizado(false);
      setPasoTurno(false);
      setJugadorSeleccionado(null);
    };

    /**
     * Manejador del evento "habilidadVidente".
     * Activa la habilidad del vidente si hay algún vidente vivo, de lo contrario lo omite.
     * Actualiza la visibilidad de los botones y reinicia estados relacionados.
     *
     * @param {any} datos - Datos recibidos del evento.
     */
    const manejarHabilidadVidente = (datos: any) => {
      setBackendState("habilidadVidente");

      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: habilidadVidente - ${JSON.stringify(datos)}`,
        jugadoresEstado[indiceUsuario]
      );

      if (!hayVidenteViva) {
        logCustom(
          jornadaActual,
          etapaActual,
          "No hay vidente vivo, se omite la habilidad de vidente.",
          jugadoresEstado[indiceUsuario]
        );
        return;
      }

      // El timer visual para el vidente será de 15 segundos tras su reinicio
      actualizarMaxTiempo(15);

      if (hayVidenteViva) {
        logCustom(
          jornadaActual,
          etapaActual,
          "Hay al menos un vidente vivo.",
          jugadoresEstado[indiceUsuario]
        );

        // Animación épica
        // (animaciones separadas porque no siempre se concatenan las 3, ver el siguiente else)
        setMostrarBotones(false);
        setMostrarResultadosVotacionAlguacil(true);
        setTimeout(() => {
          setMostrarResultadosVotacionAlguacil(false);
          setMostrarJugadoresSeDuermen(true);
          setTimeout(() => {
            setMostrarJugadoresSeDuermen(false);
            setMostrarVidenteSeDespierta(true);
            setTimeout(() => {
              setMostrarVidenteSeDespierta(false);
              setMostrarBotonVotar(rolUsuario === "Vidente" ? true : false); // Solo se muestra el botón "votar" para la vidente
              setMostrarBotones(true);

              reiniciarTemporizador();

              // Reiniciar efectos visuales de cualquier votación previa
              // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
              setVotoRealizado(false);
              setPasoTurno(false);
              setJugadorSeleccionado(null);
            }, 4000); // 3ª animación de 4000 ms
          }, 4000); // 2ª animación de 4000 ms
        }, 4000); // 1ª animación de 4000 ms
      } else {
        logCustom(
          jornadaActual,
          etapaActual,
          "No hay vidente vivo, se omite la habilidad de vidente.",
          jugadoresEstado[indiceUsuario]
        );

        // Animación épica
        setMostrarBotones(false);
        setMostrarResultadosVotacionAlguacil(true);
        setTimeout(() => {
          setMostrarResultadosVotacionAlguacil(false);
          setMostrarJugadoresSeDuermen(true);
          setTimeout(() => {
            setMostrarJugadoresSeDuermen(false);
            setMostrarBotonVotar(false);
            setMostrarBotones(true);

            reiniciarTemporizador();

            // Reiniciar efectos visuales de cualquier votación previa
            // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
            setVotoRealizado(false);
            setPasoTurno(false);
            setJugadorSeleccionado(null);
          }, 4000); // 2ª animación de 4000 ms
        }, 4000); // 1ª animación de 4000 ms
      }
    };

    /**
     * Manejador del evento "turnoHombresLobos".
     * Gestiona el turno de acción de los hombres lobo, alternando animaciones y estados según
     * si hay un vidente vivo o no. Reinicia el temporizador y estados al finalizar el turno.
     *
     * @param {any} datos - Datos recibidos del evento.
     */
    const manejarTurnoHombresLobos = (datos: any) => {
      setBackendState("turnoHombresLobos");

      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: turnoHombresLobos - ${JSON.stringify(datos)}`,
        jugadoresEstado[indiceUsuario]
      );

      // El timer visual para los lobos será de 30 segundos tras su reinicio
      actualizarMaxTiempo(30);

      if (hayVidenteViva) {
        logCustom(
          jornadaActual,
          etapaActual,
          "Hay al menos un vidente vivo..",
          jugadoresEstado[indiceUsuario]
        );

        // Animación épica si hay una vidente viva
        // (animaciones separadas porque no siempre se concatenan las 2, ver el siguiente else)
        setMostrarBotones(false);
        setMostrarAnimacionVidenteSeDuerme(true);
        setTimeout(() => {
          setMostrarAnimacionVidenteSeDuerme(false);
          setMostrarAnimacionLobosSeDespiertan(true);
          setTimeout(() => {
            setMostrarAnimacionLobosSeDespiertan(false);
            setMostrarBotonVotar(true);
            setMostrarBotones(true);

            reiniciarTemporizador();

            // Reiniciar efectios visuales de cualquier votación previa
            // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
            setVotoRealizado(false);
            setPasoTurno(false);
            setJugadorSeleccionado(null);
          }, 4000); // 2ª animación de 4000 ms
        }, 4000); // 1ª animación de 4000 ms
      } else {
        logCustom(
          jornadaActual,
          etapaActual,
          "No hay vidente vivo.",
          jugadoresEstado[indiceUsuario]
        );

        // Animación épica si no hay una vidente viva
        setMostrarBotones(false);
        setMostrarAnimacionLobosSeDespiertan(true);
        setTimeout(() => {
          setMostrarAnimacionLobosSeDespiertan(false);
          setMostrarBotonVotar(true);
          setMostrarBotones(true);

          reiniciarTemporizador();

          // Reiniciar efectios visuales de cualquier votación previa
          // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
          setVotoRealizado(false);
          setPasoTurno(false);
          setJugadorSeleccionado(null);
        }, 4000); // 1 animación de 4000 ms
      }

      // Reiniciar efectios visuales de cualquier votación previa
      // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
      setVotoRealizado(false);
      setPasoTurno(false);
      setJugadorSeleccionado(null);
    };

    /**
     * Manejador del evento "habilidadBruja".
     * Activa la habilidad de la bruja si hay una bruja viva; de lo contrario, lo omite.
     * Actualiza el modo día/noche, la visibilidad de botones y reinicia el temporizador y otros estados.
     *
     * @param {any} datos - Datos recibidos del evento.
     */
    const manejarHabilidadBruja = (datos: any) => {
      setBackendState("habilidadBruja");

      if (!hayBrujaViva) {
        logCustom(
          jornadaActual,
          etapaActual,
          "No hay bruja viva, se omite la habilidad de bruja.",
          jugadoresEstado[indiceUsuario]
        );
        return;
      }

      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: habilidadBruja - ${JSON.stringify(datos)}`,
        jugadoresEstado[indiceUsuario]
      );

      // El timer visual para la bruja será de 15 segundos tras su reinicio
      actualizarMaxTiempo(15);

      // Animación épica
      EFECTO_PANTALLA_OSCURA = true;
      setModoDiaNoche(EFECTO_PANTALLA_OSCURA);
      setMostrarBotones(false);
      setMostrarAnimacionComponentesBrujaSeDespierta(true);
      setTimeout(() => {
        setMostrarAnimacionComponentesBrujaSeDespierta(false);
        setMostrarBotonVotar(rolUsuario === "Bruja" ? true : false); // Solo dejarle "votar" a la bruja
        setMostrarBotones(true);

        reiniciarTemporizador();

        // Reiniciar efectios visuales de cualquier votación previa
        // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
      }, 4000); // 1 animación de 4000 ms
    };

    /**
     * Manejador del evento "diaComienza".
     * Actualiza el estado del backend a "diaComienza" e imprime el log correspondiente.
     *
     * @param {any} datos - Datos recibidos del evento.
     */
    const manejarDiaComienza = (datos: any) => {
      setBackendState("diaComienza");

      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: diaComienza - ${JSON.stringify(datos)}`,
        jugadoresEstado[indiceUsuario]
      );

      // El timer visual para los días será de 60 segundos tras su reinicio
      actualizarMaxTiempo(60);

      // Animación épica
      EFECTO_PANTALLA_OSCURA = false;
      setModoDiaNoche(EFECTO_PANTALLA_OSCURA);

      setMostrarBotonVotar(true);
      setMostrarBotones(true);

      reiniciarTemporizador();

      // Reiniciar efectios visuales de cualquier votación previa
      // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
      setVotoRealizado(false);
      setPasoTurno(false);
      setJugadorSeleccionado(null);
    };

    // Registro de eventos con sus respectivos manejadores
    socket.on("iniciarVotacionAlguacil", manejarIniciarVotacionAlguacil);
    socket.on("esperaInicial", manejarEsperaInicial);
    socket.on("nocheComienza", manejarNocheComienza);
    socket.on("habilidadVidente", manejarHabilidadVidente);
    socket.on("turnoHombresLobos", manejarTurnoHombresLobos);
    socket.on("habilidadBruja", manejarHabilidadBruja);
    socket.on("diaComienza", manejarDiaComienza);

    // Limpieza: remueve los listeners al desmontar el componente
    return () => {
      socket.off("iniciarVotacionAlguacil", manejarIniciarVotacionAlguacil);
      socket.off("esperaInicial", manejarEsperaInicial);
      socket.off("nocheComienza", manejarNocheComienza);
      socket.off("habilidadVidente", manejarHabilidadVidente);
      socket.off("turnoHombresLobos", manejarTurnoHombresLobos);
      socket.off("habilidadBruja", manejarHabilidadBruja);
      socket.off("diaComienza", manejarDiaComienza);
    };
  }, [
    jornadaActual,
    etapaActual,
    jugadoresEstado,
    indiceUsuario,
    setModoDiaNoche,
    setMostrarBotones,
    setMostrarAnimacionInicioVotacionAlguacil,
    setMostrarBotonVotar,
    setJornadaActual,
    setVotos,
    setVotoRealizado,
    setPasoTurno,
    setJugadorSeleccionado,
  ]);

  // ---------------------------------------------------------------------------
  // Administración de recibir eventos de la votación del algaucil
  // ---------------------------------------------------------------------------

  /**
   * Efecto que administra el recibimiento de los eventos relacionados con la votación del alguacil.
   *
   * Se controlan los siguientes eventos:
   * - "votoAlguacilRegistrado": Se registra el voto exitosamente y se actualizan los jugadores.
   * - "empateVotacionAlguacil": Se produce un primer empate, se repite la votación.
   * - "segundoEmpateVotacionAlguacil": Se produce un segundo empate y no se elige alguacil.
   * - "alguacilElegido": Se elige a un jugador como alguacil y se actualiza el estado.
   */
  useEffect(() => {
    // Evento: Voto de alguacil registrado
    socket.on("votoAlguacilRegistrado", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento votoAlguacilRegistrado recibido: ${JSON.stringify(data)}`
      );
      if (data.estado && data.estado.jugadores) {
        setJugadoresEstado(data.estado.jugadores);
      }
    });

    // Evento: Primer empate en la votación del alguacil
    socket.on("empateVotacionAlguacil", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento empateVotacionAlguacil recibido: ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );

      // Animación épica
      EFECTO_PANTALLA_OSCURA = true;
      setModoDiaNoche(EFECTO_PANTALLA_OSCURA);
      setMostrarBotones(false);
      setMostrarAnimacionSegundaVotacionAlguacil(true);
      setTimeout(() => {
        setMostrarAnimacionSegundaVotacionAlguacil(false);
        setMostrarBotonVotar(true);
        setMostrarBotones(true);
        EFECTO_PANTALLA_OSCURA = false;
        setModoDiaNoche(EFECTO_PANTALLA_OSCURA);

        reiniciarTemporizador();

        // Reiniciar efectios visuales de cualquier votación previa
        // setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
      }, 4000); // 1 animación de 4000 ms

      setMensajeEventoAlguacil(data.mensaje);
    });

    // Evento: Segundo empate, sin elección de alguacil
    socket.on("segundoEmpateVotacionAlguacil", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento segundoEmpateVotacionAlguacil recibido: ${JSON.stringify(
          data
        )}`,
        jugadoresEstado[indiceUsuario]
      );
      setMensajeEventoAlguacil(data.mensaje);
    });

    // Evento: Alguacil elegido
    socket.on("alguacilElegido", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento alguacilElegido recibido: ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      setMensajeEventoAlguacil(data.mensaje);

      // Actualizar la información de qué jugadore es alguacil
      if (data.alguacil) {
        setJugadoresEstado((prevJugadores) =>
          prevJugadores.map((jugador) =>
            jugador.id === data.alguacil
              ? { ...jugador, esAlguacil: true }
              : jugador
          )
        );
      }
    });

    return () => {
      socket.off("votoAlguacilRegistrado");
      socket.off("empateVotacionAlguacil");
      socket.off("segundoEmpateVotacionAlguacil");
      socket.off("alguacilElegido");
    };
  }, [jugadoresEstado, indiceUsuario, jornadaActual, etapaActual]);

  // ---------------------------------------------------------------------------
  // Administración de recibir eventos de las votaciones nocturnas y diurnas
  // ---------------------------------------------------------------------------

  /**
   * Efecto que administra el recibimiento de los eventos relacionados con las votaciones nocturnas y diurnas.
   *
   * Se controlan los siguientes eventos:
   * - "votoRegistrado": Se actualiza el estado de los jugadores tras el registro de cada voto.
   * - "resultadoVotosNoche": Se recibe el resultado final de la votación nocturna de los hombres lobo.
   * - "empateVotacionDia": Se produce un primer empate en la votación diurna.
   * - "segundoEmpateVotacionDia": Se produce un segundo empate en la votación diurna, quedando sin eliminar a nadie.
   * - "resultadoVotosDia": Se recibe el resultado final de la votación diurna.
   */
  useEffect(() => {
    // Evento: Voto registrado (se emite tanto para turno diurno como nocturno)
    socket.on("votoRegistrado", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento votoRegistrado recibido: ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.estado && data.estado.jugadores) {
        setJugadoresEstado(data.estado.jugadores);
      }
    });

    // Evento: Resultado de la votación nocturna
    socket.on("resultadoVotosNoche", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento resultadoVotosNoche recibido: ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.estado && data.estado.jugadores) {
        setJugadoresEstado(data.estado.jugadores);
      }
      if (data.mensaje) {
        setMensajeEventoVotacionNocturna(data.mensaje);
      }
    });

    // Evento: Primer empate en la votación diurna
    socket.on("empateVotacionDia", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento empateVotacionDia recibido: ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      setMensajeEventoVotacionDiurna(data.mensaje);
      // TODO ANIMACION EMPATE DIURNO 2
    });

    // Evento: Segundo empate en la votación diurna
    socket.on("segundoEmpateVotacionDia", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento segundoEmpateVotacionDia recibido: ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      setMensajeEventoVotacionDiurna(data.mensaje);
      // TODO ANIMACION EMPATE DIURNO 2
    });

    // Evento: Resultado final de la votación diurna
    socket.on("resultadoVotosDia", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento resultadoVotosDia recibido: ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.estado && data.estado.jugadores) {
        setJugadoresEstado(data.estado.jugadores);
      }
      if (data.mensaje) {
        setMensajeEventoVotacionDiurna(data.mensaje);
      }
    });

    return () => {
      socket.off("votoRegistrado");
      socket.off("resultadoVotosNoche");
      socket.off("empateVotacionDia");
      socket.off("segundoEmpateVotacionDia");
      socket.off("resultadoVotosDia");
    };
  }, [jugadoresEstado, indiceUsuario, jornadaActual, etapaActual]);

  // ---------------------------------------------------------------------------
  // Memos para calcular en demanda valores importantes
  // ---------------------------------------------------------------------------

  /**
   * Calcula y devuelve la cantidad de jugadores vivos que no pertenecen al rol "Hombre lobo".
   * Se recalcula automáticamente cuando cambia el estado de los jugadores.
   * @returns La cantidad de jugadores vivos que no son "Hombre lobo".
   */
  const vivos = useMemo<number>(() => {
    return jugadoresEstado.filter((j) => j.estaVivo && j.rol !== "Hombre lobo")
      .length;
  }, [jugadoresEstado]);

  /**
   * Calcula y devuelve la cantidad de jugadores vivos que tienen el rol "Hombre lobo".
   * Se recalcula automáticamente cuando cambia el estado de los jugadores.
   * @returns La cantidad de jugadores vivos que son "Hombre lobo".
   */
  const lobosVivos = useMemo<number>(() => {
    return jugadoresEstado.filter((j) => j.estaVivo && j.rol === "Hombre lobo")
      .length;
  }, [jugadoresEstado]);

  /**
   * Verifica si existe al menos un jugador con el rol "Vidente" que se encuentre vivo.
   * Se recalcula automáticamente cuando cambia el estado de los jugadores.
   * @returns `true` si existe al menos un jugador del rol "Vidente" que esté vivo; de lo contrario, `false`.
   */
  const hayVidenteViva = useMemo<boolean>(() => {
    return jugadoresEstado.some(
      (jugador) => jugador.rol === "Vidente" && jugador.estaVivo
    );
  }, [jugadoresEstado]);

  /**
   * Verifica si existe al menos un jugador con el rol "Bruja" que se encuentre vivo.
   * Se recalcula automáticamente cuando cambia el estado de los jugadores.
   * @returns `true` si existe al menos un jugador del rol "Bruja" que esté vivo; de lo contrario, `false`.
   */
  const hayBrujaViva = useMemo<boolean>(() => {
    return jugadoresEstado.some(
      (jugador) => jugador.rol === "Bruja" && jugador.estaVivo
    );
  }, [jugadoresEstado]);

  // ---------------------------------------------------------------------------
  // Hooks para realizar las votaciones
  // (seleccionar jugadores + botón votar + botón pasar turno)
  // ---------------------------------------------------------------------------

  /**
   * Administra la selección de un jugador para la votación.
   *
   * @param {number} index - Índice del jugador seleccionado.
   * @returns {void}
   */
  const administrarSeleccionJugadorVotacion = (index: number): void => {
    // Solo los lobos pueden seleccionar jugadores durante la noche
    if (!mostrarBotonVotar) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: No hay nada que votar`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("No hay nada que votar aún :)");
      return;
    }
    if (rolUsuario !== "Hombre lobo" && EFECTO_PANTALLA_OSCURA) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Es de noche y no es lobo`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError(
        "Solo los lobos pueden seleccionar jugadores durante la noche"
      );
      return;
    }
    if (pasoTurno) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Turno ya pasado`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("Has pasado turno");
      return;
    }
    if (votoRealizado) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Voto ya realizado`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("Solo puedes votar a un jugador por turno");
      return;
    }
    if (index === indiceUsuario) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección fallido: Voto propio`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("¡No puedes votarte a ti mismo!");
      return;
    }
    logCustom(
      jornadaActual,
      etapaActual,
      `Jugador ${index + 1} seleccionado para votación`,
      jugadoresEstado[indiceUsuario]
    );
    setJugadorSeleccionado(index);
  };

  /**
   * Ejecuta la acción de votar al jugador seleccionado.
   *
   * @returns {void}
   */
  const votarAJugador = (): void => {
    if (pasoTurno) {
      mostrarError("Has pasado turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de voto fallido: Turno pasado`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }
    if (votoRealizado) {
      mostrarError("Solo puedes votar a un jugador por turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de voto fallido: Voto ya realizado`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }
    if (JugadorSeleccionado === null) {
      mostrarError("Tienes que seleccionar a un jugador para votarle");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de voto fallido: Ningún jugador seleccionado`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }

    // Obtener jugador seleccionado y abortar si no hay ninguno
    // (aunque no debería no existir llegados a este punto)
    const jugadorObjetivo = jugadoresEstado[JugadorSeleccionado!];
    if (!jugadorObjetivo) {
      mostrarError("El jugador seleccionado no existe");
      return;
    }

    // Votación de alguacil
    if (backendState === "iniciarVotacionAlguacil") {
      socket.emit("votarAlguacil", {
        idPartida: idSala,
        idJugador: usuarioID,
        idObjetivo: jugadorObjetivo.id,
      });
      logCustom(
        jornadaActual,
        etapaActual,
        `Voto ALGUACIL enviado para el jugador ${jugadorObjetivo.id}`,
        jugadoresEstado[indiceUsuario]
      );
    }
    // Votación nocturna de hombres lobo
    else if (backendState === "turnoHombresLobos") {
      socket.emit("votar", {
        idPartida: idSala,
        idJugador: usuarioID,
        idObjetivo: jugadorObjetivo.id,
      });
      logCustom(
        jornadaActual,
        etapaActual,
        `Voto de HOMBRES LOBO enviado para el jugador ${jugadorObjetivo.id}`,
        jugadoresEstado[indiceUsuario]
      );
    }
    // Votación diurna
    else {
      setVotos((votosAnteriores: number[]): number[] => {
        const nuevosVotos: number[] = [...votosAnteriores];
        nuevosVotos[JugadorSeleccionado] += 1;

        socket.emit("votar", {
          idPartida: idSala,
          idJugador: usuarioID,
          idObjetivo: jugadorObjetivo.id,
        });
        logCustom(
          jornadaActual,
          etapaActual,
          `Voto DIURNO registrado para el jugador ${JugadorSeleccionado + 1}`,
          jugadoresEstado[indiceUsuario]
        );
        return nuevosVotos;
      });
    }
    setVotoRealizado(true);
    setJugadorSeleccionado(null);
  };

  /**
   * Maneja la acción de pasar turno, validando que no se haya votado previamente.
   *
   * @returns {void}
   */
  const manejarPasarTurno = (): void => {
    if (pasoTurno) {
      mostrarError("Has pasado turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de pasar turno fallido: Turno ya pasado`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }
    if (votoRealizado) {
      mostrarError("Has pasado turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de pasar turno fallido: Turno pasado`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }
    logCustom(
      jornadaActual,
      etapaActual,
      `Turno pasado`,
      jugadoresEstado[indiceUsuario]
    );
    setPasoTurno(true);
    setVotoRealizado(true);
    setJugadorSeleccionado(null);
  };

  // ---------------------------------------------------------------------------
  // Returns
  // ---------------------------------------------------------------------------

  /**
   * Hasta que no se cargue la fuente de puñeta no continuar.
   */
  if (!fuentesCargadas) {
    return <ActivityIndicator size="large" style={estilos.cargando} />;
  }

  /**
   * Si se han cargado las fuentes, continuar.
   */
  return (
    // El componente TouchableWithoutFeedback se utiliza para capturar toques
    // en cualquier parte de la pantalla sin mostrar retroalimentación visual.
    <TouchableWithoutFeedback>
      {/* Contenedor principal que engloba todo el contenido de la pantalla */}
      <View style={estilos.contenedor}>
        {/* 
          Imagen de fondo:
          - Se utiliza el componente ImageBackground para colocar una imagen que cubra toda la pantalla.
          - La imagen se obtiene de CONSTANTES.IMAGENES.FONDO.
          - La propiedad resizeMode="cover" asegura que la imagen cubra el contenedor sin deformarse.
        */}
        <ImageBackground
          source={CONSTANTES.IMAGENES.FONDO}
          style={estilos.fondo}
          resizeMode="cover"
        />

        {/*
          Overlay animado:
          - Se emplea el componente Animated.View para mostrar una capa que oscurece la pantalla.
          - La opacidad de esta capa se controla mediante el valor animado (animacionFondo)
            proporcionado por el hook useDiaNoche.
          - Cuando el modo es noche, la opacidad se establece en 0.95 para simular oscuridad.
            En modo día, la opacidad es 0, haciendo la capa invisible.
        */}
        <Animated.View
          style={[estilos.superposicion, { opacity: animacionFondo }]}
        />

        {/*
        Mostrar la animación de iniciado:
        - mostrarAnimacionInicio1: ¡AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS!
        - mostrarAnimacionInicio2: TU ROL ES <IMAGEN ROL> <ROL LOCAL>
        - mostrarAnimacionInicio3: ¡LA PARTIDA COMIENZA, LOS JUGADORES PUEDEN INTERACTUAR AHORA!
        */}
        {mostrarAnimacionInicio1 && (
          <AnimacionInicio1
            opacity={opacitiesInicio[0]}
            mostrarComponente={mostrarComponentesInicio[0]}
          />
        )}

        {mostrarAnimacionInicio2 && (
          <AnimacionInicio2
            opacity={opacitiesInicio[1]}
            mostrarComponente={mostrarComponentesInicio[1]}
            rol={rolUsuario}
          />
        )}

        {mostrarAnimacionInicio3 && (
          <AnimacionInicio3
            opacity={opacitiesInicio[2]}
            mostrarComponente={mostrarComponentesInicio[2]}
          />
        )}

        {/*
          Animación para iniciar las (1ªs) votaciones de alguacil.
        */}
        {mostrarAnimacionInicioVotacionAlguacil && (
          <AnimacionGenerica
            opacity={opacitiesInicioVotacionAlguacil[0]}
            mostrarComponente={true}
            texto="EMPIEZAN LAS VOTACIONES DE ALGUACIL"
          />
        )}

        {/*
          Animación especial para iniciar las (2ªs) votaciones de alguacil en caso de que en la 1ª haya habido empate.
        */}
        {mostrarAnimacionSegundaVotacionAlguacil && (
          <AnimacionGenerica
            opacity={opacitiesInicioSegundaVotacionAlguacil[0]}
            mostrarComponente={true}
            texto="SE REPITEN LAS VOTACIONES DE ALGUACIL"
          />
        )}

        {/*
          Mostrar animación de que la vidente se va a dormir y los lobos se despiertan:
          -mostrarComponentesVidenteYNoche[0]: resultados de la votación del alguacil
          -mostrarComponentesVidenteYNoche[1]: se hace de noche y los supervivientes vuelven a dormir
          -mostrarComponentesVidenteYNoche[2]: la vidente se despierta y señala a un jugador del que quiere conocer la verdadera personalidad
        */}
        {mostrarComponentesVidenteYNoche[0] && (
          <AnimacionGenerica
            opacity={opacidadesVidenteYNoche[0]}
            mostrarComponente={mostrarResultadosVotacionAlguacil}
            texto={`RESULTADOS DE LA VOTACIÓN DE ALGUACIL:`} //TODO, no pone quién ha ganado ${mensajeEventoAlguacil}`}
          />
        )}

        {mostrarComponentesVidenteYNoche[1] && (
          <AnimacionGenerica
            opacity={opacidadesVidenteYNoche[1]}
            mostrarComponente={mostrarJugadoresSeDuermen}
            texto="SE HACE DE NOCHE LOS SUPERVIVIENTES SE VUELVEN A DORMIR"
          />
        )}

        {mostrarComponentesVidenteYNoche[2] && (
          <AnimacionGenerica
            opacity={opacidadesVidenteYNoche[2]}
            mostrarComponente={mostrarVidenteSeDespierta}
            texto="LA VIDENTE SE DESPIERTA Y SEÑALA A UN JUGADOR DEL QUE QUIERE CONOCER LA VERDADERA PERSONALIDAD"
          />
        )}

        {/*
          Mostrar animación de que la vidente se va a dormir y los lobos se despiertan:
          -mostrarAnimacionVidenteSeDuerme (si no hay videntes vivas no se muestra)
          -mostrarAnimacionLobosSeDespiertan
        */}
        {mostrarAnimacionVidenteSeDuerme && (
          <AnimacionGenerica
            opacity={opacitiesVidenteSeDuermeLobosSeDespiertan[0]}
            mostrarComponente={
              mostrarComponentesVidenteSeDuermeLobosSeDespiertan[0]
            }
            texto="LA VIDENTE SE VUELVE A DORMIR"
          />
        )}

        {mostrarAnimacionLobosSeDespiertan && (
          <AnimacionGenerica
            // Parche por si no hay que mostrar la animación de la vidente se duerme, en ese caso toma su lugar.
            opacity={
              opacitiesVidenteSeDuermeLobosSeDespiertan[!hayVidenteViva ? 0 : 1]
            }
            mostrarComponente={
              mostrarComponentesVidenteSeDuermeLobosSeDespiertan[1]
            }
            texto="LOS HOMBRES LOBO DE DESPIERTAN, SE RECONOCEN Y DESIGNAN UNA NUEVA VÍCTIMA"
          />
        )}

        {mostrarComponentesBrujaSeDespierta && (
          <AnimacionGenerica
            opacity={opacitiesBrujaSeDespierta[0]}
            mostrarComponente={true}
            texto="LA BRUJA SE DESPIERTA, OBSERVA LA NUEVA VÍCTIMA DE LOS HOMBRES LOBO. USARÁ SU POCIÓN CURATIVA O SU POCIÓN VENENOSA"
          />
        )}

        {/*
          Renderizado condicional del mensaje de error:
          - Si errorMessage tiene contenido, se muestra el componente MensajeError.
          - Este componente se encarga de mostrar el error y la animación correspondiente.
        */}
        {errorMessage && (
          <MensajeError
            errorMessage={errorMessage}
            animacionError={animacionError}
          />
        )}

        {/*
          Renderizado condicional de los controles de acción y la votación:
          - Se verifica el estado mostrarBotones para determinar si se deben renderizar
            los botones de acción, la barra superior, el temporizador y la interfaz de votación.
          - Estos elementos permiten al usuario interactuar con las funcionalidades del juego.
        */}
        {mostrarBotones && (
          <>
            {/*
              Componente ControlesAccion:
              - Muestra los botones para votar y pasar turno.
              - Recibe información relevante (como habilidadInfo) y funciones de manejo de eventos.
              - La función mostrarBotonesAccion determina la visibilidad según el modo de juego
                o el rol del usuario (por ejemplo, permitiendo a los lobos interactuar durante la noche).
            */}
            <ControlesAccion
              habilidadInfo={habilidadInfo}
              abrirHabilidad={handleAbrirHabilidad}
              abrirChat={handleAbrirChat}
              votarAJugador={votarAJugador}
              manejarPasarTurno={manejarPasarTurno}
              mostrarBotonesAccion={() =>
                !EFECTO_PANTALLA_OSCURA || rolUsuario === "Hombre lobo"
              }
              votoRealizado={votoRealizado}
              turnoPasado={pasoTurno}
              mostrarVotacion={mostrarBotonVotar}
            />
            {/* Componente BarraSuperior: 
                Muestra información relevante en la parte superior de la pantalla, 
                como el estado del juego o la identificación del rol. */}
            <BarraSuperior vivos={vivos} lobos={lobosVivos} />

            {/*
              Temporizador:
              - Se renderiza un contenedor que muestra el tiempo restante de la ronda actual.
              - El tiempo se muestra dentro de un círculo estilizado, haciendo uso de estilos predefinidos.
            */}
            <View style={estilos.contenedorTemporizador}>
              <View style={estilos.circuloTemporizador}>
                <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
              </View>
            </View>

            {/*
              Medalla de alguacil si procede enseñarla
            */}
            {indiceUsuario !== -1 &&
              jugadoresEstado[indiceUsuario]?.esAlguacil &&
              jugadoresEstado[indiceUsuario]?.estaVivo && (
                <Image
                  source={require("@/assets/images/alguacil-icon.png")}
                  style={estilos.iconoAlguacil}
                />
              )}

            {/*
              Componente CirculoVotar:
              - Representa la interfaz de votación en la que se muestran las imágenes de los jugadores.
              - Permite seleccionar un jugador para votar, mediante la función onSelectPlayer.
              - Recibe la lista de imágenes, los votos acumulados, el jugador actualmente seleccionado,
                y la función que maneja la selección de jugadores.
            */}
            <CirculoVotar
              jugadores={jugadoresEstado}
              votes={votes}
              JugadorSeleccionado={JugadorSeleccionado}
              onSelectPlayer={administrarSeleccionJugadorVotacion}
            />
          </>
        )}

        {/*
          Renderizado condicional del Chat:
          - Si mostrarChat es verdadero, se renderiza el componente Chat.
          - Se pasan los mensajes iniciales, la posición actual del chat (para la animación),
            y la función para cerrar el chat.
        */}
        {mostrarChat && (
          <Chat
            //mensajes={CONSTANTES.TEXTOS.CHAT.MENSAJES_INICIALES}mensajes
            mensajes={mensajes}
            posicionChat={posicionChat}
            onClose={handleCerrarChat}
            socket={socket} // Aquí pasas el socket
            idSala={idSala} // Aquí pasas el idSala
            usuarioID={usuarioID} // Aquí pasas el usuarioData
          />
        )}

        {/*
          Renderizado condicional del HabilidadPopup:
          - Si mostrarHabilidad es verdadero, se renderiza el componente HabilidadPopup.
          - Este componente muestra información y opciones relacionadas con la habilidad del jugador.
          - Se le suministran datos como habilidadInfo, la posición para la animación, y una función
            para cerrar el popup.
        */}
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
