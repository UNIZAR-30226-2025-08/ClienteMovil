import React, { useState, useEffect, useRef } from "react";
import { View, ImageBackground, StyleSheet, Text, Image, Animated, Dimensions } from "react-native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

// Importación de imágenes utilizadas en la pantalla
const imagenFondo = require("@/assets/images/fondo-partida.png");
const imagenLobo = require("@/assets/images/hombre-lobo-icon.jpeg");

const PantallaJugando = () => {
  // Estados para controlar la visibilidad de los textos y animaciones
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);

  // Referencias de animaciones para los efectos de desvanecimiento
  const animacionTexto = useRef(new Animated.Value(0)).current;
  const animacionRol = useRef(new Animated.Value(0)).current;
  const animacionInicio = useRef(new Animated.Value(0)).current;
  const animacionFondo = useRef(new Animated.Value(1)).current;

  // Cargar fuentes personalizadas
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });

  useEffect(() => {
    // Secuencia de animaciones al iniciar la pantalla
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
                }).start();
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

  return (
    <View style={estilos.contenedor}>
      <ImageBackground source={imagenFondo} style={estilos.fondo} resizeMode="cover" />
      <Animated.View style={[estilos.superposicion, { opacity: animacionFondo }]} />
      
      {/* Texto de inicio de la partida */}
      <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto }]}> 
        <Text style={estilos.texto}>AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS</Text>
      </Animated.View>

      {/* Visualización del rol asignado al jugador */}
      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol }]}> 
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
              TU ROL ES
            </Text>
          </View>
          <Image source={imagenLobo} style={estilos.imagenRol} />
          <Text style={estilos.nombreRol}>HOMBRE LOBO</Text>
        </Animated.View>
      )}

      {/* Mensaje de inicio del juego */}
      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio }]}> 
          <Text style={estilos.textoInicio}>EMPIEZA LA PARTIDA</Text>
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
    top: "22%",
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
    minHeight: height * 0.15,
    paddingHorizontal: width * 0.05,
  },
  textoRol: {
    fontSize: width * 0.1,
    color: "white",
    fontFamily: "Corben",
    textAlign: "center",
    textAlignVertical: "center",
    width: "90%",
    flexShrink: 1,
    paddingVertical: height * 0.03,
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
    fontSize: width * 0.10,
    fontFamily: "Corben",
    textAlign: "center",
    top: "127%",
    paddingHorizontal: width * 0.05,
  },
});

export default PantallaJugando;
