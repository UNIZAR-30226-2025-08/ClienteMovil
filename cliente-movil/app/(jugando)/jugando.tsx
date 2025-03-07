import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";

// ---------------------------------------------------------------------------
// Variable global para controlar si es de día o de noche (false = día, true = noche)
export let MODO_NOCHE_GLOBAL = false;
// Global flag para controlar si ya se mostró el texto inicial
let TEXTO_YA_MOSTRADO = false;
// Global variable para el rol del usuario (aldeano, lobo, bruja, cazador)
export let ROL_USUARIO = "aldeano";
// ---------------------------------------------------------------------------

// ============================================================================
// ============================================================================
// ============================================================================

// Sección de valores hardcoded

const TEXTO_INICIAL = "AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS";
const TEXTO_ROL_TITULO = "TU ROL ES";
const TEXTO_INICIO_PARTIDA = "EMPIEZA LA PARTIDA";
const TEXTO_BOTON_HABILIDAD = "HABILIDAD";
const TEXTO_BOTON_CHAT = "CHAT";
const TEXTO_BOTON_PASAR_TURNO = "Pasar turno";
const TEXTO_BOTON_VOTAR = "Votar";
const TEXTO_PUEBLO = "PUEBLO";
const TEXTO_LOBOS = "LOBOS";
const TEXTO_JORNADA = "JORNADA 2";
const TEXTO_DIA = "DÍA 2";
const TEXTO_ESTADO_PUEBLO = "5/6 vivos";
const TEXTO_ESTADO_LOBOS = "2/2 vivos";

// Números
const CANTIDAD_IMAGENES = 8;
const TIEMPO_INICIAL = 60; // Segundos

// Dimensiones
const { width: ancho, height: alto } = Dimensions.get("window");
const BORDE_RADIO_BOTON = ancho * 0.0556;
const TAMANIO_ICONO_BOTON = ancho * 0.1;
const TAMANIO_TEMPORIZADOR = ancho * 0.15;

// Imágenes
const imagenFondo = require("@/assets/images/fondo-partida.png");
const imagenLoboRol = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenHabilidad = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenPueblo = require("@/assets/images/pueblo-barra-arriba-juego.png");
const imagenLobos = require("@/assets/images/lobo-barra-arriba-juego.png");
const imagenJugadores = require("@/assets/images/jugador-icono.jpg");

// Textos y mensajes hardcodeados no centralizados
const TEXTO_CHAT_PLACEHOLDER = "Enviar un mensaje";
const TEXTO_BOTON_ENVIAR_CHAT = "Enviar";
const TEXTO_TITULO_CHAT = "CHAT";
const TEXTO_CERRAR_CHAT = "X";
const TEXTO_CERRAR_POPUP = "X";
// Textos por defecto para el popup de habilidad
const TEXTO_POPUP_HABILIDAD_TITULO = "Habilidad";
const TEXTO_POPUP_HABILIDAD_DESC =
  "Eres El Lobo. Tienes el poder de matar a un jugador durante la noche, pero ten cuidado de no ser descubierto.";
const TEXTO_POPUP_HABILIDAD_RECUERDA =
  "Recuerda: Los lobos deben ponerse de acuerdo sobre a quién asesinar en la noche.";
const MENSAJES_CHAT_INITIAL = [
  { id: 1, texto: "Jugador 2: Mensaje de prueba" },
  { id: 2, texto: "Jugador 5: Otro mensaje" },
];

