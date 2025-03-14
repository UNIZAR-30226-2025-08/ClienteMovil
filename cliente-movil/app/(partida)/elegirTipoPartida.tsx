import React, { useState, useEffect } from "react"; // Importar useState desde React
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Imágenes utilizadas en la pantalla.
 */
const imagenPortada = require("@/assets/images/imagen-portada.png");
const imagenPorDefecto = require("@/assets/images/imagenPerfil.webp");
const imagenNotificaciones = require("@/assets/images/noti_icon.png");

/**
 * Pantalla para elegir una partida.
 * Permite al usuario seleccionar entre partida rápida, buscar salas o crear una nueva partida.
 *
 * @returns {JSX.Element} Pantalla de selección de partida.
 */
export default function ElegirPartidaScreen(): JSX.Element | null {
  /**
   * Estado para almacenar los datos del usuario.
   */
  const [usuario, setUsuario] = useState<{
    nombre: string;
    avatar?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true); // Estado de carga

  /**
   * Cargar los datos del usuario desde AsyncStorage cuando la pantalla se renderiza.
   */
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const avatar = await AsyncStorage.getItem("avatarUsuario");

        setUsuario({
          nombre: nombre ?? "Usuario", // Si es null, usa "Usuario"
          avatar: avatar || undefined, // Si es null, usa undefined
        });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  const router = useRouter();
  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  return (
    <View style={styles.container}>

      {/* Fondo de pantalla */}     
      <ImageBackground
        source={imagenPortada}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {/* Contenedor del avatar del usuario */}
        <TouchableOpacity
          onPress={() => router.push("/perfil")}
          style={styles.contenedorPerfil}
        >
          <Image
            source={
              usuario?.avatar ? { uri: usuario.avatar } : imagenPorDefecto
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        {/* Nombre del usuario */}
        <Text style={styles.nombrePlayer}>{usuario?.nombre || "Usuario"}</Text>

        {/* Botón de Partida Rápida */}
        <Link href={"/jugando"} style={styles.textoPartida}>
          PARTIDA RÁPIDA
        </Link>

        {/* Botón para Buscar Salas */}
        <Link
          href={"/(buscarpartida)/buscarpartida"}
          style={styles.textoComoJugar}
        >
          BUSCAR SALAS
        </Link>

        {/* Botón para Crear Partida */}
        <Link href={"/(crearsala)/crearsala"} style={styles.textoRoles}>
          CREAR PARTIDA
        </Link>

        {/* Botón de Notificaciones */}
        <TouchableOpacity
          style={styles.botonNotificaciones}
          onPress={() => router.push("/notificaciones")}
        >
          <View style={styles.iconoNotificacionesContainer}>
            <Image
              source={imagenNotificaciones}
              style={styles.iconoNotificaciones}
            />
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos de la pantalla de selección de partida.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  contenedorPerfil: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    zIndex: 1,
  },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject, // Cubre toda el área de la imagen
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo negro semitransparente, puedes ajustar la opacidad
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },

  nombrePlayer: {
    position: "absolute",
    top: 205, // Ajusta la distancia desde la parte superior
    alignSelf: "center", // Centra horizontalmente
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%", // Asegura que el texto se centre correctamente
  },

  textoPartida: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute", // Fija el contenedor en la parte inferior
    top: 250, // Ajusta la distancia desde la parte inferior
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoComoJugar: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute", // Fija el contenedor en la parte inferior
    top: 325, // Ajusta la distancia desde la parte inferior
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoRoles: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute", // Fija el contenedor en la parte inferior
    top: 400, // Ajusta la distancia desde la parte inferior
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
  },

  botonNotificaciones: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },

  iconoNotificacionesContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo negro semitransparente
    borderRadius: 10,
    padding: 5,
  },

  iconoNotificaciones: {
    width: 40, // Aumenta el tamaño de la imagen
    height: 40, // Aumenta el tamaño de la imagen
  },
});
