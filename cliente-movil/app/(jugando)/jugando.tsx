import React, { useState, useEffect, useRef } from "react";
import { View, ImageBackground, StyleSheet, Text, Image, Animated, Dimensions, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";

// Obtenemos las dimensiones de la ventana y las renombramos a "ancho" y "alto"
const { width: ancho, height: alto } = Dimensions.get("window");

// Imágenes originales de fondo y rol
const imagenFondo = require("@/assets/images/fondo-partida.png");
const imagenLoboRol = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenHabilidad = require("@/assets/images/hombre-lobo-icon.jpeg");

// Nuevas imágenes de marcador de posición para Pueblo y Lobos
const imagenPueblo = require("@/assets/images/pueblo-barra-arriba-juego.png");
const imagenLobos = require("@/assets/images/lobo-barra-arriba-juego.png");

// Imagen para representar a los jugadores
const imagenJugadores = require("@/assets/images/jugador-icono.jpg");

const PantallaJugando = () => {
  // Estados para controlar la visualización de elementos
  const [mostrarRol, setMostrarRol] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);

  // Estados para las imágenes circulares en el centro
  const [numeroDeImagenes, setNumeroDeImagenes] = useState(8);
  const [imagenes] = useState([
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
    imagenJugadores,
  ]);

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
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(animacionTexto, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start(() => {
          // Muestra la sección de rol
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
              // Muestra el mensaje de inicio
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
                // Desvanece el fondo para mostrar los botones
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

  // Calcula el radio máximo para el círculo (en función de las dimensiones de la pantalla)
  const radioMaximoCalculado = Math.min(ancho, alto) * 0.45;
  
  // Calcula el tamaño de la imagen para el círculo
  const tamanioImagen = Math.min(ancho, alto) * 0.13;
  // Ajusta el radio máximo para evitar que se recorte la imagen en los bordes
  const radioMaximo = radioMaximoCalculado - tamanioImagen / 2;

  return (
    <View style={estilos.contenedor}>
      {/* Imagen de fondo */}
      <ImageBackground source={imagenFondo} style={estilos.fondo} resizeMode="cover" />
      <Animated.View style={[estilos.superposicion, { opacity: animacionFondo }]} />

      {/* Texto inicial animado */}
      <Animated.View style={[estilos.contenedorTexto, { opacity: animacionTexto }]}>
        <Text style={estilos.texto}>
          AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS
        </Text>
      </Animated.View>

      {/* Sección para mostrar el rol */}
      {mostrarRol && (
        <Animated.View style={[estilos.contenedorRol, { opacity: animacionRol }]}>
          <View style={estilos.contenedorTextoRol}>
            <Text style={estilos.textoRol}>TU ROL ES</Text>
          </View>
          {/* Imagen del rol */}
          <Image source={imagenLoboRol} style={estilos.imagenRol} />
          <Text style={estilos.nombreRol}>HOMBRE LOBO</Text>
        </Animated.View>
      )}

      {/* Mensaje de inicio de la partida */}
      {mostrarInicio && (
        <Animated.View style={[estilos.contenedorTexto, { opacity: animacionInicio }]}>
          <Text style={estilos.textoInicio}>EMPIEZA LA PARTIDA</Text>
        </Animated.View>
      )}

      {/* Botones y barra superior que se muestran al finalizar las animaciones */}
      {mostrarBotones && (
        <>
          <View style={estilos.contenedorBotones}>
            {/* Botón izquierdo (HABILIDAD) */}
            <TouchableOpacity style={estilos.botonHabilidad}>
              <Image source={imagenHabilidad} style={estilos.iconoBoton} />
              <Text style={estilos.textoBoton}>HABILIDAD</Text>
            </TouchableOpacity>

            {/* Botón derecho (CHAT) */}
            <TouchableOpacity style={estilos.botonChat}>
              <Text style={estilos.textoBoton}>CHAT</Text>
            </TouchableOpacity>
          </View>

          {/* Barra superior con información de Pueblo, Jornada y Lobos */}
          <View style={estilos.contenedorTopBar}>
            {/* Sección izquierda - Pueblo */}
            <View style={estilos.seccionTopBarIzquierda}>
              <View style={estilos.contenedorTopBarItem}>
                <Image source={imagenPueblo} style={estilos.iconoTopBar} />
                <View style={estilos.textoTopBarContainer}>
                  <Text style={estilos.textoTopBarTitulo}>PUEBLO</Text>
                  <Text style={estilos.textoTopBarSub}>5/6 vivos</Text>
                </View>
              </View>
            </View>

            {/* Sección central - Jornada */}
            <View style={estilos.seccionTopBarCentro}>
              <Text style={estilos.textoTopBarTitulo}>JORNADA 2</Text>
              <Text style={estilos.textoTopBarSub}>DÍA 2</Text>
            </View>

            {/* Sección derecha - Lobos */}
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

// Estilos de la pantalla
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: "45%",
    marginRight: ancho * 0.12,
  },
  botonChat: {
    flex: 1,
    backgroundColor: "black",
    height: alto * 0.07,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: "45%",
    marginLeft: ancho * 0.02,
  },
  iconoBoton: {
    width: 40,
    height: 40,
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
});

export default PantallaJugando;
