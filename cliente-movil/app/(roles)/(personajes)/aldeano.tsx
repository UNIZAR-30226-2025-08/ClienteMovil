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
 * Imágenes utilizadas en la pantalla del rol "Aldeano".
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imageAldeano = require("@/assets/images/aldeano-icon.jpeg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Pantalla que muestra la descripción del rol "Aldeano".
 * Permite al usuario leer la descripción y regresar a la pantalla anterior.
 *
 * @returns {JSX.Element} Pantalla de información sobre el rol "Aldeano".
 */
export default function AldeanoScreen(): JSX.Element | null {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

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
      {/* Fondo de pantalla */}
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {/* Título de la pantalla */}
        <Text style={styles.tituloAldeano}>ALDEANO</Text>

        {/* Imagen representativa del rol */}
        <Image source={imageAldeano} style={styles.imageAldeano}></Image>

        {/* Imagen decorativa de papiro */}
        <Image source={imagenPapiro} style={styles.imagePapiro}></Image>

        {/* Descripción del rol */}
        <Text style={styles.textoAldeano}>
          LOS ALDEANOS NO POSEEN NINGUNA HABILIDAD ESPECIAL, PERO SU VOTO ES
          CRUCIAL PARA SALVAR LA ALDEA.
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

  imageAldeano: {
    width: 170,
    height: 170,
    left: "29%",
    top: "15%",
    position: "absolute",
  },

  tituloAldeano: {
    position: "absolute",
    top: "5%",
    left: "40%",
    marginTop: 20,
    marginLeft: -60,
    color: "white",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoAldeano: {
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    width: 230,
    left: "25%",
    top: "45%",
  },
});
