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

// ============================================================================
// ============================================================================
// ============================================================================

// Sección de valores hardcoded, su proposito es:
//  1. (Principal) Cuando tengamos que integrar el backend, que sea un proceso lo menos doloroso posible
//  2. (Secundario) Tener centralizadas las deicisiones de estilo

// Strings existentes
const TEXTO_INICIAL = "AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS";
const TEXTO_ROL_TITULO = "TU ROL ES";
const TEXTO_NOMBRE_ROL = "HOMBRE LOBO";
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
const MULTIPLICADOR_RADIO = 0.45;
const MULTIPLICADOR_TAMANIO_IMAGEN = 0.13;
const DURACION_ANIMACION = 1500;
const RETRASO_ANIMACION = 3000;

// Dimensiones
const { width: ancho, height: alto } = Dimensions.get("window");
const BORDE_RADIO_BOTON = ancho * 0.0556; // Aproximadamente 20px en un dispositivo de ~360px de ancho
const TAMANIO_ICONO_BOTON = ancho * 0.1;
const TAMANIO_TEMPORIZADOR = ancho * 0.15;

// Imagenes
const imagenFondo = require("@/assets/images/fondo-partida.png");
const imagenLoboRol = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenHabilidad = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenPueblo = require("@/assets/images/pueblo-barra-arriba-juego.png");
const imagenLobos = require("@/assets/images/lobo-barra-arriba-juego.png");
const imagenJugadores = require("@/assets/images/jugador-icono.jpg");

// NUEVAS CONSTANTES: textos y mensajes hardcodeados no centralizados
const TEXTO_CHAT_PLACEHOLDER = "Enviar un mensaje";
const TEXTO_BOTON_ENVIAR_CHAT = "Enviar";
const TEXTO_TITULO_CHAT = "CHAT";
const TEXTO_CERRAR_CHAT = "X";
const TEXTO_CERRAR_POPUP = "X";
const TEXTO_POPUP_HABILIDAD_TITULO = "Habilidad";
const TEXTO_POPUP_HABILIDAD_DESC = "Eres El Lobo. Tienes el poder de matar a un jugador durante la noche, pero ten cuidado de no ser descubierto.";
const TEXTO_POPUP_HABILIDAD_RECUERDA = "Recuerda: Los lobos deben ponerse de acuerdo sobre a quién asesinar en la noche.";
const MENSAJES_CHAT_INITIAL = [
  { id: 1, texto: "Jugador 2: Mensaje de prueba" },
  { id: 2, texto: "Jugador 5: Otro mensaje" },
];

// ============================================================================
// ============================================================================
// ============================================================================

