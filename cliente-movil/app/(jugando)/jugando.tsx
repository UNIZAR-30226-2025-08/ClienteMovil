/**
 * @file jugando.tsx
 * @description Componente principal de la pantalla de juego.
 * Maneja la lógica del juego, incluyendo estados, temporizador, votaciones, chat, habilidades y animaciones.
 * @module Jugando
 */

// React y librerías base
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Alert,
  ActivityIndicator,
  Image,
  BackHandler,
} from "react-native";

// Carga de fuentes personalizadas
import { useFonts } from "expo-font";

// Navegación y parámetros locales
import { useRouter, useLocalSearchParams } from "expo-router";

// Conexión vía WebSocket con el servidor del juego, la partida asume que ya está conectado
import socket from "@/app/(sala)/socket";

// Utils (funciones puras, estilos y constantes)
import { getInfoRol } from "../../utils/jugando/rolesUtilidades";
import { estilos } from "../../utils/jugando/jugando.styles";
import { CONSTANTES, Rol } from "../../utils/jugando/constantes";

// Componentes de UI del juego
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

// Hooks de estado y lógica del juego
import useTemporizador from "./hooks/useTemporizador";
import useAnimacionChat from "./hooks/useAnimacionChat";
import useAnimacionHabilidad from "./hooks/useAnimacionHabilidad";
import useMensajeError from "./hooks/useMensajeError";
import useDiaNoche from "./hooks/useDiaNoche";
import useGestorAnimaciones from "./hooks/useGestorAnimaciones";
import { push } from "expo-router/build/global-state/routing";

/**
 * Enum que representa los diferentes estados de la partida.
 */
enum Estado {
  esperaInicial,
  iniciarVotacionAlguacil,
  iniciarSegundaVotacionAlguacil,
  alguacilElegido,
  nocheComienza,
  habilidadVidente,
  turnoHombresLobos,
  habilidadBruja,
  habilidadAlguacil,
  diaComienza,
  habilidadCazador,
  partidaFinalizada,
  usuarioLocalMuerto,
  empateVotacionDia,
  segundoEmpateVotacionDia,
  resultadoVotosDia,
}

/**
 * Tipo de estructura de datos para definir organizadamente que elementos UI enseñar en un momento dado.
 */
type PlantillaUI = {
  mostrarControlesAccion: boolean;
  mostrarCirculoJugadores: boolean;
  mostrarBarraSuperior: boolean;
  mostrarBotellas: boolean;
  mostrarPantallaOscura: boolean;
  mostrarTemporizador: boolean;
  mostrarBotonVotar: boolean;
  mostrarMedallaAlguacilPropia: boolean;
  valorOpacidadPantallaOscura: number;
  textoBotonVotar: string;
  mostrarBotonPasarTurno: boolean;
};

/**
 * Representa la pantalla principal de juego.
 *
 * @returns {JSX.Element | null} El componente renderizado o null si las fuentes aún no se han cargado.
 */
