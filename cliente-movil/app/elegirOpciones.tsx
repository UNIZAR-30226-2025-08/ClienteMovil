import React, { useState, useCallback } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

import NotificationButton from "@/components/NotificationButton";

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

const imagenPortada = require("@/assets/images/imagen-portada.png");
const imagenPorDefecto = require("@/assets/images/imagenPerfil.webp");

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
const socket = io(BACKEND_URL);

const STATUSBAR_HEIGHT = Constants.statusBarHeight || 0;

export default function OpcionesScreen(): JSX.Element | null {
  const router = useRouter();

  const [usuario, setUsuario] = useState<{
    nombre: string;
    avatar?: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const cargarUsuario = async () => {
        try {
          const nombre = await AsyncStorage.getItem("nombreUsuario");
          const avatarClave = await AsyncStorage.getItem("avatarUsuario");
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

  const cerrarSesion = async () => {
    try {
      // leemos el id antes de limpiar el storage
      const id = await AsyncStorage.getItem("idUsuario");
      const parsedId = id ? parseInt(id, 10) : null;
      if (parsedId) {
        // notificamos al servidor que el usuario se desconecta voluntariamente
        socket.emit("desconectarUsuario", { idUsuario: parsedId });
      }
      // limpiamos todo
      await AsyncStorage.multiRemove([
        "idUsuario",
        "nombreUsuario",
        "avatarUsuario",
        "rolFavorito",
      ]);
      setUsuario(null);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenPortada}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <>
            {/* 
              Contenedor de la imagen con position: "absolute" 
              para no desplazar otros elementos.
              Se ubica en la misma posición de antes (top: 100).
              Le damos zIndex: 1 para que un dropdown con zIndex mayor se superponga. 
            */}
            <View style={styles.contenedorPerfil}>
              <TouchableOpacity onPress={() => router.push("/perfil")}>
                <Image
                  source={usuario?.avatar ? usuario.avatar : imagenPorDefecto}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.nombrePlayer}>
              {usuario?.nombre || "Usuario"}
            </Text>

            {/* Nuevo contenedor absoluto para los botones */}
            <View style={styles.contenedorBotones}>
              <TouchableOpacity
                style={styles.boton}
                onPress={() => router.push("/(partida)/elegirTipoPartida")}
              >
                <Text style={styles.textoBoton}>JUGAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.boton}
                onPress={() => router.push("/(comoJugar)/comoJugar")}
              >
                <Text style={styles.textoBoton}>¿CÓMO JUGAR?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.boton}
                onPress={() => router.push("/roles")}
              >
                <Text style={styles.textoBoton}>ROLES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.boton}
                onPress={() => router.push("/(sugerencias)/sugerencias")}
              >
                <Text style={styles.textoBoton}>SUGERENCIAS</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.botonCerrarSesion}
              onPress={cerrarSesion}
            >
              <Text style={styles.textoBoton}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
          </>
        )}

        {/* 
          Botón de notificaciones con position: "absolute"
          (igual que antes), y un zIndex mayor para que el menú 
          sobresalga sobre la imagen (que tiene zIndex: 1).
        */}
        <View style={styles.botonNotificaciones}>
          <NotificationButton />
        </View>

        <TouchableOpacity
          style={styles.botonRanking}
          onPress={() => router.push("/ranking")}
        >
          <View style={styles.iconoRankingContainer}>
            <Text style={styles.iconoRanking}>🏆</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column" },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  loader: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
  },

  // Contenedor con position absolute para que no desplace nada
  // y zIndex menor (1) para que el dropdown con zIndex alto lo tape
  contenedorPerfil: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    zIndex: 1,
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

  contenedorBotones: {
    position: "absolute",
    top: 240,
    alignSelf: "center",
    width: "100%",
  },

  boton: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: "center",
    width: "100%",
  },
  textoBoton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  botonCerrarSesion: {
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 30,
    alignSelf: "center",
    width: "80%",
    position: "absolute",
    bottom: 50,
  },

  // Botón de notificaciones
  botonNotificaciones: {
    position: "absolute",
    top: STATUSBAR_HEIGHT + 10,
    right: 15,
    padding: 10,
    zIndex: 10, // superior a 1 => se superpone a la imagen
  },

  // Botón de Ranking
  botonRanking: {
    position: "absolute",
    top: STATUSBAR_HEIGHT + 10,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  iconoRankingContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 5,
  },
  iconoRanking: {
    fontSize: 30,
    color: "white",
  },
});
