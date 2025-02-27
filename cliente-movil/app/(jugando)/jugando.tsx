import React, { useState, useEffect, useRef } from "react";
import { View, ImageBackground, StyleSheet, Text, Image, Animated, Dimensions, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

// Original background and role images
const imagenFondo = require("@/assets/images/fondo-partida.png");
const imagenLoboRol = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenHabilidad = require("@/assets/images/hombre-lobo-icon.jpeg");

// New placeholder images for Pueblo & Lobos
const imagenPueblo = require("@/assets/images/pueblo-barra-arriba-juego.png");
const imagenLobos = require("@/assets/images/lobo-barra-arriba-juego.png");

const imagenJugadores = require("@/assets/images/jugador-icono.png");

const PantallaJugando = () => {
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);

  // New state variables for the circular images
  const [numberOfImages, setNumberOfImages] = useState(8);
  const [images] = useState([
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
  ]);

  const animacionTexto = useRef(new Animated.Value(0)).current;
  const animacionRol = useRef(new Animated.Value(0)).current;
  const animacionInicio = useRef(new Animated.Value(0)).current;
  const animacionFondo = useRef(new Animated.Value(1)).current;

  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });

  useEffect(() => {
    Animated.timing(animacionTexto, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(animacionTexto, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start(() => {
          setMostrarRol(true);
          Animated.timing(animacionRol, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            Animated.timing(animacionRol, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }).start(() => {
              setMostrarInicio(true);
              Animated.timing(animacionInicio, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
              }).start();

              setTimeout(() => {
                Animated.timing(animacionInicio, {
                  toValue: 0,
                  duration: 1500,
                  useNativeDriver: true,
                }).start();
                Animated.timing(animacionFondo, {
                  toValue: 0,
                  duration: 1500,
                  useNativeDriver: true,
                }).start(() => {
                  setMostrarBotones(true);
                });
              }, 3000);
            });
          }, 3000);
        });
      }, 3000);
    });
  }, []);

  if (!fuentesCargadas) {
    return null;
  }

  // Compute a max radius for the circle
  const computedMaxRadius = Math.min(width, height) * 0.4;
  
  // Calculate the image size once so that container centering can be adjusted if needed
  const imageSize = Math.min(width, height) * 0.12;
  // Adjust the max radius to avoid clipping half the image at the edges
  const maxRadius = computedMaxRadius - imageSize / 2;

  return (
    <View style={estilos.contenedor}>
      <ImageBackground source={imagenFondo} style={estilos.fondo} resizeMode="cover" />
      <Animated.View style={[estilos.superposicion, { opacity: animacionFondo }]} />

      <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto }]}>
        <Text style={estilos.texto}>
          AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS
        </Text>
      </Animated.View>

      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol }]}>
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>TU ROL ES</Text>
          </View>
          {/* Role Image */}
          <Image source={imagenLoboRol} style={estilos.imagenRol} />
          <Text style={estilos.nombreRol}>HOMBRE LOBO</Text>
        </Animated.View>
      )}

      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio }]}>
          <Text style={estilos.textoInicio}>EMPIEZA LA PARTIDA</Text>
        </Animated.View>
      )}

      {mostrarBotones && (
        <>
          <View style={estilos.contenedorBotones}>
            {/* LEFT BUTTON (HABILIDAD) */}
            <TouchableOpacity style={estilos.botonHabilidad}>
              <Image source={imagenHabilidad} style={estilos.iconoBoton} />
              <Text style={estilos.textoBoton}>HABILIDAD</Text>
            </TouchableOpacity>

            {/* RIGHT BUTTON (CHAT) */}
            <TouchableOpacity style={estilos.botonChat}>
              <Text style={estilos.textoBoton}>CHAT</Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.contenedorTopBar}>
            {/* Left Section - Pueblo */}
            <View style={estilos.seccionTopBarIzquierda}>
              <View style={estilos.contenedorTopBarItem}>
                <Image source={imagenPueblo} style={estilos.iconoTopBar} />
                <View style={estilos.textoTopBarContainer}>
                  <Text style={estilos.textoTopBarTitulo}>PUEBLO</Text>
                  <Text style={estilos.textoTopBarSub}>5/6 vivos</Text>
                </View>
              </View>
            </View>

            {/* Center Section - Jornada */}
            <View style={estilos.seccionTopBarCentro}>
              <Text style={estilos.textoTopBarTitulo}>JORNADA 2</Text>
              <Text style={estilos.textoTopBarSub}>DÍA 2</Text>
            </View>

            {/* Right Section - Lobos */}
            <View style={estilos.seccionTopBarDerecha}>
              <View style={estilos.contenedorTopBarItem}>
                <View style={estilos.textoTopBarContainer}>
                  <Text style={estilos.textoTopBarTitulo}>LOBOS</Text>
                  <Text style={estilos.textoTopBarSub}>2/2 vivos</Text>
                </View>
                <Image source={imagenLobos} style={estilos.iconoTopBar} />
              </View>
            </View>
          </View>

          {/* New Centered Circle Container for Images */}
          <View
            style={[
              estilos.circleContainer,
              {
                width: computedMaxRadius * 2,
                height: computedMaxRadius * 2,
                marginLeft: -computedMaxRadius,
                marginTop: -computedMaxRadius,
              },
            ]}
          >
            {images.slice(0, numberOfImages).map((image, index) => {
              const angle = (index * 2 * Math.PI) / numberOfImages;
              const x = maxRadius * Math.cos(angle);
              const y = maxRadius * Math.sin(angle);
              
              return (
                <Image
                  key={index}
                  source={image}
                  style={[
                    estilos.circleImage,
                    {
                      width: imageSize,
                      height: imageSize,
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
    fontSize: width * 0.09,
    fontFamily: "Corben",
    textAlign: "center",
    paddingHorizontal: width * 0.05,
  },
  contenedorRol: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    top: "28%",
    flexDirection: "column",
  },
  contenedorTextoRol: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.1,
    paddingHorizontal: width * 0.05,
  },
  textoRol: {
    fontSize: width * 0.1,
    color: "white",
    fontFamily: "Corben",
    textAlign: "center",
    lineHeight: width * 0.12,
    paddingVertical: height * 0.005,
    includeFontPadding: true,
  },
  imagenRol: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: height * 0.05,
  },
  nombreRol: {
    textAlign: "center",
    fontSize: width * 0.12,
    color: "red",
    fontFamily: "Corben",
    fontWeight: "bold",
  },
  textoInicio: {
    color: "white",
    fontSize: width * 0.1,
    fontFamily: "Corben",
    textAlign: "center",
    top: "127%",
    paddingHorizontal: width * 0.05,
  },
  contenedorBotones: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: width * 0.10,
  },
  botonHabilidad: {
    flex: 1,
    backgroundColor: "black",
    height: height * 0.13,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: "45%",
    marginRight: width * 0.12,
  },
  botonChat: {
    flex: 1,
    backgroundColor: "black",
    height: height * 0.07,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: "45%",
    marginLeft: width * 0.02,
  },
  iconoBoton: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  textoBoton: {
    color: "white",
    fontSize: width * 0.05,
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
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  textoTopBarSub: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "bold",
    opacity: 0.9,
  },
  // Updated circle container style to center it on the screen
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
});

export default PantallaJugando;
