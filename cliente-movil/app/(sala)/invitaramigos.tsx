import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import io from "socket.io-client";

/**
 * Mapa de avatares que relaciona claves con sus respectivas imágenes.
 */
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

/**
 * Tipo que representa a un jugador.
 */
type Jugador = {
  idUsuario: number;
  nombre: string;
  avatar?: string;
  enLinea?: boolean; // agregado
};

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");
const imagenPerfilDefecto = require("@/assets/images/imagenPerfil.webp");

export default function AmigosScreen(): JSX.Element {
  const router = useRouter();
  // Ahora solo recibimos el idSala
  const { idSala } = useLocalSearchParams<{ idSala: string }>();
  console.log("idSala recibido:", idSala);

  const [loading, setLoading] = useState(true);
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  // Conexión al backend vía Socket.IO
  const socket = io(BACKEND_URL);

  // Estado para almacenar la lista de IDs de amigos y sus detalles
  const [amigos, setAmigos] = useState<number[]>([]);
  const [amigosDetalles, setAmigosDetalles] = useState<Jugador[]>([]);
  // Datos del usuario logueado
  const [usuario, setUsuario] = useState<{
    idUsuario: number;
    nombre: string;
  } | null>(null);

  // Cargar datos del usuario al ganar foco la pantalla
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

  // Obtener la lista de amigos desde el backend
  useEffect(() => {
    if (usuario && usuario.idUsuario) {
      const fetchListadoAmigos = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/amistad/listar/${usuario.idUsuario}`
          );
          setAmigos(response.data.amigos);
          cargarDetallesAmigos(response.data.amigos);
        } catch (error) {
          console.error("Error al obtener los amigos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchListadoAmigos();
    }
  }, [usuario]);

  // Función para obtener detalles de cada amigo usando sus IDs
  const cargarDetallesAmigos = async (idsAmigos: number[]) => {
    try {
      const detalles = await Promise.all(
        idsAmigos.map(async (idAmigo) => {
          const response = await axios.post(
            `${BACKEND_URL}/api/usuario/obtener_por_id`,
            { idUsuario: idAmigo }
          );
          return {
            ...response.data.usuario,
            enLinea: false, // por defecto offline
          };
        })
      );
      setAmigosDetalles(detalles);
    } catch (error) {
      console.error("Error al obtener los detalles de los amigos:", error);
    }
  };

  // Suscribirse a estado online de amigos
  useEffect(() => {
    if (usuario?.idUsuario) {
      if (!socket.connected) socket.connect();
      socket.emit("registrarUsuario", { idUsuario: usuario.idUsuario });
      socket.emit("solicitarEstadoAmigos", { idUsuario: usuario.idUsuario });

      // manejar actualizaciones de múltiples amigos
      const handleEstadoAmigos = (
        estadoAmigos: { idUsuario: number; en_linea: boolean }[]
      ) => {
        setAmigosDetalles((prev) =>
          prev.map((a) => {
            const est = estadoAmigos.find((e) => e.idUsuario === a.idUsuario);
            return est ? { ...a, enLinea: est.en_linea } : a;
          })
        );
      };
      // manejar actualización de un solo amigo
      const handleEstadoAmigo = ({
        idUsuario,
        en_linea,
      }: {
        idUsuario: number;
        en_linea: boolean;
      }) => {
        setAmigosDetalles((prev) =>
          prev.map((a) =>
            a.idUsuario === idUsuario ? { ...a, enLinea: en_linea } : a
          )
        );
      };

      socket.on("estadoAmigos", handleEstadoAmigos);
      socket.on("estadoAmigo", handleEstadoAmigo);

      return () => {
        socket.off("estadoAmigos", handleEstadoAmigos);
        socket.off("estadoAmigo", handleEstadoAmigo);
      };
    }
  }, [usuario]);

  // Función para manejar la acción de invitar a un amigo usando socket.emit
  const handleInvite = (amigoNombre: string, idAmigo: number) => {
    if (!usuario) return;
    if (!idSala) {
      Alert.alert("Error", "No se recibió un id de sala válido.");
      return;
    }
    socket.emit("invitarASala", {
      idAmigo,
      idSala,
      idInvitador: usuario.idUsuario,
    });
    Alert.alert("Invitación", `Invitación enviada a ${amigoNombre}`);
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {amigosDetalles.map((amigo) => (
            <View key={amigo.idUsuario} style={styles.amigoContainer}>
              <Image
                source={
                  avatarMap[amigo.avatar || "avatar1"] || imagenPerfilDefecto
                }
                style={styles.imagenPerfil}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.nombre}>{amigo.nombre}</Text>
                <View
                  style={[
                    styles.estadoDot,
                    amigo.enLinea ? styles.enLinea : styles.desconectadoDot,
                  ]}
                />
              </View>
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={() => handleInvite(amigo.nombre, amigo.idUsuario)}
              >
                <Text style={styles.inviteButtonText}>Invitar</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  container: {
    flex: 1,
  },

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

  scrollContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },

  amigoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  imagenPerfil: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },

  estadoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },

  enLinea: {
    backgroundColor: "green",
  },

  desconectadoDot: {
    backgroundColor: "gray",
  },

  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },

  inviteButton: {
    marginLeft: "auto",
    backgroundColor: "#007BFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  inviteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
