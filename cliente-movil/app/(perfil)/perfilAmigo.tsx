/**
 * @file PerfilAmigoScreen.tsx
 * @description Pantalla que muestra el perfil detallado de un usuario (amigo), incluyendo su información básica y número de victorias si se encuentra en el ranking.
 */

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

/**
 * Mapa de avatares que relaciona claves de avatar con sus respectivas imágenes locales.
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

// Imágenes utilizadas en la interfaz
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Interfaz que representa la estructura de un objeto usuario.
 */
interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  avatar?: string;
  fechaCreacion: string;
  rolFavorito: string;
}

/**
 * Pantalla de perfil de un amigo.
 *
 * @returns {JSX.Element} Componente visual que representa el perfil del amigo seleccionado.
 *
 * @remarks
 * - Utiliza `AsyncStorage` para obtener el ID del amigo.
 * - Hace dos peticiones: una para obtener los datos del usuario, y otra para extraer su número de victorias del ranking global.
 * - Muestra el avatar, nombre, fecha de creación del perfil, rol favorito y número de victorias.
 */
export default function PerfilAmigoScreen(): JSX.Element {
  const router = useRouter();
  const { amigoId } = useLocalSearchParams();
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  const [amigo, setAmigo] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [victorias, setVictorias] = useState<number | null>(null);

  /**
   * Hook de efecto para cargar los detalles del amigo y su número de victorias al montar el componente.
   */
  useEffect(() => {
    if (!amigoId) {
      console.log("No se encontró el ID del amigo en los parámetros.");
      setLoading(false);
      return;
    }

    const fetchAmigoDetails = async () => {
      try {
        const amigoIdFromStorage = await AsyncStorage.getItem("amigoId");
        //console.log("ID del amigo desde los parámetros:", amigoIdFromStorage);

        const response = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener_por_id`,
          { idUsuario: amigoIdFromStorage }
        );
        setAmigo(response.data.usuario);

        const rankingResponse = await axios.get(
          `${BACKEND_URL}/api/ranking/ranking`
        );
        const jugadorEnRanking = rankingResponse.data.ranking.find(
          (jugador: any) => jugador.idUsuario == amigoIdFromStorage
        );

        if (jugadorEnRanking) {
          setVictorias(jugadorEnRanking.victorias);
        } else {
          setVictorias(0); // Si no está en el ranking, se asume 0 victorias
        }
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
      <ImageBackground source={imagenFondoRoles} style={styles.image}>
        <View style={styles.overlay} />
        <Image
          source={avatarMap[amigo.avatar || "avatar1"]}
          style={styles.profileImage}
        />

        {/* Papiro con nombre dentro */}
        <ImageBackground source={imagenPapiro} style={styles.imagePapiro}>
          <Text style={styles.textoNombrePapiro}>👤 {amigo.nombre}</Text>
        </ImageBackground>

        <View style={styles.formContainer}>
          <Text style={styles.fechaCreacion}>
            📅 Perfil creado:{" "}
            {new Date(amigo.fechaCreacion).toLocaleDateString("es-ES")}
          </Text>
          <Text style={styles.textoRol}>
            ⭐ Rol favorito: {amigo.rolFavorito}
          </Text>
          {victorias !== null && (
            <Text style={styles.textoRol}>
              🏆 Número de victorias: {victorias}
            </Text>
          )}

          {/* Historial de partidas justo debajo de las victorias */}
          <TouchableOpacity
            style={styles.botonHistorial}
            onPress={() =>
              router.push({
                pathname: "/(perfil)/historial",
                params: { usuarioId: amigo.idUsuario.toString() },
              })
            }
          >
            <Text style={styles.textoHistorial}>HISTORIAL PARTIDAS</Text>
          </TouchableOpacity>
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

/**
 * Estilos para la pantalla de perfil del amigo.
 */
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
    zIndex: 1,
  },

  imagePapiro: {
    height: 420,
    width: 333,
    position: "absolute",
    bottom: "20%",
    left: "8%",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  formContainer: {
    position: "absolute",
    width: "100%",
    bottom: "25%",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "40%",
  },

  textoNombrePapiro: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginTop: 20,
    textAlign: "center",
    width: "100%",
  },

  fechaCreacion: {
    fontSize: 23,
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

  botonHistorial: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 50,
    marginTop: 15,
    borderRadius: 10,
  },

  textoHistorial: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
