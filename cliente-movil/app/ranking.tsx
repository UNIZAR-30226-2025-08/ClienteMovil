import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Mapa de avatares que relaciona claves con sus respectivas imágenes.
 *
 * @remarks
 * Se utiliza para obtener la imagen correspondiente a la clave almacenada en la base de datos.
 *
 * @example
 * ```ts
 * const avatar = avatarMap["avatar1"]; // Obtiene la imagen para 'avatar1'
 * ```
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
 * Tipo que representa a un jugador en el ranking.
 *
 * @property idUsuario - Identificador único del jugador.
 * @property nombre - Nombre del jugador.
 * @property victorias - Número de victorias del jugador.
 * @property avatar - Clave del avatar asignado al jugador (opcional).
 */
type Jugador = {
  idUsuario: number;
  nombre: string;
  victorias: number;
  avatar?: string;
};

/**
 * Pantalla de ranking que muestra el top 10 de jugadores con más victorias.
 *
 * @returns {JSX.Element} La interfaz de la pantalla de ranking.
 *
 * @remarks
 * Se realiza una petición al endpoint del backend para obtener el ranking global, se muestra un indicador de carga mientras se obtienen los datos y luego se renderiza una lista de tarjetas (cards) con el avatar, nombre y victorias de cada jugador.
 */
export default function RankingScreen(): JSX.Element {
  // Estado que guarda el ranking de jugadores
  const [ranking, setRanking] = useState<Jugador[]>([]);

  // Estado que indica si los datos están cargando
  const [loading, setLoading] = useState(true);

  // Hook de enrutamiento para navegar a otras pantallas
  const router = useRouter();

  /** URL del backend obtenida de las constantes de Expo */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  useEffect(() => {
    /**
     * Función asíncrona para obtener el ranking global desde el backend.
     *
     * @remarks
     * Se espera que la respuesta tenga una propiedad `ranking` que es un array de jugadores ordenados de forma descendente por victorias.
     */
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/ranking/ranking`);
        // Se asume que response.data.ranking está ordenado descendentemente por victorias
        setRanking(response.data.ranking.slice(0, 30));
      } catch (error) {
        // Manejo de errores al obtener el ranking
        console.error("Error al obtener el ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    // Llama a la función para obtener el ranking
    fetchRanking();
  }, []);

  /**
   * Maneja el evento de presionar un jugador en el ranking.
   * Guarda el ID del jugador en AsyncStorage y navega al perfil del jugador.
   *
   * @param {number} idUsuario - ID del jugador que se presionó.
   * @returns {Promise<void>} No retorna nada.
   */
  const handlePress = async (idUsuario: number) => {
    try {
      console.log("Presionando jugador del ranking con ID:", idUsuario);
      await AsyncStorage.setItem("amigoId", idUsuario.toString());
      router.push({
        pathname: "/(perfil)/perfilAmigo",
        params: { amigoId: idUsuario.toString() },
      });
    } catch (error) {
      console.error(
        "Error al guardar el ID del jugador en AsyncStorage",
        error
      );
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/fondo-roles.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        <Text style={styles.header}>Ranking Top 30</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          // Muestra la lista de jugadores en un ScrollView
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {ranking.map((jugador, index) => (
              <TouchableOpacity
                key={jugador.idUsuario}
                onPress={() => handlePress(jugador.idUsuario)}
                activeOpacity={0.7}
              >
                <View key={jugador.idUsuario} style={styles.cardContainer}>
                  <View style={styles.cardHeader}>
                    {/* Mostrar avatar de cada uno de los usuarios del ranking */}
                    <Image
                      source={
                        jugador.avatar && avatarMap[jugador.avatar]
                          ? avatarMap[jugador.avatar]
                          : require("@/assets/images/imagenPerfil.webp")
                      }
                      style={styles.avatar}
                    />

                    <Text style={styles.rank}>{index + 1}.</Text>
                    <Text style={styles.nombre}>{jugador.nombre}</Text>
                  </View>
                  <Text style={styles.victorias}>
                    {jugador.victorias} Victorias
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Botón para volver atrás */}
        <TouchableOpacity
          style={styles.containerAtras}
          onPress={() => router.back()}
        >
          <Image
            source={require("@/assets/images/botonAtras.png")}
            style={styles.imageAtras}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 60,
    zIndex: 1,
  },

  scrollContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },

  cardContainer: {
    flexDirection: "column",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  rank: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },

  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },

  victorias: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },

  loader: {
    marginTop: 20,
  },

  containerAtras: {
    position: "absolute",
    bottom: 20,
    left: "46%",
  },

  imageAtras: {
    width: 40,
    height: 40,
  },
});
