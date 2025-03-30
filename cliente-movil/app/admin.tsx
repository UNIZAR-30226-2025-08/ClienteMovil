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

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

// Pantalla de administración de sugerencias
export default function AdminSuggestionsScreen() {
  // Estado para almacenar las sugerencias obtenidas
  interface Suggestion {
    idSugerencia: number;
    name?: string;
    email?: string;
    contenido: string;
    respuesta?: string;
    revisada?: boolean;
  }
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // Estado para la respuesta en curso y sugerencia activa (para mostrar TextInput)
  const [selectedReply, setSelectedReply] = useState("");
  const [activeSuggestionId, setActiveSuggestionId] = useState<number | null>(null);
  // Estado de carga (opcional)
  const [loading, setLoading] = useState(true);

  // Función para cargar las sugerencias desde el backend
  const loadSuggestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/sugerencias/todas`);
      // Se espera que el backend devuelva { mensaje, sugerencias }
      setSuggestions(response.data.sugerencias);
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
      <Text style={styles.userInfo}>
        Nombre: {item.name ? item.name : "N/D"}
      </Text>
  <Text style={styles.userInfo}>Correo: {item.email ? item.email : "N/D"}</Text>
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
        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          <FlatList
            data={suggestions}
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
    backgroundColor: "rgba(0, 128, 0, 0.3)",
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
});
