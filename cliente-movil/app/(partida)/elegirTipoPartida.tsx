import React, { useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Link } from "expo-router";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationButton from "@/components/NotificationButton";
import io from "socket.io-client";

// Importación para el botón de atrás
const imagenAtras = require("@/assets/images/botonAtras.png");

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
    id: number;
    nombre: string;
    avatar?: string;
  } | null>(null);

  /**
   * Estado de carga para mostrar un indicador mientras se recuperan los datos.
   */
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Referencia para la conexión socket
  const socketRef = useRef<any>(null);

  /**
   * Carga los datos del usuario cuando la pantalla gana foco.
   */
  useFocusEffect(
    useCallback(() => {
      const cargarUsuario = async () => {
        try {
          const nombre = await AsyncStorage.getItem("nombreUsuario");
          const avatarClave = await AsyncStorage.getItem("avatarUsuario");

          const storedId = await AsyncStorage.getItem("idUsuario");
          const id = Number(storedId);

          const avatar = avatarClave ? avatarMap[avatarClave] : undefined;

          setUsuario({
            id,
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

  /**
   * Conectar con el backend utilizando socket.io.
   */
  useEffect(() => {
    if (BACKEND_URL) {
      socketRef.current = io(BACKEND_URL);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [BACKEND_URL]);

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

  /**
   * Función para unirse a una partida rápida.
   */
  const joinQuickMatch = () => {
    if (!usuario) return;

    const usuarioPayload = {
      id: usuario.id,
      nombre: usuario.nombre,
      avatar: usuario.avatar,
    };

    // Emitimos el evento "unirseRapido" al servidor
    socketRef.current.emit("unirseRapido", { usuario: usuarioPayload });

    // Escuchamos posibles errores
    socketRef.current.on("error", (mensaje: string) => {
      Alert.alert("Error", mensaje);
    });

    // Cuando se reciba la sala
    socketRef.current.on("salaActualizada", (sala: any) => {
      router.push({
        pathname: "/(sala)/sala",
        params: {
          idSala: sala.id,
          salaData: JSON.stringify(sala),
        },
      });
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenPortada}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        <TouchableOpacity
          style={styles.botonAtras}
          onPress={() => router.back()}
        >
          <Image source={imagenAtras} style={styles.imagenAtras} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/perfil")}
          style={styles.contenedorPerfil}
        >
          <Image
            source={usuario?.avatar ? usuario.avatar : imagenPorDefecto}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <Text style={styles.nombrePlayer}>{usuario?.nombre || "Usuario"}</Text>

        {/* Botón de Partida Rápida */}
        <TouchableOpacity onPress={joinQuickMatch} style={styles.textoPartida}>
          <Text style={styles.textInsideLink}>PARTIDA RÁPIDA</Text>
        </TouchableOpacity>

        <Link
          href={"/(buscarpartida)/buscarpartida"}
          style={styles.textoComoJugar}
        >
          BUSCAR SALAS
        </Link>

        <Link href={"/(crearsala)/crearsala"} style={styles.textoRoles}>
          CREAR PARTIDA
        </Link>

        <View style={styles.botonNotificaciones}>
          <View style={styles.iconoNotificacionesContainer}>
            <NotificationButton />
          </View>
        </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute",
    top: 250,
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  textInsideLink: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
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
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 10,
  },

  iconoNotificacionesContainer: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 5,
  },

  botonAtras: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    zIndex: 10,
  },

  imagenAtras: {
    width: 50,
    height: 50,
  },
});
