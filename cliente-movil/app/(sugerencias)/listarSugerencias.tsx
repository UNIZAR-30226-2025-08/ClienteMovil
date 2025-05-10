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

/**
 * Importación de imágenes utilizadas en la pantalla de listar
 * sugerencias.
 *
 * @remarks
 * Estas imágenes incluyen el fondo de la pantalla, y la del
 * botón de regreso.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

export default function NotificacionesScreen() {
  /**
   * Hook de navegación para manejar la navegación en la aplicación.
   */
  const router = useRouter();

  /**
   * URL del backend obtenida de las constantes de Expo.
   *
   * @constant {string | undefined}
   */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  /**
   * Tipo que representa una sugerencia.
   *
   * @property {string} id - Identificador único de la sugerencia.
   * @property {string} contenido - El contenido de la sugerencia.
   * @property {string} [respuesta] - La respuesta a la sugerencia (si existe).
   * @property {string} fechaSugerencia - La fecha en que se envió la sugerencia.
   * @property {boolean} revisada - Indica si la sugerencia ha sido revisada.
   */
  interface Sugerencia {
    id: string;
    contenido: string;
    respuesta?: string;
    fechaSugerencia: string;
    revisada: boolean;
  }

  /**
   * Estado para almacenar las notificaciones del usuario.
   * @type {Sugerencia[]}
   */
  const [notificaciones, setNotificaciones] = useState<Sugerencia[]>([]);

  /**
   * Estado para almacenar el ID del usuario actual.
   * @type {number | null}
   */
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  /**
   * Efecto secundario para cargar el ID del usuario desde AsyncStorage.
   * Este efecto se ejecuta una vez al montar el componente para obtener el ID del usuario.
   *
   * @remarks
   * Se utiliza para obtener el ID del usuario que realiza las sugerencias y cargar las sugerencias correspondientes.
   */
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

  /**
   * Efecto secundario que se ejecuta cuando se tiene el ID del usuario.
   * Este efecto hace una solicitud al backend para obtener las sugerencias del usuario.
   */
  useEffect(() => {
    if (usuarioId) {
      handleVerSugerencia(String(usuarioId));
    }
  }, [usuarioId]);

  /**
   * Función para obtener las sugerencias del usuario desde el backend.
   * Realiza una petición POST para obtener las sugerencias almacenadas.
   *
   * @param {string} usuarioId - El ID del usuario para obtener sus sugerencias.
   * @async
   * @returns {Promise<void>} Promesa que se resuelve cuando las sugerencias son obtenidas.
   */
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

  /**
   * Función para volver a la pantalla anterior.
   *
   * @remarks
   * Utiliza el hook `useRouter` para retroceder en el stack de navegación.
   */
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

/**
 * Estilos para la pantalla de notificaciones.
 *
 * @remarks
 * Los estilos incluyen la disposición de los elementos en la pantalla, como
 * las imágenes, los textos y los botones.
 * Se usa un fondo de imagen, y se configuran estilos para las notificaciones,
 * incluyendo la visualización del estado revisado.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
  },

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
