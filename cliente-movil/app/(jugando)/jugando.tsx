import React, { useState, useEffect, useRef } from "react";
import { View, ImageBackground, Text, Image, Animated, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { estilos } from "./jugando.styles";
import { CONSTANTES, Rol } from "./constants";
import { getHabilidadInfo, getRoleInfo } from "./roleUtils";
import ChatComponent from "./components/ChatComponent";
import HabilidadPopup from "./components/HabilidadPopup";
import TopBar from "./components/TopBar";
import VotingCircle from "./components/VotingCircle";
export let MODO_NOCHE_GLOBAL = false;
export let ROL_USUARIO: Rol = "aldeano";
let TEXTO_YA_MOSTRADO = false;
const { TEXTOS, NUMERICAS, IMAGENES, DIMENSIONES, COLORES } = CONSTANTES;
const { ANCHO, ALTO } = DIMENSIONES;
const PantallaJugando: React.FC = () => {
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
  const reiniciarTemporizador = () => {
    setTiempoRestante(NUMERICAS.TIEMPO_INICIAL);
    setTemporizadorActivo(true);
  };
  const voteForPlayer = () => {
    if (selectedPlayer === null) {
      console.log("No player selected to vote for.");
      return;
    }
    setVotes((prevVotes) => {
      const newVotes = [...prevVotes];
      newVotes[selectedPlayer] += 1;
      return newVotes;
    });
    console.log(`Voted for player ${selectedPlayer + 1}`, votes);
    setSelectedPlayer(null);
  };
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
  const DURACION_ANIMACION = NUMERICAS.DURACION_ANIMACION;
  const RETRASO_ANIMACION = NUMERICAS.RETRASO_ANIMACION;
  const animacionTexto = useRef(new Animated.Value(0)).current;
  const animacionRol = useRef(new Animated.Value(0)).current;
  const animacionInicio = useRef(new Animated.Value(0)).current;
  const animacionFondo = useRef(new Animated.Value(1)).current;
  const [isNight, setIsNight] = useState(false);
  const setNightDayMode = (mode: boolean) => {
    setIsNight(mode);
    Animated.timing(animacionFondo, { toValue: mode ? 1 : 0, duration: 500, useNativeDriver: true }).start();
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (MODO_NOCHE_GLOBAL !== isNight) {
        setNightDayMode(MODO_NOCHE_GLOBAL);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isNight]);
  const posicionChat = useRef(new Animated.Value(ALTO)).current;
  const abrirChat = () => {
    setMostrarChat(true);
    Animated.timing(posicionChat, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  const cerrarChat = () => {
    Animated.timing(posicionChat, { toValue: ALTO, duration: 300, useNativeDriver: true }).start(() => {
      setMostrarChat(false);
    });
  };
  const posicionHabilidad = useRef(new Animated.Value(ALTO)).current;
  const abrirHabilidad = () => {
    setMostrarHabilidad(true);
    Animated.timing(posicionHabilidad, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  const cerrarHabilidad = () => {
    Animated.timing(posicionHabilidad, { toValue: ALTO, duration: 300, useNativeDriver: true }).start(() => {
      setMostrarHabilidad(false);
    });
  };
  useEffect(() => {
    if (TEXTO_YA_MOSTRADO) {
      setMostrarTextoInicial(false);
      setMostrarRol(false);
      setMostrarInicio(false);
      setMostrarBotones(true);
      return;
    }
    Animated.timing(animacionTexto, { toValue: 1, duration: DURACION_ANIMACION, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(animacionTexto, { toValue: 0, duration: DURACION_ANIMACION, useNativeDriver: true }).start(() => {
          TEXTO_YA_MOSTRADO = true;
          setMostrarTextoInicial(false);
          setMostrarRol(true);
          Animated.timing(animacionRol, { toValue: 1, duration: DURACION_ANIMACION, useNativeDriver: true }).start(() => {
            setTimeout(() => {
              Animated.timing(animacionRol, { toValue: 0, duration: DURACION_ANIMACION, useNativeDriver: true }).start(() => {
                setMostrarInicio(true);
                Animated.timing(animacionInicio, { toValue: 1, duration: DURACION_ANIMACION, useNativeDriver: true }).start(() => {
                  setTimeout(() => {
                    Animated.timing(animacionInicio, { toValue: 0, duration: DURACION_ANIMACION, useNativeDriver: true }).start();
                    Animated.timing(animacionFondo, { toValue: 0, duration: DURACION_ANIMACION, useNativeDriver: true }).start(() => {
                      setMostrarBotones(true);
                    });
                  }, RETRASO_ANIMACION);
                });
              });
            }, RETRASO_ANIMACION);
          });
        });
      }, RETRASO_ANIMACION);
    });
  }, []);
  useEffect(() => {
    if (mostrarBotones) {
      setTemporizadorActivo(true);
    }
  }, [mostrarBotones]);
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf")
  });
  if (!fuentesCargadas) return null;
  const habilidadInfo = getHabilidadInfo(ROL_USUARIO);
  const roleInfo = getRoleInfo(ROL_USUARIO);
  return (
    <View style={estilos.contenedor}>
      <ImageBackground source={IMAGENES.FONDO} style={estilos.fondo} resizeMode="cover" />
      <Animated.View style={[estilos.superposicion, { opacity: animacionFondo }]} />
      {mostrarTextoInicial && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto }]}>
          <Text style={estilos.texto}>{TEXTOS.INICIAL}</Text>
        </Animated.View>
      )}
      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol }]}>
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>{TEXTOS.ROL_TITULO}</Text>
          </View>
          <Image source={roleInfo.image} style={estilos.imagenRol} />
          <Text style={[estilos.nombreRol, { color: ROL_USUARIO === "lobo" ? "red" : "blue" }]}>{roleInfo.roleName}</Text>
        </Animated.View>
      )}
      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio }]}>
          <Text style={estilos.textoInicio}>{TEXTOS.INICIO_PARTIDA}</Text>
        </Animated.View>
      )}
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
          <TopBar />
          <View style={estilos.contenedorTemporizador}>
            <View style={estilos.circuloTemporizador}>
              <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
            </View>
          </View>
          <View style={estilos.contenedorBotonesDerecha}>
            <TouchableOpacity style={estilos.botonAccion}>
              <Text style={estilos.textoBoton}>{TEXTOS.BOTON_PASAR_TURNO}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[estilos.botonAccion, estilos.botonVotar]} onPress={voteForPlayer}>
              <Text style={estilos.textoBoton}>{TEXTOS.BOTON_VOTAR}</Text>
            </TouchableOpacity>
          </View>
          <VotingCircle imagenes={imagenes} votes={votes} selectedPlayer={selectedPlayer} onSelectPlayer={setSelectedPlayer} />
        </>
      )}
      {mostrarChat && <ChatComponent mensajes={TEXTOS.CHAT.MENSAJES_INICIALES} posicionChat={posicionChat} onClose={cerrarChat} />}
      {mostrarHabilidad && <HabilidadPopup habilidadInfo={habilidadInfo} posicionHabilidad={posicionHabilidad} onClose={cerrarHabilidad} />}
    </View>
  );
};
export default PantallaJugando;
