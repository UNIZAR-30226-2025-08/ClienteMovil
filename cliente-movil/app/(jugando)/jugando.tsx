import React, { useState, useEffect, useRef } from "react";
import { View, ImageBackground, StyleSheet, Text, Image, Animated } from "react-native";
import { useFonts } from "expo-font";

// Importación de imágenes utilizadas en la pantalla
const fondoPartida = require("@/assets/images/fondo-partida.png");
const imagenHombreLobo = require("@/assets/images/hombre-lobo-icon.jpeg");

const PantallaJugando = () => {
  // Estado para controlar la visibilidad del rol
  const [mostrarRol, setMostrarRol] = useState(false);
  
  // Animaciones para el texto y la revelación del rol
  const animacionDesvanecerTexto = useRef(new Animated.Value(1)).current;
  const animacionDesvanecerRol = useRef(new Animated.Value(0)).current;

  // Carga de fuentes personalizadas
  const [fuentesCargadas] = useFonts({
    Corben: require("@/assets/fonts/Corben-Regular.ttf"),
  });

  // Efecto de animación al montar el componente
  useEffect(() => {
    setTimeout(() => {
      // Animación para desvanecer el primer texto
      Animated.timing(animacionDesvanecerTexto, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => setMostrarRol(true)); // Una vez finaliza, muestra el rol

      // Animación para mostrar el rol con un pequeño retraso
      Animated.timing(animacionDesvanecerRol, {
        toValue: 1,
        duration: 1500,
        delay: 1500,
        useNativeDriver: true,
      }).start();
    }, 3000);
  }, []);

  // Mientras las fuentes se cargan, no se renderiza nada
  if (!fuentesCargadas) {
    return null;
  }

  return (
    <View style={estilos.contenedor}>
      <ImageBackground source={fondoPartida} style={estilos.fondo} resizeMode="cover" />
      <View style={estilos.superposicion} />

      {/* Texto inicial con animación de desvanecimiento */}
      <Animated.View style={[estilos.contenedorTexto, { opacity: animacionDesvanecerTexto }]}>
        <Text style={estilos.texto}>AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS</Text>
      </Animated.View>

      {/* Revelación del rol con animación de aparición */}
      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionDesvanecerRol }]}> 
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>TU ROL ES</Text>
          </View>
          <Image source={imagenHombreLobo} style={estilos.imagenRol} />
          <Text style={estilos.nombreRol}>HOMBRE LOBO</Text>
        </Animated.View>
      )}
    </View>
  );
};

// Definición de estilos
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
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    color: "white",
    fontSize: 24,
    fontFamily: "Corben",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  contenedorRol: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    top: "22%",
    paddingTop: 70,
    flexGrow: 1,
  },
  contenedorTextoRol: {
    width: "100%",
    alignItems: "center",
    minHeight: 50,
  },
  textoRol: {
    fontSize: 40,
    color: "white",
    fontFamily: "Corben",
    marginBottom: 40,
    textAlignVertical: "center",
    includeFontPadding: false,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  imagenRol: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
  nombreRol: {
    fontSize: 38,
    color: "red",
    fontFamily: "Corben",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default PantallaJugando;