// ---------------------------------------------------------------------------
// Helper function para retornar la información de habilidad según el rol
const getHabilidadInfo = (rol) => {
  switch (rol) {
    case "aldeano":
      return {
        titulo: "Habilidad",
        descripcion:
          "Como aldeano, no posees una habilidad especial, pero tu voto es crucial para la aldea.",
        recuerda: "",
        imagen: require("@/assets/images/aldeano-icon.jpeg"),
      };
    case "lobo":
      return {
        titulo: "Habilidad",
        descripcion:
          "Eres el lobo. Tienes el poder de matar a un jugador durante la noche, pero ten cuidado de no ser descubierto.",
        recuerda: "Recuerda: Los lobos deben ponerse de acuerdo sobre a quién asesinar en la noche.",
        imagen: require("@/assets/images/hombre-lobo-icon.jpeg"),
      };
    case "bruja":
      return {
        titulo: "Habilidad",
        descripcion:
          "Como bruja, tienes dos pociones: una para salvar a un jugador y otra para envenenar. Úsalas con sabiduría.",
        recuerda: "Recuerda: Cada poción solo se puede usar una vez.",
        imagen: require("@/assets/images/bruja-icon.jpeg"),
      };
    case "cazador":
      return {
        titulo: "Habilidad",
        descripcion:
          "Si mueres, puedes disparar a otro jugador en venganza. Usa tu habilidad para proteger a la aldea.",
        recuerda: "Recuerda: Tu disparo final puede cambiar el destino del juego.",
        imagen: require("@/assets/images/cazador-icon.jpeg"),
      };
    default:
      return {
        titulo: TEXTO_POPUP_HABILIDAD_TITULO,
        descripcion: TEXTO_POPUP_HABILIDAD_DESC,
        recuerda: TEXTO_POPUP_HABILIDAD_RECUERDA,
        imagen: imagenHabilidad,
      };
  }
};

// ---------------------------------------------------------------------------
// Helper function para retornar la información del rol para la sección "Tu rol es"
const getRoleInfo = (rol) => {
  switch (rol) {
    case "aldeano":
      return {
        roleName: "ALDEANO",
        image: require("@/assets/images/aldeano-icon.jpeg"),
      };
    case "lobo":
      return {
        roleName: "HOMBRE LOBO",
        image: require("@/assets/images/hombre-lobo-icon.jpeg"),
      };
    case "bruja":
      return {
        roleName: "BRUJA",
        image: require("@/assets/images/bruja-icon.jpeg"),
      };
    case "cazador":
      return {
        roleName: "CAZADOR",
        image: require("@/assets/images/cazador-icon.jpeg"),
      };
    default:
      return {
        roleName: "HOMBRE LOBO",
        image: require("@/assets/images/hombre-lobo-icon.jpeg"),
      };
  }
};

// ============================================================================
// ============================================================================
// ============================================================================

