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
 * Importación de imágenes utilizadas en la pantalla del turno de día.
 *
 * @remarks
 * Estas imágenes incluyen el fondo de la pantalla, el icono del sol que representa el turno de día, un papiro decorativo,
 * y el botón de regreso.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenSol = require("@/assets/images/imagen-sol.jpg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Pantalla del turno de día en el juego.
 * Explica las mecánicas del juego durante la fase diurna.
 *
 * @returns {JSX.Element} Pantalla de explicación del turno de día o `null` si la fuente aún no se ha cargado.
 */
export default function TurnoDiaScreen(): JSX.Element | null {
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
   * Esta función se usa en el botón de "volver atrás" para regresar a
   * la pantalla anterior en la navegación.
   */
  const irAtras = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <Text style={styles.tituloTurnoDia}>DIA</Text>
        <Image source={imagenSol} style={styles.imageSol}></Image>
        <Image source={imagenPapiro} style={styles.imagePapiro}></Image>
        <Text style={styles.textoTurnoDia}>
          Para empezar, se conocerá qué jugador murió la noche anterior.
          Posteriormente, los jugadores tendrán un tiempo de hablar para
          discutir quienes pueden ser los hombres lobos. Tras debatir, votarán a
          un jugador a su elección para ser linchado (el jugador con más votos
          será eliminado de la partida y se mostrará públicamente su rol). Las
          fases de noche y día se alternan sucesivamente hasta que únicamente
          queden hombres lobo o aldeanos vivos y la partida termine con la
          victoria de uno de los dos bandos.
        </Text>

        {/* Botón de regreso */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos para la pantalla del turno de día.
 *
 * @remarks
 * Los estilos incluyen la disposición de los elementos de la pantalla, como
 * los iconos, el fondo, y los textos, asegurando que los elementos se ubiquen
 * correctamente en la pantalla.
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

  imageSol: {
    width: 170,
    height: 170,
    left: "30%",
    top: "16%",
    position: "absolute",
    borderRadius: 100,
  },

  tituloTurnoDia: {
    position: "absolute",
    top: "5%",
    left: "57%",
    marginTop: 20,
    marginLeft: -60,
    color: "white",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoTurnoDia: {
    fontSize: 10.9,
    fontWeight: "bold",
    position: "absolute",
    width: 230,
    left: "23%",
    top: "46%",
  },
});
