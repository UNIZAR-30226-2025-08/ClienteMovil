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
 *
 * @remarks
 * Estas imágenes se utilizan para el fondo de la pantalla y los íconos de los roles "Luna", "Sol", "Papiro", y otros botones.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imageLobo = require("@/assets/images/lobo.png");
const imagenPapiro = require("@/assets/images/papiro.png");
const imageFondoTurnos = require("@/assets/images/fondo-turnos-explicacion.webp");
const imagenAtras = require("@/assets/images/botonAtras.png");
const imagenLuna = require("@/assets/images/imagen-luna.png");
const imagenSol = require("@/assets/images/imagen-sol.jpg");

/**
 * Pantalla "¿Cómo Jugar?".
 * Explica la mecánica del juego e introduce las fases de "Día" y "Noche".
 *
 * @returns {JSX.Element} Pantalla de explicación de juego, o `null` mientras se carga la fuente.
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
        <Text style={styles.tituloComoJugar}>¿CÓMO JUGAR?</Text>
        <Image source={imageLobo} style={styles.imageLobo}></Image>
        <Image source={imagenPapiro} style={styles.imagePapiro}></Image>
        <Text style={styles.textoComoJugar}>
          Antes de iniciar la partida, se repartirán los roles. Cada jugador
          conocerá el suyo pero no el de los demás jugadores. Los roles sólo se
          revelarán al morir un jugador o al finalizar la partida. Al comienzo
          de la partida los aldeanos votarán un Alguacil (función adicional,
          independiente del rol del personaje) por mayoría simple. El voto del
          Alguacil cuenta como dos votos. Tras votar, el ciclo de juego comienza
          en la noche.
        </Text>

        {/* Botón para ir a la fase de Noche */}
        <TouchableOpacity style={styles.containerTurnoNoche}>
          <Link href="/(comoJugar)/(turnos)/turnoNoche">
            <ImageBackground
              source={imageFondoTurnos}
              style={styles.imageFondoTurnos}
            >
              <View style={styles.overlayTurno} />
              <View style={styles.buttonContent}>
                <Image source={imagenLuna} style={styles.iconTurno} />
                <Text style={styles.textTurno}>NOCHE</Text>
                <Image source={imagenLuna} style={styles.iconTurno} />
              </View>
            </ImageBackground>
          </Link>
        </TouchableOpacity>

        {/* Botón para ir a la fase de Día */}
        <TouchableOpacity style={styles.containerTurnoDia}>
          <Link href="/(comoJugar)/(turnos)/turnoDia">
            <ImageBackground
              source={imageFondoTurnos}
              style={styles.imageFondoTurnos}
            >
              <View style={styles.overlayTurno} />
              <View style={styles.buttonContent}>
                <Image source={imagenSol} style={styles.iconTurno} />
                <Text style={styles.textTurno}>DIA</Text>
                <Image source={imagenSol} style={styles.iconTurno} />
              </View>
            </ImageBackground>
          </Link>
        </TouchableOpacity>

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
 *
 * @remarks
 * Los estilos incluyen configuraciones para la
 * disposición de los elementos, la imagen de fondo,
 * los iconos y los textos en la pantalla.
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
    top: 580,
    left: "35%",
    marginLeft: -50,
  },

  containerTurnoDia: {
    position: "absolute",
    top: 640,
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

  buttonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  iconTurno: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },

  textTurno: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
