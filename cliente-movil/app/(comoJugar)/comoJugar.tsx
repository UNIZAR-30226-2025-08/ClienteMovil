import React from "react"; // Importar useState desde React
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useFonts } from "expo-font";

/**
 * Importación de imágenes utilizadas en la pantalla "¿Cómo Jugar?".
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imageLobo = require("@/assets/images/lobo.png");
const imagenPapiro = require("@/assets/images/papiro.png");
const imageFondoTurnos = require("@/assets/images/fondo-turnos-explicacion.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");
const imagenLuna = require("@/assets/images/imagen-luna.png");
const imagenSol = require("@/assets/images/imagen-sol.jpg");

/**
 * Pantalla "¿Cómo Jugar?".
 * Explica la mecánica del juego e introduce las fases de "Día" y "Noche".
 *
 * @returns {JSX.Element} Pantalla de explicación de juego.
 */
export default function ComoJugarScreen(): JSX.Element | null {
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
        <Text style={styles.tituloComoJugar}>¿CÓMO JUGAR?</Text>
        <Image source={imageLobo} style={styles.imageLobo}></Image>
        <Image source={imagenPapiro} style={styles.imagePapiro}></Image>
        <Text style={styles.textoComoJugar}>
          Se reparten los roles a los jugadores. Cada jugador mira su carta para
          saber cuál es su personaje, información que mantendrá en secreto a
          menos que sea eliminado. El Narrador decide si los aldeanos votarán
          ahora un Alguacil (función adicional, independiente del personaje) por
          mayoría simple, o si el Alguacil será elegido más tarde en el
          transcurso de la partida. El voto del Alguacil cuenta como dos votos.
          El juego comienza en la noche.
        </Text>

        {/* Botón para ir a la fase de Noche */}
        <TouchableOpacity style={styles.containerTurnoNoche}>
          <View style={styles.turnoContainer}>
            <Link href="/(comoJugar)/(turnos)/turnoNoche">
              {" "}
              {/* Ruta a la que quieres redirigir */}
              <View style={styles.imageContainer}>
                <Image
                  source={imageFondoTurnos}
                  style={styles.imageFondoTurnos}
                />
                <View style={styles.overlayTurno} />
              </View>
            </Link>
          </View>
        </TouchableOpacity>

        <Text style={styles.textoNoche}>NOCHE</Text>
        <Image source={imagenLuna} style={styles.imagenTurnoNoche1}></Image>
        <Image source={imagenLuna} style={styles.imagenTurnoNoche2}></Image>

        {/* Botón para ir a la fase de Día */}
        <TouchableOpacity style={styles.containerTurnoDia}>
          <View style={styles.turnoContainer}>
            <Link href="/(comoJugar)/(turnos)/turnoDia">
              {" "}
              {/* Ruta a la que quieres redirigir */}
              <View style={styles.imageContainer}>
                <Image
                  source={imageFondoTurnos}
                  style={styles.imageFondoTurnos}
                />
                <View style={styles.overlayTurno} />
              </View>
            </Link>
          </View>
        </TouchableOpacity>

        <Text style={styles.textoDia}>DIA</Text>
        <Image source={imagenSol} style={styles.imagenTurnoDia1}></Image>
        <Image source={imagenSol} style={styles.imagenTurnoDia2}></Image>

        {/* Botón de regreso */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos para la pantalla "¿Cómo Jugar?".
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  turnoContainer: {
    position: "absolute",
    width: 220,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    position: "relative",
    width: 220,
    height: 40,
  },

  overlayTurno: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  containerAtras: {
    position: "absolute",
    bottom: 20,
    left: "46%",
  },

  containerTurnoNoche: {
    position: "absolute",
    top: 570,
    left: "35%",
    marginLeft: -50,
  },

  containerTurnoDia: {
    position: "absolute",
    top: 630,
    left: "35%",
    marginLeft: -50,
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

  imageFondoTurnos: {
    width: 220,
    height: 40,
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

  imageLobo: {
    width: 170,
    height: 170,
    left: "29%",
    top: "15%",
    position: "absolute",
  },

  tituloComoJugar: {
    position: "absolute",
    top: "5%",
    left: "25%",
    marginTop: 20,
    marginLeft: -60,
    color: "white",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoComoJugar: {
    fontSize: 13,
    fontWeight: "bold",
    position: "absolute",
    width: 230,
    left: "25%",
    top: "45%",
  },

  textoNoche: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    left: "43%",
    bottom: "25%",
  },

  textoDia: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    left: "47%",
    bottom: "17.5%",
  },

  imagenTurnoNoche1: {
    width: 35,
    height: 35,
    position: "absolute",
    bottom: "24.3%",
    left: "28%",
    borderRadius: 100,
  },

  imagenTurnoNoche2: {
    width: 35,
    height: 35,
    position: "absolute",
    bottom: "24.3%",
    left: "66%",
    borderRadius: 100,
  },

  imagenTurnoDia1: {
    width: 35,
    height: 35,
    position: "absolute",
    bottom: "16.8%",
    left: "28%",
    borderRadius: 100,
  },

  imagenTurnoDia2: {
    width: 35,
    height: 35,
    position: "absolute",
    bottom: "16.8%",
    left: "66%",
    borderRadius: 100,
  },
});
