import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import socket from "@/app/(sala)/socket";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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

  const [wsInvitaciones, setWsInvitaciones] = useState<any[]>([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<any[]>([]);

  // Carga inicial del usuario
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

  // Actualizar nombre/avatar al volver al foco
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const avatar =
          (await AsyncStorage.getItem("avatarUsuario")) || "avatar1";
        setUser((u: typeof user) => ({ ...u, nombre, avatar }));
      };
      fetchUserData();
    }, [])
  );

  // Escuchar invitaciones de sala y enriquecer con datos del invitador
  useEffect(() => {
    socket.on("invitacionSala", async (data) => {
      console.log("Invitación recibida:", JSON.stringify(data, null, 2));
      try {
        const respName = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener_por_id`,
          { idUsuario: data.idInvitador }
        );
        const respAvatar = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener_avatar_por_id`,
          { idUsuario: data.idInvitador }
        );
        const enriched = {
          ...data,
          nombreInvitador: respName.data.usuario.nombre,
          avatarInvitador: respAvatar.data.avatar,
        };
        setWsInvitaciones((prev) => [...prev, enriched]);
      } catch (error) {
        console.error("Error al enriquecer invitación:", error);
        setWsInvitaciones((prev) => [...prev, data]);
      }
    });
    return () => {
      socket.off("invitacionSala");
    };
  }, []);

  // Obtener solicitudes pendientes para badge
  useEffect(() => {
    if (user.id) fetchSolicitudesPendientes();
  }, [user.id]);

  // Cargar notificaciones al cambiar el tipo (solicitudes vs invitaciones)
  useEffect(() => {
    if (tipoNotificacion !== "invitaciones") {
      fetchNotificaciones();
    } else {
      setNotificaciones(wsInvitaciones);
    }
  }, [tipoNotificacion, wsInvitaciones]);

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
      setNotificaciones((prev) =>
        prev.filter((n) => n.idUsuarioEmisor !== notif.idUsuarioEmisor)
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
        { solicitudId: idEmisor }
      );
      if (response.data.exito) {
        Alert.alert("Solicitud denegada", "La solicitud ha sido rechazada.");
        setNotificaciones((prev) =>
          prev.filter((n) => n.idUsuarioEmisor !== idEmisor)
        );
      } else {
        Alert.alert("Error", "No se pudo rechazar la solicitud.");
      }
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      Alert.alert("Error", "No se pudo rechazar la solicitud.");
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

  const acceptInvitation = (notif: any) => {
    if (!user.id) {
      Alert.alert("Error", "Usuario no disponible");
      return;
    }
    socket.emit("obtenerSala", notif.idSala, (salaData: any) => {
      if (!salaData) {
        Alert.alert("Error", "No se encontró la sala.");
        return;
      }
      socket.emit("unirseSala", {
        idSala: notif.idSala,
        usuario: user,
        contrasena: null,
        codigoInvitacion: notif.codigoInvitacion,
      });
      setWsInvitaciones((prev) =>
        prev.filter(
          (inv) =>
            inv.codigoInvitacion !== notif.codigoInvitacion ||
            inv.idSala !== notif.idSala
        )
      );
      Alert.alert("Éxito", "Te has unido a la sala");
      router.push({
        pathname: "/(sala)/sala",
        params: { idSala: notif.idSala, salaData: JSON.stringify(salaData) },
      });
    });
  };

  const rejectInvitation = (notif: any) => {
    if (!user.id) return;
    socket.emit("invitacionRechazada", { idAmigo: user.id });
    setWsInvitaciones((prev) =>
      prev.filter(
        (inv) =>
          inv.codigoInvitacion !== notif.codigoInvitacion ||
          inv.idSala !== notif.idSala
      )
    );
  };

  const irAlPerfil = () => {
    router.push({
      pathname: "/perfil",
      params: { nombre: user.nombre, avatar: user.avatar || "" },
    });
  };

  const hasNotifications =
    wsInvitaciones.length > 0 || solicitudesPendientes.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cabecera}>
        <View style={styles.perfilNotificaciones}>
          <TouchableOpacity
            style={[styles.profile, compacto && styles.profileCompacto]}
            onPress={irAlPerfil}
          >
            <Image source={avatarMap[user.avatar]} style={styles.userIcon} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user.nombre || "NombreCuenta"}
              </Text>
            </View>
          </TouchableOpacity>

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
            </View>

            <View style={styles.notifContent}>
              {loadingNotifs ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : errorNotifs ? (
                <Text style={styles.errorText}>{errorNotifs}</Text>
              ) : notificaciones.length > 0 ? (
                <ScrollView style={styles.notifScroll}>
                  {tipoNotificacion === "solicitudes"
                    ? notificaciones.map((notif, idx) => (
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
                      ))
                    : notificaciones.map((notif, idx) => (
                        <View key={idx} style={styles.cardContainer}>
                          <View style={styles.cardHeader}>
                            <Image
                              source={
                                avatarMap[notif.avatarInvitador]
                                  ? avatarMap[notif.avatarInvitador]
                                  : { uri: notif.avatarInvitador }
                              }
                              style={styles.cardAvatar}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.cardTitle}>
                                {notif.nombreInvitador ||
                                  "Invitador desconocido"}
                              </Text>
                              <Text style={styles.cardSubtitle}>
                                te invitó a una partida
                                {notif.nombreSala &&
                                  ` en \"${notif.nombreSala}\"`}
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
                      ))}
                </ScrollView>
              ) : (
                <Text style={styles.notifText}>No hay notificaciones.</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#262522",
  },
  cabecera: {
    width: width,
    backgroundColor: "#262522",
    padding: 10,
    flexDirection: "column",
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
    zIndex: 10000,
    elevation: 10,
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
  },
  cardSubtitle: {
    color: "#aaa",
    fontSize: 12,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardButton: {
    flex: 1,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  cardButtonAccept: {
    backgroundColor: "#008000",
  },
  cardButtonReject: {
    backgroundColor: "#800000",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Cabecera;
