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
  /** Hook de navegación de Expo Router */
  const router = useRouter();

  /** URL del backend obtenida de las constantes de Expo */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  // Estado para almacenar las notificaciones
  const [notificaciones, setNotificaciones] = useState([]);
  // Estado para almacenar el id del usuario actual
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  // Estado para el tipo de notificación: "solicitudes", "invitaciones" o "sugerencias"
  const [tipoNotificacion, setTipoNotificacion] = useState("solicitudes");

  // Al cargar la pantalla, obtenemos el usuario actual
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const idUsuario = await AsyncStorage.getItem("idUsuario");
        if (idUsuario) {
          const parsedId = parseInt(idUsuario);
          setUsuarioId(parsedId);
          //console.log("Usuario ID cargado:", parsedId);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    cargarUsuario();
  }, []);

  /**
   * Obtiene las notificaciones del usuario desde el backend
   *
   * @remarks
   * Se ejecuta cuando:
   * - Se carga el ID del usuario
   * - Cambia el tipo de notificación
   */
  useEffect(() => {
    if (usuarioId) {
      fetchNotificaciones();
    }
  }, [usuarioId, tipoNotificacion]);

  const fetchNotificaciones = async () => {
    if (!usuarioId) return;
    if (tipoNotificacion === "solicitudes") {
      const response = await axios.get(
        `${BACKEND_URL}/api/solicitud/listar/${usuarioId}`
      );
      setNotificaciones(response.data.solicitudes);
    } else if (tipoNotificacion === "invitaciones") {
      const response = await axios.get(
        `${BACKEND_URL}/api/invitacion/listar/${usuarioId}`
      );
      setNotificaciones(response.data.invitaciones);
    } else if (tipoNotificacion === "sugerencias") {
      // En vez de armar el endpoint, invoca directamente la función
      await handleVerSugerencia(String(usuarioId));
    }
  };

  // Ejemplo de función para cargar sugerencias
  const handleVerSugerencia = async (usuarioId: string) => {
    if (!usuarioId) {
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/sugerencias/usuario`,
        {
          idUsuario: usuarioId,
        }
      );
      setNotificaciones(data.sugerencias);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Error al obtener tus sugerencias."
      );
    }
  };

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

  const handleDenegar = async (emisorId: number) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/solicitud/denegar`,
        {
          solicitudId: emisorId,
        }
      );
      if (response.data.exito) {
        Alert.alert("Éxito", "Solicitud denegada");
        setNotificaciones((prev) =>
          prev.filter((notif: any) => notif.id !== emisorId)
        );
      } else {
        Alert.alert("Error", "No se pudo denegar la solicitud");
      }
    } catch (error) {
      console.error("Error al denegar solicitud:", error);
      Alert.alert("Error", "Error al denegar la solicitud");
    }
  };

  // Funciones de ejemplo para invitaciones a partidas
  const handleUnirse = (notif: any) => {
    Alert.alert("Función no implementada", "Unirse a la partida");
  };

  const handleRechazar = (emisorId: number) => {
    Alert.alert("Función no implementada", "Rechazar la invitación");
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

        {/* Botones para filtrar el tipo de notificaciones */}
        <View style={styles.botonesTipoContainer}>
          <TouchableOpacity
            style={[
              styles.botonTipo,
              tipoNotificacion === "solicitudes" && styles.botonTipoActivo,
            ]}
            onPress={() => setTipoNotificacion("solicitudes")}
          >
            <Text style={styles.botonTipoTexto}>Solicitudes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.botonTipo,
              tipoNotificacion === "invitaciones" && styles.botonTipoActivo,
            ]}
            onPress={() => setTipoNotificacion("invitaciones")}
          >
            <Text style={styles.botonTipoTexto}>Invitaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.botonTipo,
              tipoNotificacion === "sugerencias" && styles.botonTipoActivo,
            ]}
            onPress={() => setTipoNotificacion("sugerencias")}
          >
            <Text style={styles.botonTipoTexto}>Sugerencias</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {notificaciones && notificaciones.length > 0 ? (
            notificaciones.map((notif: any, index: number) => (
              <View
                key={`${notif.idUsuarioEmisor || notif.id}-${index}`}
                style={styles.notificacionContainer}
              >
                {tipoNotificacion === "solicitudes" && (
                  <>
                    <Text style={styles.textoNotificacion}>
                      <Text style={styles.autor}>{notif.nombreEmisor}</Text> te
                      ha enviado una solicitud de amistad.
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
                  </>
                )}
                {tipoNotificacion === "invitaciones" && (
                  <>
                    <Text style={styles.textoNotificacion}>
                      <Text style={styles.autor}>{notif.nombreEmisor}</Text> te
                      ha invitado a una partida.
                    </Text>
                    <Text style={styles.fechaNotificacion}>
                      {new Date(notif.fechaInvitacion).toLocaleString()}
                    </Text>
                    <View style={styles.botonesContainer}>
                      <TouchableOpacity
                        style={styles.boton}
                        onPress={() => handleUnirse(notif)}
                      >
                        <Text style={styles.botonTexto}>Unirse</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.boton, styles.botonDenegar]}
                        onPress={() => handleRechazar(notif.idUsuarioEmisor)}
                      >
                        <Text style={styles.botonTexto}>Rechazar</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {tipoNotificacion === "sugerencias" && (
                  <>
                    {/* Indicador de sugerencia */}
                    <Text
                      style={[
                        styles.textoNotificacion,
                        { fontStyle: "italic" },
                      ]}
                    >
                      Sugerencia enviada:
                    </Text>

                    {/* Luego se muestra el contenido y la respuesta */}
                    <Text
                      style={[styles.textoNotificacion, { fontWeight: "bold" }]}
                    >
                      {notif.contenido || "Sin contenido"}
                    </Text>
                    <Text style={[styles.textoNotificacion]}>
                      Respuesta:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {notif.respuesta ?? "Aún no hay respuesta"}
                      </Text>
                    </Text>

                    {/* Finalmente se muestra la fecha y el estado */}
                    <Text style={styles.fechaNotificacion}>
                      {new Date(notif.fechaSugerencia).toLocaleString()}
                    </Text>

                    {/* Si la sugerencia está cerrada, muestra un check verde al lado */}
                    <Text style={styles.textoNotificacion}>
                      Estado:
                      {notif.revisada ? (
                        <Text style={{ color: "green", fontWeight: "bold" }}>
                          {" "}
                          Cerrada ✔
                        </Text>
                      ) : (
                        <Text style={{ fontWeight: "bold" }}> Abierta</Text>
                      )}
                    </Text>
                  </>
                )}
              </View>
            ))
          ) : (
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
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 60,
  },
  botonesTipoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 20,
  },
  botonTipo: {
    backgroundColor: "#008f39",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  botonTipoActivo: {
    backgroundColor: "#005f20",
  },
  botonTipoTexto: {
    color: "#fff",
    fontWeight: "bold",
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
