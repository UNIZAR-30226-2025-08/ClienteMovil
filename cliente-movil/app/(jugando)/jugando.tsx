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
import { getHabilidadInfo, getRoleInfo } from "./utilidades/rolesUtilidades";
// Componentes existentes
import Chat from "./componentes/Chat";
import HabilidadPopup from "./componentes/HabilidadPopup";
import BarraSuperior from "./componentes/BarraSuperior";
import CirculoVotar from "./componentes/CirculoVotar";
// Componentes modulares
import ControlesAccion from "./componentes/ControlesAccion";
import MensajeError from "./componentes/MensajeError";
// Hooks personalizados
import useTemporizador from "./hooks/useTemporizador";
import useAnimacionesPantalla from "./hooks/useAnimacionesPantalla";
import useModoDiaNoche from "./hooks/useModoDiaNoche";
import useAnimacionChat from "./hooks/useAnimacionChat";
import useAnimacionHabilidad from "./hooks/useAnimacionHabilidad";
import useMensajeError from "./hooks/useMensajeError";

/**
 * @constant MODO_NOCHE_GLOBAL - Indica si el juego está en modo noche.
 */
export let MODO_NOCHE_GLOBAL = false;

/**
 * @constant TEXTO_YA_MOSTRADO - Bandera que indica si el texto de inicio ya se mostró.
 */
export let TEXTO_YA_MOSTRADO = false;

