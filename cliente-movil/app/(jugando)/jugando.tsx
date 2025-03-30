/**
 * @file PantallaJugando.tsx
 * @description Componente principal de la pantalla de juego.
 * Maneja la lógica del juego, incluyendo estados, temporizador, votaciones, chat y habilidades, sin animaciones.
 * @module PantallaJugando
 */
import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";

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

// Hooks (administran estado)
import useTemporizador from "./hooks/useTemporizador";
import useAnimacionChat from "./hooks/useAnimacionChat";
import useAnimacionHabilidad from "./hooks/useAnimacionHabilidad";
import useMensajeError from "./hooks/useMensajeError";
import useDiaNoche from "./hooks/useDiaNoche";
import useGestorAnimaciones from "./hooks/useGestorAnimaciones";

/**
 * @constant {boolean} MODO_NOCHE_GLOBAL
 * Indica si el juego se encuentra en modo noche. Si es false, se considera modo día.
 */
export let MODO_NOCHE_GLOBAL = true;

/**
 * Componente funcional que representa la pantalla principal de juego.
 *
 * @returns {JSX.Element | null} El componente renderizado o null si las fuentes no se han cargado.
 */
const PantallaJugando: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Carga de fuentes
  // ---------------------------------------------------------------------------
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/corben-regular.ttf"),
  });

  // ---------------------------------------------------------------------------
  // Estados del Juego
  // ---------------------------------------------------------------------------
  const [jornadaActual, setJornadaActual] = useState<number>(1);
  const [etapaActual, setEtapaActual] = useState<"Día" | "Noche">(
    MODO_NOCHE_GLOBAL ? "Noche" : "Día"
  );
  const [jugadoresVivos, setJugadoresVivos] = useState<boolean[]>(
    Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(true)
  );

  // ---------------------------------------------------------------------------
  // Estados de la Interfaz de Usuario (UI)
  // ---------------------------------------------------------------------------

  /**
   * Controla la visualización de los botones de acción pasar turno y votar.
   * @type {boolean}
   */
  const [mostrarBotones, setMostrarBotones] = useState<boolean>(false);

  /**
   * Controla la visualización del chat.
   * @type {boolean}
   */
  const [mostrarChat, setMostrarChat] = useState<boolean>(false);

  /**
   * Guarda el índice del jugador seleccionado para votar.
   * @type {number | null}
   */
  const [JugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(
    null
  );

  /**
   * Registra los votos de cada jugador.
   * @type {number[]}
   */
  const [votes, setVotos] = useState<number[]>(
    Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0)
  );

  /**
   * Controla la visualización de la ventana de habilidad.
   * @type {boolean}
   */
  const [mostrarHabilidad, setMostrarHabilidad] = useState<boolean>(false);

  /**
   * Lista de imágenes asociadas a cada jugador.
   * @type {string[]}
   */
  const [imagenes] = useState<string[]>(
    new Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(
      CONSTANTES.IMAGENES.JUGADORES
    )
  );

  /**
   * Índice del usuario local.
   * @type {number}
   */
  const [indiceUsuario] = useState<number>(0);

  /**
   * Rol del usuario local.
   * @type {Rol}
   */
  const [rolUsuario, setRolUsuario] = useState<Rol>("Aldeano"); // Por defecto villager

  /**
   * Indica si el usuario ya realizó su voto.
   * @type {boolean}
   */
  const [votoRealizado, setVotoRealizado] = useState<boolean>(false);

  /**
   * Indica si el usuario ha pasado su turno.
   * @type {boolean}
   */
  const [pasoTurno, setPasoTurno] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // Obtención de información adicional a partir del rol del jugador.
  // ---------------------------------------------------------------------------
  const { habilidadInfo, roleInfo } = getInfoRol(rolUsuario);

  // ---------------------------------------------------------------------------
  // Hooks para la animación de inicio
  // ---------------------------------------------------------------------------
  const [mostrarAnimacionInicio1, setMostrarAnimacionInicio1] =
    useState<boolean>(true);
  const [mostrarAnimacionInicio2, setMostrarAnimacionInicio2] =
    useState<boolean>(false);
  const [mostrarAnimacionInicio3, setMostrarAnimacionInicio3] =
    useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // Hook para la animación del modo día/noche
  // ---------------------------------------------------------------------------
  const { animacionFondo, setModoDiaNoche } = useDiaNoche(MODO_NOCHE_GLOBAL);

  // ---------------------------------------------------------------------------
  // Hooks para administrar el temporizador, el chat, la habilidad y errores.
  // ---------------------------------------------------------------------------

  /**
   * Hook que administra el temporizador del juego.
   * @returns {tiempoRestante, reiniciarTemporizador, setTemporizadorActivo}
   */
  const { tiempoRestante, reiniciarTemporizador, setTemporizadorActivo } =
    useTemporizador(CONSTANTES.NUMERICAS.TIEMPO_INICIAL, false);

  /**
   * Hook que administra la animación del chat.
   * @returns {posicionChat, abrirChat, cerrarChat}
   */
  const { posicionChat, abrirChat, cerrarChat } = useAnimacionChat();

  /**
   * Hook que administra la animación de la ventana de habilidad.
   * @returns {posicionHabilidad, abrirHabilidad, cerrarHabilidad}
   */
  const { posicionHabilidad, abrirHabilidad, cerrarHabilidad } =
    useAnimacionHabilidad();

  /**
   * Hook que administra los mensajes de error en la interfaz.
   * @returns {errorMessage, mostrarError, animacionError}
   */
  const { errorMessage, mostrarError, animacionError } = useMensajeError();

  const duracionFadeIn = 1000; // 1 segundo
  const duracionEspera = 2000; // 2 segundos
  const duracionFadeOut = 1000; // 1 segundo
  const { opacities, mostrarComponentes } = useGestorAnimaciones({
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones: 3, // 3 animaciones iniciales concatenadas :)
  });

  // ---------------------------------------------------------------------------
  // Logs custom
  // ---------------------------------------------------------------------------

  const coloresConsola = [
    "\x1b[31m", // Rojo (Jornada 1)
    "\x1b[32m", // Verde (Jornada 2)
    "\x1b[33m", // Amarillo (Jornada 3)
    "\x1b[34m", // Azul (Jornada 4)
    "\x1b[35m", // Magenta (Jornada 5r)
    "\x1b[36m", // Cian (Jornada 6)
    "\x1b[37m", // Blanco (Jornada 7)
  ];

  function logCustom(
    jornadaActual: number,
    etapaActual: "Día" | "Noche",
    message: string
  ) {
    console.log(
      `${
        coloresConsola[jornadaActual % coloresConsola.length]
      }[Jornada ${jornadaActual} - ${etapaActual}] ${message}\x1b[0m`
    );
  }

  // ---------------------------------------------------------------------------
  // Efectos de inicialización y actualización
  // ---------------------------------------------------------------------------

  /**
   * Efecto de inicialización:
   * - Selecciona un rol aleatorio para el usuario.
   * - Activa la visualización de los botones de acción.
   */
  useEffect(() => {
    const roles: Rol[] = [
      "Aldeano", 
      "Hombre lobo", 
      "Bruja", 
      "Cazador", 
      "Vidente", 
    ];

    const indiceAleatorio: number = Math.floor(Math.random() * roles.length);
    const rolAsignado = roles[indiceAleatorio];

    setRolUsuario(rolAsignado);
    console.log(`Juego iniciado. Rol asignado: ${rolAsignado}`);

    setTimeout(() => {
      setMostrarAnimacionInicio1(false);
      setMostrarAnimacionInicio2(true);
      setTimeout(() => {
        setMostrarAnimacionInicio2(false);
        setMostrarAnimacionInicio3(true);
        setTimeout(() => {
          setMostrarAnimacionInicio3(false);
          setMostrarBotones(true);
          MODO_NOCHE_GLOBAL = false;
          setModoDiaNoche(MODO_NOCHE_GLOBAL);
        }, 4000);
      }, 4000);
    }, 4000);
  }, []);

  /**
   * Efecto que se dispara cuando el temporizador llega a 0.
   * Alterna el modo (día/noche), reinicia los estados de votación y resetea el temporizador.
   */
  useEffect(() => {
    if (tiempoRestante === 0) {
      const nuevoModo: boolean = !MODO_NOCHE_GLOBAL;
      MODO_NOCHE_GLOBAL = nuevoModo;
      setModoDiaNoche(nuevoModo);

      const nuevaEtapa = nuevoModo ? "Noche" : "Día";
      const esNuevoDia = nuevoModo === false;
      const nuevaJornada = esNuevoDia ? jornadaActual + 1 : jornadaActual;

      if (!votoRealizado) {
        logCustom(
          jornadaActual,
          etapaActual,
          `El jugador no ha votado en esta etapa`
        );
      }

      logCustom(nuevaJornada, nuevaEtapa, `Comenzando nueva etapa`);

      if (!MODO_NOCHE_GLOBAL) {
        logCustom(nuevaJornada, nuevaEtapa, `Estado de vida de los jugadores:`);
        jugadoresVivos.forEach((estado, index) => {
          logCustom(
            nuevaJornada,
            nuevaEtapa,
            `- Jugador ${index + 1}: ${estado ? "Vivo" : "Muerto"}`
          );
        });
      }

      setEtapaActual(nuevaEtapa);
      if (esNuevoDia) {
        setJornadaActual(nuevaJornada);
      }

      setVotos(Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0));
      setVotoRealizado(false);
      setPasoTurno(false);
      setJugadorSeleccionado(null);
      reiniciarTemporizador();
    }
  }, [tiempoRestante]);

  /**
   * Efecto que activa el temporizador al montar el componente.
   * Es para poder retrasar su activación hasta después de las animaciones
   */
  useEffect(() => {
    setTemporizadorActivo(true);
  }, []);

  // ---------------------------------------------------------------------------
  // Funciones de manejo de eventos
  // ---------------------------------------------------------------------------

  /**
   * Abre el chat y activa la animación correspondiente.
   *
   * @returns {void}
   */
  const handleAbrirChat = (): void => {
    logCustom(jornadaActual, etapaActual, `Chat abierto`);
    setMostrarChat(true);
    abrirChat();
  };

  /**
   * Cierra el chat y desactiva la animación correspondiente.
   *
   * @returns {void}
   */
  const handleCerrarChat = (): void => {
    logCustom(jornadaActual, etapaActual, `Chat cerrado`);
    cerrarChat();
    setMostrarChat(false);
  };

  /**
   * Abre la ventana de habilidad y activa la animación correspondiente.
   *
   * @returns {void}
   */
  const handleAbrirHabilidad = (): void => {
    logCustom(jornadaActual, etapaActual, `Ventana de habilidad abierta`);
    setMostrarHabilidad(true);
    abrirHabilidad();
  };

  /**
   * Cierra la ventana de habilidad y desactiva la animación correspondiente.
   *
   * @returns {void}
   */
  const handleCerrarHabilidad = (): void => {
    logCustom(jornadaActual, etapaActual, `Ventana de habilidad cerrada`);
    cerrarHabilidad();
    setMostrarHabilidad(false);
  };

  /**
   * Administra la selección de un jugador para la votación.
   *
   * @param {number} index - Índice del jugador seleccionado.
   * @returns {void}
   */
  const administrarSeleccionJugadorVotacion = (index: number): void => {
    // Solo los lobos pueden seleccionar jugadores durante la noche
    if (rolUsuario !== "Hombre lobo" && MODO_NOCHE_GLOBAL) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Es de noche y no es lobo`
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
        `Intento de selección de usuario fallido: Turno ya pasado`
      );
      mostrarError("Has pasado turno");
      return;
    }
    if (votoRealizado) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección de usuario fallido: Voto ya realizado`
      );
      mostrarError("Solo puedes votar a un jugador por turno");
      return;
    }
    if (index === indiceUsuario) {
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de selección fallido: Voto propio`
      );
      mostrarError("¡No puedes votarte a ti mismo!");
      return;
    }
    logCustom(
      jornadaActual,
      etapaActual,
      `Jugador ${index + 1} seleccionado para votación`
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
        `Intento de voto fallido: Turno pasado`
      );
      return;
    }
    if (votoRealizado) {
      mostrarError("Solo puedes votar a un jugador por turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de voto fallido: Voto ya realizado`
      );
      return;
    }
    if (JugadorSeleccionado === null) {
      mostrarError("Tienes que seleccionar a un jugador para votarle");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de voto fallido: Ningún jugador seleccionado`
      );
      return;
    }
    setVotos((votosAnteriores: number[]): number[] => {
      const nuevosVotos: number[] = [...votosAnteriores];
      nuevosVotos[JugadorSeleccionado] += 1;
      logCustom(
        jornadaActual,
        etapaActual,
        `Voto registrado para el jugador ${JugadorSeleccionado + 1}`
      );
      return nuevosVotos;
    });
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
        `Intento de pasar turno fallido: Turno ya pasado`
      );
      return;
    }
    if (votoRealizado) {
      mostrarError("Has pasado turno");
      logCustom(
        jornadaActual,
        etapaActual,
        `Intento de pasar turno fallido: Turno pasado`
      );
      return;
    }
    logCustom(jornadaActual, etapaActual, `Turno pasado`);
    setPasoTurno(true);
    setVotoRealizado(true);
    setJugadorSeleccionado(null);
  };

  /**
   * Hasta que no se cargue la fuente de puñeta no continuar
   */
  if (!fuentesCargadas) {
    return <ActivityIndicator size="large" style={estilos.cargando} />;
  }

  // ---------------------------------------------------------------------------
  // Renderizado del componente
  // ---------------------------------------------------------------------------
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
            opacity={opacities[0]}
            mostrarComponente={mostrarComponentes[0]}
          />
        )}

        {mostrarAnimacionInicio2 && (
          <AnimacionInicio2
            opacity={opacities[1]}
            mostrarComponente={mostrarComponentes[1]}
            rol={rolUsuario}
          />
        )}

        {mostrarAnimacionInicio3 && (
          <AnimacionInicio3
            opacity={opacities[2]}
            mostrarComponente={mostrarComponentes[2]}
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
                !MODO_NOCHE_GLOBAL || rolUsuario === "Hombre lobo"
              }
              votoRealizado={votoRealizado}
              turnoPasado={pasoTurno}
            />

            {/* Componente BarraSuperior: 
                Suele mostrar información relevante en la parte superior de la pantalla, 
                como el estado del juego o la identificación del rol. */}
            <BarraSuperior />

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
              Componente CirculoVotar:
              - Representa la interfaz de votación en la que se muestran las imágenes de los jugadores.
              - Permite seleccionar un jugador para votar, mediante la función onSelectPlayer.
              - Recibe la lista de imágenes, los votos acumulados, el jugador actualmente seleccionado,
                y la función que maneja la selección de jugadores.
            */}
            <CirculoVotar
              imagenes={imagenes}
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
            mensajes={CONSTANTES.TEXTOS.CHAT.MENSAJES_INICIALES}
            posicionChat={posicionChat}
            onClose={handleCerrarChat}
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
