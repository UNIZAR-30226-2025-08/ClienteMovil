import React, { useState, useEffect } from "react"; // Importar useState desde React
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const imagenPortada = require("@/assets/images/imagen-portada.png");
const imagenPorDefecto = require("@/assets/images/imagenPerfil.webp");

export default function opcionesScreen() {
  // Recuperar la URL de backend desde Constants
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  const router = useRouter();

  // Estado para almacenar los datos del usuario
  const [usuario, setUsuario] = useState<{
    nombre: string;
    avatar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Cargar los datos del usuario al entrar a la pantalla
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

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
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

            <Text style={styles.nombrePlayer}>
              {usuario?.nombre || "Usuario"}
            </Text>

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
              onPress={() => router.push("/(opciones)/opciones")}
            >
              <Text style={styles.textoBoton}>OPCIONES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boton}
              onPress={() => router.push("/(contacto)/contacto")}
            >
              <Text style={styles.textoBoton}>CONTACTO</Text>
            </TouchableOpacity>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

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
});
