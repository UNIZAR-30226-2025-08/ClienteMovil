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
  TouchableOpacity 
} from "react-native";
import { useFonts } from "expo-font";
import { estilos } from "./jugando.styles";
import { CONSTANTES, Rol } from "./constants";
import { getHabilidadInfo, getRoleInfo } from "./roleUtils";
import ChatComponent from "./components/ChatComponent";
import HabilidadPopup from "./components/HabilidadPopup";
import TopBar from "./components/TopBar";
import VotingCircle from "./components/VotingCircle";
import { useAnimationManager } from "./animations";

/**
 * @constant MODO_NOCHE_GLOBAL - Indica si el juego está en modo noche.
 */
export let MODO_NOCHE_GLOBAL = false;

/**
 * @constant ROL_USUARIO - Define el rol del usuario en la partida.
 */
export let ROL_USUARIO: Rol = "aldeano";

/**
 * @constant TEXTO_YA_MOSTRADO - Bandera que indica si el texto de inicio ya se mostró.
 */
let TEXTO_YA_MOSTRADO = false;

// Desestructuración de constantes usadas en el componente.
const { TEXTOS, NUMERICAS, IMAGENES, DIMENSIONES, COLORES } = CONSTANTES;
const { ANCHO, ALTO } = DIMENSIONES;

/**
 * @component PantallaJugando
 * @description Componente principal que gestiona la lógica del juego, animaciones y renderizado
 * de elementos interactivos en la pantalla de juego.
 */
