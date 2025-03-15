import React, { useState } from "react"; // Importar useState desde React
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
import { useCallback } from "react";
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
 * Recursos de imágenes utilizados en la pantalla.
 */
const imagenPortada = require("@/assets/images/imagen-portada.png");
const imagenPorDefecto = require("@/assets/images/imagenPerfil.webp");
const imagenNotificaciones = require("@/assets/images/noti_icon.png");

/**
 * Pantalla de opciones principales del juego.
 * 
 * Permite acceder a diferentes secciones como jugar, ver roles, opciones,
 * contacto y cerrar sesión.
 * 
 * @returns {JSX.Element | null} Pantalla de opciones del juego.
 */
export default function OpcionesScreen(): JSX.Element | null {

  /**
   * Recupera la URL del backend desde las configuraciones de la aplicación.
   */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  const router = useRouter();

  /**
   * Estado que almacena la información del usuario.
   */
  const [usuario, setUsuario] = useState<{
    nombre: string;
    avatar?: string;
  } | null>(null);

    /**
   * Estado de carga para mostrar un indicador mientras se recuperan los datos.
   */
  const [loading, setLoading] = useState(true);

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

  /**
   * Cierra la sesión del usuario eliminando los datos almacenados.
   */
  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem("nombreUsuario");
      await AsyncStorage.removeItem("avatarUsuario");
      setUsuario(null); // Restablecer el estado del usuario
      router.push("/"); // Redirigir a la pantalla de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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
      <ImageBackground
        source={imagenPortada}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {/* Muestra un indicador de carga si los datos aún están cargando */}
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <>

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
            <Text style={styles.nombrePlayer}>
              {usuario?.nombre || "Usuario"}
            </Text>

            {/* Botón para jugar */}
            <TouchableOpacity
              style={styles.boton}
              onPress={() => router.push("/(partida)/elegirTipoPartida")}
            >
              <Text style={styles.textoBoton}>JUGAR</Text>
            </TouchableOpacity>

            {/* Botón para ver cómo jugar */}
            <TouchableOpacity
              style={styles.boton}
              onPress={() => router.push("/(comoJugar)/comoJugar")}
            >
              <Text style={styles.textoBoton}>¿CÓMO JUGAR?</Text>
            </TouchableOpacity>

            {/* Botón para ver los roles */}
            <TouchableOpacity
              style={styles.boton}
              onPress={() => router.push("/roles")}
            >
              <Text style={styles.textoBoton}>ROLES</Text>
            </TouchableOpacity>

            {/* Botón para acceder a las opciones */}
            <TouchableOpacity
              style={styles.boton}
              onPress={() => router.push("/(opciones)/opciones")}
            >
              <Text style={styles.textoBoton}>OPCIONES</Text>
            </TouchableOpacity>

            {/* Botón para ver la sección de contacto */}
            <TouchableOpacity
              style={styles.boton}
              onPress={() => router.push("/(contacto)/contacto")}
            >
              <Text style={styles.textoBoton}>CONTACTO</Text>
            </TouchableOpacity>

            {/* Botón para cerrar sesión */}
            <TouchableOpacity
              style={styles.botonCerrarSesion}
              onPress={cerrarSesion}
            >
              <Text style={styles.textoBoton}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Botón de notificaciones */}
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


// Estilos de la pantalla
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

  textoOpciones: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute", // Fija el contenedor en la parte inferior
    top: 475, // Ajusta la distancia desde la parte inferior
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoContacto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute", // Fija el contenedor en la parte inferior
    top: 550, // Ajusta la distancia desde la parte inferior
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
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

  loader: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
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
