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

// Imagen de fondo y botón de atrás
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

export default function NotificacionesScreen(): JSX.Element {
  const router = useRouter();
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  // Estado para almacenar las notificaciones (solicitudes de amistad)
  const [notificaciones, setNotificaciones] = useState([]);
  // Estado para almacenar el id del usuario actual
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  // Al cargar la pantalla, obtenemos el usuario actual
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const idUsuario = await AsyncStorage.getItem("idUsuario");
        if (idUsuario) {
          setUsuarioId(parseInt(idUsuario));
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    cargarUsuario();
  }, []);

  // Obtener las notificaciones cuando se tiene el usuario
  useEffect(() => {
    if (usuarioId) {
      fetchNotificaciones();
    }
  }, [usuarioId]);

  const fetchNotificaciones = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/solicitud/listar/${usuarioId}`
      );
      //console.log("Notificaciones recibidas:", response.data);
      // Se espera que response.data tenga { solicitudes: [...] }
      setNotificaciones(response.data.solicitudes);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las notificaciones");
    }
  };

  /**
   * Maneja la aceptación de una solicitud.
   * Se llama al endpoint para aceptar y, de ser exitoso, se elimina la notificación de la lista.
   */
  const handleAceptar = async (notif: any) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/solicitud/aceptar`,
        {
          idEmisor: notif.idUsuarioEmisor,
          idReceptor: usuarioId,
        }
      );
      Alert.alert("Éxito", response.data.mensaje);
      setNotificaciones((prev) =>
        prev.filter((n: any) => n.idUsuarioEmisor !== notif.idUsuarioEmisor)
      );
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
      Alert.alert("Error", "Error al aceptar la solicitud");
    }
  };

  /**
   * Maneja la denegación de una solicitud.
   * Se llama al endpoint para denegar y, de ser exitoso, se elimina la notificación de la lista.
   */
  const handleDenegar = async (solicitudId: number) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/solicitud/denegar`,
        {
          solicitudId,
        }
      );
      if (response.data.exito) {
        Alert.alert("Éxito", "Solicitud denegada");
        setNotificaciones((prev) =>
          prev.filter((notif: any) => notif.id !== solicitudId)
        );
      } else {
        Alert.alert("Error", "No se pudo denegar la solicitud");
      }
    } catch (error) {
      console.error("Error al denegar solicitud:", error);
      Alert.alert("Error", "Error al denegar la solicitud");
    }
  };

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
        <Text style={styles.titulo}>Notificaciones</Text>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {notificaciones.map((notif: any, index: number) => (
            <View
              key={`${notif.idUsuarioEmisor}-${index}`}
              style={styles.notificacionContainer}
            >
              <Text style={styles.textoNotificacion}>
                <Text style={styles.autor}>{notif.nombreEmisor}</Text> te ha
                enviado una solicitud de amistad.
              </Text>
              <Text style={styles.fechaNotificacion}>
                {new Date(notif.fechaSolicitud).toLocaleString()}
              </Text>
              <View style={styles.botonesContainer}>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => handleAceptar(notif)}
                >
                  <Text style={styles.botonTexto}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.boton, styles.botonDenegar]}
                  onPress={() => handleDenegar(notif.idUsuarioEmisor)}
                >
                  <Text style={styles.botonTexto}>Denegar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {notificaciones.length === 0 && (
            <Text style={styles.sinNotificaciones}>
              No tienes notificaciones pendientes
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    marginTop: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 60,
  },
  notificacionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  textoNotificacion: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  autor: {
    fontWeight: "bold",
    color: "#000",
  },
  fechaNotificacion: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boton: {
    backgroundColor: "#008f39",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  botonDenegar: {
    backgroundColor: "red",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
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