const Jugando: React.FC = () => {
  const router = useRouter(); // !!!! MOVER????

  /**
   * Carga de fuentes personalizadas para la interfaz del juego.
   */
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/corben-regular.ttf"),
  });

  /**
   * Parámetros recibidos desde la pantalla anterior (sala).
   */
  const { idSala, salaData, rol, usuarioID, usuarioNombre } =
    useLocalSearchParams<{
      idSala: string;
      salaData: string;
      rol: string;
      usuarioID: string;
      usuarioNombre: string;
    }>();
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

  // ---------------------------------------------------------------------------
  // Control de la conexión de la partida
  // ---------------------------------------------------------------------------

  /**
   * Efecto que se ejecuta cuando cambia el ID de la sala (`idSala`).
   *
   * - Solicita al backend el estado actual de la partida mediante el evento `obtenerEstadoPartida`.
   * - Al recibir la respuesta por `estadoPartida`, actualiza el estado local de `jugadoresEstado`.
   * - El listener se limpia al desmontar el componente o cuando `idSala` cambia.
   */
  useEffect(() => {
    if (!idSala) return;

    // Emitir evento al backend para solicitar el estado actual de los jugadores
    // socket.emit("obtenerEstadoJugadores", { idPartida: idSala });
    // console.log("[PantallaJugando] → Emitiendo obtenerEstadoJugadores", idSala);

    // Escuchar la respuesta del backend con los datos de los jugadores
    socket.on("estadoJugadores", (data) => {
      // console.log("→ Respuesta estadoJugadores:", data);

      if (data.error) {
        // console.log("Error al obtener estado de los jugadores:", data.error);
        return;
      }

      //  setJugadoresEstado(data.jugadores);
    });
    console.log("Escucho estadoPartida:");
    socket.on("estadoPartida", (data) => {
      setJornadaActual(data.numJornada);
      setEtapaActual(data.turno);
      setJugadoresEstado(data.listaJugadores);
      actualizarMaxTiempo(data.tiempoRestante);
      // si hay lógica de cambio de fase, llama a agregarEstado con data.faseActual
    });

    // Limpiar el listener al desmontar
    return () => {
      socket.off("estadoJugadores");
      socket.off("estadoPartida");
    };
  }, [idSala]);

  // ---------------------------------------------------------------------------
  // Efectos de inicialización
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleBackPress = () => {
      Alert.alert(
        "Salir de la partida",
        "¿Estás seguro de que quieres salir?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir",
            onPress: () => {
              router.back(); // Regresa a la pantalla anterior
            },
          },
        ]
      );

      return true; // <- Esto es correcto aquí
    };

    // Agrega el event listener
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    // Limpia el event listener al desmontar
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, []);

  /**
   * Conecta la partida a los sockets y escucha eventos clave como "enPartida" y "actualizarSala".
   *
   * @warning console.logs comentados porque petan la consola
   */
  useEffect(() => {
    socket.on("enPartida", (data) => {
      console.log("Evento enPartida recibido");
      console.log("Jugadores recibidos enPartida (raw):", data.sala.jugadores);

      // Versión legible en JSON del estado

      console.log(
        "Jugadores enPartida (stringify):",
        JSON.stringify(data.sala.jugadores, null, 2)
      );

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

  const animacionesInicialesYaEjecutadas: Record<string, boolean> = {};

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
    const fetchJugadores = async () => {
      setRolUsuario(rol as Rol);
      
      if (!animacionesInicialesYaEjecutadas[idSala]) {
        agregarEstado(Estado.esperaInicial);
        animacionesInicialesYaEjecutadas[idSala] = true;
      }

      const nuevosJugadores = await new Promise<typeof jugadoresEstado>(
        (resolve) => {
          const handler = (data: { jugadores: typeof jugadoresEstado }) => {
            socket.off("estadoJugadores", handler);
            resolve(data.jugadores);
          };

          socket.on("estadoJugadores", handler);
          socket.emit("obtenerEstadoJugadores", { idPartida: idSala });
        }
      );

      setJugadoresEstado(nuevosJugadores);
    };

    fetchJugadores();
  }, [rol, idSala]);

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

    const now = new Date();
    const horaExacta = now.toTimeString().slice(0, 8);
    const milisegundos = now.getMilliseconds();

    console.log(
      `${color}${horaExacta}.${milisegundos} [Jornada ${jornadaActual} - ${etapaParaMostrar}] ${infoJugador} - ${message}\x1b[0m`
    );
  }

  // ---------------------------------------------------------------------------
  // Constantes para controlar los tiempos de timer que se le muestran a los usuario
  // ---------------------------------------------------------------------------

  // Esto es lo que quieres modificar para cambiar los timers visuales durante la partida
  const CONST_TIEMPO_ESPERA_INICAL = 15;
  const CONST_TIEMPO_VOTACION_ALGUACIL = 25;
  const CONST_TIEMPO_HABILIDAD_VIDENTE = 15;
  const CONST_TIEMPO_VOTACION_NOCTURNA = 30;
  const CONST_TIEMPO_HABILIDAD_BRUJA = 15;
  const CONST_TIEMPO_VOTACION_DIURNA = 60;
  const CONST_TIEMPO_HABILIDAD_CAZADOR = 15;

  // ---------------------------------------------------------------------------
  // Estados del juego
  // ---------------------------------------------------------------------------
  /**
   * Representa el número de jornada en la que el juego cree que está.
   * Cada jornada se compone por 1 día y 1 noche.
   */
  const [jornadaActual, setJornadaActual] = useState<number>(1);

  /**
   * Representa en que etapa cree el juego que está: si es de "Día" o de "Noche".
   */
  const [etapaActual, setEtapaActual] = useState<"Día" | "Noche">("Día");

  /**
   * Rol del usuario local.
   * @note Se inicializa a Aldeano, se espera que se inicialice nada más reiniciar el componente.
   * @type {Rol}
   */
  const [rolUsuario, setRolUsuario] = useState<Rol>("Aldeano");

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
    (jugador) => jugador.id == usuarioID
  );

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

  /*
   * Mensaje informativo recibido del backend relacionado con a quién a han matado
   * los lobos, recibido por la bruja justo antes de su turno.
   */
  const [mensajeEventoBruja, setMensajeEventoBruja] = useState<string>("");

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

  /**
   * Nombre del jugador que ha ganado la votación del alguacil.
   */
  const [nombreAlguacilElegido, setNombreAlguacilElegido] =
    useState<string>("");

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
   * Guarda la selección actual del usuario local de las pocimas de bruja.
   * @type {string | null}
   */
  const [botellaSeleccionada, setBotellaSeleccionada] = useState<
    "vida" | "muerte" | null
  >(null);

  /**
   * Controla si el usuario local ya ha usado su botella de vida.
   * @type {boolean}
   */
  const [botellaVidaUsada, setBotellaVidaUsada] = useState<boolean>(false);

  /**
   * Controla si el usuario local ya ha usado su botella de muerte.
   * @type {boolean}
   */
  const [botellaMuerteUsada, setBotellaMuerteUsada] = useState<boolean>(false);

  /**
   * Controla si el usuario ya ha usado su botella (cualquiera de las 2) en este turno,
   * @type {boolean}
   */
  const [botellaUsadaEnEsteTurno, setBotellaUsadaEnEsteTurno] =
    useState<boolean>(false);

  /**
   * Lista de mensajes enviados durante la partida.
   */
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);

  /**
   * Estados para la duración de cada timer en las fases.
   * Deberían enviarlos el backend, esto son solo fallbacks como los de web.
   * Cuando web no tenía fallback, está puesto 30 segundos.
   */
  const [duracionEsperaInicial, setDuracionEsperaInicial] = useState<number>(30);
  const [duracionIniciarVotacionAlguacil, setDuracionIniciarVotacionAlguacil] = useState<number>(24);
  const [duracionSegundaVotacionAlguacil, setDuracionSegundaVotacionAlguacil] = useState<number>(24);
  const [duracionHabilidadVidente, setDuracionHabilidadVidente] = useState<number>(15);
  const [duracionTurnoHombresLobos, setDuracionTurnoHombresLobos] = useState<number>(19);
  const [duracionHabilidadBruja, setDuracionHabilidadBruja] = useState<number>(30);
  const [duracionHabilidadAlguacil, setDuracionHabilidadAlguacil] = useState<number>(30);
  const [duracionHabilidadCazador, setDuracionHabilidadCazador] = useState<number>(30);
  const [duracionDiaComienza, setDuracionDiaComienza] = useState<number>(60);
  const [duracionEmpateVotacionDia, setDuracionEmpateVotacionDia] = useState<number>(25);

  // ---------------------------------------------------------------------------
  // ¿Qué elementos de la UI mostrar en cada momento?
  // ---------------------------------------------------------------------------

  const plantillaAnimacionDia: PlantillaUI = {
    mostrarControlesAccion: false,
    mostrarCirculoJugadores: false,
    mostrarBarraSuperior: false,
    mostrarBotellas: false,
    mostrarPantallaOscura: true,
    mostrarTemporizador: false,
    mostrarBotonVotar: false,
    mostrarMedallaAlguacilPropia: false,
    valorOpacidadPantallaOscura: 0.5,
    textoBotonVotar: "VOTAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaAnimacionNoche: PlantillaUI = {
    mostrarControlesAccion: false,
    mostrarCirculoJugadores: false,
    mostrarBarraSuperior: false,
    mostrarBotellas: false,
    mostrarPantallaOscura: true,
    mostrarTemporizador: false,
    mostrarBotonVotar: false,
    mostrarMedallaAlguacilPropia: false,
    valorOpacidadPantallaOscura: 0.95,
    textoBotonVotar: "VOTAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaEsperaInicial: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: false,
    mostrarTemporizador: true,
    mostrarBotonVotar: false,
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0,
    textoBotonVotar: "VOTAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaVotacionAlguacil: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: false,
    mostrarTemporizador: true,
    mostrarBotonVotar: true,
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0,
    textoBotonVotar: "VOTAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaHabilidadVidente: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: true,
    mostrarTemporizador: true,
    mostrarBotonVotar: rolUsuario === "Vidente",
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0.95,
    textoBotonVotar: "MIRAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaVotacionHombresLobo: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: true,
    mostrarTemporizador: true,
    mostrarBotonVotar: rolUsuario === "Hombre lobo",
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0.95,
    textoBotonVotar: "VOTAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaHabilidadBruja: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: rolUsuario === "Bruja",
    mostrarPantallaOscura: true,
    mostrarTemporizador: true,
    mostrarBotonVotar: rolUsuario === "Bruja",
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0.95,
    textoBotonVotar: "TIRAR",
    mostrarBotonPasarTurno: rolUsuario === "Bruja",
  };

  const plantillaHabilidadCazadorNoche: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: true,
    mostrarTemporizador: true,
    mostrarBotonVotar: rolUsuario === "Cazador",
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0.95,
    textoBotonVotar: "MATAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaHabilidadCazadorDia: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: false,
    mostrarTemporizador: true,
    mostrarBotonVotar: rolUsuario === "Cazador",
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0,
    textoBotonVotar: "MATAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaVotacionDiurna: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: false,
    mostrarTemporizador: true,
    mostrarBotonVotar: true,
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0,
    textoBotonVotar: "VOTAR",
    mostrarBotonPasarTurno: false,
  };

  const plantillaHabilidadAlguacil: PlantillaUI = {
    mostrarControlesAccion: true,
    mostrarCirculoJugadores: true,
    mostrarBarraSuperior: true,
    mostrarBotellas: false,
    mostrarPantallaOscura: false,
    mostrarTemporizador: true,
    mostrarBotonVotar: jugadoresEstado[indiceUsuario]?.esAlguacil ?? false,
    mostrarMedallaAlguacilPropia: true,
    valorOpacidadPantallaOscura: 0.95,
    textoBotonVotar: "ELIGE",
    mostrarBotonPasarTurno: false,
  };

  const [plantillaActual, setPlantillaActual] = useState<PlantillaUI>(
    plantillaAnimacionDia
  );

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
  const { animacionFondo, setModoDiaNoche, setOpacity } = useDiaNoche(
    plantillaActual.mostrarPantallaOscura,
    plantillaActual.valorOpacidadPantallaOscura
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
  } = useTemporizador(CONST_TIEMPO_ESPERA_INICAL, false);

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

  /**
   * Información relacionada con el rol del usuario para mostrarla en componentes.
   */
  const { habilidadInfo, roleInfo } = getInfoRol(rolUsuario);

  /**
   * Habilidad del usuario que la vidente ha seleccionado en su último turno.
   */
  const [idObjetivoVidente, setIdObjetivoVidente] = useState("");

  /**
   * Rol del usuario que la vidente ha seleccionado en su último turno.
   */
  const [rolObjetivoVidente, setRolObjetivoVidente] = useState("");

  /**
   * Nombre del usuario al que los hombres lobo han matado esta ronda, para enseñarselo a la bruja.
   */
  const [nombreVictimaBruja, setNombreVictimaBruja] = useState<string>("");

  // ---------------------------------------------------------------------------
  // Animaciones
  // ---------------------------------------------------------------------------

  /**
   * Duración de la animación de entrada (fade in) en milisegundos de todas las animaciones.
   * @type {number}
   */
  const duracionFadeIn = 1000;

  /**
   * Tiempo de espera entre fases de la animación en milisegundos de todas las animaciones.
   * @type {number}
   */
  const duracionEspera = 3000;

  /**
   * Duración de la animación de salida (fade out) en milisegundos de todas las animaciones.
   * @type {number}
   */
  const duracionFadeOut = 1000;

  /**
   * Duración total de todas las animaciones.
   * @type {number}
   */
  const duracionAnimacion = duracionFadeIn + duracionEspera + duracionFadeOut;

  /**
   * Controla si se muestra la primera animación de inicio.
   * @type {boolean}
   */
  const [mostrarAnimacionInicio1, setMostrarAnimacionInicio1] =
    useState<boolean>(false);

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
   * Controla si se muestra animación que se muestra justo antes de la primera votación de alguacil.
   * @type {boolean}
   */
  const [
    mostrarAnimacionPrimeraVotacionAlguacil,
    setMostrarAnimacionPrimeraVotacionAlguacil,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra justo antes de la primera votación de alguacil..
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesPrimeraVotacionAlguacil,
    mostrarComponentes: mostrarComponentesPrimeraVotacionAlguacil,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionPrimeraVotacionAlguacil,
  });

  /**
   * Controla si se muestra animación que se muestra justo antes de la segunda votación de alguacil.
   * @type {boolean}
   */
  const [
    mostrarAnimacionSegundaVotacionAlguacil,
    setMostrarAnimacionSegundaVotacionAlguacil,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra justo antes de la segunda votación de alguacil..
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesSegundaVotacionAlguacil,
    mostrarComponentes: mostrarComponentesSegundaVotacionAlguacil,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionSegundaVotacionAlguacil,
  });

  /**
   * Controla si se muestra la animación que se muestra al salir elegido un alguacil.
   * @type {boolean}
   */
  const [mostrarAnimacionAlguacilElegido, setMostrarAnimacionAlguacilElegido] =
    useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al salir elegido un alguacil.
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesAlguacilElegido,
    mostrarComponentes: mostrarComponentesAlguacilElegido,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionAlguacilElegido,
  });

  /**
   * Controla si se muestra la animación que se muestra al comienzo de la noche.
   * @type {boolean}
   */
  const [mostrarAnimacionNocheComienza, setMostrarAnimacionNocheComienza] =
    useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al comienzo de la noche.
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesNocheComienza,
    mostrarComponentes: mostrarComponentesNocheComienza,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionNocheComienza,
  });

  /**
   * Controla si se muestra la animación que se muestra al comienzo del turno de la vidente si hay vidente.
   * @type {boolean}
   */
  const [
    mostrarAnimacionInicioHabilidadVidente,
    setMostrarAnimacionInicioHabilidadVidente,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al comienzo del turno de la vidente si hay vidente.
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicioHabilidadVidente,
    mostrarComponentes: mostrarComponentesInicioHabilidadVidente,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionInicioHabilidadVidente,
  });

  /**
   * Controla si se muestra la animación que se muestra al final del turno de la vidente si hay vidente.
   * @type {boolean}
   */
  const [
    mostrarAnimacionFinalHabilidadVidente,
    setMostrarAnimacionFinalHabilidadVidente,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al final del turno de la vidente si hay vidente.
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesFinalHabilidadVidente,
    mostrarComponentes: mostrarComponentesFinalHabilidadVidente,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionFinalHabilidadVidente,
  });

  /**
   * Controla si se muestra la animación que se muestra al final del turno de la vidente si hay vidente.
   * @type {boolean}
   */
  const [
    mostrarAnimacionEjecutarHabilidadVidente,
    setMostrarAnimacionEjecutarHabilidadVidente,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que muestra a la vidente el rol del usuario al que ha visualizado.
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesEjecutarHabilidadVidente,
    mostrarComponentes: mostrarComponentesEjecutarHabilidadVidente,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionEjecutarHabilidadVidente,
  });

  /**
   * Controla si se muestra la animación que se muestra al inicio del turno de los hombres lobo.
   * @type {boolean}
   */
  const [
    mostrarAnimacionInicioTurnoHombresLobo,
    setMostrarAnimacionInicioTurnoHombresLobo,
    ,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al inicio del turno de los hombres lobo.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicioTurnoHombresLobo,
    mostrarComponentes: mostrarComponentesInicioTurnoHombresLobo,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionInicioTurnoHombresLobo,
  });

  /**
   * Controla si se muestra la animación que se muestra al final del turno de los hombres lobo.
   * @type {boolean}
   */
  const [
    mostrarAnimacionFinalTurnoHombresLobo,
    setMostrarAnimacionFinalTurnoHombresLobo,
    ,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al final del turno de los hombres lobo.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesFinalTurnoHombresLobo,
    mostrarComponentes: mostrarComponentesFinalTurnoHombresLobo,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionFinalTurnoHombresLobo,
  });

  /**
   * Controla si se muestra la animación que se muestra al inicio del turno de la bruja.
   * @type {boolean}
   */
  const [
    mostrarAnimacionInicioHabilidadBruja,
    setMostrarAnimacionInicioHabilidadBruja,
    ,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al inicio del turno de la bruja.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicioHabilidadBruja,
    mostrarComponentes: mostrarComponentesInicioHabilidadBruja,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionInicioHabilidadBruja,
  });

  /**
   * Controla si se muestra la animación que se muestra al final del turno de la bruja.
   * @type {boolean}
   */
  const [
    mostrarAnimacionFinalHabilidadBruja,
    setMostrarAnimacionFinalHabilidadBruja,
    ,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra al final del turno de la bruja.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesFinalHabilidadBruja,
    mostrarComponentes: mostrarComponentesFinalHabilidadBruja,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionFinalHabilidadBruja,
  });

  /**
   * Controla si se muestra la animación que se muestra a la bruja con la persona que ha muerto en la ronda.
   * @type {boolean}
   */
  const [
    mostrarAnimacionEnseñarVictimaALaBruja,
    setMostrarAnimacionEnseñarVictimaALaBruja,
    ,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación que se muestra a la bruja con la persona que ha muerto en la ronda.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesEnseñarVictimaALaBruja,
    mostrarComponentes: mostrarComponentesEnseñarVictimaALaBruja,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionEnseñarVictimaALaBruja,
  });

  /**
   * Controla si se muestra la primera animación que se muestra en el comienzo de cada día.
   * @type {boolean}
   */
  const [mostrarAnimacionInicioDia1, setMostrarAnimacionInicioDia1] =
    useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la primera animación que se muestra en el comienzo de cada día.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicioDia1,
    mostrarComponentes: mostrarComponentesInicioDia1,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 2,
    start: mostrarAnimacionInicioDia1,
  });

  /**
   * Controla si se muestra la segunda animación que se muestra en el comienzo de cada día.
   * @type {boolean}
   */
  const [mostrarAnimacionInicioDia2, setMostrarAnimacionInicioDia2] =
    useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la segunda animación que se muestra en el comienzo de cada día.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicioDia2,
    mostrarComponentes: mostrarComponentesInicioDia2,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 2,
    start: mostrarAnimacionInicioDia2,
  });

  /**
   * Controla si se muestra la animación de cuando el usuario local ha muerto.
   * @type {boolean}
   */
  const [
    mostrarAnimacionUsuarioLocalMuerto,
    setMostrarAnimacionUsuarioLocalMuerto,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación de cuando el usuario local ha muerto.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesUsuarioLocalMuerto,
    mostrarComponentes: mostrarComponentesUsuarioLocalMuerto,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionUsuarioLocalMuerto,
  });

  /**
   * Controla si se muestra la animación de cuando empieza el turno del cazador.
   * @type {boolean}
   */
  const [
    mostrarAnimacionInicioTurnoCazador,
    setMostrarAnimacionInicioTurnoCazador,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación de cuando empieza el turno del cazador.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicioTurnoCazador,
    mostrarComponentes: mostrarComponentesInicioTurnoCazador,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionInicioTurnoCazador,
  });

  /**
   * Controla si se muestra la animación de cuando termina el turno del cazador.
   * @type {boolean}
   */
  const [
    mostrarAnimacionFinalTurnoCazador,
    setMostrarAnimacionFinalTurnoCazador,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación de cuando termina el turno del cazador.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesFinalTurnoCazador,
    mostrarComponentes: mostrarComponentesFinalTurnoCazador,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionFinalTurnoCazador,
  });

  /**
   * Controla si se muestra la animación de cuando empieza la sucesión del alguacil.
   * @type {boolean}
   */
  const [
    mostrarAnimacionInicioHabilidadAlguacil,
    setMostrarAnimacionInicioHabilidadAlguacil,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación de cuando empieza la sucesión del alguacil.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesInicioHabilidadAlguacil,
    mostrarComponentes: mostrarComponentesInicioHabilidadAlguacil,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionInicioHabilidadAlguacil,
  });

  /**
   * Controla si se muestra la animación de cuando termina la sucesión del alguacil.
   * @type {boolean}
   */
  const [
    mostrarAnimacionFinalHabilidadAlguacil,
    setMostrarAnimacionFinalHabilidadAlguacil,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación de cuando termina la sucesión del alguacil.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesFinalHabilidadAlguacil,
    mostrarComponentes: mostrarComponentesFinalHabilidadAlguacil,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionFinalHabilidadAlguacil,
  });

  /**
   * Controla si se muestra la animación de cuando se da el primer empate en las votaciones diurnas.
   * @type {boolean}
   */
  const [
    mostrarAnimacionEmpateVotacionDiurna,
    setMostrarAnimacionEmpateVotacionDiurna,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación de cuando se da el primer empate en las votaciones diurnas.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesEmpateVotacionDiurna,
    mostrarComponentes: mostrarComponentesEmpateVotacionDiurna,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionEmpateVotacionDiurna,
  });

  /**
   * Controla si se muestra la animación de cuando se da el segundo empate en las votaciones diurnas.
   * @type {boolean}
   */
  const [
    mostrarAnimacionSegundoEmpateVotacionDiurna,
    setMostrarAnimacionSegundoEmpateVotacionDiurna,
  ] = useState<boolean>(false);

  /**
   * Valores de opacidad y visibilidad para la animación de cuando cuando se da el segundo empate en las votaciones diurnas.
   * @type {boolean}
   * Generados por el hook `useGestorAnimaciones`.
   */
  const {
    opacities: opacitiesSegundoEmpateVotacionDiurna,
    mostrarComponentes: mostrarComponentesSegundoEmpateVotacionDiurna,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionSegundoEmpateVotacionDiurna,
  });

  /**
   *
   */
  const [
    mostrarAnimacionResultadosDia,
    setMostrarAnimacionResultadosDia,
  ] = useState<boolean>(false);

  /**
   *
   */
  const {
    opacities: opacitiesResultadosDia,
    mostrarComponentes: mostrarComponentesResultadosDia,
  } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 1,
    start: mostrarAnimacionResultadosDia,
  });

    /**
     *
     */
    const [
        mostrarAnimacionFinPartida,
        setMostrarAnimacionFinPartida,
    ] = useState<boolean>(false);

    /**
     *
     */
    const {
        opacities: opacitiesFinPartida,
        mostrarComponentes: mostrarComponentesFinPartida,
        } = useGestorAnimaciones({
        duracionFadeIn,
        duracionEspera,
        duracionFadeOut,
        numAnimaciones: 1,
        start: mostrarAnimacionFinPartida,
    });

  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // const [mensaje, setMensaje] = useState(null);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!

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
    if (jugadorLocalMuerto) {
        mostrarError("Estas muerto :(");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de selección de usuario fallido: Usuario muerto`,
          jugadoresEstado[indiceUsuario]
        );
        return;
    }
    if (estadoActual === Estado.esperaInicial) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: no hay nada que votar en Estado.esperaInicial`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("No hay nada que votar todavía");
      return;
    }
    if (estadoActual === Estado.habilidadVidente && rolUsuario !== "Vidente") {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Es el turno de la vidente y no es vidente`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError(
        "Solo la vidente puede seleccionar jugadores durante el turno de la vidente"
      );
      return;
    }
    if (
      estadoActual === Estado.turnoHombresLobos &&
      rolUsuario !== "Hombre lobo"
    ) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Es el turno de los lobos y no es lobo`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError(
        "Solo los lobos pueden seleccionar jugadores durante la noche"
      );
      return;
    }
    if (estadoActual === Estado.habilidadBruja && rolUsuario !== "Bruja") {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Es el turno de la bruja y no es bruja`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError(
        "Solo la bruja puede seleccionar jugadores durante el turno de la bruja"
      );
      return;
    }
    if (
      estadoActual === Estado.habilidadAlguacil &&
      jugadoresEstado[indiceUsuario].esAlguacil !== true
    ) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Es el turno del alguacil y no es alguacil`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError(
        "Solo el alguacil puede seleccionar jugadores durante el turno del alguacil"
      );
      return;
    }
    if (estadoActual === Estado.habilidadCazador && rolUsuario !== "Cazador") {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Es el turno del cazador y no es cazador`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError(
        "Solo el cazador puede seleccionar jugadores durante el turno del cazador"
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
    if (
      index === indiceUsuario &&
      !(estadoActual === Estado.habilidadBruja && rolUsuario === "Bruja")
    ) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección fallido: Voto propio`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("¡No puedes seleccionarte a ti mismo!");
      return;
    }
    if (
      !jugadoresEstado[index].estaVivo &&
      !(estadoActual === Estado.habilidadBruja && rolUsuario === "Bruja")
    ) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección fallido: Selección a muerto`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("¡No puedes seleccionar a jugadores muertos!");
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
   * Ejecuta la acción de votar/visualizar/usar poción al jugador seleccionado.
   *
   * @returns {void}
   */
  const votarAJugador = (): void => {
    if (jugadorLocalMuerto) {
        mostrarError("Estas muerto :(");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de voto fallido: Usuario muerto`,
          jugadoresEstado[indiceUsuario]
        );
        return;
    }
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
    if (
      JugadorSeleccionado === null &&
      estadoActual === Estado.habilidadVidente &&
      rolUsuario === "Vidente"
    ) {
      mostrarError("Tienes que seleccionar a un jugador para visualizarlo");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de acción vidente fallida: El vidente no ha seleccionado un jugador para revelar`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }
    if (
      votoRealizado &&
      estadoActual === Estado.habilidadVidente &&
      rolUsuario === "Vidente"
    ) {
      mostrarError("Solo puedes revelar la identidad de 1 jugador por turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de acción vidente fallida: El vidente ya ha solicitado revelar a un jugador en este turno`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }
    if (
      JugadorSeleccionado === null &&
      estadoActual === Estado.habilidadBruja &&
      rolUsuario === "Bruja"
    ) {
      mostrarError(
        "Tienes que seleccionar a un jugador para lanzarle una poción"
      );
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de acción bruja fallida: La bruja no ha seleccionado un jugador para lanzarle una poción`,
        jugadoresEstado[indiceUsuario]
      );
      return;
    }
    if (
      votoRealizado &&
      botellaUsadaEnEsteTurno &&
      estadoActual === Estado.habilidadBruja &&
      rolUsuario === "Bruja"
    ) {
      mostrarError("Solo puedes lanzar una poción por turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de acción bruja fallida: La bruja ya ha lanzado una poción a un jugador en este turno`,
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
        `Intento de voto fallido: el usuario no ha seleccionado a un jugador par votarle`,
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
    if (
      estadoActual === Estado.iniciarVotacionAlguacil ||
      estadoActual === Estado.iniciarSegundaVotacionAlguacil
    ) {
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
    else if (estadoActual === Estado.turnoHombresLobos) {
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
    else if (
      estadoActual === Estado.diaComienza ||
      estadoActual === Estado.empateVotacionDia
    ) {
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
      setVotoRealizado(true);
      setJugadorSeleccionado(null);
    }
    // Revelación de la vidente
    else if (estadoActual === Estado.habilidadVidente) {
      socket.emit("videnteRevela", {
        idPartida: idSala,
        idJugador: usuarioID,
        idObjetivo: jugadorObjetivo.id,
      });
      logCustom(
        jornadaActual,
        etapaActual,
        `La vidente local pide visualizar a ${jugadorObjetivo.id}`,
        jugadoresEstado[indiceUsuario]
      );
    } else if (estadoActual === Estado.habilidadBruja) {
      if (botellaSeleccionada == null) {
        mostrarError(
          "Tienes que seleccionar una poción para usarla en un jugador"
        );
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de voto bruja fallido: Ninguna poción seleccionado`,
          jugadoresEstado[indiceUsuario]
        );
        return;
      }
      if (botellaSeleccionada === "muerte" && jugadorObjetivo.id == usuarioID) {
        mostrarError("No puedes lanzarte la poción de muerte a ti misma");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de acción bruja fallido: La bruja intentó matarse a sí misma`,
          jugadoresEstado[indiceUsuario]
        );
        return;
      }
      if (
        botellaSeleccionada === "vida" &&
        jugadorObjetivo.nombre !== nombreVictimaBruja
      ) {
        mostrarError(
          "Solo puedes revivir a la persona que han matado los hombres lobo esta noche"
        );
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de acción bruja fallido: intentó revivir a ${jugadorObjetivo.nombre}, no a ${nombreVictimaBruja}`,
          jugadoresEstado[indiceUsuario]
        );
        return;
      }
      if (botellaSeleccionada === "vida") {
        socket.emit("usaPocionBruja", {
          idPartida: idSala,
          idJugador: usuarioID,
          tipo: "curar",
          idObjetivo: jugadorObjetivo.id,
        });
        logCustom(
          jornadaActual,
          etapaActual,
          `Poción de curar usada`,
          jugadoresEstado[indiceUsuario]
        );
        setBotellaVidaUsada(true);
      } else if (botellaSeleccionada === "muerte") {
        socket.emit("usaPocionBruja", {
          idPartida: idSala,
          idJugador: usuarioID,
          tipo: "matar",
          idObjetivo: jugadorObjetivo.id,
        });
        logCustom(
          jornadaActual,
          etapaActual,
          `Poción de matar usada`,
          jugadoresEstado[indiceUsuario]
        );
        setBotellaMuerteUsada(true);
      }
      setBotellaUsadaEnEsteTurno(true);
    } else if (estadoActual === Estado.habilidadCazador) {
      socket.emit("cazadorDispara", {
        idPartida: idSala,
        idJugador: usuarioID,
        idObjetivo: jugadorObjetivo.id,
      });
      logCustom(
        jornadaActual,
        etapaActual,
        `El cazador usa su habilidad`,
        jugadoresEstado[indiceUsuario]
      );
    } else if (estadoActual === Estado.habilidadAlguacil) {
      socket.emit("elegirSucesor", {
        idPartida: idSala,
        idJugador: usuarioID,
        idObjetivo: jugadorObjetivo.id,
      });
      logCustom(
        jornadaActual,
        etapaActual,
        `El alguacil elige su sucesor`,
        jugadoresEstado[indiceUsuario]
      );
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
    if (jugadorLocalMuerto) {
        mostrarError("Estas muerto :(");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de pasar turno fallido: Usuario muerto`,
          jugadoresEstado[indiceUsuario]
        );
        return;
    }
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
    if (rolUsuario === "Bruja") {
        socket.emit("pasarTurnoBruja", {
          idPartida: idSala,
          idJugador: usuarioID,
        });
        logCustom(
          jornadaActual,
          etapaActual,
          `Evento 'pasarTurnoBruja' emitido`,
          jugadoresEstado[indiceUsuario]
        );
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
  // Funciones para manejar la selección de las pocimas de la bruja.
  // ---------------------------------------------------------------------------

  /**
   * Controla la selección de la pocima de vida.
   * @returns {void}
   */
  const manejarSeleccionBotellaVida = () => {
    setBotellaSeleccionada((prev) => (prev === "vida" ? null : "vida"));
    if (jugadorLocalMuerto) {
        mostrarError("Estas muerto :(");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de lanzar poción turno fallido: Usuario muerto`,
          jugadoresEstado[indiceUsuario]
        );
        return;
    }
    if (pasoTurno) {
        mostrarError("Has pasado turno");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de lanzar poción turno fallido: Turno ya pasado`,
          jugadoresEstado[indiceUsuario]
        );
        return;
    }
    if (botellaUsadaEnEsteTurno) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de botella de vida fallido: el usuario ya ha usado una botella este turno`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("Ya has usado una pocima este turno");
      return;
    }
    if (botellaVidaUsada) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de botella de vida fallido: el usuario ya ha usado la botella de vida`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("Ya has usado la pocima de vida en otro turno");
      return;
    }
  };

  /**
   * Controla la selección de la pocima de muerte.
   * @returns {void}
   */
  const manejarSeleccionBotellaMuerte = () => {
    setBotellaSeleccionada((prev) => (prev === "muerte" ? null : "muerte"));
    if (jugadorLocalMuerto) {
        mostrarError("Estas muerto :(");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de lanzar poción turno fallido: Usuario muerto`,
          jugadoresEstado[indiceUsuario]
        );
        return;
    }
    if (pasoTurno) {
        mostrarError("Has pasado turno");
        logCustom(
          jornadaActual,
          etapaActual,
          `Intento de lanzar poción turno fallido: Turno ya pasado`,
          jugadoresEstado[indiceUsuario]
        );
        return;
    }
    if (botellaUsadaEnEsteTurno) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de botella de muerte fallido: el usuario ya ha usado una botella este turno`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("Ya has usado una pocima este turno");
      return;
    }
    if (botellaMuerteUsada) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de botella de muerte fallido: el usuario ya ha usado la botella de muerte`,
        jugadoresEstado[indiceUsuario]
      );
      mostrarError("Ya has usado la pocima de muerte en otro turno");
      return;
    }
  };

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

  /**
   * Verifica si el jugador local está muerto.
   * Se calcula cada vez que el array de estado de los jugadores se modifica.
   * @return `true` si el jugador local está muerto; de lo contrario, `false`
   */
  const jugadorLocalMuerto = useMemo(() => {
    console.log("indiceUsuario:", indiceUsuario);
    console.log("jugadoresEstado[indiceUsuario]:", jugadoresEstado[indiceUsuario]);
    console.log("estaVivo:", jugadoresEstado[indiceUsuario]?.estaVivo);
  
    return indiceUsuario !== -1
      ? !jugadoresEstado[indiceUsuario]?.estaVivo
      : false;
  }, [jugadoresEstado, indiceUsuario]);

  const [visionJugador, setVisionJugador] = useState("");
  const [resultadoVotosDia, setResultadosVotosDia] = useState("");
  const [muerteYaTratada, setMuerteYaTratada] = useState<boolean>(false);
  const [mensajeFinPartida, setMensajeFinPartida] = useState("");

  // ---------------------------------------------------------------------------
  // Encolar el evento correspondiente cuando el usuario local ha muerto
  // ---------------------------------------------------------------------------

  const prevMuertoRef = useRef<boolean>(jugadorLocalMuerto);
  // ---------------------------------------------------------------------------
  // Recibir eventos del backend
  // ---------------------------------------------------------------------------

  useEffect(() => {
    socket.on("estadoJugadores", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: estadoJugadores - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      setJugadoresEstado(data.jugadores);
    });
    /**
     * Socket.on para escuchar los mensajes del chat diurno.
     */
    socket.on("mensajeChat", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: mensajeChat - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      console.log("Llega el mensaje a Frontend", data);

      var mensaje = data.nombre + ": " + data.mensaje;

      console.log("Tamaño de mensajes.length", mensajes.length);

      const nuevoMensaje: MensajeChat = {
        id: Date.now() + Math.random(),
        texto: mensaje,
      };

      setMensajes((prevMensajes) => [...prevMensajes, nuevoMensaje]);
    });
    /**
     * Socket.on para escuchar los mensajes privados que se intercambian los lobos.
     */
    socket.on("mensajePrivado", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: mensajePrivado - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
    });
    socket.on("iniciarVotacionAlguacil", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: iniciarVotacionAlguacil - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.tiempo != null) {
        setDuracionIniciarVotacionAlguacil(data.tiempo);
      }
      agregarEstado(Estado.iniciarVotacionAlguacil);
    });
    /* Nunca llega?
    socket.on("esperaInicial", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: esperaInicial - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      agregarEstado(Estado.esperaInicial);
    });
    */
    socket.on("nocheComienza", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: nocheComienza - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      agregarEstado(Estado.nocheComienza);
    });
    socket.on("habilidadVidente", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: habilidadVidente - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.tiempo != null) {
        setDuracionHabilidadVidente(data.tiempo);
      }
      agregarEstado(Estado.habilidadVidente);
    });
    socket.on("turnoHombresLobos", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: turnoHombresLobos - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.tiempo != null) {
        setDuracionTurnoHombresLobos(data.tiempo);
      }
      agregarEstado(Estado.turnoHombresLobos);
    });
    socket.on("habilidadBruja", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: habilidadBruja - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.tiempo != null) {
        setDuracionHabilidadBruja(data.tiempo);
      }
      agregarEstado(Estado.habilidadBruja);
    });
    socket.on("habilidadAlguacil", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: habilidadAlguacil - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.tiempo != null) {
        setDuracionHabilidadAlguacil(data.tiempo);
      }
      agregarEstado(Estado.habilidadAlguacil);
    });
    socket.on("habilidadCazador", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: habilidadCazador - ${JSON.stringify(data)}`
      );
      if (data.tiempo != null) {
        setDuracionHabilidadCazador(data.tiempo);
      }
      agregarEstado(Estado.habilidadCazador);
    });
    socket.on("diaComienza", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: diaComienza - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.tiempo != null) {
        setDuracionDiaComienza(data.tiempo);
      }
      agregarEstado(Estado.diaComienza);
    });
    socket.on("partidaFinalizada", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: partidaFinalizada - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      setMensajeFinPartida(data.mensaje);
      agregarEstado(Estado.partidaFinalizada);
    });
    socket.on("votoAlguacilRegistrado", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: votoAlguacilRegistrado - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
    });
    socket.on("empateVotacionAlguacil", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: empateVotacionAlguacil - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      if (data.tiempo != null) {
        setDuracionSegundaVotacionAlguacil(data.tiempo);
      }
      agregarEstado(Estado.iniciarSegundaVotacionAlguacil);
    });
    socket.on("segundoEmpateVotacionAlguacil", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: segundoEmpateVotacionAlguacil - ${JSON.stringify(
          data
        )}`,
        jugadoresEstado[indiceUsuario]
      );
    });
    socket.on("alguacilElegido", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: alguacilElegido - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      const regex =
        /^(.+?) (?:ha sido elegido como alguacil\.|se convierte en el nuevo alguacil\.)/;
      const match = data.mensaje.match(regex);
      setNombreAlguacilElegido(match?.[1] ?? "");
      // Actualizar la información de qué jugador es alguacil
      if (data.alguacil) {
        setJugadoresEstado((prevJugadores) =>
          prevJugadores.map((jugador) =>
            jugador.id == data.alguacil
              ? { ...jugador, esAlguacil: true }
              : jugador
          )
        );
      }
      agregarEstado(Estado.alguacilElegido);
    });
    socket.on("votoRegistrado", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: votoRegistrado - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
    });
    socket.on("resultadoVotosNoche", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: resultadoVotosNoche - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
    });
    socket.on("empateVotacionDia", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: empateVotacionDia - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      agregarEstado(Estado.empateVotacionDia);
    });
    socket.on("segundoEmpateVotacionDia", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: segundoEmpateVotacionDia - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      agregarEstado(Estado.segundoEmpateVotacionDia);
    });
    socket.on("resultadoVotosDia", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: resultadoVotosDia - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      setResultadosVotosDia(data.mensaje);
    });
    socket.on("mensajeBruja", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: mensajeBruja - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
      const regex = /Los lobos van a atacar a ([^\.]+)\./;
      const match = data.mensaje.match(regex);

      if (match) {
        const nombre = match[1];
        setNombreVictimaBruja(nombre);
      }
    });
    socket.on("visionJugador", (data) => {
        logCustom(
          jornadaActual,
          etapaActual,
          `Evento recibido: visionJugador - ${JSON.stringify(data)}`,
          jugadoresEstado[indiceUsuario]
        );
        setVisionJugador(data.mensaje);
      });
    socket.on("jugadorSalido", (data) => {
      logCustom(
        jornadaActual,
        etapaActual,
        `Evento recibido: jugadorSalido - ${JSON.stringify(data)}`,
        jugadoresEstado[indiceUsuario]
      );
    });

    return () => {
      socket.off("estadoJugadores");
      socket.off("mensajeChat");
      socket.off("mensajePrivado");
      socket.off("iniciarVotacionAlguacil");
      socket.off("esperaInicial");
      socket.off("nocheComienza");
      socket.off("habilidadVidente");
      socket.off("turnoHombresLobos");
      socket.off("habilidadBruja");
      socket.off("habilidadAlguacil");
      socket.off("habilidadCazador");
      socket.off("diaComienza");
      socket.off("partidaFinalizada");
      socket.off("votoAlguacilRegistrado");
      socket.off("empateVotacionAlguacil");
      socket.off("segundoEmpateVotacionAlguacil");
      socket.off("alguacilElegido");
      socket.off("votoRegistrado");
      socket.off("resultadoVotosNoche");
      socket.off("empateVotacionDia");
      socket.off("segundoEmpateVotacionDia");
      socket.off("resultadoVotosDia");
      socket.off("mensajeBruja");
      socket.off("visionJugador");
      socket.off("jugadorSalido");
    };
  }, [idSala, jugadoresEstado, indiceUsuario]);

  // ---------------------------------------------------------------------------
  // Cola de estados
  // ---------------------------------------------------------------------------

  /**
   * Cola de estados que define el flujo del juego (FIFO).
   */
  const [colaEstados, setColaEstados] = useState<Estado[]>([]);

  /**
   * Estado actual del juego, sacado de la cola.
   */
  const [estadoActual, setEstadoActual] = useState<Estado | null>(null);

  /**
   * Flag para controlar ejecución secuencial
   */
  const [procesando, setProcesando] = useState(false); // Nuevo estado para controlar ejecución

  // Referencia para acceder al valor actual de colaEstados
  const colaEstadosRef = useRef<Estado[]>([]);
  useEffect(() => {
    colaEstadosRef.current = colaEstados;
  }, [colaEstados]);

  const prevEstadoRef = useRef<Estado | null>(null);

  async function procesarFinalEstado(estado: Estado): Promise<void> {
    switch (estado) {
      case Estado.habilidadVidente:
        if (!hayVidenteViva) break;
        if (rolUsuario === "Vidente") {
          setPlantillaActual(plantillaAnimacionNoche);
          cerrarHabilidad();
          cerrarChat();
          setMostrarAnimacionEjecutarHabilidadVidente(true);

          await new Promise((resolve) =>
            setTimeout(resolve, duracionAnimacion)
          );

          setMostrarAnimacionEjecutarHabilidadVidente(false);
          setRolObjetivoVidente(""); // Limpiar, por si la vidente no envía/recibe una nueva petición tras esta, que se marque claramente que no ha recibido nada
        }

        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionFinalHabilidadVidente(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionFinalHabilidadVidente(false);
        break;
      case Estado.turnoHombresLobos:
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionFinalTurnoHombresLobo(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionFinalTurnoHombresLobo(false);
        break;
      case Estado.habilidadBruja:
        if (!hayBrujaViva) break;
        setBotellaUsadaEnEsteTurno(false);
        setNombreVictimaBruja(""); // Limpiar, por si la bruja no recibe una nueva petición tras esta, que se marque claramente que no ha recibido nada
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionFinalHabilidadBruja(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionFinalHabilidadBruja(false);
        break;
      case Estado.habilidadAlguacil:
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionFinalHabilidadAlguacil(true);

        const nuevosJugadores = await new Promise<typeof jugadoresEstado>(
          (resolve) => {
            const handler = (data: { jugadores: typeof jugadoresEstado }) => {
              socket.off("estadoJugadores", handler);
              resolve(data.jugadores);
            };
            socket.on("estadoJugadores", handler);
            socket.emit("obtenerEstadoJugadores", { idPartida: idSala });
          }
        );

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionFinalHabilidadAlguacil(false);
        break;
      case Estado.habilidadCazador:
        if (etapaActual === "Día") {
          setPlantillaActual(plantillaAnimacionDia);
        } else {
          setPlantillaActual(plantillaAnimacionNoche);
        }
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionFinalTurnoCazador(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionFinalTurnoCazador(false);
        break;
    case Estado.diaComienza:
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionResultadosDia(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionResultadosDia(false);
        break;
      default:
        break;
    }
  }

  /**
   * Procesa el siguiente estado en la cola de forma segura.
   */
  const procesarSiguienteEstado = async () => {
    if (procesando || colaEstadosRef.current.length === 0) return;
    setProcesando(true);

    const siguiente = colaEstadosRef.current[0];

    if (prevEstadoRef.current !== null) {
      try {
        await procesarFinalEstado(prevEstadoRef.current);
      } catch (err) {
        console.error("Error exit de", prevEstadoRef.current, err);
      }
    }

    prevEstadoRef.current = siguiente;

    setColaEstados((prev) => prev.slice(1));
    setEstadoActual(siguiente);

    await procesarEstado(siguiente);

    setProcesando(false);
  };

  /**
   * Bucle principal optimizado
   */
  useEffect(() => {
    if (!procesando && colaEstadosRef.current.length > 0) {
      procesarSiguienteEstado();
    }
  }, [colaEstados, procesando]); // Dependencias esenciales

  /**
   * Función para añadir estados garantizando orden
   */
  const agregarEstado = (nuevo: Estado) => {
    setColaEstados((prev) => [...prev, nuevo]); // Actualización funcional
  };

  /**
   * Tratamiento de cada estado
   * @param estado
   */
  const procesarEstado = async (estado: Estado): Promise<void> => {
    switch (estado) {
      case Estado.esperaInicial:
        setPlantillaActual(plantillaAnimacionDia);

        setMostrarAnimacionInicio1(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicio1(false);
        setMostrarAnimacionInicio2(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicio2(false);
        setMostrarAnimacionInicio3(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicio3(false);

        actualizarMaxTiempo(duracionEsperaInicial);
        setTemporizadorActivo(true);
        setPlantillaActual(plantillaEsperaInicial);

        break;
      case Estado.iniciarVotacionAlguacil:
        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionPrimeraVotacionAlguacil(true);

        // Esperar a que termine la animación antes de continuar
        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionPrimeraVotacionAlguacil(false);
        setPlantillaActual(plantillaVotacionAlguacil);
        actualizarMaxTiempo(CONST_TIEMPO_VOTACION_ALGUACIL);
        actualizarMaxTiempo(duracionIniciarVotacionAlguacil);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      case Estado.iniciarSegundaVotacionAlguacil:
        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionSegundaVotacionAlguacil(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionSegundaVotacionAlguacil(false);
        setPlantillaActual(plantillaVotacionAlguacil);
        actualizarMaxTiempo(duracionSegundaVotacionAlguacil);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      case Estado.alguacilElegido:
        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionAlguacilElegido(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionAlguacilElegido(false);
        break;
      case Estado.nocheComienza:
        const jugadoresNuevos = await new Promise<typeof jugadoresEstado>(
            (resolve) => {
                const handler = (data: { jugadores: typeof jugadoresEstado }) => {
                socket.off("estadoJugadores", handler);
                resolve(data.jugadores);
                };
                socket.on("estadoJugadores", handler);
                socket.emit("obtenerEstadoJugadores", { idPartida: idSala });
            }
            );
            setJugadoresEstado(jugadoresNuevos);
        setEtapaActual("Noche");
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionNocheComienza(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionNocheComienza(false);
        break;
      case Estado.habilidadVidente:
        if (!hayVidenteViva) break;
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionInicioHabilidadVidente(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicioHabilidadVidente(false);
        setPlantillaActual(plantillaHabilidadVidente);
        actualizarMaxTiempo(duracionHabilidadVidente);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      case Estado.turnoHombresLobos:
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionInicioTurnoHombresLobo(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicioTurnoHombresLobo(false);

        setPlantillaActual(plantillaVotacionHombresLobo);
        actualizarMaxTiempo(duracionTurnoHombresLobos);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      case Estado.habilidadBruja:
        if (!hayBrujaViva) break;
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();

        setMostrarAnimacionInicioHabilidadBruja(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicioHabilidadBruja(false);

        if (rolUsuario === "Bruja") {
          setPlantillaActual(plantillaAnimacionNoche);
          cerrarHabilidad();
          cerrarChat();
          setMostrarAnimacionEnseñarVictimaALaBruja(true);

          await new Promise((resolve) =>
            setTimeout(resolve, duracionAnimacion)
          );

          setMostrarAnimacionEnseñarVictimaALaBruja(false);
        }

        setPlantillaActual(plantillaHabilidadBruja);
        actualizarMaxTiempo(duracionHabilidadBruja);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      case Estado.habilidadAlguacil:
        setPlantillaActual(plantillaAnimacionNoche);
        cerrarHabilidad();
        cerrarChat();

        setMostrarAnimacionInicioHabilidadAlguacil(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicioHabilidadAlguacil(false);

        setPlantillaActual(plantillaHabilidadAlguacil);
        actualizarMaxTiempo(duracionHabilidadAlguacil);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);

        break;
      case Estado.habilidadCazador:
        if (etapaActual === "Día") {
          setPlantillaActual(plantillaAnimacionDia);
        } /* else if (etapaActual === "Noche" )*/ else {
          setPlantillaActual(plantillaAnimacionNoche);
        }
        cerrarHabilidad();
        cerrarChat();

        setMostrarAnimacionInicioTurnoCazador(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionInicioTurnoCazador(false);

        if (etapaActual === "Día") {
          setPlantillaActual(plantillaHabilidadCazadorDia);
        } /* else if (etapaActual === "Noche" )*/ else {
          setPlantillaActual(plantillaHabilidadCazadorNoche);
        }

        actualizarMaxTiempo(duracionHabilidadCazador);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      case Estado.diaComienza:
        const nuevosJugadores = await new Promise<typeof jugadoresEstado>(
          (resolve) => {
            const handler = (data: { jugadores: typeof jugadoresEstado }) => {
              socket.off("estadoJugadores", handler);
              resolve(data.jugadores);
            };
            socket.on("estadoJugadores", handler);
            socket.emit("obtenerEstadoJugadores", { idPartida: idSala });
          }
        );

        setJugadoresEstado(nuevosJugadores);
        setEtapaActual("Día");
        setJornadaActual(jornadaActual + 1);
        setOpacity(0.5); // Si no estuviese esto, no le daría tiempo a actualizarse para este case

        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();
        setMostrarAnimacionInicioDia1(true);

        await new Promise((resolve) =>
          setTimeout(resolve, duracionAnimacion * 2)
        );

        setMostrarAnimacionInicioDia1(false);

        logCustom(
            jornadaActual,
            etapaActual,
            `Valor de jugadorLocalMuerto = ${jugadorLocalMuerto}`,
            jugadoresEstado[indiceUsuario]
          );
          const antes = prevMuertoRef.current;
          const ahora = jugadorLocalMuerto;
      
          if (!antes && ahora) {
            logCustom(
              jornadaActual,
              etapaActual,
              `Evento local detectado: usuarioLocalMuerto`,
              jugadoresEstado[indiceUsuario]
            );
            agregarEstado(Estado.usuarioLocalMuerto);
            break;
          }
      
        prevMuertoRef.current = ahora;

        setPlantillaActual(plantillaEsperaInicial);
        actualizarMaxTiempo(3);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);

        await new Promise((resolve) => setTimeout(resolve, 3000));

        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();

        setMostrarAnimacionInicioDia2(true);

        await new Promise((resolve) =>
          setTimeout(resolve, duracionAnimacion * 2)
        );

        setMostrarAnimacionInicioDia2(false);

        setPlantillaActual(plantillaVotacionDiurna);
        actualizarMaxTiempo(duracionDiaComienza);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      case Estado.usuarioLocalMuerto:
        logCustom(
            jornadaActual,
            etapaActual,
            `Tratando muerte de usuario`,
            jugadoresEstado[indiceUsuario]
          );
        if (etapaActual === "Día") {
          setPlantillaActual(plantillaAnimacionDia);
        } /* else if (etapaActual === "Noche" )*/ else {
          setPlantillaActual(plantillaAnimacionNoche);
        }
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);

        setMostrarAnimacionUsuarioLocalMuerto(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionUsuarioLocalMuerto(false);

        if (rolUsuario === "Cazador") break;
        agregarEstado(Estado.partidaFinalizada);

        break;
      case Estado.empateVotacionDia:
        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();

        setMostrarAnimacionEmpateVotacionDiurna(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionEmpateVotacionDiurna(false);

        setPlantillaActual(plantillaVotacionDiurna);
        actualizarMaxTiempo(duracionEmpateVotacionDia);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);

        break;
      case Estado.segundoEmpateVotacionDia:
        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();

        setMostrarAnimacionSegundoEmpateVotacionDiurna(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionSegundoEmpateVotacionDiurna(false);

        setPlantillaActual(plantillaVotacionDiurna);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);

        break;
      case Estado.partidaFinalizada:
        animacionesInicialesYaEjecutadas[idSala] = true;
        setPlantillaActual(plantillaAnimacionDia);
        cerrarHabilidad();
        cerrarChat();

        setMostrarAnimacionFinPartida(true);

        await new Promise((resolve) => setTimeout(resolve, duracionAnimacion));

        setMostrarAnimacionFinPartida(false);

        setPlantillaActual(plantillaVotacionDiurna);
        reiniciarTemporizador();
        setVotoRealizado(false);
        setPasoTurno(false);
        setJugadorSeleccionado(null);
        break;
      default:
        break;
    }
  };

  if (!fuentesCargadas) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /**
   * Datos de la sala parseados desde JSON.
   */
  const sala = JSON.parse(salaData);

  return (
    <TouchableWithoutFeedback>
      <View style={estilos.contenedor}>
        <ImageBackground
          source={CONSTANTES.IMAGENES.FONDO}
          style={estilos.fondo}
          resizeMode="cover"
        />
        <Animated.View
          style={[estilos.superposicion, { opacity: animacionFondo }]}
        />
        {mostrarAnimacionInicio1 && (
          <AnimacionGenerica
            opacity={opacitiesInicio[0]}
            mostrarComponente={mostrarComponentesInicio[0]}
            texto="AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS"
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
          <AnimacionGenerica
            opacity={opacitiesInicio[2]}
            mostrarComponente={mostrarComponentesInicio[2]}
            texto="EMPIEZA LA PARTIDA"
          />
        )}
        {mostrarAnimacionPrimeraVotacionAlguacil && (
          <AnimacionGenerica
            opacity={opacitiesPrimeraVotacionAlguacil[0]}
            mostrarComponente={mostrarComponentesPrimeraVotacionAlguacil[0]}
            texto="LOS JUGADORES DEBEN ELEGIR DE MANERA POR MAYORÍA SIMPLE QUIEN EJERCERÁ DE ALGUACIL"
          />
        )}
        {mostrarAnimacionSegundaVotacionAlguacil && (
          <AnimacionGenerica
            opacity={opacitiesSegundaVotacionAlguacil[0]}
            mostrarComponente={mostrarComponentesSegundaVotacionAlguacil[0]}
            texto="NINGÚN CANDIDATO TIENE LA MAYORÍA SIMPLE, SE REPITEN LAS ELECCIONES DE ALGUACIL "
          />
        )}
        {mostrarAnimacionAlguacilElegido && (
          <AnimacionGenerica
            opacity={opacitiesAlguacilElegido[0]}
            mostrarComponente={mostrarComponentesAlguacilElegido[0]}
            texto={
              !nombreAlguacilElegido // cubre "" o undefined
                ? "NO SE HA LLEGADO A UN ACUERDO DE QUIÉN ES EL ALGUACIL"
                : jugadoresEstado[indiceUsuario]?.esAlguacil
                ? "HAS SIDO EL ELEGIDO POR EL PUEBLO"
                : `${(
                    nombreAlguacilElegido || ""
                  ).toUpperCase()} ES EL ALGUACIL`
            }
          />
        )}
        {mostrarAnimacionNocheComienza && (
          <AnimacionGenerica
            opacity={opacitiesNocheComienza[0]}
            mostrarComponente={mostrarComponentesNocheComienza[0]}
            texto="SE HACE DE NOCHE, LOS SUPERVIVIENTES SE VUELVEN A DORMIR"
          />
        )}
        {mostrarAnimacionInicioHabilidadVidente && (
          <AnimacionGenerica
            opacity={opacitiesInicioHabilidadVidente[0]}
            mostrarComponente={mostrarComponentesInicioHabilidadVidente[0]}
            texto="LA VIDENTE SE DESPIERTA Y SEÑALA A UN JUGADOR DEL QUE QUIERE CONOCER LA VERDADERA PERSONALIDAD"
          />
        )}
        {mostrarAnimacionFinalHabilidadVidente && (
          <AnimacionGenerica
            opacity={opacitiesFinalHabilidadVidente[0]}
            mostrarComponente={mostrarComponentesFinalHabilidadVidente[0]}
            texto="LA VIDENTE SE VUELVE A DORMIR"
          />
        )}
        {mostrarAnimacionEjecutarHabilidadVidente && (
          <AnimacionGenerica
            opacity={opacitiesEjecutarHabilidadVidente[0]}
            mostrarComponente={mostrarComponentesEjecutarHabilidadVidente[0]}
            texto={
              visionJugador !== ""
                ? visionJugador
                : "NO HAS SELECCIONADO A UN JUGADOR AL QUE VISUALIZAR"
            }
          />
        )}
        {mostrarAnimacionInicioTurnoHombresLobo && (
          <AnimacionGenerica
            opacity={opacitiesInicioTurnoHombresLobo[0]}
            mostrarComponente={mostrarComponentesInicioTurnoHombresLobo[0]}
            texto="LOS HOMBRES LOBO SE DESPIERTAN, SE RECONOCEN Y DESIGNAN UNA NUEVA VÍCTIMA"
          />
        )}
        {mostrarAnimacionFinalTurnoHombresLobo && (
          <AnimacionGenerica
            opacity={opacitiesFinalTurnoHombresLobo[0]}
            mostrarComponente={mostrarComponentesFinalTurnoHombresLobo[0]}
            texto="LOS HOMBRES LOBO SACIADOS VUELVEN A DORMIRSE Y SUEÑAN CON PRÓXIMAS Y SABROSAS VÍCTIMAS"
          />
        )}
        {mostrarAnimacionInicioHabilidadBruja && (
          <AnimacionGenerica
            opacity={opacitiesInicioHabilidadBruja[0]}
            mostrarComponente={mostrarComponentesFinalHabilidadBruja[0]}
            texto="LA BRUJA SE DESPIERTA, OBSERVA VÍCTIMA DE LOS LOBOS. ¿USARÁ SU POCIÓN CURATIVA O SU POCIÓN VENENOSA?"
          />
        )}
        {mostrarAnimacionFinalHabilidadBruja && (
          <AnimacionGenerica
            opacity={opacitiesFinalHabilidadBruja[0]}
            mostrarComponente={mostrarComponentesFinalHabilidadBruja[0]}
            texto="LA BRUJA SE VUELVE A DORMIR"
          />
        )}
        {mostrarAnimacionEnseñarVictimaALaBruja && (
          <AnimacionGenerica
            opacity={opacitiesEnseñarVictimaALaBruja[0]}
            mostrarComponente={mostrarComponentesEnseñarVictimaALaBruja[0]}
            texto={
              nombreVictimaBruja === ""
                ? `LOS HOMBRES LOBO NO HAN DEVORADO A NADIE`
                : `LOS HOMBRES LOBO HAN DEVORADO A ${nombreVictimaBruja.toUpperCase()}`
            }
          />
        )}
        {mostrarAnimacionInicioDia1 && (
          <AnimacionGenerica
            opacity={opacitiesInicioDia1[0]}
            mostrarComponente={mostrarComponentesInicioDia1[0]}
            texto="AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS"
          />
        )}
        {mostrarAnimacionInicioDia1 && (
          <AnimacionGenerica
            opacity={opacitiesInicioDia1[1]}
            mostrarComponente={mostrarComponentesInicioDia1[1]}
            texto="A CONTINUACIÓN SE MUESTRAN LAS VÍCTIMAS DE LA ÚLTIMA NOCHE"
          />
        )}
        {mostrarAnimacionInicioDia2 && (
          <AnimacionGenerica
            opacity={opacitiesInicioDia2[0]}
            mostrarComponente={mostrarComponentesInicioDia2[0]}
            texto="LOS JUGADORES DEBEN ELIMINAR DE MANERA MAYORÍA SIMPLE A UN SOPECHOSO DE SER HOMBRE LOBO"
          />
        )}
        {mostrarAnimacionInicioDia2 && (
          <AnimacionGenerica
            opacity={opacitiesInicioDia2[1]}
            mostrarComponente={mostrarComponentesInicioDia2[1]}
            texto="COMIENZAN LAS VOTACIONES"
          />
        )}
        {mostrarAnimacionUsuarioLocalMuerto && (
          <AnimacionGenerica
            opacity={opacitiesUsuarioLocalMuerto[1]}
            mostrarComponente={mostrarComponentesUsuarioLocalMuerto[1]}
            texto="HAS MUERTO"
          />
        )}
        {mostrarAnimacionInicioTurnoCazador && (
          <AnimacionGenerica
            opacity={opacitiesInicioTurnoCazador[0]}
            mostrarComponente={mostrarComponentesInicioTurnoCazador[0]}
            texto="EL CAZADOR VA A MORIR. DISPARARÁ A QUIÉN CREA QUE ES UN HOMBRE LOBO"
          />
        )}
        {mostrarAnimacionFinalTurnoCazador && (
          <AnimacionGenerica
            opacity={opacitiesFinalTurnoCazador[0]}
            mostrarComponente={mostrarComponentesFinalTurnoCazador[0]}
            texto="EL CAZADOR CAE ÉPICAMENTE EN EL SUELO MUERTO."
          />
        )}
        {mostrarAnimacionInicioHabilidadAlguacil && (
          <AnimacionGenerica
            opacity={opacitiesInicioHabilidadAlguacil[0]}
            mostrarComponente={mostrarComponentesInicioHabilidadAlguacil[0]}
            texto="EL ALGUACIL VA A MORIR. ELIGIRÁ A SU NUEVO SUCESOR"
          />
        )}
        {mostrarAnimacionFinalHabilidadAlguacil && (
          <AnimacionGenerica
            opacity={opacitiesFinalHabilidadAlguacil[0]}
            mostrarComponente={mostrarComponentesFinalHabilidadAlguacil[0]}
            texto="EL ANTIGUO ALGUACIL CAE ÉPICAMENTE EN EL SUELO MUERTO."
          />
        )}
        {mostrarAnimacionEmpateVotacionDiurna && (
          <AnimacionGenerica
            opacity={opacitiesEmpateVotacionDiurna[0]}
            mostrarComponente={mostrarComponentesEmpateVotacionDiurna[0]}
            texto="NO SE HA LLEGADO A UNA MAYORÍA SIMPLE DE A QUÉ JUGADOR MATAR."
          />
        )}
        {mostrarAnimacionSegundoEmpateVotacionDiurna && (
          <AnimacionGenerica
            opacity={opacitiesSegundoEmpateVotacionDiurna[0]}
            mostrarComponente={mostrarComponentesSegundoEmpateVotacionDiurna[0]}
            texto="NO SE HA LLEGADO A UNA MAYORÍA SIMPLE DE A QUÉ JUGADOR MATAR."
          />
        )}
        {mostrarAnimacionResultadosDia && (
          <AnimacionGenerica
            opacity={opacitiesResultadosDia[0]}
            mostrarComponente={mostrarComponentesResultadosDia[0]}
            texto={
              resultadoVotosDia !== ""
                ? resultadoVotosDia
                : "EL PUEBLO NO SE HA PUESTO DE ACUERDO DE A QUIÉN LINCHAR"
            }
          />
        )}
        {mostrarAnimacionFinPartida && (
          <AnimacionGenerica
            opacity={opacitiesFinPartida[0]}
            mostrarComponente={mostrarComponentesFinPartida[0]}
            texto={`${mensajeFinPartida}`}
          />
        )}
        {errorMessage && (
          <MensajeError
            errorMessage={errorMessage}
            animacionError={animacionError}
          />
        )}

        {plantillaActual.mostrarBarraSuperior && (
          <BarraSuperior
            vivos={vivos}
            lobos={lobosVivos}
            jornada={jornadaActual}
            etapa={etapaActual}
          />
        )}
        {plantillaActual.mostrarTemporizador && (
          <View style={estilos.contenedorTemporizador}>
            <View style={estilos.circuloTemporizador}>
              <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
            </View>
          </View>
        )}
        {plantillaActual.mostrarCirculoJugadores && (
          <CirculoVotar
            jugadores={jugadoresEstado}
            votes={Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0)} // Modificar si se quiere implementar los contadores de votos
            JugadorSeleccionado={JugadorSeleccionado}
            onSelectPlayer={administrarSeleccionJugadorVotacion}
          />
        )}
        {plantillaActual.mostrarControlesAccion && (
          <ControlesAccion
            habilidadInfo={habilidadInfo}
            abrirHabilidad={handleAbrirHabilidad}
            abrirChat={handleAbrirChat}
            votarAJugador={votarAJugador}
            manejarPasarTurno={manejarPasarTurno}
            mostrarBotonesAccion={() => plantillaActual.mostrarControlesAccion}
            votoRealizado={votoRealizado}
            turnoPasado={pasoTurno}
            mostrarVotacion={plantillaActual.mostrarBotonVotar}
            mostrarBotellaVida={plantillaActual.mostrarBotellas}
            mostrarBotellaMuerte={plantillaActual.mostrarBotellas}
            botellaVidaUsada={botellaVidaUsada}
            botellaMuerteUsada={botellaMuerteUsada}
            manejarBotellaVida={manejarSeleccionBotellaVida}
            manejarBotellaMuerte={manejarSeleccionBotellaMuerte}
            botellaSeleccionada={botellaSeleccionada}
            textoBotonVotar={plantillaActual.textoBotonVotar}
            mostrarBotonPasarTurno={plantillaActual.mostrarBotonPasarTurno}
          />
        )}
        {/*
            Medalla de alguacil si el usuario local es alguacil.
        */}
        {indiceUsuario !== -1 &&
          jugadoresEstado[indiceUsuario]?.esAlguacil &&
          jugadoresEstado[indiceUsuario]?.estaVivo &&
          plantillaActual.mostrarMedallaAlguacilPropia && (
            <Image
              source={require("@/assets/images/alguacil-icon.png")}
              style={estilos.iconoAlguacil}
            />
          )}

        {mostrarChat && (
          <Chat
            mensajes={mensajes}
            posicionChat={posicionChat}
            onClose={handleCerrarChat}
            socket={socket}
            idSala={idSala}
            usuarioID={usuarioID}
            usuarioNombre={usuarioNombre}
          />
        )}
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

export default Jugando;
