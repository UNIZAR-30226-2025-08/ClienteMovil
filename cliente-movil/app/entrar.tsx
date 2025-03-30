import React from "react"; // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useFonts } from "expo-font";

/**
 * Imagen utilizada como fondo en la pantalla de inicio.
 */
const imagenPortada = require("@/assets/images/imagen-portada.png");

/**
 * Pantalla de inicio de la aplicación.
 *
 * Muestra el título del juego y un enlace para acceder a la siguiente pantalla.
 *
 * @returns {JSX.Element | null} Pantalla de inicio.
 */
export default function EntrarScreen() {
  /**
   * Carga la fuente personalizada 'GhostShadow'.
   *
   * Se utiliza el hook `useFonts` para gestionar la carga de la fuente antes de renderizar el contenido.
   */
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  /**
   * Si la fuente aún no ha terminado de cargarse, se retorna `null` para evitar errores de renderizado.
   */
  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Imagen de fondo cubriendo toda la pantalla */}
      <ImageBackground
        source={imagenPortada}
        resizeMode="cover"
        style={styles.image}
      >
        {/* Título principal del juego */}
        <Text style={styles.title}>LOS HOMBRES LOBOS DE CASTRONEGRO</Text>

        {/* Enlace para continuar a la pantalla de opciones */}
        <Link href="/elegirOpciones" style={styles.textoEntrar}>
          PULSA PARA ENTRAR
        </Link>
      </ImageBackground>
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    width: "90%",
    left: "6%",
    lineHeight: 60,
    color: "white",
    fontFamily: "GhostShadow",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    position: "absolute", // Posiciona el texto de forma absoluta
    top: 50, // Ajusta la distancia desde la parte superior de la pantalla
  },

  textoEntrar: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    position: "absolute", // Fija el contenedor en la parte inferior
    bottom: 70, // Ajusta la distancia desde la parte inferior
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
  },

  /* Envuelve la imagen en un TouchableOpacity */
  iconoBoton: {
    position: "absolute",
    bottom: 15,
    right: 10,
  },
});