const PantallaJugando = () => {
  // Estados para manejar las secciones
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);

  // POPUP DE HABILIDAD: Estado para manejar la ventana emergente de habilidad
  const [mostrarHabilidad, setMostrarHabilidad] = useState(false);

  const [cantidadImagenes] = useState(CANTIDAD_IMAGENES);
  const [imagenes] = useState(new Array(CANTIDAD_IMAGENES).fill(imagenJugadores));

  // Estado para mensajes del chat
  const [mensajes] = useState(MENSAJES_CHAT_INITIAL);

  // Función para manejar la pulsación sobre un jugador
  const presionarJugador = (indice) => {
    console.log(`Jugador ${indice + 1} presionado`);
    // Lógica para manejar la interacción con el jugador
  };

  // Estados y lógica para el temporizador
  const [tiempoInicialEstado] = useState(TIEMPO_INICIAL);
  const [tiempoRestante, setTiempoRestante] = useState(tiempoInicialEstado);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);

  const reiniciarTemporizador = () => {
    setTiempoRestante(tiempoInicialEstado);
    setTemporizadorActivo(true);
  };

  useEffect(() => {
    let intervalo;
    if (temporizadorActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      setTemporizadorActivo(false);
    }
    return () => clearInterval(intervalo);
  }, [temporizadorActivo, tiempoRestante]);

  // Animaciones para las secuencias iniciales
  const animacionTexto = useRef(new Animated.Value(0)).current;
  const animacionRol = useRef(new Animated.Value(0)).current;
  const animacionInicio = useRef(new Animated.Value(0)).current;
  const animacionFondo = useRef(new Animated.Value(1)).current;

  // Animación para deslizar el chat
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

  // POPUP DE HABILIDAD: Animación de la ventana emergente de habilidad
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
          setMostrarRol(true);
          Animated.timing(animacionRol, {
            toValue: 1,
            duration: DURACION_ANIMACION,
            useNativeDriver: true,
          }).start();

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
              }).start();

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
          }, RETRASO_ANIMACION);
        });
      }, RETRASO_ANIMACION);
    });
  }, []);

  // Inicia el temporizador cuando se muestran los botones
  useEffect(() => {
    if (mostrarBotones) {
      setTemporizadorActivo(true);
    }
  }, [mostrarBotones]);

  // Cargar fuente personalizada
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });

  if (!fuentesCargadas) return null;

  // Cálculos para posicionar imágenes en círculo
  const radioMaximoCalculado = Math.min(ancho, alto) * MULTIPLICADOR_RADIO;
  const tamanioImagen = Math.min(ancho, alto) * MULTIPLICADOR_TAMANIO_IMAGEN;
  const radioMaximo = radioMaximoCalculado - tamanioImagen / 2;

  return (
    <View style={estilos.contenedor}>
      <ImageBackground source={imagenFondo} style={estilos.fondo} resizeMode="cover" />
      <Animated.View style={[estilos.superposicion, { opacity: animacionFondo }]} />

      {/* Texto inicial */}
      <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto }]}>
        <Text style={estilos.texto}>{TEXTO_INICIAL}</Text>
      </Animated.View>

      {/* Sección de rol */}
      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol }]}>
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>{TEXTO_ROL_TITULO}</Text>
          </View>
          <Image source={imagenLoboRol} style={estilos.imagenRol} />
          <Text style={estilos.nombreRol}>{TEXTO_NOMBRE_ROL}</Text>
        </Animated.View>
      )}

      {/* Mensaje de inicio */}
      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio }]}>
          <Text style={estilos.textoInicio}>{TEXTO_INICIO_PARTIDA}</Text>
        </Animated.View>
      )}

      {/* Botones y barra superior */}
      {mostrarBotones && (
        <>
          <View style={estilos.contenedorBotones}>
            {/* Botón Habilidad - se añade onPress para abrir pop-up */}
            <TouchableOpacity style={estilos.botonHabilidad} onPress={abrirHabilidad}>
              <Image source={imagenHabilidad} style={estilos.iconoBoton} />
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_HABILIDAD}</Text>
            </TouchableOpacity>

            {/* Botón Chat */}
            <TouchableOpacity style={estilos.botonChat} onPress={abrirChat}>
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_CHAT}</Text>
            </TouchableOpacity>
          </View>

          {/* Barra superior */}
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

          {/* Temporizador */}
          <TouchableOpacity
            style={estilos.contenedorTemporizador}
            onPress={reiniciarTemporizador}
            activeOpacity={0.7}
          >
            <View style={estilos.circuloTemporizador}>
              <Text style={estilos.textoTemporizador}>{tiempoRestante}</Text>
            </View>
          </TouchableOpacity>

          {/* Botones en la parte superior derecha */}
          <View style={estilos.contenedorBotonesDerecha}>
            <TouchableOpacity style={estilos.botonAccion}>
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_PASAR_TURNO}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[estilos.botonAccion, estilos.botonVotar]}>
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_VOTAR}</Text>
            </TouchableOpacity>
          </View>

          {/* Círculo de jugadores */}
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
            {imagenes.slice(0, cantidadImagenes).map((img, indice) => {
              const angulo = (indice * 2 * Math.PI) / cantidadImagenes;
              const x = radioMaximo * Math.cos(angulo);
              const y = radioMaximo * Math.sin(angulo);

              return (
                <TouchableOpacity
                  key={indice}
                  onPress={() => presionarJugador(indice)}
                  style={[
                    estilos.contenedorImagenCirculo,
                    {
                      width: tamanioImagen,
                      height: tamanioImagen,
                      transform: [{ translateX: x }, { translateY: y }],
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Image source={img} style={estilos.imagenCirculo} />
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* CHAT DESLIZABLE */}
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

      {/* POPUP DE HABILIDAD DESLIZABLE */}
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

          {/* Contenedor para título + imagen a la izquierda */}
          <View style={estilos.contenedorTituloHabilidad}>
            <Image source={imagenHabilidad} style={estilos.iconoHabilidadPopup} />
            <Text style={estilos.tituloHabilidad}>{TEXTO_POPUP_HABILIDAD_TITULO}</Text>
          </View>
          
          <View style={estilos.separadorHabilidad} />

          <ScrollView contentContainerStyle={estilos.contenedorInfoHabilidad}>
            <Text style={estilos.textoHabilidad}>
              {TEXTO_POPUP_HABILIDAD_DESC}
            </Text>
            <Text style={estilos.textoRecuerda}>
              {TEXTO_POPUP_HABILIDAD_RECUERDA}
            </Text>
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    color: "red",
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
    backgroundColor: "black",
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
    backgroundColor: "black",
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
    backgroundColor: "black",
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
  contenedorImagenCirculo: {
    position: "absolute",
    borderRadius: 50,
    borderWidth: ancho * 0.005,
    borderColor: "white",
    overflow: "hidden",
  },
  imagenCirculo: {
    width: "100%",
    height: "100%",
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
    backgroundColor: "#000000",
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
    backgroundColor: "#000000",
    paddingVertical: alto * 0.02,
    paddingHorizontal: ancho * 0.06,
    borderRadius: ancho * 0.07,
    alignItems: "center",
    minWidth: ancho * 0.33,
  },
  botonVotar: {
    backgroundColor: "#000000",
  },
  contenedorChat: {
    position: "absolute",
    zIndex: 9999,
    left: ancho * 0.05,
    right: ancho * 0.05,
    bottom: 0,
    height: alto * 0.85,
    backgroundColor: "black",
    borderTopLeftRadius: ancho * 0.05,
    borderTopRightRadius: ancho * 0.05,
    padding: ancho * 0.04,
    borderWidth: ancho * 0.002,
    elevation: 50,
    shadowColor: "#000",
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
    backgroundColor: "black",
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
    backgroundColor: "black",
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

  // POPUP DE HABILIDAD
  contenedorHabilidad: {
    position: "absolute",
    zIndex: 9999,
    left: ancho * 0.05,
    right: ancho * 0.05,
    bottom: 0,
    height: alto * 0.6,
    backgroundColor: "black",
    borderTopLeftRadius: ancho * 0.05,
    borderTopRightRadius: ancho * 0.05,
    padding: ancho * 0.04,
    borderWidth: ancho * 0.002,
    elevation: 50,
    shadowColor: "#000",
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
    backgroundColor: "black",
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
