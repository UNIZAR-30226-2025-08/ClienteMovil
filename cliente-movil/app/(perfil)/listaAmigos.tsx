import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
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

type Jugador = {
  idUsuario?: number; // Puede venir en idUsuario o en id
  id?: number; // Se contempla ambas opciones
  nombre: string;
  avatar?: string;
  enLinea?: boolean;
  enSala?: boolean;
  sala?: string | number;
};

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");
const imagenPerfilDefecto = require("@/assets/images/imagenPerfil.webp");

export default function AmigosScreen(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  const [amigosDetalles, setAmigosDetalles] = useState<Jugador[]>([]);
  const [nuevoAmigo, setNuevoAmigo] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<{
    idUsuario: number;
    nombre: string;
  } | null>(null);
  const [salaActual, setSalaActual] = useState<any>(null);
  const [salasPublicas, setSalasPublicas] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const cargarUsuario = async () => {
        try {
          const idUsuario = await AsyncStorage.getItem("idUsuario");
          const nombre = await AsyncStorage.getItem("nombreUsuario");
          setUsuario({
            idUsuario: idUsuario ? parseInt(idUsuario) : 0,
            nombre: nombre ?? "Usuario",
          });
        } catch (error) {
          console.error("Error al cargar usuario:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarUsuario();
    }, [])
  );

  useEffect(() => {
    const configurarSocket = async () => {
      if (!usuario || !usuario.idUsuario) return;
      const idUsuario = usuario.idUsuario;
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("registrarUsuario", { idUsuario });

      // Obtener la lista de amigos y asignar propiedades por defecto
      const fetchFriends = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/amistad/listar/${idUsuario}`
          );
          const amigosIds = response.data.amigos;
          const detalles = await Promise.all(
            amigosIds.map(async (idAmigo: number) => {
              const responseAmigo = await axios.post(
                `${BACKEND_URL}/api/usuario/obtener_por_id`,
                { idUsuario: idAmigo }
              );
              const usuarioAmigo = responseAmigo.data.usuario;
              return {
                ...usuarioAmigo,
                enLinea: false,
                enSala: false,
                sala: null,
              };
            })
          );
          setAmigosDetalles(detalles);
        } catch (error) {
          console.error("Error al obtener la lista de amigos:", error);
        }
      };

      await fetchFriends();
      socket.emit("solicitarEstadoAmigos", { idUsuario });

      const handleEstadoAmigo = ({
        idUsuario,
        en_linea,
        enSala,
        sala,
      }: {
        idUsuario: number;
        en_linea: boolean;
        enSala?: boolean;
        sala?: string | number;
      }) => {
        setAmigosDetalles((prevDetalles) =>
          prevDetalles.map((amigo) =>
            amigo.idUsuario === idUsuario || amigo.id === idUsuario
              ? {
                  ...amigo,
                  enLinea: en_linea,
                  enSala: enSala ?? amigo.enSala,
                  sala: sala ?? amigo.sala,
                }
              : amigo
          )
        );
      };

      const handleEstadoAmigos = (
        estadoAmigos: { idUsuario: number; en_linea: boolean }[]
      ) => {
        setAmigosDetalles((prevDetalles) =>
          prevDetalles.map((amigo) => {
            const friendKey = amigo.idUsuario || amigo.id;
            const estado = estadoAmigos.find((e) => e.idUsuario === friendKey);
            return estado ? { ...amigo, enLinea: estado.en_linea } : amigo;
          })
        );
      };

      socket.on("estadoAmigo", handleEstadoAmigo);
      socket.on("estadoAmigos", handleEstadoAmigos);

      return () => {
        socket.off("estadoAmigo", handleEstadoAmigo);
        socket.off("estadoAmigos", handleEstadoAmigos);
      };
    };
    configurarSocket();
  }, [usuario]);

  // Obtener las salas públicas desde el backend
  useEffect(() => {
    if (!usuario || !usuario.idUsuario) return;
    socket.emit("obtenerSalas");
    const handleListaSalas = (salas: any) => {
      const salasArray = Array.isArray(salas) ? salas : Object.values(salas);
      const publicSalas = salasArray.filter(
        (sala) =>
          sala.tipo &&
          sala.tipo.toLowerCase() === "publica" &&
          Array.isArray(sala.jugadores)
      );
      console.log("Salas públicas filtradas:", publicSalas);
      setSalasPublicas(publicSalas);
    };
    socket.on("listaSalas", handleListaSalas);
    return () => {
      socket.off("listaSalas", handleListaSalas);
    };
  }, [usuario]);

  // Función para enviar solicitud de amistad
  const enviarSolicitud = async () => {
    if (!nuevoAmigo.trim() || !usuario) return;
    try {
      const responseUsuario = await axios.post(
        `${BACKEND_URL}/api/usuario/obtener_por_nombre`,
        { nombre: nuevoAmigo.trim() }
      );
      if (!responseUsuario.data.usuario) {
        setMensaje("Usuario no encontrado");
        return;
      }
      const idReceptor = responseUsuario.data.usuario.idUsuario;
      const responseSolicitud = await axios.post(
        `${BACKEND_URL}/api/solicitud/enviar`,
        { idEmisor: usuario.idUsuario, idReceptor }
      );
      if (responseSolicitud.data.solicitud) {
        setMensaje("¡Solicitud enviada con éxito!");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setMensaje("Error al enviar solicitud");
    } finally {
      setNuevoAmigo("");
      setTimeout(() => setMensaje(null), 1500);
    }
  };

  // Función para unirse a la sala pública en la que se encuentre el amigo
  const unirseASalaPublica = async (sala: any) => {
    if (salaActual) {
      socket.emit("salirDeSala", {
        idUsuario: usuario?.idUsuario,
        idSala: salaActual.id,
      });
      await AsyncStorage.removeItem("salaActual");
      setSalaActual(null);
      setMensaje("Has salido de tu sala actual.");
      setTimeout(() => setMensaje(null), 1500);
    }
    socket.emit("unirseSala", {
      idSala: sala.id,
      usuario: {
        id: usuario?.idUsuario,
        nombre: usuario?.nombre,
        avatar: "avatar1",
      },
    });
    router.push({
      pathname: "/(sala)/sala",
      params: { idSala: sala.id, salaData: JSON.stringify(sala) },
    });
  };

  // Navegar al perfil del amigo
  const handlePress = async (idUsuario: number) => {
    try {
      await AsyncStorage.setItem("amigoId", idUsuario.toString());
      router.push({
        pathname: "/perfilAmigo",
        params: { amigoId: idUsuario.toString() },
      });
    } catch (error) {
      console.error("Error al guardar el ID del amigo en AsyncStorage", error);
    }
  };

  // Función para eliminar un amigo
  const eliminarAmigo = async (idAmigo: number) => {
    if (!usuario) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/amistad/eliminar`, {
        headers: { "Content-Type": "application/json" },
        data: { idUsuario1: usuario.idUsuario, idUsuario2: idAmigo },
      });
      setAmigosDetalles((prev) =>
        prev.filter((amigo) => (amigo.idUsuario || amigo.id) !== idAmigo)
      );
      setMensaje("¡Amigo eliminado con éxito!");
      setTimeout(() => setMensaje(null), 1500);
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <Text style={styles.titulo}>Lista de Amigos</Text>
        {mensaje && (
          <View style={styles.mensajeExitoContainer}>
            <Text style={styles.mensajeExito}>{mensaje}</Text>
          </View>
        )}
        <View style={styles.addFriendContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del usuario"
            placeholderTextColor="#666"
            value={nuevoAmigo}
            onChangeText={setNuevoAmigo}
          />
          <TouchableOpacity
            style={styles.botonAnadir}
            onPress={enviarSolicitud}
          >
            <Text style={styles.botonAnadirTexto}>ENVIAR SOLICITUD</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {amigosDetalles.map((amigo) => {
            // Se utiliza friendId tomando idUsuario o id
            const friendId = Number(amigo.idUsuario || amigo.id);
            // Busca si el amigo aparece en alguna sala pública (comparando números)
            const salaDelAmigo = salasPublicas.find(
              (sala) =>
                Array.isArray(sala.jugadores) &&
                sala.jugadores.some(
                  (jugador: any) => Number(jugador.id) === friendId
                )
            );
            return (
              <View key={friendId} style={styles.amigoContainer}>
                <TouchableOpacity
                  style={styles.cardInfo}
                  onPress={() => handlePress(friendId)}
                >
                  <Image
                    source={
                      avatarMap[amigo.avatar || "avatar1"] ||
                      imagenPerfilDefecto
                    }
                    style={styles.imagenPerfil}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.nombre}>{amigo.nombre}</Text>
                    <View
                      style={[
                        styles.estadoConexion,
                        amigo.enLinea ? styles.enLinea : styles.desconectado,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
                <View style={styles.actionButtons}>
                  {salaDelAmigo && (
                    <TouchableOpacity
                      style={styles.botonUnirse}
                      onPress={() => unirseASalaPublica(salaDelAmigo)}
                    >
                      <Text style={styles.textoBoton}>UNIRSE</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.botonEliminar}
                    onPress={() => eliminarAmigo(friendId)}
                  >
                    <Text style={styles.textoBoton}>ELIMINAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          style={styles.containerAtras}
          onPress={() => router.back()}
        >
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 60,
  },
  mensajeExitoContainer: {
    position: "absolute",
    top: 50,
    left: "10%",
    right: "10%",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    zIndex: 10,
  },
  mensajeExito: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  addFriendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginRight: 10,
    color: "#000",
  },
  botonAnadir: {
    backgroundColor: "#008f39",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  botonAnadirTexto: { color: "#fff", fontWeight: "bold" },
  scrollContainer: { marginTop: 20, paddingHorizontal: 20, paddingBottom: 80 },
  amigoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  imagenPerfil: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  infoContainer: { flexDirection: "column", justifyContent: "center" },
  nombre: { fontSize: 18, fontWeight: "bold", color: "black" },
  estadoConexion: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  enLinea: { backgroundColor: "green" },
  desconectado: { backgroundColor: "gray" },
  actionButtons: { flexDirection: "row", alignItems: "center" },
  botonUnirse: {
    backgroundColor: "#008f39",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  botonEliminar: {
    backgroundColor: "#FF0000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textoBoton: { color: "#fff", fontWeight: "bold" },
  containerAtras: { position: "absolute", bottom: 20, left: "46%" },
  imageAtras: { height: 40, width: 40 },
});
