import React from "react"; // Importar useState desde React
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

/**
 * Imágenes utilizadas en la pantalla.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imageVidente = require("@/assets/images/vidente-icon.jpeg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Pantalla que muestra la descripción del rol "Vidente".
 * Permite al usuario leer la descripción y regresar a la pantalla anterior.
 *
 * @returns {JSX.Element} Pantalla de información sobre el rol "Vidente".
 */
export default function VidenteScreen(): JSX.Element | null {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  // Si la fuente no se ha cargado, retornamos `null`
  // para evitar que la pantalla se muestre incompleta.
  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  /**
   * Función para regresar a la pantalla anterior.
   * Utiliza la función `router.back()` para navegar hacia la pantalla anterior.
   *
   * @remarks
   * Esta función es utilizada en el botón de "volver atrás" para regresar a la pantalla anterior.
   */
  const irAtras = () => {
    router.back(); // Regresa a la pantalla anterior
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {/* Título de la pantalla */}
        <Text style={styles.tituloVidente}>VIDENTE</Text>

        {/* Imagen representativa del rol */}
        <Image source={imageVidente} style={styles.imageVidente}></Image>

        {/* Imagen decorativa de papiro */}
        <Image source={imagenPapiro} style={styles.imagePapiro}></Image>

        {/* Descripción del rol */}
        <Text style={styles.textoVidente}>
          ELIGE UN JUGADOR Y EL NARRADOR LE MOSTRARÁ LA CARTA DE DICHO JUGADOR.
          DE ESTA FORMA, PODRÁ CONOCER SU ROL, OBTENIENDO INFORMACIÓN
          PRIVILEGIADA.
        </Text>

        {/* Botón para regresar a la pantalla anterior */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos de la pantalla del rol "Vidente".
 *
 * @remarks
 * Los estilos incluyen configuraciones para la disposición de los elementos,
 * la imagen de fondo, los iconos y los textos en la pantalla.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  containerAtras: {
    position: "absolute",
    bottom: 20,
    left: "46%",
  },

  imageAtras: {
    height: 40,
    width: 40,
  },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  imagePapiro: {
    height: 400,
    width: 300,
    position: "absolute",
    bottom: "10%",
    left: "13%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  imageVidente: {
    width: 170,
    height: 170,
    left: "29%",
    top: "15%",
    position: "absolute",
  },

  tituloVidente: {
    position: "absolute",
    top: "5%",
    left: "42%",
    marginTop: 20,
    marginLeft: -60,
    color: "white",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoVidente: {
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    width: 230,
    left: "25%",
    top: "45%",
  },
});
