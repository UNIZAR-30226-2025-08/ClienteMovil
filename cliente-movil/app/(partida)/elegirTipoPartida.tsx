import React, { useState, useEffect } from "react"; // Importar useState desde React
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Link } from "expo-router";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Mapa que relaciona claves de avatar con las imágenes correspondientes.
 */
const avatarMap: Record<string, any> = {
  avatar1: require("@/assets/images/imagenPerfil.webp"),
  avatar2: require("@/assets/images/imagenPerfil2.webp"),
  avatar3: require("@/assets/images/imagenPerfil3.webp"),
  avatar4: require("@/assets/images/imagenPerfil4.webp"),
  avatar5: require("@/assets/images/imagenPerfil5.webp"),
  avatar6: require("@/assets/images/imagenPerfil6.webp"),
  avatar7: require("@/assets/images/imagenPerfil7.webp"),
  avatar8: require("@/assets/images/imagenPerfil8.webp"),
};

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
   * Recupera la URL del backend desde las configuraciones de la aplicación.
   */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  /**
   * Estado para almacenar los datos del usuario.
   */
  const [usuario, setUsuario] = useState<{
    nombre: string;
    avatar?: string;
  } | null>(null);

  /**
   * Estado de carga para mostrar un indicador mientras se recuperan los datos.
   */
  const [loading, setLoading] = useState(true); // Estado de carga

  /**
   * Carga los datos del usuario cuando la pantalla gana foco.
   */
  useFocusEffect(
    useCallback(() => {
      const cargarUsuario = async () => {
        try {
          const nombre = await AsyncStorage.getItem("nombreUsuario");
          const avatarClave = await AsyncStorage.getItem("avatarUsuario");

          // Convertimos la clave en la imagen correspondiente en el mapa
          const avatar = avatarClave ? avatarMap[avatarClave] : undefined;

          setUsuario({
            nombre: nombre ?? "Usuario",
            avatar: avatar || undefined,
          });
        } catch (error) {
          console.error("Error al cargar usuario:", error);
        } finally {
          setLoading(false);
        }
      };

      cargarUsuario();
    }, [])
  );

  const router = useRouter();

  /**
   * Carga la fuente personalizada `GhostShadow`.
   */
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  /**
   * Si la fuente aún no ha terminado de cargarse, se retorna `null` para evitar errores.
   */
  if (!loaded) {
    return null;
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

        {/* Contenedor del perfil del usuario */}
        <TouchableOpacity
          onPress={() => router.push("/perfil")}
          style={styles.contenedorPerfil}
        >
          <Image
            source={usuario?.avatar ? usuario.avatar : imagenPorDefecto}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        {/* Nombre del jugador */}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },

  nombrePlayer: {
    position: "absolute",
    top: 205,
    alignSelf: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },

  textoPartida: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute",
    top: 250,
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoComoJugar: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute",
    top: 325,
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
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

  botonNotificaciones: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },

  iconoNotificacionesContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    padding: 5,
  },

  iconoNotificaciones: {
    width: 40,
    height: 40,
  },
});
