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
 * Imágenes de los roles y fondo de pantalla.
 *
 * @remarks
 * Estas imágenes se utilizan como iconos para los roles y el fondo de la pantalla.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenCazador = require("@/assets/images/cazador-icon.jpeg");
const imagenAlguacil = require("@/assets/images/alguacil-icon.png");
const imagenVidente = require("@/assets/images/vidente-icon.jpeg");
const imagenBruja = require("@/assets/images/bruja-icon.jpeg");
const imagenAldeano = require("@/assets/images/aldeano-icon.jpeg");
const imagenLobo = require("@/assets/images/hombre-lobo-icon.jpeg");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Pantalla que muestra la lista de roles del juego.
 * Permite seleccionar un rol para ver más información sobre él.
 *
 * @returns {JSX.Element | null} Pantalla de selección de roles o `null` mientras se carga la fuente.
 */
export default function RolesScreen(): JSX.Element | null {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  // Verificar si la fuente se cargó correctamente antes de renderizar
  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  /**
   * Función para regresar a la pantalla anterior.
   *
   * @remarks
   * Utiliza `router.back()` para navegar hacia la pantalla anterior.
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
        <Text style={styles.tituloRoles}>ROLES</Text>

        {/* Botón de Cazador */}
        <TouchableOpacity style={styles.containerCazador}>
          <Link href="/(roles)/(personajes)/cazador">
            {" "}
            {/* Ruta a la que quieres redirigir */}
            <Image source={imagenCazador} style={styles.imageIconos} />
          </Link>
        </TouchableOpacity>
        <Text style={styles.textoCazador}>CAZADOR</Text>

        {/* Botón de Alguacil */}
        <TouchableOpacity style={styles.containerAlguacil}>
          <Link href="/(roles)/(personajes)/alguacil">
            {" "}
            {/* Ruta a la que quieres redirigir */}
            <Image source={imagenAlguacil} style={styles.imageIconos} />
          </Link>
        </TouchableOpacity>
        <Text style={styles.textoAlguacil}>ALGUACIL</Text>

        {/* Botón de Vidente */}
        <TouchableOpacity style={styles.containerVidente}>
          <Link href="/(roles)/(personajes)/vidente">
            {" "}
            {/* Ruta a la que quieres redirigir */}
            <Image source={imagenVidente} style={styles.imageIconos} />
          </Link>
        </TouchableOpacity>
        <Text style={styles.textoVidente}>VIDENTE</Text>

        {/* Botón de Bruja */}
        <TouchableOpacity style={styles.containerBruja}>
          <Link href="/(roles)/(personajes)/bruja">
            {" "}
            {/* Ruta a la que quieres redirigir */}
            <Image source={imagenBruja} style={styles.imageIconos} />
          </Link>
        </TouchableOpacity>
        <Text style={styles.textoBruja}>BRUJA</Text>

        {/* Botón de Aldeano */}
        <TouchableOpacity style={styles.containerAldeano}>
          <Link href="/(roles)/(personajes)/aldeano">
            {" "}
            {/* Ruta a la que quieres redirigir */}
            <Image source={imagenAldeano} style={styles.imageIconos} />
          </Link>
        </TouchableOpacity>
        <Text style={styles.textoAldeano}>ALDEANO</Text>

        {/* Botón de Lobo */}
        <TouchableOpacity style={styles.containerLobo}>
          <Link href="/(roles)/(personajes)/lobo">
            {" "}
            {/* Ruta a la que quieres redirigir */}
            <Image source={imagenLobo} style={styles.imageIconos} />
          </Link>
        </TouchableOpacity>
        <Text style={styles.textoLobo}>LOBO</Text>

        {/* Botón de regresar */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos de la pantalla de selección de roles.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  containerCazador: {
    position: "absolute",
    top: 200,
    left: "25%",
    marginLeft: -50,
  },

  containerAlguacil: {
    position: "absolute",
    top: 200,
    right: "12%",
    marginLeft: -50,
  },

  containerVidente: {
    position: "absolute",
    top: 375,
    left: "25%",
    marginLeft: -50,
  },

  containerBruja: {
    position: "absolute",
    top: 375,
    right: "12%",
    marginLeft: -50,
  },

  containerAldeano: {
    position: "absolute",
    top: 550,
    left: "25%",
    marginLeft: -50,
  },

  containerLobo: {
    position: "absolute",
    top: 550,
    right: "12%",
    marginLeft: -50,
  },

  containerAtras: {
    position: "absolute",
    bottom: 20,
    left: "46%",
  },

  textoCazador: {
    position: "absolute",
    top: 320,
    left: "18%",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoAlguacil: {
    position: "absolute",
    top: 320,
    right: "17%",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoVidente: {
    position: "absolute",
    top: 495,
    left: "19%",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoBruja: {
    position: "absolute",
    top: 495,
    right: "20%",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoAldeano: {
    position: "absolute",
    top: 670,
    left: "18%",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoLobo: {
    position: "absolute",
    top: 670,
    right: "21%",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  imageIconos: {
    width: 110,
    height: 110,
  },

  tituloRoles: {
    position: "absolute",
    top: "8%",
    left: "49%",
    marginTop: 20,
    marginLeft: -60,
    color: "white",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoRoles: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute",
    top: 400,
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
  },
});