const PantallaJugando: React.FC = () => {
  // Estados locales para controlar visibilidad e interacciones.
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mostrarTextoInicial, setMostrarTextoInicial] = useState(
    !TEXTO_YA_MOSTRADO
  );
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [votes, setVotes] = useState(
    Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(0)
  );
  const [mostrarHabilidad, setMostrarHabilidad] = useState(false);
  const [cantidadImagenes] = useState(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES);
  const [imagenes] = useState(
    new Array(CONSTANTES.NUMERICAS.CANTIDAD_IMAGENES).fill(
      CONSTANTES.IMAGENES.JUGADORES
    )
  );
  const [indiceUsuario] = useState(0);
  const [rolUsuario, setRolUsuario] = useState<Rol>("aldeano");

  // Obtiene la información de la habilidad y del rol actual.
  const habilidadInfo = getHabilidadInfo(rolUsuario);
  const roleInfo = getRoleInfo(rolUsuario);

  // Uso de hooks personalizados
  const { tiempoRestante, reiniciarTemporizador, setTemporizadorActivo } =
    useTemporizador(CONSTANTES.NUMERICAS.TIEMPO_INICIAL, false);
  const {
    animationManager,
    animacionTexto,
    animacionRol,
    animacionInicio,
    animacionFondo,
  } = useAnimacionesPantalla();
  const { esDeNoche, setModoDiaNoche } = useModoDiaNoche(animacionFondo);
  const { posicionChat, abrirChat, cerrarChat } = useAnimacionChat();
  const { posicionHabilidad, abrirHabilidad, cerrarHabilidad } =
    useAnimacionHabilidad();
  const { errorMessage, showError, animacionError } = useMensajeError();

  /**
   * Determina si se deben mostrar los botones de acción.
   * @returns {boolean} True si los botones deben ser visibles.
   */
  const mostrarBotonesAccion = () => {
    return !MODO_NOCHE_GLOBAL || rolUsuario === "lobo";
  };

  /**
   * @function handleSelectPlayer
   * @description Maneja la selección de un jugador para votación.
   * @param {number} index - Índice del jugador seleccionado.
   */
  const handleSelectPlayer = (index: number) => {
    if (index === indiceUsuario) {
      showError("¡No puedes votarte a ti mismo!");
      return;
    }
    setSelectedPlayer(index);
  };

  /**
   * @function voteForPlayer
   * @description Incrementa el voto para el jugador seleccionado.
   */
  const voteForPlayer = () => {
    if (selectedPlayer === null) {
      console.log("No se ha seleccionado ningún jugador para votar.");
      return;
    }
    setVotes((prevVotes) => {
      const newVotes = [...prevVotes];
      newVotes[selectedPlayer] += 1;
      return newVotes;
    });
    console.log(`Votado al jugador ${selectedPlayer + 1}`, votes);
    setSelectedPlayer(null);
  };

  /**
   * Efecto que maneja el temporizador y reinicia cuando llega a 0.
   */
  useEffect(() => {
    if (tiempoRestante === 0) {
      // Aquí se alternaría el modo noche/día (lógica según tus necesidades)
      reiniciarTemporizador();
    }
  }, [tiempoRestante]);

  /**
   * Secuencia de animaciones para mostrar el texto inicial, rol, inicio de partida y botones.
   * Encadena múltiples animaciones para la transición de estados en la interfaz.
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
          // Actualizamos la bandera global
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
                  }, animationManager.RETRASO_ANIMACION);
                });
              });
            }, animationManager.RETRASO_ANIMACION);
          });
        });
      }, animationManager.RETRASO_ANIMACION);
    });
  }, []);

  /**
   * Activa el temporizador una vez que se muestran los botones de acción.
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
      {/* Imagen de fondo que cubre toda la pantalla */}
      <ImageBackground
        source={CONSTANTES.IMAGENES.FONDO}
        style={estilos.fondo}
        resizeMode="cover"
      />

      {/* Superposición animada para efectos visuales en el fondo */}
      <Animated.View
        style={[estilos.superposicion, { opacity: animacionFondo.value }]}
      />

      {/* Condicional: Muestra el texto inicial animado si aún no se ha ocultado */}
      {mostrarTextoInicial && (
        <Animated.View
          style={[estilos.contenedorTexto, { opacity: animacionTexto.value }]}
        >
          <Text style={estilos.texto}>{CONSTANTES.TEXTOS.INICIAL}</Text>
        </Animated.View>
      )}

      {/* Mensaje de error animado */}
      {errorMessage && (
        <MensajeError
          errorMessage={errorMessage}
          animacionError={animacionError}
        />
      )}

      {/* Condicional: Muestra la información del rol del usuario con animación */}
      {mostrarRol && (
        <Animated.View
          style={[estilos.contenedorRol, { opacity: animacionRol.value }]}
        >
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>{CONSTANTES.TEXTOS.ROL_TITULO}</Text>
          </View>
          <Image source={roleInfo.image} style={estilos.imagenRol} />
          <Text
            style={[
              estilos.nombreRol,
              { color: rolUsuario === "lobo" ? "red" : "blue" },
            ]}
          >
            {roleInfo.roleName}
          </Text>
        </Animated.View>
      )}

      {/* Condicional: Muestra el mensaje de inicio de partida animado */}
      {mostrarInicio && (
        <Animated.View
          style={[estilos.contenedorTexto, { opacity: animacionInicio.value }]}
        >
          <Text style={estilos.textoInicio}>
            {CONSTANTES.TEXTOS.INICIO_PARTIDA}
          </Text>
        </Animated.View>
      )}

      {/* Renderizado de controles y componentes de juego cuando se muestran los botones */}
      {mostrarBotones && (
        <>
          <ControlesAccion
            habilidadInfo={habilidadInfo}
            abrirHabilidad={abrirHabilidad}
            abrirChat={abrirChat}
            voteForPlayer={voteForPlayer}
            mostrarBotonesAccion={mostrarBotonesAccion}
          />
          <BarraSuperior />
          {/* Temporizador central que muestra el tiempo restante */}
          <View style={estilos.contenedorTemporizador}>
            <View style={estilos.circuloTemporizador}>
              <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
            </View>
          </View>
          {/* Componente para la votación de jugadores */}
          <CirculoVotar
            imagenes={imagenes}
            votes={votes}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={handleSelectPlayer}
          />
        </>
      )}

      {/* Condicional: Muestra el componente de chat si está activado */}
      {mostrarChat && (
        <Chat
          mensajes={CONSTANTES.TEXTOS.CHAT.MENSAJES_INICIALES}
          posicionChat={posicionChat}
          onClose={cerrarChat}
        />
      )}

      {/* Condicional: Muestra el popup de habilidad del jugador si está activado */}
      {mostrarHabilidad && (
        <HabilidadPopup
          habilidadInfo={habilidadInfo}
          posicionHabilidad={posicionHabilidad}
          onClose={cerrarHabilidad}
        />
      )}
    </View>
  );
};

export default PantallaJugando;
