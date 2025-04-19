// NotificationButton.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import socket from "@/app/(sala)/socket";
import { SafeAreaView } from "react-native-safe-area-context";
import { InviteBus } from "../src/utils/InviteBus";

const { width } = Dimensions.get("window");
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

const NotificationButton = () => {
  const router = useRouter();

  // Estado del usuario
  const [user, setUser] = useState<any>({});

  // Estados para notificaciones y dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [tipoNotificacion, setTipoNotificacion] = useState("solicitudes");
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [errorNotifs, setErrorNotifs] = useState<string | null>(null);

  // Estados para invitaciones vía socket y solicitudes
  const [wsInvitaciones, setWsInvitaciones] = useState<any[]>([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<any[]>([]);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  // Mapeo de avatares para mostrar imágenes en las notificaciones
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

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = await AsyncStorage.getItem("idUsuario");
        const parsedId = id ? parseInt(id, 10) : null;
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const avatar =
          (await AsyncStorage.getItem("avatarUsuario")) || "avatar1";
        const rolFavorito =
          (await AsyncStorage.getItem("rolFavorito")) || "Sin rol favorito";
        setUser({ id: parsedId, nombre, avatar, rolFavorito });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    fetchUser();
  }, []);

  // Obtener solicitudes de amistad (para el badge y dropdown)
  useEffect(() => {
    if (user.id) {
      fetchSolicitudesPendientes();
    }
  }, [user.id]);

  // Configuración del socket para recibir invitaciones
  useEffect(() => {
    socket.on("invitacionSala", async (data) => {
      // Log completo de la invitación en formato JSON
      console.log("Invitación recibida:", JSON.stringify(data, null, 2));

      // Log individual de cada componente de la invitación
      console.log("Componentes de la invitación a una sala:");
      console.log("idAmigo:", data.idAmigo);
      console.log("idSala:", data.idSala);
      console.log("idInvitador:", data.idInvitador);

      // Aquí continuaría la lógica para enriquecer la invitación
      // (por ejemplo, obteniendo el nombre y el avatar del invitador)
      try {
        const responseName = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener_por_id`,
          { idUsuario: data.idInvitador }
        );
        const usuarioInvitador = responseName.data.usuario;
        const responseAvatar = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener_avatar_por_id`,
          { idUsuario: data.idInvitador }
        );
        const avatarInvitador = responseAvatar.data.avatar;
        console.log("Nombre del invitador:", usuarioInvitador.nombre);
        console.log("Avatar del invitador:", avatarInvitador);

        const invitacionEnriquecida = {
          ...data,
          nombreInvitador: usuarioInvitador.nombre,
          avatarInvitador: avatarInvitador,
        };
        setWsInvitaciones((prev: any[]) => [...prev, invitacionEnriquecida]);
      } catch (error) {
        console.error("Error al obtener datos del invitador:", error);
        setWsInvitaciones((prev: any[]) => [...prev, data]);
      }
    });
    return () => {
      socket.off("invitacionSala");
    };
  }, []);

  // Cada vez que cambie el tipo de notificación se carga el listado
  useEffect(() => {
    if (tipoNotificacion !== "invitaciones") {
      fetchNotificaciones();
    } else {
      setNotificaciones(wsInvitaciones);
    }
  }, [tipoNotificacion]);

  // Función para cargar solicitudes de amistad
  const fetchSolicitudesPendientes = async () => {
    if (!user.id) return;
    const userId =
      typeof user.id === "number" ? user.id : parseInt(user.id, 10);
    if (isNaN(userId)) return;
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/solicitud/listar/${userId}`
      );
      setSolicitudesPendientes(response.data.solicitudes || []);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    }
  };

  // Función para cargar notificaciones (solicitudes o sugerencias)
  const fetchNotificaciones = async () => {
    if (!user.id) return;
    const userId =
      typeof user.id === "number" ? user.id : parseInt(user.id, 10);
    if (isNaN(userId)) return;
    setLoadingNotifs(true);
    setErrorNotifs(null);
    try {
      if (tipoNotificacion === "solicitudes") {
        const response = await axios.get(
          `${BACKEND_URL}/api/solicitud/listar/${userId}`
        );
        setNotificaciones(response.data.solicitudes || []);
        setSolicitudesPendientes(response.data.solicitudes || []);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      setErrorNotifs("Error al obtener notificaciones");
    } finally {
      setLoadingNotifs(false);
    }
  };

  // Alterna el estado del dropdown de notificaciones
  const toggleNotifications = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    if (newState) {
      if (tipoNotificacion !== "invitaciones") {
        fetchNotificaciones();
      } else {
        setNotificaciones(wsInvitaciones);
      }
    }
  };

  // Cambiar el tipo de notificación (filtro)
  const handleTipoChange = (tipo: string) => {
    setTipoNotificacion(tipo);
  };

  // Funciones para aceptar o rechazar una solicitud de amistad
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
      setNotificaciones(
        notificaciones.filter(
          (n) => n.idUsuarioEmisor !== notif.idUsuarioEmisor
        )
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
        setNotificaciones(
          notificaciones.filter((n) => n.idUsuarioEmisor !== idEmisor)
        );
      } else {
        Alert.alert("Error", "No se pudo rechazar la solicitud.");
      }
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      Alert.alert("Error", "No se pudo rechazar la solicitud.");
    }
  };

  // Función actualizada para aceptar invitación a sala
  const acceptInvitation = (notif: any) => {
    if (!user.id) {
      Alert.alert("Error", "Usuario no disponible");
      return;
    }
    // Primero solicitamos los datos de la sala
    socket.emit("obtenerSala", notif.idSala, (salaData: any) => {
      if (!salaData) {
        Alert.alert("Error", "No se encontró la sala.");
        return;
      }
      // Si existe, nos unimos
      socket.emit("unirseSala", {
        idSala: notif.idSala,
        usuario: user,
        contrasena: salaData.contrasena || null,
        codigoInvitacion: notif.codigoInvitacion,
      });
      // Limpiamos la invitación
      setWsInvitaciones((prev) =>
        prev.filter(
          (inv) =>
            inv.codigoInvitacion !== notif.codigoInvitacion ||
            inv.idSala !== notif.idSala
        )
      );
      // Notificamos al resto de la app
      InviteBus.emit("invite:removed", {
        idSala: notif.idSala,
        codigoInvitacion: notif.codigoInvitacion,
      });
      Alert.alert("Éxito", "Te has unido a la sala");
      router.push({
        pathname: "/(sala)/sala",
        params: { idSala: notif.idSala, salaData: JSON.stringify(salaData) },
      });
    });
  };

  // Cambiamos la firma para recibir la invitación a rechazar
  const rejectInvitation = (notif: any) => {
    if (!user.id) return;
    socket.emit("invitacionRechazada", { idAmigo: user.id });

    // Filtramos wsInvitaciones y notificaciones para que la invitación desaparezca
    setWsInvitaciones((prev) =>
      prev.filter(
        (inv) =>
          inv.codigoInvitacion !== notif.codigoInvitacion ||
          inv.idSala !== notif.idSala
      )
    );
    setNotificaciones((prev) =>
      prev.filter(
        (inv) =>
          inv.codigoInvitacion !== notif.codigoInvitacion ||
          inv.idSala !== notif.idSala
      )
    );
    InviteBus.emit("invite:removed", {
      idSala: notif.idSala,
      codigoInvitacion: notif.codigoInvitacion,
    });
    Alert.alert("Invitación rechazada");
  };

  // Calcular si hay notificaciones pendientes para mostrar el badge
  const hasNotifications =
    wsInvitaciones.length > 0 || solicitudesPendientes.length > 0;

  return (
    <SafeAreaView>
      <View style={styles.notificationContainer}>
        {/* Botón (campana) para mostrar/ocultar el dropdown */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={toggleNotifications}
        >
          <Image
            source={require("@/assets/images/noti_icon.png")}
            style={styles.notificationIcon}
          />
          {hasNotifications && <View style={styles.redCircle} />}
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
            </View>

            <View style={styles.notifContent}>
              {loadingNotifs ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : errorNotifs ? (
                <Text style={styles.errorText}>{errorNotifs}</Text>
              ) : notificaciones.length > 0 ? (
                <ScrollView style={styles.notifScroll}>
                  {tipoNotificacion === "solicitudes" &&
                    notificaciones.map((notif, idx) => (
                      <View key={idx} style={styles.notifItem}>
                        <View style={styles.cardContainer}>
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
                              style={[
                                styles.cardButton,
                                styles.cardButtonAccept,
                              ]}
                              onPress={() => handleAceptarSolicitud(notif)}
                            >
                              <Text style={styles.cardButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.cardButton,
                                styles.cardButtonReject,
                              ]}
                              onPress={() =>
                                handleDenegarSolicitud(notif.idUsuarioEmisor)
                              }
                            >
                              <Text style={styles.cardButtonText}>
                                Rechazar
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  {tipoNotificacion === "invitaciones" &&
                    notificaciones.map((notif, idx) => (
                      <View key={idx} style={styles.notifItem}>
                        <View style={styles.cardContainer}>
                          <View style={styles.cardHeader}>
                            {notif.avatarInvitador &&
                            avatarMap[notif.avatarInvitador] ? (
                              <Image
                                source={avatarMap[notif.avatarInvitador]}
                                style={styles.cardAvatar}
                              />
                            ) : (
                              <Image
                                source={require("@/assets/images/imagenPerfil.webp")}
                                style={styles.cardAvatar}
                              />
                            )}
                            <View style={{ flex: 1 }}>
                              <Text style={styles.cardTitle}>
                                {notif.nombreInvitador ||
                                  "Invitador desconocido"}
                              </Text>
                              <Text style={styles.cardSubtitle}>
                                te invitó a una partida{" "}
                                {notif.nombreSala && `en "${notif.nombreSala}"`}
                                .
                              </Text>
                            </View>
                          </View>
                          <View style={styles.cardActions}>
                            <TouchableOpacity
                              style={[
                                styles.cardButton,
                                styles.cardButtonAccept,
                              ]}
                              onPress={() => acceptInvitation(notif)}
                            >
                              <Text style={styles.cardButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.cardButton,
                                styles.cardButtonReject,
                              ]}
                              onPress={() => rejectInvitation(notif)}
                            >
                              <Text style={styles.cardButtonText}>
                                Rechazar
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                </ScrollView>
              ) : (
                <Text style={styles.notifText}>No hay notificaciones.</Text>
              )}
            </View>
          </View>
        )}

        {/* Modal para invitaciones vía socket */}
        <Modal visible={showInvitationModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Invitación a Sala</Text>
              <Text style={styles.modalText}>
                Has sido invitado a la sala{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {invitationData?.idSala}
                </Text>
              </Text>
              <Text style={styles.modalText}>
                Invitación de: {invitationData?.idInvitador}
              </Text>
              <Text style={styles.modalText}>
                Código: {invitationData?.codigoInvitacion}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.greenButton}
                  onPress={acceptInvitation}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.redButton}
                  onPress={rejectInvitation}
                >
                  <Text style={styles.buttonText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    width: width,
  },
  // Change this to match the trophy's size & shadow
  notificationButton: {
    position: "relative",
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 5,
    bottom: 2, // Changed from top to bottom
  },
  // Make the icon 30x30 to match the trophy size
  notificationIcon: {
    width: 40,
    height: 40,
  },
  redCircle: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  // Align and bring dropdown on top
  notifDropdownContainer: {
    bottom: 2,
    left: 25,
    right: 0,
    zIndex: 10000, // zIndex más alto para superponer a todo
    elevation: 10, // Para Android
    backgroundColor: "#262522",
    borderWidth: 1,
    borderColor: "#1f1e1c",
    borderRadius: 8,
    padding: 10,
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
  filtroActivo: {
    backgroundColor: "#008000",
  },
  filtroTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  notifContent: {
    maxHeight: 150,
  },
  notifScroll: {},
  notifItem: {
    paddingVertical: 4,
  },
  notifText: {
    color: "#fff",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  cardContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardSubtitle: {
    color: "#ccc",
    fontSize: 14,
  },
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
  cardButtonAccept: {
    backgroundColor: "#008000",
  },
  cardButtonReject: {
    backgroundColor: "#e74c3c",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#262522",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  greenButton: {
    backgroundColor: "#a2d060",
    padding: 10,
    borderRadius: 4,
    minWidth: 100,
    alignItems: "center",
  },
  redButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 4,
    minWidth: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NotificationButton;
