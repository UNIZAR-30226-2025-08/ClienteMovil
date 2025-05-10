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
 * Importación de imágenes utilizadas en la pantalla del turno de noche.
 *
 * @remarks
 * Estas imágenes representan el fondo de la pantalla, el icono de la
 * luna para el turno de noche, el papiro decorativo y el botón de regreso.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenLuna = require("@/assets/images/imagen-luna.png");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Pantalla del turno de noche en el juego.
 * Explica las mecánicas que ocurren durante la noche en la partida, incluyendo las acciones de los roles especiales.
 *
 * @returns {JSX.Element} Pantalla explicativa del turno de noche, o `null` mientras se carga la fuente.
 */
export default function TurnoNocheScreen(): JSX.Element | null {
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
   * Esta función es utilizada en el botón de "volver atrás" para regresar
   * a la pantalla anterior.
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

        {/* Título de la pantalla */}
        <Text style={styles.tituloTurnoNoche}>NOCHE</Text>

        {/* Imagen representativa del turno de noche */}
        <Image source={imagenLuna} style={styles.imageLuna}></Image>

        {/* Imagen de papiro para dar contexto al texto descriptivo */}
        <Image source={imagenPapiro} style={styles.imagePapiro}></Image>

        {/* Descripción de la fase nocturna */}
        <Text style={styles.textoTurnoNoche}>
          Durante la noche los personajes con roles especiales van despertando y
          realizan diversas acciones. Orden de actuar durante la noche: vidente,
          hombres lobo, bruja. Para empezar, la vidente elige un jugador y el
          Narrador le mostrará el rol de dicho jugador. Luego, los hombres lobo
          aparecerán para elegir a su próxima víctima, cuya muerte se hará
          efectiva y anunciada en el próximo turno de día. Si no hay unanimidad
          en la designación de la víctima, no hay muerte, por lo que dispondrán
          de un tiempo limitado para elegir a su víctima. Para continuar, la
          bruja podrá observar qué jugador está a punto de morir en esa noche
          (si lo hay) y decidirá si desea salvarlo gastando su Poción de la
          Vida, o dejarlo morir. A continuación, la bruja tiene la opción de
          gastar su Poción de la Muerte para eliminar al jugador que desee.
          Ambas pociones son de solo un uso durante la partida. Y por último, en
          caso de que suceda la muerte del cazador: Cazador: Se le comunicará
          que ha sido asesinado y el cazador podrá eliminar a un jugador de su
          elección.
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
 * Estilos para la pantalla del turno de noche.
 *
 * @remarks
 * Los estilos incluyen la disposición de los elementos en la pantalla,
 * como las imágenes, los textos y los botones.
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

  imageLuna: {
    width: 170,
    height: 170,
    left: "30%",
    top: "16%",
    position: "absolute",
    borderRadius: 100,
  },

  tituloTurnoNoche: {
    position: "absolute",
    top: "5%",
    left: "47%",
    marginTop: 20,
    marginLeft: -60,
    color: "white",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoTurnoNoche: {
    fontSize: 10.9,
    fontWeight: "bold",
    position: "absolute",
    width: 230,
    left: "23%",
    top: "46%",
  },
});
