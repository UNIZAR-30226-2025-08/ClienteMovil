import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import Constants from "expo-constants";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

/** URL del backend obtenida de las constantes de Expo */
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

/**
 * Obtiene los datos de un usuario específico desde el backend
 *
 * @param userId - ID del usuario a obtener
 * @returns {Promise<Object>} Datos del usuario
 * @throws {Error} Si hay un error al obtener los datos del usuario
 */
async function fetchUserData(userId: number) {
  const response = await axios.post(
    `${BACKEND_URL}/api/usuario/obtener_por_id`,
    { idUsuario: userId }
  );
  // Alert.alert("Usuario Obtenido", JSON.stringify(response.data.usuario)); // Muestra lo recibido en un alert
  return response.data.usuario; // Ajusta según la estructura que devuelva el backend
}

// Pantalla de administración de sugerencias
export default function AdminSuggestionsScreen() {
  // Estado para almacenar las sugerencias obtenidas
  interface Suggestion {
    idSugerencia: number;
    name?: string;
    correo?: string;
    contenido: string;
    respuesta?: string;
    revisada?: boolean;
  }

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // Estado para la respuesta en curso y sugerencia activa (para mostrar TextInput)
  const [selectedReply, setSelectedReply] = useState("");
  const [activeSuggestionId, setActiveSuggestionId] = useState<number | null>(
    null
  );
  // Estado de carga (opcional)
  const [loading, setLoading] = useState(true);
  // Estado para el filtro de sugerencias
  const [filter, setFilter] = useState<"all" | "revisadas" | "pendientes">(
    "all"
  );

  // Lista filtrada según el estado
  const filteredSuggestions = suggestions.filter((sug) => {
    if (filter === "revisadas") return sug.revisada === true;
    if (filter === "pendientes") return sug.revisada !== true;
    return true;
  });

  /**
   * Carga las sugerencias desde el backend
   *
   * @remarks
   * Se ejecuta al montar el componente y cada vez que se enfoca la pantalla
   */
  const loadSuggestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/sugerencias/todas`);
      // Se espera que el backend devuelva { mensaje, sugerencias }
      const enrichedSuggestions = await Promise.all(
        response.data.sugerencias.map(async (sug: { idUsuario: number }) => {
          const usuario = await fetchUserData(sug.idUsuario);
          // Ajustamos el campo a "correo" en lugar de "email"
          return {
            ...sug,
            name: usuario.nombre,
            correo: usuario.correo,
          };
        })
      );
      setSuggestions(enrichedSuggestions);
    } catch (error) {
      Alert.alert(
        "Error",
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "No se pudieron cargar las sugerencias."
      );
    } finally {
      setLoading(false);
    }
  };

  // Se recarga la información cada vez que la pantalla tiene foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadSuggestions(); // Asegúrate de que esta función esté correctamente declarada
    }, [])
  );

  // Función para responder a una sugerencia
  const handleSendReply = async (idSugerencia: number) => {
    if (selectedReply.trim() === "") {
      Alert.alert("Error", "La respuesta no puede estar vacía.");
      return;
    }
    try {
      await axios.put(`${BACKEND_URL}/api/sugerencias/responder`, {
        idSugerencia,
        respuesta: selectedReply,
      });
      setSuggestions((prev) =>
        prev.map((sug) =>
          sug.idSugerencia === idSugerencia
            ? { ...sug, respuesta: selectedReply }
            : sug
        )
      );
      setSelectedReply("");
      setActiveSuggestionId(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.error || "No se pudo enviar la respuesta."
        );
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado.");
      }
    }
  };

  // Función para marcar una sugerencia como completada (revisada)
  const handleMarkCompleted = async (idSugerencia: number) => {
    try {
      await axios.put(`${BACKEND_URL}/api/sugerencias/marcarRevisada`, {
        idSugerencia,
        revisada: true,
      });
      Alert.alert(
        "Sugerencia completada",
        "La sugerencia ha sido marcada como completada."
      );
      // Actualizamos el estado local
      setSuggestions((prev) =>
        prev.map((sug) =>
          sug.idSugerencia === idSugerencia ? { ...sug, revisada: true } : sug
        )
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.error ||
            "No se pudo marcar la sugerencia como completada."
        );
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado.");
      }
    }
  };

  const renderSuggestion = ({ item }: { item: Suggestion }) => (
    <View style={[styles.card, item.revisada && styles.completedCard]}>
      {item.revisada && <Text style={styles.reviewedBadge}>Revisada</Text>}
      <Text style={styles.userInfo}>
        Nombre: {item.name ? item.name : "N/D"}
      </Text>
      <Text style={styles.userInfo}>
        Correo: {item.correo ? item.correo : "N/D"}
      </Text>
      <Text style={styles.description}>Sugerencia: {item.contenido}</Text>
      {item.respuesta ? (
        <Text style={styles.reply}>Respuesta: {item.respuesta}</Text>
      ) : null}
      <View style={styles.actions}>
        {activeSuggestionId === item.idSugerencia ? (
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor="#666"
              value={selectedReply}
              onChangeText={setSelectedReply}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSendReply(item.idSugerencia)}
            >
              <Text style={styles.buttonText}>Enviar Respuesta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {!item.revisada && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setActiveSuggestionId(item.idSugerencia)}
              >
                <Text style={styles.buttonText}>Responder</Text>
              </TouchableOpacity>
            )}
            {!item.revisada && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleMarkCompleted(item.idSugerencia)}
              >
                <Text style={styles.buttonText}>Marcar Completada</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/fondo-roles.jpg")}
      style={styles.image}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.header}>Sugerencias de Usuarios</Text>

        {/* Controles para filtrar */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            onPress={() => setFilter("all")}
            style={[
              styles.filterBtn,
              filter === "all" && styles.filterBtnActive,
            ]}
          >
            <Text style={styles.filterText}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter("pendientes")}
            style={[
              styles.filterBtn,
              filter === "pendientes" && styles.filterBtnActive,
            ]}
          >
            <Text style={styles.filterText}>Pendientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter("revisadas")}
            style={[
              styles.filterBtn,
              filter === "revisadas" && styles.filterBtnActive,
            ]}
          >
            <Text style={styles.filterText}>Revisadas</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item) => item.idSugerencia.toString()}
            renderItem={renderSuggestion}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    fontSize: 28,
    fontFamily: "Georgia",
    lineHeight: 40,
    color: "white",
    textAlign: "center",
    marginTop: 60,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
    marginTop: 40,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  completedCard: {
    backgroundColor: "#e8f5e9",
    borderLeftWidth: 5,
    borderLeftColor: "#008f39",
  },
  reviewedBadge: {
    backgroundColor: "#008f39",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  reply: {
    fontSize: 16,
    color: "green",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  replyContainer: {
    width: "100%",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#008f39",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    minWidth: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  filterBtnActive: {
    backgroundColor: "#008f39",
  },
  filterText: {
    color: "#000",
    fontWeight: "bold",
  },
});