const PantallaJugando = () => {
  // Estados de la UI
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);

  // Usamos la bandera inicial para decidir si mostrar la animación del texto inicial
  const [mostrarTextoInicial, setMostrarTextoInicial] = useState(!TEXTO_YA_MOSTRADO);

  // Estado para trackear qué jugador está seleccionado para votar
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  // Estado para almacenar los votos (inicialmente, cero votos para cada jugador)
  const [votes, setVotes] = useState(Array(CANTIDAD_IMAGENES).fill(0));

  // Estados para popups
  const [mostrarHabilidad, setMostrarHabilidad] = useState(false);
  const [cantidadImagenes] = useState(CANTIDAD_IMAGENES);
  const [imagenes] = useState(new Array(CANTIDAD_IMAGENES).fill(imagenJugadores));
  const [mensajes] = useState(MENSAJES_CHAT_INITIAL);

  // Temporizador
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_INICIAL);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);

  // Función para reiniciar el temporizador
  const reiniciarTemporizador = () => {
    setTiempoRestante(TIEMPO_INICIAL);
    setTemporizadorActivo(true);
  };

  // Función para votar a un jugador y almacenar el voto
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

  // useEffect para manejar el temporizador
  useEffect(() => {
    let intervalo;
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

  // Animaciones
  const DURACION_ANIMACION = 1500;
  const RETRASO_ANIMACION = 3000;
  const animacionTexto = useRef(new Animated.Value(0)).current;
  const animacionRol = useRef(new Animated.Value(0)).current;
  const animacionInicio = useRef(new Animated.Value(0)).current;
  const animacionFondo = useRef(new Animated.Value(1)).current;

  // Estado para modo día/noche
  const [isNight, setIsNight] = useState(false);
  const setNightDayMode = (mode) => {
    setIsNight(mode);
    Animated.timing(animacionFondo, {
      toValue: mode ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Sincronizar el modo día/noche
  useEffect(() => {
    const interval = setInterval(() => {
      if (MODO_NOCHE_GLOBAL !== isNight) {
        setNightDayMode(MODO_NOCHE_GLOBAL);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isNight]);

  // Animaciones para chat y habilidad
  const posicionChat = useRef(new Animated.Value(alto)).current;
  const referenciaScrollView = useRef(null);

  const abrirChat = () => {
    setMostrarChat(true);
    Animated.timing(posicionChat, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const cerrarChat = () => {
    Animated.timing(posicionChat, {
      toValue: alto,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMostrarChat(false);
    });
  };

  const posicionHabilidad = useRef(new Animated.Value(alto)).current;

  const abrirHabilidad = () => {
    setMostrarHabilidad(true);
    Animated.timing(posicionHabilidad, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const cerrarHabilidad = () => {
    Animated.timing(posicionHabilidad, {
      toValue: alto,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMostrarHabilidad(false);
    });
  };

  // Secuencia de animación inicial
  useEffect(() => {
    if (TEXTO_YA_MOSTRADO) {
      setMostrarTextoInicial(false);
      setMostrarRol(false);
      setMostrarInicio(false);
      setMostrarBotones(true);
      return;
    }
    Animated.timing(animacionTexto, {
      toValue: 1,
      duration: DURACION_ANIMACION,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(animacionTexto, {
          toValue: 0,
          duration: DURACION_ANIMACION,
          useNativeDriver: true,
        }).start(() => {
          TEXTO_YA_MOSTRADO = true;
          setMostrarTextoInicial(false);
          setMostrarRol(true);
          Animated.timing(animacionRol, {
            toValue: 1,
            duration: DURACION_ANIMACION,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(animacionRol, {
                toValue: 0,
                duration: DURACION_ANIMACION,
                useNativeDriver: true,
              }).start(() => {
                setMostrarInicio(true);
                Animated.timing(animacionInicio, {
                  toValue: 1,
                  duration: DURACION_ANIMACION,
                  useNativeDriver: true,
                }).start(() => {
                  setTimeout(() => {
                    Animated.timing(animacionInicio, {
                      toValue: 0,
                      duration: DURACION_ANIMACION,
                      useNativeDriver: true,
                    }).start();
                    Animated.timing(animacionFondo, {
                      toValue: 0,
                      duration: DURACION_ANIMACION,
                      useNativeDriver: true,
                    }).start(() => {
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

  // Activar el temporizador cuando se muestran los botones
  useEffect(() => {
    if (mostrarBotones) {
      setTemporizadorActivo(true);
    }
  }, [mostrarBotones]);

  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });

  if (!fuentesCargadas) return null;

  // Cálculos para posicionar imágenes en círculo
  const MULTIPLICADOR_RADIO = 0.45;
  const MULTIPLICADOR_TAMANIO_IMAGEN = 0.13;
  const radioMaximoCalculado = Math.min(ancho, alto) * MULTIPLICADOR_RADIO;
  const tamanioImagen = Math.min(ancho, alto) * MULTIPLICADOR_TAMANIO_IMAGEN;
  const radioMaximo = radioMaximoCalculado - tamanioImagen / 2;

  // Obtener información de habilidad y rol
  const habilidadInfo = getHabilidadInfo(ROL_USUARIO);
  const roleInfo = getRoleInfo(ROL_USUARIO);

  return (
    <View style={estilos.contenedor}>
      <ImageBackground
        source={imagenFondo}
        style={estilos.fondo}
        resizeMode="cover"
      />
      <Animated.View style={[estilos.superposicion, { opacity: animacionFondo }]} />

      {mostrarTextoInicial && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto }]}>
          <Text style={estilos.texto}>{TEXTO_INICIAL}</Text>
        </Animated.View>
      )}

      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol }]}>
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>{TEXTO_ROL_TITULO}</Text>
          </View>
          <Image source={roleInfo.image} style={estilos.imagenRol} />
          <Text style={[estilos.nombreRol, { color: ROL_USUARIO === "lobo" ? "red" : "blue" }]}>
            {roleInfo.roleName}
          </Text>
        </Animated.View>
      )}

      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio }]}>
          <Text style={estilos.textoInicio}>{TEXTO_INICIO_PARTIDA}</Text>
        </Animated.View>
      )}

      {mostrarBotones && (
        <>
          <View style={estilos.contenedorBotones}>
            <TouchableOpacity style={estilos.botonHabilidad} onPress={abrirHabilidad}>
              <Image source={habilidadInfo.imagen} style={estilos.iconoBoton} />
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_HABILIDAD}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botonChat} onPress={abrirChat}>
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_CHAT}</Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.contenedorTopBar}>
            <View style={estilos.seccionTopBarIzquierda}>
              <View style={estilos.contenedorTopBarItem}>
                <Image source={imagenPueblo} style={estilos.iconoTopBar} />
                <View style={estilos.textoTopBarContainer}>
                  <Text style={estilos.textoTopBarTitulo}>{TEXTO_PUEBLO}</Text>
                  <Text style={estilos.textoTopBarSub}>{TEXTO_ESTADO_PUEBLO}</Text>
                </View>
              </View>
            </View>
            <View style={estilos.seccionTopBarCentro}>
              <Text style={estilos.textoTopBarTitulo}>{TEXTO_JORNADA}</Text>
              <Text style={estilos.textoTopBarSub}>{TEXTO_DIA}</Text>
            </View>
            <View style={estilos.seccionTopBarDerecha}>
              <View style={estilos.contenedorTopBarItem}>
                <View style={estilos.textoTopBarContainer}>
                  <Text style={estilos.textoTopBarTitulo}>{TEXTO_LOBOS}</Text>
                  <Text style={estilos.textoTopBarSub}>{TEXTO_ESTADO_LOBOS}</Text>
                </View>
                <Image source={imagenLobos} style={estilos.iconoTopBar} />
              </View>
            </View>
          </View>

          <View style={estilos.contenedorTemporizador}>
            <View style={estilos.circuloTemporizador}>
              <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
            </View>
          </View>

          <View style={estilos.contenedorBotonesDerecha}>
            <TouchableOpacity style={estilos.botonAccion}>
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_PASAR_TURNO}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[estilos.botonAccion, estilos.botonVotar]}
              onPress={voteForPlayer}
            >
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_VOTAR}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              estilos.contenedorCirculo,
              {
                width: radioMaximoCalculado * 2,
                height: radioMaximoCalculado * 2,
                marginLeft: -radioMaximoCalculado,
                marginTop: -radioMaximoCalculado,
              },
            ]}
          >
            {imagenes.slice(0, CANTIDAD_IMAGENES).map((img, indice) => {
              const angulo = (indice * 2 * Math.PI) / CANTIDAD_IMAGENES;
              const x = radioMaximo * Math.cos(angulo);
              const y = radioMaximo * Math.sin(angulo);
              const isSelected = selectedPlayer === indice;
              return (
                <TouchableOpacity
                  key={indice}
                  onPress={() => setSelectedPlayer(indice)}
                  style={[
                    estilos.contenedorJugador,
                    {
                      transform: [{ translateX: x }, { translateY: y }],
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  {/* Circular container with hidden overflow */}
                  <View style={[
                    estilos.contenedorImagenCirculo,
                    {
                      width: tamanioImagen,
                      height: tamanioImagen,
                      borderWidth: 3,
                      borderColor: isSelected ? "#33FF00" : "white",
                    }
                  ]}>
                    <Image source={img} style={estilos.imagenCirculo} />
                  </View>
                  
                  {/* Vote sticks outside the circular container */}
                  <View style={estilos.contenedorVotos}>
                    {Array.from({ length: votes[indice] }).map((_, index) => (
                      <View key={index} style={estilos.barraVoto} />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {mostrarChat && (
        <Animated.View
          style={[
            estilos.contenedorChat,
            { transform: [{ translateY: posicionChat }] },
          ]}
        >
          <TouchableOpacity
            style={estilos.botonCerrarChat}
            onPress={cerrarChat}
            activeOpacity={0.5}
            hitSlop={{
              top: alto * 0.02,
              bottom: alto * 0.02,
              left: ancho * 0.04,
              right: ancho * 0.04,
            }}
          >
            <Text style={estilos.textoCerrarChat}>{TEXTO_CERRAR_CHAT}</Text>
          </TouchableOpacity>
          <Text style={estilos.tituloChat}>{TEXTO_TITULO_CHAT}</Text>
          <View style={estilos.separadorChat} />
          <ScrollView
            contentContainerStyle={estilos.contenedorMensajesChat}
            ref={referenciaScrollView}
            onContentSizeChange={() =>
              referenciaScrollView.current &&
              referenciaScrollView.current.scrollToEnd({ animated: true })
            }
          >
            {mensajes.map((mensaje) => (
              <Text key={mensaje.id} style={estilos.mensajeChat}>
                {mensaje.texto}
              </Text>
            ))}
          </ScrollView>
          <View style={estilos.contenedorEntradaChat}>
            <TextInput
              style={estilos.entradaChat}
              placeholder={TEXTO_CHAT_PLACEHOLDER}
              placeholderTextColor="#CCC"
            />
            <TouchableOpacity style={estilos.botonEnviarChat}>
              <Text style={estilos.textoBotonEnviarChat}>{TEXTO_BOTON_ENVIAR_CHAT}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {mostrarHabilidad && (
        <Animated.View
          style={[
            estilos.contenedorHabilidad,
            { transform: [{ translateY: posicionHabilidad }] },
          ]}
        >
          <TouchableOpacity
            style={estilos.botonCerrarHabilidad}
            onPress={cerrarHabilidad}
            activeOpacity={0.5}
            hitSlop={{
              top: alto * 0.02,
              bottom: alto * 0.02,
              left: ancho * 0.04,
              right: ancho * 0.04,
            }}
          >
            <Text style={estilos.textoCerrarHabilidad}>{TEXTO_CERRAR_POPUP}</Text>
          </TouchableOpacity>
          <View style={estilos.contenedorTituloHabilidad}>
            <Image source={habilidadInfo.imagen} style={estilos.iconoHabilidadPopup} />
            <Text style={estilos.tituloHabilidad}>{habilidadInfo.titulo}</Text>
          </View>
          <View style={estilos.separadorHabilidad} />
          <ScrollView contentContainerStyle={estilos.contenedorInfoHabilidad}>
            <Text style={estilos.textoHabilidad}>
              {habilidadInfo.descripcion}
            </Text>
            {habilidadInfo.recuerda !== "" && (
              <Text style={estilos.textoRecuerda}>
                {habilidadInfo.recuerda}
              </Text>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: alto * 0.07,
  },
  fondo: {
    width: "100%",
    height: "100%",
  },
  superposicion: {
    backgroundColor: "rgba(38, 37, 34, 0.7)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contenedorTexto: {
    position: "absolute",
    width: "80%",
    top: "21%",
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    color: "white",
    fontSize: ancho * 0.09,
    fontFamily: "Corben",
    textAlign: "center",
    paddingHorizontal: ancho * 0.05,
  },
  contenedorRol: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    top: "35%",
    flexDirection: "column",
  },
  contenedorTextoRol: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: alto * 0.1,
    paddingHorizontal: ancho * 0.05,
  },
  textoRol: {
    fontSize: ancho * 0.1,
    color: "white",
    fontFamily: "Corben",
    textAlign: "center",
    lineHeight: ancho * 0.12,
    paddingVertical: alto * 0.005,
    includeFontPadding: true,
  },
  imagenRol: {
    width: ancho * 0.35,
    height: ancho * 0.35,
    marginBottom: alto * 0.05,
  },
  nombreRol: {
    textAlign: "center",
    fontSize: ancho * 0.12,
    fontFamily: "Corben",
    fontWeight: "bold",
  },
  textoInicio: {
    color: "white",
    fontSize: ancho * 0.1,
    fontFamily: "Corben",
    textAlign: "center",
    top: "127%",
    paddingHorizontal: ancho * 0.05,
  },
  contenedorBotones: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: ancho * 0.10,
  },
  botonHabilidad: {
    flex: 1,
    backgroundColor: "#262522",
    height: alto * 0.13,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: BORDE_RADIO_BOTON,
    borderTopRightRadius: BORDE_RADIO_BOTON,
    maxWidth: "45%",
    marginRight: ancho * 0.12,
  },
  botonChat: {
    flex: 1,
    backgroundColor: "#262522",
    height: alto * 0.07,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: BORDE_RADIO_BOTON,
    borderTopRightRadius: BORDE_RADIO_BOTON,
    maxWidth: "45%",
    marginLeft: ancho * 0.02,
  },
  iconoBoton: {
    width: TAMANIO_ICONO_BOTON,
    height: TAMANIO_ICONO_BOTON,
    marginBottom: ancho * 0.02,
  },
  textoBoton: {
    color: "white",
    fontSize: ancho * 0.05,
    fontWeight: "bold",
    textAlign: "center",
  },
  contenedorTopBar: {
    position: "absolute",
    top: alto * 0.06,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#262522",
    paddingVertical: alto * 0.03,
    paddingHorizontal: ancho * 0.04,
  },
  seccionTopBarIzquierda: {
    flex: 1,
    alignItems: "flex-start",
  },
  seccionTopBarCentro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  seccionTopBarDerecha: {
    flex: 1,
    alignItems: "flex-end",
  },
  contenedorTopBarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: ancho * 0.02,
  },
  iconoTopBar: {
    width: ancho * 0.1,
    height: ancho * 0.1,
    borderRadius: ancho * 0.02,
  },
  textoTopBarContainer: {
    flexDirection: "column",
  },
  textoTopBarTitulo: {
    color: "white",
    fontSize: ancho * 0.04,
    fontWeight: "bold",
  },
  textoTopBarSub: {
    color: "white",
    fontSize: ancho * 0.03,
    fontWeight: "bold",
    opacity: 0.9,
  },
  contenedorCirculo: {
    position: "absolute",
    top: "56%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  contenedorJugador: {
    position: "absolute",
    alignItems: 'center',
  },
  contenedorImagenCirculo: {
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenCirculo: {
    width: "100%",
    height: "100%",
  },
  contenedorVotos: {
    position: 'absolute',
    bottom: -alto * 0.025,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ancho * 0.005,
  },
  barraVoto: {
    width: ancho * 0.008,
    height: alto * 0.015,
    backgroundColor: 'black',
    borderRadius: ancho * 0.002,
  },
  contenedorTemporizador: {
    position: "absolute",
    top: alto * 0.2,
    left: ancho * 0.05,
    zIndex: 2,
  },
  circuloTemporizador: {
    width: TAMANIO_TEMPORIZADOR,
    height: TAMANIO_TEMPORIZADOR,
    borderRadius: TAMANIO_TEMPORIZADOR / 2,
    backgroundColor: "#262522",
    justifyContent: "center",
    alignItems: "center",
  },
  textoTemporizador: {
    color: "white",
    fontSize: ancho * 0.05,
    fontWeight: "bold",
  },
  contenedorBotonesDerecha: {
    position: "absolute",
    top: alto * 0.2,
    right: ancho * 0.05,
    zIndex: 2,
    gap: ancho * 0.02,
  },
  botonAccion: {
    backgroundColor: "#262522",
    paddingVertical: alto * 0.02,
    paddingHorizontal: ancho * 0.06,
    borderRadius: ancho * 0.07,
    alignItems: "center",
    minWidth: ancho * 0.33,
  },
  botonVotar: {
    backgroundColor: "#262522",
  },
  contenedorChat: {
    position: "absolute",
    zIndex: 9999,
    left: ancho * 0.05,
    right: ancho * 0.05,
    bottom: 0,
    height: alto * 0.85,
    backgroundColor: "#262522",
    borderTopLeftRadius: ancho * 0.05,
    borderTopRightRadius: ancho * 0.05,
    padding: ancho * 0.04,
    borderWidth: ancho * 0.002,
    elevation: 50,
    shadowColor: "#262522",
    shadowOffset: { width: 0, height: alto * 0.003 },
    shadowOpacity: 0.5,
    shadowRadius: ancho * 0.02,
  },
  botonCerrarChat: {
    position: "absolute",
    top: alto * 0.02,
    right: ancho * 0.04,
    zIndex: 99999,
    padding: ancho * 0.02,
    backgroundColor: "#262522",
    borderRadius: ancho * 0.015,
    minWidth: ancho * 0.08,
    minHeight: ancho * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  textoCerrarChat: {
    color: "white",
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    fontFamily: "Corben",
    includeFontPadding: true,
    textAlignVertical: "center",
    marginBottom: -alto * 0.005,
  },
  tituloChat: {
    color: "white",
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: alto * 0.02,
    fontFamily: "Corben",
  },
  separadorChat: {
    height: 1,
    backgroundColor: "white",
    marginVertical: alto * 0.02,
  },
  contenedorMensajesChat: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: alto * 0.02,
  },
  mensajeChat: {
    color: "white",
    fontSize: ancho * 0.04,
    marginBottom: alto * 0.015,
    fontFamily: "Corben",
    lineHeight: ancho * 0.05,
    includeFontPadding: true,
  },
  contenedorEntradaChat: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: alto * 0.02,
  },
  entradaChat: {
    flex: 1,
    height: alto * 0.07,
    borderWidth: ancho * 0.002,
    borderColor: "white",
    backgroundColor: "#262522",
    borderRadius: ancho * 0.02,
    paddingHorizontal: ancho * 0.03,
    color: "white",
    fontSize: ancho * 0.04,
    fontFamily: "Corben",
  },
  botonEnviarChat: {
    backgroundColor: "green",
    height: alto * 0.07,
    justifyContent: "center",
    paddingHorizontal: ancho * 0.04,
    borderRadius: ancho * 0.02,
    borderWidth: ancho * 0.002,
    marginLeft: ancho * 0.02,
  },
  textoBotonEnviarChat: {
    color: "white",
    fontWeight: "bold",
    fontSize: ancho * 0.04,
    fontFamily: "Corben",
  },
  contenedorHabilidad: {
    position: "absolute",
    zIndex: 9999,
    left: ancho * 0.05,
    right: ancho * 0.05,
    bottom: 0,
    height: alto * 0.6,
    backgroundColor: "#262522",
    borderTopLeftRadius: ancho * 0.05,
    borderTopRightRadius: ancho * 0.05,
    padding: ancho * 0.04,
    borderWidth: ancho * 0.002,
    elevation: 50,
    shadowColor: "#262522",
    shadowOffset: { width: 0, height: alto * 0.003 },
    shadowOpacity: 0.5,
    shadowRadius: ancho * 0.02,
  },
  botonCerrarHabilidad: {
    position: "absolute",
    top: alto * 0.02,
    right: ancho * 0.04,
    zIndex: 99999,
    padding: ancho * 0.02,
    backgroundColor: "#262522",
    borderRadius: ancho * 0.015,
    minWidth: ancho * 0.08,
    minHeight: ancho * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  textoCerrarHabilidad: {
    color: "white",
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    fontFamily: "Corben",
    includeFontPadding: true,
    textAlignVertical: "center",
    marginBottom: -alto * 0.005,
  },
  contenedorTituloHabilidad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: alto * 0.02,
  },
  iconoHabilidadPopup: {
    width: ancho * 0.12,
    height: ancho * 0.12,
    marginRight: ancho * 0.02,
  },
  tituloHabilidad: {
    color: "white",
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Corben",
  },
  separadorHabilidad: {
    height: 1,
    backgroundColor: "white",
    marginVertical: alto * 0.02,
  },
  contenedorInfoHabilidad: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: alto * 0.02,
  },
  textoHabilidad: {
    color: "white",
    fontSize: ancho * 0.05,
    marginBottom: alto * 0.015,
    fontFamily: "Corben",
    lineHeight: ancho * 0.06,
    includeFontPadding: true,
  },
  textoRecuerda: {
    color: "white",
    fontSize: ancho * 0.045,
    marginTop: alto * 0.02,
    fontFamily: "Corben",
    lineHeight: ancho * 0.055,
    includeFontPadding: true,
  },
});

export default PantallaJugando;