const PantallaJugando: React.FC = () => {
  // Estados locales para controlar visibilidad e interacciones.
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mostrarTextoInicial, setMostrarTextoInicial] = useState(!TEXTO_YA_MOSTRADO);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [votes, setVotes] = useState(Array(NUMERICAS.CANTIDAD_IMAGENES).fill(0));
  const [mostrarHabilidad, setMostrarHabilidad] = useState(false);
  const [cantidadImagenes] = useState(NUMERICAS.CANTIDAD_IMAGENES);
  const [imagenes] = useState(new Array(NUMERICAS.CANTIDAD_IMAGENES).fill(IMAGENES.JUGADORES));
  const [mensajes] = useState(TEXTOS.CHAT.MENSAJES_INICIALES);
  const [tiempoRestante, setTiempoRestante] = useState(NUMERICAS.TIEMPO_INICIAL);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [indiceUsuario] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const animacionError = useRef(new Animated.Value(0)).current;

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
   * @function reiniciarTemporizador
   * @description Reinicia el temporizador al valor inicial y lo activa.
   */
  const reiniciarTemporizador = () => {
    setTiempoRestante(NUMERICAS.TIEMPO_INICIAL);
    setTemporizadorActivo(true);
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
   * Efecto que maneja el temporizador decrementándolo cada segundo y alterna el modo noche cuando llega a 0.
   */
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (temporizadorActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (temporizadorActivo && tiempoRestante === 0) {
      MODO_NOCHE_GLOBAL = !MODO_NOCHE_GLOBAL;
      reiniciarTemporizador();
    }
    return () => clearInterval(intervalo);
  }, [temporizadorActivo, tiempoRestante]);

  // Inicializa el gestor de animaciones.
  const animationManager = useAnimationManager();
  const animacionTexto = useRef(animationManager.createAnimation(0)).current;
  const animacionRol = useRef(animationManager.createAnimation(0)).current;
  const animacionInicio = useRef(animationManager.createAnimation(0)).current;
  // Nota: animacionFondo se utiliza en dos contextos diferentes.
  const animacionFondo = useRef(animationManager.createAnimation(1)).current;

  // Constantes para la duración y retraso de animaciones.
  const DURACION_ANIMACION = NUMERICAS.DURACION_ANIMACION;
  const RETRASO_ANIMACION = NUMERICAS.RETRASO_ANIMACION;

  /**
   * @function setNightDayMode
   * @description Cambia entre modo noche y modo día.
   * @param {boolean} mode - Indica si se debe activar el modo noche.
   */
  const [isNight, setIsNight] = useState(false);
  const setNightDayMode = (mode: boolean) => {
    setIsNight(mode);
    if (mode) {
      animacionFondo.fadeIn(500).start();
    } else {
      animacionFondo.fadeOut(500).start();
    }
  };

  /**
   * Sincroniza el estado global del modo noche con el estado local.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (MODO_NOCHE_GLOBAL !== isNight) {
        setNightDayMode(MODO_NOCHE_GLOBAL);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isNight]);

  // Animación para la posición del chat.
  const posicionChat = useRef(new Animated.Value(ALTO)).current;
  /**
   * Abre el chat animándolo desde la parte inferior.
   */
  const abrirChat = () => {
    setMostrarChat(true);
    Animated.timing(posicionChat, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  /**
   * Cierra el chat animándolo hacia la parte inferior.
   */
  const cerrarChat = () => {
    Animated.timing(posicionChat, { toValue: ALTO, duration: 300, useNativeDriver: true }).start(() => {
      setMostrarChat(false);
    });
  };

  // Animación para la posición del popup de habilidad.
  const posicionHabilidad = useRef(new Animated.Value(ALTO)).current;
  /**
   * Abre el popup de habilidad animándolo desde la parte inferior.
   */
  const abrirHabilidad = () => {
    setMostrarHabilidad(true);
    Animated.timing(posicionHabilidad, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  /**
   * Cierra el popup de habilidad animándolo hacia la parte inferior.
   */
  const cerrarHabilidad = () => {
    Animated.timing(posicionHabilidad, { toValue: ALTO, duration: 300, useNativeDriver: true }).start(() => {
      setMostrarHabilidad(false);
    });
  };

  /**
   * Secuencia de animaciones para mostrar el texto inicial, rol, inicio de partida y botones.
   * Encadena múltiples animaciones para la transición de estados en la interfaz.
   */
  useEffect(() => {
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
   * @function showError
   * @description Muestra un mensaje de error temporalmente.
   * @param {string} message - Mensaje de error a mostrar.
   */
  const showError = (message: string) => {
    setErrorMessage(message);
    // Animación para mostrar y ocultar el mensaje
    Animated.sequence([
      Animated.timing(animacionError, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(animacionError, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setErrorMessage(null));
  };

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

  // Obtiene la información de la habilidad y del rol actual.
  const habilidadInfo = getHabilidadInfo(ROL_USUARIO);
  const roleInfo = getRoleInfo(ROL_USUARIO);

  return (
      // Contenedor principal de la pantalla de juego
      <View style={estilos.contenedor}>
        {/* Imagen de fondo que cubre toda la pantalla */}
        <ImageBackground source={IMAGENES.FONDO} style={estilos.fondo} resizeMode="cover" />
        
        {/* Superposición animada para efectos visuales en el fondo */}
        <Animated.View style={[estilos.superposicion, { opacity: animacionFondo.value }]} />
        
        {/* Condicional: Muestra el texto inicial animado si aún no se ha ocultado */}
        {mostrarTextoInicial && (
          <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto.value }]}>
            <Text style={estilos.texto}>{TEXTOS.INICIAL}</Text>
          </Animated.View>
        )}

        {/* Condicional: Mensaje de error animado */}
        {errorMessage && (
        <Animated.View
          style={[
            estilos.contenedorError,
            {
              opacity: animacionError,
              transform: [
                {
                  translateY: animacionError.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={estilos.textoError}>{errorMessage}</Text>
        </Animated.View>
      )}
      
      {/* Condicional: Muestra la información del rol del usuario con animación */}
      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol.value }]}>
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>{TEXTOS.ROL_TITULO}</Text>
          </View>
          <Image source={roleInfo.image} style={estilos.imagenRol} />
          <Text style={[estilos.nombreRol, { color: ROL_USUARIO === "lobo" ? "red" : "blue" }]}>
            {roleInfo.roleName}
          </Text>
        </Animated.View>
      )}
      
      {/* Condicional: Muestra el mensaje de inicio de partida animado */}
      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio.value }]}>
          <Text style={estilos.textoInicio}>{TEXTOS.INICIO_PARTIDA}</Text>
        </Animated.View>
      )}
      
      {/* Condicional: Renderiza los botones de acción, temporizador, barra superior y votación */}
      {mostrarBotones && (
        <>
          <View style={estilos.contenedorBotones}>
            <TouchableOpacity style={estilos.botonHabilidad} onPress={abrirHabilidad}>
              <Image source={habilidadInfo.imagen} style={estilos.iconoBoton} />
              <Text style={estilos.textoBoton}>{TEXTOS.BOTON_HABILIDAD}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botonChat} onPress={abrirChat}>
              <Text style={estilos.textoBoton}>{TEXTOS.BOTON_CHAT}</Text>
            </TouchableOpacity>
          </View>
          {/* Barra superior con información adicional del juego */}
          <TopBar />
          {/* Temporizador central que muestra el tiempo restante */}
          <View style={estilos.contenedorTemporizador}>
            <View style={estilos.circuloTemporizador}>
              <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
            </View>
          </View>
          {/* Botones de acciones complementarias: pasar turno y votar */}
          <View style={estilos.contenedorBotonesDerecha}>
            <TouchableOpacity style={estilos.botonAccion}>
              <Text style={estilos.textoBoton}>{TEXTOS.BOTON_PASAR_TURNO}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[estilos.botonAccion, estilos.botonVotar]} onPress={voteForPlayer}>
              <Text style={estilos.textoBoton}>{TEXTOS.BOTON_VOTAR}</Text>
            </TouchableOpacity>
          </View>
          {/* Componente para la votación de jugadores */}
          <VotingCircle
            imagenes={imagenes}
            votes={votes}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={handleSelectPlayer}
          />
        </>
      )}
      
      {/* Condicional: Muestra el componente de chat si está activado */}
      {mostrarChat && (
        <ChatComponent
          mensajes={TEXTOS.CHAT.MENSAJES_INICIALES}
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

      {/* Mensaje de error animado */}
      {errorMessage && (
        <Animated.View
          style={[
            estilos.contenedorError,
            {
              opacity: animacionError,
              transform: [
                {
                  translateY: animacionError.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-ALTO * 0.04, 0],
                  }),
                },
              ],
            },
          ]}
        >
        <Text 
          style={estilos.textoError}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {errorMessage}
        </Text>  
        </Animated.View>
      )}
    </View>
  );
};

export default PantallaJugando;
