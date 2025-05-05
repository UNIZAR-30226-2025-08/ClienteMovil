import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

export default function NotificacionesScreen() {
  const router = useRouter();
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  // Estado para almacenar las sugerencias
  interface Sugerencia {
    id: string;
    contenido: string;
    respuesta?: string;
    fechaSugerencia: string;
    revisada: boolean;
  }

  const [notificaciones, setNotificaciones] = useState<Sugerencia[]>([]);
  // Estado para almacenar el ID del usuario actual
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  // Al cargar la pantalla se obtiene el usuario actual
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const idUsuario = await AsyncStorage.getItem("idUsuario");
        if (idUsuario) {
          const parsedId = parseInt(idUsuario);
          setUsuarioId(parsedId);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    cargarUsuario();
  }, []);

  // Cuando ya se tiene el ID del usuario se solicitan las sugerencias
  useEffect(() => {
    if (usuarioId) {
      handleVerSugerencia(String(usuarioId));
    }
  }, [usuarioId]);

  // Función para obtener las sugerencias del usuario
  const handleVerSugerencia = async (usuarioId: string) => {
    if (!usuarioId) {
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/sugerencias/usuario`,
        { idUsuario: usuarioId }
      );
      setNotificaciones(data.sugerencias);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Error al obtener tus sugerencias."
      );
    }
  };

  // Función para volver a la pantalla anterior
  const irAtras = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <Text style={styles.titulo}>Sugerencias</Text>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {notificaciones && notificaciones.length > 0 ? (
            notificaciones.map((notif, index) => (
              <View
                key={`${notif.id}-${index}`}
                style={[
                  styles.notificacionContainer,
                  notif.revisada && styles.completedNotificacionContainer,
                ]}
              >
                {notif.revisada && (
                  <Text style={styles.reviewedBadge}>Revisada</Text>
                )}
                <Text
                  style={[styles.textoNotificacion, { fontStyle: "italic" }]}
                >
                  Sugerencia enviada:
                </Text>
                <Text
                  style={[styles.textoNotificacion, { fontWeight: "bold" }]}
                >
                  {notif.contenido || "Sin contenido"}
                </Text>
                <Text style={styles.textoNotificacion}>
                  Respuesta:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {notif.respuesta ?? "Aún no hay respuesta"}
                  </Text>
                </Text>
                <Text style={styles.fechaNotificacion}>
                  {new Date(notif.fechaSugerencia).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.sinNotificaciones}>
              No tienes sugerencias pendientes
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: "100%", flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 60,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    marginTop: 20,
  },
  notificacionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  completedNotificacionContainer: {
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
  textoNotificacion: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  fechaNotificacion: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  sinNotificaciones: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
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
