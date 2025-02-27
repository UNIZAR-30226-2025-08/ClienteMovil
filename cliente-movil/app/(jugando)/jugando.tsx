import React, { useState, useEffect, useRef } from "react";
import { View, ImageBackground, StyleSheet, Text, Image, Animated, Dimensions, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";

// ============================================================================
// ============================================================================
// ============================================================================

// Sección de valores hardcoded, su proposito es:
//  1. (Principal) Cuando tengamos que integrar el backend, que sea un proceso lo menos doloroso posible
//  2. Tener centralizadas las deicisiones de estilo

// Strings
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

// Cosntantes numéricas
const NUMERO_IMAGENES = 8;
const TIEMPO_INICIAL = 60; // Segundos
const RADIO_MULTIPLICADOR = 0.45;
const TAMANIO_IMAGEN_MULTIPLICADOR = 0.13;
const ANIMATION_DURATION = 1500;
const ANIMATION_DELAY = 3000;
const BORDE_RADIO_BOTON = 20;
const TAMANIO_ICONO_BOTON = 40;
const TAMANIO_TEMPORIZADOR = 60;

// Imagenes
const imagenFondo = require("@/assets/images/fondo-partida.png");
const imagenLoboRol = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenHabilidad = require("@/assets/images/hombre-lobo-icon.jpeg"); // Same as loboRol
const imagenPueblo = require("@/assets/images/pueblo-barra-arriba-juego.png");
const imagenLobos = require("@/assets/images/lobo-barra-arriba-juego.png");
const imagenJugadores = require("@/assets/images/jugador-icono.jpg");

// ============================================================================
// ============================================================================
// ============================================================================

// Obtenemos las dimensiones de la ventana y las renombramos a "ancho" y "alto"
const { width: ancho, height: alto } = Dimensions.get("window");

const PantallaJugando = () => {
  // Estados para controlar la visualización de elementos
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);

  // Estados para las imágenes circulares en el centro
  const [numeroDeImagenes, setNumeroDeImagenes] = useState(NUMERO_IMAGENES);
  const [imagenes] = useState(
    new Array(NUMERO_IMAGENES).fill(imagenJugadores)
  );

  // Nuevos estados para el temporizador
  const [tiempoInicial, setTiempoInicial] = useState(TIEMPO_INICIAL); // Valor inicial configurable
  const [tiempoRestante, setTiempoRestante] = useState(tiempoInicial);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);

  // Función para reiniciar el temporizador al tocarlo
  const reiniciarTemporizador = () => {
    setTiempoRestante(tiempoInicial);
    setTemporizadorActivo(true);
  };

  // Efecto para manejar el temporizador
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

  // Referencias para las animaciones
  const animacionTexto = useRef(new Animated.Value(0)).current;
  const animacionRol = useRef(new Animated.Value(0)).current;
  const animacionInicio = useRef(new Animated.Value(0)).current;
  const animacionFondo = useRef(new Animated.Value(1)).current;

  // Carga de fuentes personalizadas
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });

  // Secuencia de animaciones encadenadas
  useEffect(() => {
    // Animación del texto inicial
    Animated.timing(animacionTexto, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(animacionTexto, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start(() => {
          // Muestra la sección de rol
          setMostrarRol(true);
          Animated.timing(animacionRol, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            Animated.timing(animacionRol, {
              toValue: 0,
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }).start(() => {
              // Muestra el mensaje de inicio
              setMostrarInicio(true);
              Animated.timing(animacionInicio, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }).start();

              setTimeout(() => {
                Animated.timing(animacionInicio, {
                  toValue: 0,
                  duration: ANIMATION_DURATION,
                  useNativeDriver: true,
                }).start();
                // Desvanece el fondo para mostrar los botones
                Animated.timing(animacionFondo, {
                  toValue: 0,
                  duration: ANIMATION_DURATION,
                  useNativeDriver: true,
                }).start(() => {
                  setMostrarBotones(true);
                });
              }, ANIMATION_DELAY);
            });
          }, ANIMATION_DELAY);
        });
      }, ANIMATION_DELAY);
    });
  }, []);

  // Iniciar temporizador cuando se muestran los botones
  useEffect(() => {
    if (mostrarBotones) {
      setTemporizadorActivo(true);
    }
  }, [mostrarBotones]);

  if (!fuentesCargadas) {
    return null;
  }

  // Calcula el radio máximo para el círculo (en función de las dimensiones de la pantalla)
  const radioMaximoCalculado = Math.min(ancho, alto) * RADIO_MULTIPLICADOR;
  
  // Calcula el tamaño de la imagen para el círculo
  const tamanioImagen = Math.min(ancho, alto) * TAMANIO_IMAGEN_MULTIPLICADOR;
  // Ajusta el radio máximo para evitar que se recorte la imagen en los bordes
  const radioMaximo = radioMaximoCalculado - tamanioImagen / 2;

  return (
    <View style={estilos.contenedor}>
      {/* Imagen de fondo */}
      <ImageBackground source={imagenFondo} style={estilos.fondo} resizeMode="cover" />
      <Animated.View style={[estilos.superposicion, { opacity: animacionFondo }]} />

      {/* Texto inicial animado */}
      <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto }]}>
        <Text style={estilos.texto}>{TEXTO_INICIAL}</Text>
      </Animated.View>

      {/* Sección para mostrar el rol */}
      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol }]}>
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>{TEXTO_ROL_TITULO}</Text>
          </View>
          {/* Imagen del rol */}
          <Image source={imagenLoboRol} style={estilos.imagenRol} />
          <Text style={estilos.nombreRol}>{TEXTO_NOMBRE_ROL}</Text>
        </Animated.View>
      )}

      {/* Mensaje de inicio de la partida */}
      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio }]}>
          <Text style={estilos.textoInicio}>{TEXTO_INICIO_PARTIDA}</Text>
        </Animated.View>
      )}

      {/* Botones y barra superior que se muestran al finalizar las animaciones */}
      {mostrarBotones && (
        <>
          <View style={estilos.contenedorBotones}>
            {/* Botón izquierdo (HABILIDAD) */}
            <TouchableOpacity style={estilos.botonHabilidad}>
              <Image source={imagenHabilidad} style={estilos.iconoBoton} />
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_HABILIDAD}</Text>
            </TouchableOpacity>

            {/* Botón derecho (CHAT) */}
            <TouchableOpacity style={estilos.botonChat}>
              <Text style={estilos.textoBoton}>{TEXTO_BOTON_CHAT}</Text>
            </TouchableOpacity>
          </View>

          {/* Barra superior con información de Pueblo, Jornada y Lobos */}
          <View style={estilos.contenedorTopBar}>
            {/* Sección izquierda - Pueblo */}
            <View style={estilos.seccionTopBarIzquierda}>
              <View style={estilos.contenedorTopBarItem}>
                <Image source={imagenPueblo} style={estilos.iconoTopBar} />
                <View style={estilos.textoTopBarContainer}>
                  <Text style={estilos.textoTopBarTitulo}>{TEXTO_PUEBLO}</Text>
                  <Text style={estilos.textoTopBarSub}>{TEXTO_ESTADO_PUEBLO}</Text>
                </View>
              </View>
            </View>

            {/* Sección central - Jornada */}
            <View style={estilos.seccionTopBarCentro}>
              <Text style={estilos.textoTopBarTitulo}>{TEXTO_JORNADA}</Text>
              <Text style={estilos.textoTopBarSub}>{TEXTO_DIA}</Text>
            </View>

            {/* Sección derecha - Lobos */}
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

          {/* Temporizador circular en la parte superior izquierda */}
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

          {/* Contenedor circular centrado para las imágenes de los jugadores */}
          <View
            style={[
              estilos.circleContainer,
              {
                width: radioMaximoCalculado * 2,
                height: radioMaximoCalculado * 2,
                marginLeft: -radioMaximoCalculado,
                marginTop: -radioMaximoCalculado,
              },
            ]}
          >
            {imagenes.slice(0, numeroDeImagenes).map((imagen, indice) => {
              // Calcula el ángulo y la posición (x, y) de cada imagen en el círculo
              const angulo = (indice * 2 * Math.PI) / numeroDeImagenes;
              const x = radioMaximo * Math.cos(angulo);
              const y = radioMaximo * Math.sin(angulo);
              
              return (
                <Image
                  key={indice}
                  source={imagen}
                  style={[
                    estilos.circleImage,
                    {
                      width: tamanioImagen,
                      height: tamanioImagen,
                      transform: [{ translateX: x }, { translateY: y }],
                    },
                  ]}
                />
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

// Estilos actualizados
const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
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
    marginBottom: 5,
  },
  textoBoton: {
    color: "white",
    fontSize: ancho * 0.05,
    fontWeight: "bold",
    textAlign: "center",
  },
  contenedorTopBar: {
    position: "absolute",
    top: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 20,
    paddingHorizontal: 15,
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
    gap: 8,
  },
  iconoTopBar: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
  circleContainer: {
    position: "absolute",
    top: "56%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  circleImage: {
    position: "absolute",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  contenedorTemporizador: {
    position: "absolute",
    top: 140,
    left: 20,
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
    fontSize: 24,
    fontWeight: "bold",
  },
  contenedorBotonesDerecha: {
    position: "absolute",
    top: 140,
    right: 20,
    zIndex: 2,
    gap: 10,
  },
  botonAccion: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    minWidth: 120,
  },
  botonVotar: {
    backgroundColor: "#000000",
  },
});

export default PantallaJugando;
