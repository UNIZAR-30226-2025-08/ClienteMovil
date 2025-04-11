import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router"; // o de '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import socket from "@/app/(sala)/socket";

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

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

const Cabecera = ({ compacto = false }) => {
  const router = useRouter();

  const [user, setUser] = useState<any>({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [tipoNotificacion, setTipoNotificacion] = useState("solicitudes");
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [errorNotifs, setErrorNotifs] = useState<string | null>(null);

  // Invitaciones vía socket
  const [wsInvitaciones, setWsInvitaciones] = useState<any[]>([]);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  // Estado para solicitudes de amistad
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<any[]>([]);

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const avatar =
          (await AsyncStorage.getItem("avatarUsuario")) || "avatar1";
        const rolFavorito =
          (await AsyncStorage.getItem("rolFavorito")) || "Sin rol favorito";
        setUser({ ...user, nombre, avatar, rolFavorito });
      };
      fetchUserData();
    }, [])
  );

  // Socket para recibir invitaciones
  useEffect(() => {
    socket.on("invitacionSala", (data) => {
      setWsInvitaciones((prev) => [...prev, data]);
      setInvitationData(data);
      setShowInvitationModal(true);
    });
    return () => {
      socket.off("invitacionSala");
    };
  }, []);

  // Obtener solicitudes de amistad para el badge
  useEffect(() => {
    if (user.id) {
      fetchSolicitudesPendientes();
    }
  }, [user.id]);

  useEffect(() => {
    if (tipoNotificacion !== "invitaciones") {
      fetchNotificaciones();
    } else {
      setNotificaciones(wsInvitaciones);
    }
  }, [tipoNotificacion]);

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

  // Función para cargar notificaciones del dropdown
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
        // Sincronizamos también el badge con el estado de solicitudes pendientes
        setSolicitudesPendientes(response.data.solicitudes || []);
      } else if (tipoNotificacion === "sugerencias") {
        const { data } = await axios.post(
          `${BACKEND_URL}/api/sugerencias/usuario`,
          { idUsuario: userId }
        );
        setNotificaciones(data.sugerencias || []);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      setErrorNotifs("Error al obtener notificaciones");
    } finally {
      setLoadingNotifs(false);
    }
  };

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

  const handleTipoChange = (tipo: string) => {
    setTipoNotificacion(tipo);
  };

  const acceptInvitation = () => {
    if (!user.id) {
      Alert.alert("Error", "Usuario no disponible");
      return;
    }
    socket.emit("unirseSala", {
      idSala: invitationData.idSala,
      usuario: user,
      contrasena: null,
      codigoInvitacion: invitationData.codigoInvitacion,
    });
    setWsInvitaciones((prev) =>
      prev.filter(
        (inv) =>
          inv.codigoInvitacion !== invitationData.codigoInvitacion ||
          inv.idSala !== invitationData.idSala
      )
    );
    setShowInvitationModal(false);
    Alert.alert("Éxito", "Te has unido a la sala");
    router.push({
      pathname: "/(sala)/sala",
      params: { idSala: invitationData.idSala },
    });
  };

  const rejectInvitation = () => {
    if (!user.id) return;
    socket.emit("invitacionRechazada", { idAmigo: user.id });
    setWsInvitaciones((prev) =>
      prev.filter(
        (inv) =>
          inv.codigoInvitacion !== invitationData.codigoInvitacion ||
          inv.idSala !== invitationData.idSala
      )
    );
    setShowInvitationModal(false);
    Alert.alert("Invitación", "Invitación rechazada");
  };

  const irAlPerfil = () => {
    router.push({
      pathname: "/perfil",
      params: {
        nombre: user.nombre,
        avatar: user.avatar || "",
        rolFavorito: user.rolFavorito || "Sin rol favorito",
      },
    });
  };

  // Calcular si hay alguna notificación pendiente (invitaciones o solicitudes)
  const hasNotifications =
    wsInvitaciones.length > 0 || solicitudesPendientes.length > 0;

  return (
    <View style={styles.cabecera}>
      <View style={styles.perfilNotificaciones}>
        <TouchableOpacity
          style={[styles.profile, compacto && styles.profileCompacto]}
          onPress={irAlPerfil}
        >
          <Image source={avatarMap[user.avatar]} style={styles.userIcon} />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.nombre || "NombreCuenta"}</Text>
            <Text style={styles.rol}>
              {user.rolFavorito || "Sin rol favorito"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón de notificaciones con círculo rojo si hay notificaciones */}
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
      </View>

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
            ) : notificaciones.length > 0 ? (
              <ScrollView style={styles.notifScroll}>
                {notificaciones.map((notif, idx) => (
                  <View key={idx} style={styles.notifItem}>
                    {tipoNotificacion === "solicitudes" && (
                      <Text style={styles.notifText}>
                        <Text style={{ fontWeight: "bold" }}>
                          {notif.nombreEmisor}
                        </Text>{" "}
                        te ha enviado una solicitud.
                      </Text>
                    )}
                    {tipoNotificacion === "invitaciones" && (
                      <Text style={styles.notifText}>
                        <Text style={{ fontWeight: "bold" }}>
                          {notif.nombreEmisor}
                        </Text>{" "}
                        te invitó a una partida.
                      </Text>
                    )}
                    {tipoNotificacion === "sugerencias" && (
                      <Text style={styles.notifText}>
                        Sugerencia:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {notif.contenido || "Sin contenido"}
                        </Text>
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.notifText}>No hay notificaciones.</Text>
            )}
          </View>
        </View>
      )}

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
  );
};

const styles = StyleSheet.create({
  cabecera: {
    width: "100%",
    backgroundColor: "#262522",
    padding: 10,
    flexDirection: "column",
    position: "relative",
  },
  perfilNotificaciones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  profileCompacto: {
    padding: 2,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  profileInfo: {
    marginLeft: 5,
  },
  userName: {
    color: "#fff",
    fontWeight: "700",
  },
  rol: {
    color: "#ccc",
    fontSize: 12,
  },
  notificationButton: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 8,
    position: "relative",
  },
  notificationIcon: {
    width: 40,
    height: 40,
  },
  // Estilo para el círculo rojo (badge)
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
    left: 0,
    right: 0,
    zIndex: 999,
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

export default Cabecera;
