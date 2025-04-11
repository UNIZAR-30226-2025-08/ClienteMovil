import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import socket from "@/app/(sala)/socket";

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

const NotificationButton = () => {
  const router = useRouter();

  // Estado para mostrar/ocultar el dropdown de notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  // Estado para almacenar las notificaciones (solicitudes, invitaciones o sugerencias)
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [errorNotifs, setErrorNotifs] = useState<string | null>(null);
  // Estado para datos del usuario
  const [user, setUser] = useState<any>({});
  // Estado para solicitudes pendientes (opcional para badge)
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<any[]>([]);
  // Estado para filtrar el tipo de notificación
  const [tipoNotificacion, setTipoNotificacion] = useState("solicitudes");

  // Obtener datos del usuario desde AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = await AsyncStorage.getItem("idUsuario");
        const parsedId = id ? parseInt(id, 10) : null;
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const avatar =
          (await AsyncStorage.getItem("avatarUsuario")) || "avatar1";
        setUser({ id: parsedId, nombre, avatar });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    fetchUser();
  }, []);

  // Alterna el desplegable y, si se muestra, obtiene notificaciones
  const toggleNotifications = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    if (newState) {
      fetchNotifications();
    }
  };

  // Función para obtener notificaciones desde la API según el tipo
  const fetchNotifications = async () => {
    if (!user.id) return;
    setLoadingNotifs(true);
    setErrorNotifs(null);
    try {
      if (tipoNotificacion === "solicitudes") {
        const response = await axios.get(
          `${BACKEND_URL}/api/solicitud/listar/${user.id}`
        );
        const solicitudes = response.data.solicitudes || [];
        setNotifications(solicitudes);
        setSolicitudesPendientes(solicitudes);
      } else if (tipoNotificacion === "invitaciones") {
        const response = await axios.get(
          `${BACKEND_URL}/api/invitacion/listar/${user.id}`
        );
        setNotifications(response.data.invitaciones || []);
      } else if (tipoNotificacion === "sugerencias") {
        const { data } = await axios.post(
          `${BACKEND_URL}/api/sugerencias/usuario`,
          { idUsuario: user.id }
        );
        setNotifications(data.sugerencias || []);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      setErrorNotifs("Error al obtener notificaciones");
    } finally {
      setLoadingNotifs(false);
    }
  };

  // Funciones para aceptar y denegar solicitud de amistad
  const handleAceptarSolicitud = async (notif: any) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/solicitud/aceptar`,
        {
          idEmisor: notif.idUsuarioEmisor,
          idReceptor: user.id,
        }
      );
      Alert.alert("Solicitud aceptada", response.data.mensaje);
      setNotifications(
        notifications.filter((n) => n.idUsuarioEmisor !== notif.idUsuarioEmisor)
      );
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
      Alert.alert("Error", "No se pudo aceptar la solicitud.");
    }
  };

  const handleDenegarSolicitud = async (idEmisor: number) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/solicitud/denegar`,
        {
          solicitudId: idEmisor,
        }
      );
      if (response.data.exito) {
        Alert.alert("Solicitud denegada", "La solicitud ha sido rechazada.");
        setNotifications(
          notifications.filter((n) => n.idUsuarioEmisor !== idEmisor)
        );
      } else {
        Alert.alert("Error", "No se pudo rechazar la solicitud.");
      }
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      Alert.alert("Error", "No se pudo rechazar la solicitud.");
    }
  };

  // Funciones para invitaciones (usando la misma lógica que la Cabecera)
  const acceptInvitation = () => {
    if (!user.id || notifications.length === 0) {
      Alert.alert("Error", "Usuario no disponible");
      return;
    }
    const notif = notifications[0];
    socket.emit("unirseSala", {
      idSala: notif.idSala,
      usuario: user,
      contrasena: null,
      codigoInvitacion: notif.codigoInvitacion,
    });
    Alert.alert("Éxito", "Te has unido a la sala");
    setShowNotifications(false);
    // Redirige a la sala si lo deseas
    router.push({
      pathname: "/(sala)/sala",
      params: { idSala: notif.idSala, salaData: JSON.stringify(notif) },
    });
  };

  const rejectInvitation = () => {
    if (!user.id || notifications.length === 0) return;
    socket.emit("invitacionRechazada", { idAmigo: user.id });
    Alert.alert("Invitación", "Invitación rechazada");
    setShowNotifications(false);
  };

  // Cambia el tipo de notificación y vuelve a obtener datos
  const handleTipoChange = (tipo: string) => {
    setTipoNotificacion(tipo);
    // Actualiza las notificaciones según el nuevo filtro
    fetchNotifications();
  };

  // Badge para indicar notificaciones pendientes
  const hasNotifications =
    notifications.length > 0 || solicitudesPendientes.length > 0;

  return (
    <View style={styles.container}>
      {/* Botón de campana */}
      <TouchableOpacity style={styles.button} onPress={toggleNotifications}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/noti_icon.png")}
            style={styles.icon}
          />
          {hasNotifications && <View style={styles.redCircle} />}
        </View>
      </TouchableOpacity>

      {/* Dropdown de notificaciones */}
      {showNotifications && (
        <View style={styles.notifDropdownContainer}>
          <View style={styles.filtroContainer}>
            <TouchableOpacity
              style={[
                styles.filtroButton,
                tipoNotificacion === "solicitudes" && styles.filtroActivo,
              ]}
              onPress={() => handleTipoChange("solicitudes")}
            >
              <Text style={styles.filtroTexto}>Solicitudes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filtroButton,
                tipoNotificacion === "invitaciones" && styles.filtroActivo,
              ]}
              onPress={() => handleTipoChange("invitaciones")}
            >
              <Text style={styles.filtroTexto}>Invitaciones</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filtroButton,
                tipoNotificacion === "sugerencias" && styles.filtroActivo,
              ]}
              onPress={() => handleTipoChange("sugerencias")}
            >
              <Text style={styles.filtroTexto}>Sugerencias</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.notifContent}>
            {loadingNotifs ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : errorNotifs ? (
              <Text style={styles.errorText}>{errorNotifs}</Text>
            ) : notifications.length > 0 ? (
              <ScrollView style={styles.notifScroll}>
                {tipoNotificacion === "solicitudes" &&
                  notifications.map((notif, idx) => (
                    <View key={idx} style={styles.cardContainer}>
                      <View style={styles.cardHeader}>
                        <Image
                          source={
                            notif.avatarEmisor
                              ? { uri: notif.avatarEmisor }
                              : require("@/assets/images/imagenPerfil.webp")
                          }
                          style={styles.cardAvatar}
                        />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={styles.cardTitle}>
                            {notif.nombreEmisor}
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            te ha enviado una solicitud de amistad.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={[styles.cardButton, styles.cardButtonAccept]}
                          onPress={() => handleAceptarSolicitud(notif)}
                        >
                          <Text style={styles.cardButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.cardButton, styles.cardButtonReject]}
                          onPress={() =>
                            handleDenegarSolicitud(notif.idUsuarioEmisor)
                          }
                        >
                          <Text style={styles.cardButtonText}>Rechazar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                {tipoNotificacion === "invitaciones" &&
                  notifications.map((notif, idx) => (
                    <View key={idx} style={styles.cardContainer}>
                      <View style={styles.cardHeader}>
                        {notif.avatarInvitador && (
                          <Image
                            source={{ uri: notif.avatarInvitador }}
                            style={styles.cardAvatar}
                          />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardTitle}>
                            {notif.nombreInvitador}
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            te invitó a una partida{" "}
                            {notif.nombreSala && `en "${notif.nombreSala}"`}.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={[styles.cardButton, styles.cardButtonAccept]}
                          onPress={acceptInvitation}
                        >
                          <Text style={styles.cardButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.cardButton, styles.cardButtonReject]}
                          onPress={rejectInvitation}
                        >
                          <Text style={styles.cardButtonText}>Rechazar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                {tipoNotificacion === "sugerencias" && (
                  <Text style={styles.notifText}>
                    Sugerencia:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {notifications[0]?.contenido || "Sin contenido"}
                    </Text>
                  </Text>
                )}
              </ScrollView>
            ) : (
              <Text style={styles.notifText}>No hay notificaciones.</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative" },
  button: { padding: 10 },
  iconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    padding: 5,
  },
  icon: { width: 40, height: 40 },
  redCircle: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  notifDropdownContainer: {
    position: "absolute",
    top: 60,
    right: 0,
    left: -50,
    backgroundColor: "#262522",
    borderWidth: 1,
    borderColor: "#1f1e1c",
    borderRadius: 8,
    padding: 10,
    zIndex: 10000,
    elevation: 10,
    maxHeight: 200,
  },
  filtroContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  filtroButton: {
    backgroundColor: "#555",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  filtroActivo: { backgroundColor: "#008000" },
  filtroTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  notifContent: { maxHeight: 150 },
  notifScroll: { maxHeight: 150 },
  errorText: { color: "red", fontSize: 14 },
  notifText: { color: "#fff", fontSize: 14 },
  cardContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardAvatar: { width: 40, height: 40, borderRadius: 20 },
  cardTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cardSubtitle: { color: "#ccc", fontSize: 14 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cardButtonAccept: { backgroundColor: "#008000" },
  cardButtonReject: { backgroundColor: "#e74c3c" },
  cardButtonText: { color: "#fff", fontWeight: "bold" },
});

export default NotificationButton;
