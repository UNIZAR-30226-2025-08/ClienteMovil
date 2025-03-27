import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");

// Definir la estructura esperada del usuario
interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  avatar?: string;
  fechaCreacion: string;
  rolFavorito: string;
}

export default function PerfilAmigoScreen() {
  const router = useRouter();
  const { amigoId } = useLocalSearchParams();
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  const [amigo, setAmigo] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!amigoId) {
      console.log("No se encontró el ID del amigo en los parámetros.");
      setLoading(false);
      return;
    }

    const fetchAmigoDetails = async () => {
      try {
        const amigoIdFromStorage = await AsyncStorage.getItem("amigoId");
        console.log("ID del amigo desde los parámetros:", amigoIdFromStorage);
        const response = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener_por_id`,
          { idUsuario: amigoIdFromStorage }
        );
        console.log("Detalles del amigo:", response.data.usuario);
        setAmigo(response.data.usuario);
      } catch (error) {
        console.error("Error al obtener los detalles del amigo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmigoDetails();
  }, [amigoId, BACKEND_URL]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!amigo) {
    return <Text>Error al cargar el perfil del amigo.</Text>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <Image
          source={avatarMap[amigo.avatar || "avatar1"]}
          style={styles.profileImage}
        />

        <Image source={imagenPapiro} style={styles.imagePapiro} />

        <View style={styles.formContainer}>
          <Text style={styles.textoNombre}>{amigo.nombre}</Text>
          <Text style={styles.fechaCreacion}>
            Perfil creado:{" "}
            {new Date(amigo.fechaCreacion).toLocaleDateString("es-ES")}
          </Text>
          <Text style={styles.textoRol}>Rol favorito: {amigo.rolFavorito}</Text>
        </View>

        <TouchableOpacity
          style={styles.containerAtras}
          onPress={() => router.back()}
        >
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    top: 80,
    left: "50%",
    marginLeft: -50,
  },

  imagePapiro: {
    height: 420,
    width: 333,
    position: "absolute",
    bottom: "20%",
    left: "8%",
  },

  formContainer: {
    position: "absolute",
    width: "100%",
    bottom: "25%",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "40%",
  },

  textoNombre: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },

  fechaCreacion: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },

  textoRol: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
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
});
