import React, { useState, useEffect } from "react";
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
import { useCallback } from "react";
import socket from "@/app/(sala)/socket";
/**
 * Mapa de avatares que relaciona claves con sus respectivas imágenes.
 *
 * @remarks
 * Se utiliza para obtener la imagen correspondiente a la clave almacenada en la base de datos.
 *
 * @example
 * ```ts
 * const avatar = avatarMap["avatar1"]; // Obtiene la imagen para 'avatar1'
 * ```
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
 * Tipo que representa a un jugador en el ranking.
 *
 * @property idUsuario - Identificador único del jugador.
 * @property nombre - Nombre del jugador.
 * @property victorias - Número de victorias del jugador.
 * @property avatar - Clave del avatar asignado al jugador (opcional).
 */
type Jugador = {
  idUsuario: number;
  nombre: string;
  avatar?: string; // Campo opcional para la URL del avatar
  enLinea?: boolean; // Campo opcional para el estado de conexión
};

/**
 * Imágenes utilizadas en la pantalla de lista de amigos.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

// Imagen por defecto para nuevos amigos (o la que prefieras)
const imagenPerfilDefecto = require("@/assets/images/imagenPerfil.webp");

/**
 * Pantalla de lista de amigos.
 * Permite visualizar amigos, agregar nuevos y regresar a la pantalla anterior.
 *
 * @returns {JSX.Element} Pantalla de lista de amigos.
 */
export default function AmigosScreen(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  // Lista de amigos en estado para poder modificarla
  const [amigos, setAmigos] = useState<number[]>([]);
  const [amigosDetalles, setAmigosDetalles] = useState<Jugador[]>([]); // Almacenar detalles de los amigos
  // Estado para almacenar el nombre del nuevo amigo
  const [nuevoAmigo, setNuevoAmigo] = useState("");

  // Estado para el mensaje
  const [mensaje, setMensaje] = useState<string | null>(null);

  const [usuario, setUsuario] = useState<{
    idUsuario: number;
    nombre: string;
  } | null>(null);
  

  /**
   * Carga los datos del usuario cuando la pantalla gana foco.
   */
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
  
      // Conectar el socket si no está conectado
      if (!socket.connected) {
        socket.connect();
      }
  
      // Registrar usuario en el socket
      socket.emit("registrarUsuario", { idUsuario });
  
      // Obtener la lista de amigos desde el backend
      const fetchFriends = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/amistad/listar/${idUsuario}`
          );
          console.log("Amigos recibidos del backend:", response.data.amigos);
  
          // Cargar detalles de los amigos y asignar enLinea como false inicialmente
          const amigosDetalles = await Promise.all(
            response.data.amigos.map(async (idAmigo: number) => {
              const responseAmigo = await axios.post(
                `${BACKEND_URL}/api/usuario/obtener_por_id`,
                { idUsuario: idAmigo }
              );
              const usuarioAmigo = responseAmigo.data.usuario;
              return { ...usuarioAmigo, enLinea: false }; // Inicializa enLinea como false
            })
          );
  
          setAmigosDetalles(amigosDetalles);
          console.log("Detalles iniciales de amigos:", amigosDetalles);
        } catch (error) {
          console.error("Error al obtener la lista de amigos:", error);
        }
      };
  
      await fetchFriends();
  
      // Solicitar el estado actual de los amigos
      socket.emit("solicitarEstadoAmigos", { idUsuario });
  
      // Escuchar el estado de un amigo individual
      const handleEstadoAmigo = ({ idUsuario, en_linea }: { idUsuario: number; en_linea: boolean }) => {
        console.log(`Estado actualizado para amigo ID ${idUsuario}: ${en_linea ? "Conectado" : "Desconectado"}`);
        setAmigosDetalles((prevDetalles) =>
          prevDetalles.map((amigo) =>
            amigo.idUsuario === idUsuario ? { ...amigo, enLinea: en_linea } : amigo
          )
        );
      };
  
      // Escuchar el estado de todos los amigos
      const handleEstadoAmigos = (estadoAmigos: { idUsuario: number; en_linea: boolean }[]) => {
        console.log("Estado de todos los amigos recibido:", estadoAmigos);
        setAmigosDetalles((prevDetalles) =>
          prevDetalles.map((amigo) => {
            const estado = estadoAmigos.find((e) => e.idUsuario === amigo.idUsuario);
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

  // Nueva función para enviar solicitud de amistad:
  const enviarSolicitud = async () => {
    if (!nuevoAmigo.trim() || !usuario) return;

    try {
      // Buscar el usuario por nombre
      const responseUsuario = await axios.post(
        `${BACKEND_URL}/api/usuario/obtener_por_nombre`,
        { nombre: nuevoAmigo.trim() }
      );
      if (!responseUsuario.data.usuario) {
        //Alert.alert("Depuración", "Usuario no encontrado");
        setMensaje("Usuario no encontrado");
        return;
      }

      // Muestra la información del usuario en un Alert
      /*Alert.alert(
        "Depuración",
        `Usuario encontrado:\n${JSON.stringify(responseUsuario.data.usuario)}`
      );*/

      const idReceptor = responseUsuario.data.usuario.idUsuario;
      //Alert.alert("Depuración", `Usuario encontrado: ID ${idReceptor}`);

      // Enviar la solicitud de amistad
      const responseSolicitud = await axios.post(
        `${BACKEND_URL}/api/solicitud/enviar`,
        {
          idEmisor: usuario.idUsuario,
          idReceptor: idReceptor,
        }
      );
      if (responseSolicitud.data.solicitud) {
        //Alert.alert("Depuración", "Solicitud enviada con éxito");
        setMensaje("¡Solicitud enviada con éxito!");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      //Alert.alert("Depuración", "Error al enviar solicitud");
      setMensaje("Error al enviar solicitud");
    } finally {
      setNuevoAmigo("");
      setTimeout(() => setMensaje(null), 1500);
    }
  };

  const handlePress = async (idUsuario: number) => {
    try {
      console.log("Presionando perfil del amigo con ID:", idUsuario);
      await AsyncStorage.setItem("amigoId", idUsuario.toString());
      router.push({
        pathname: "/perfilAmigo",
        params: { amigoId: idUsuario.toString() },
      });
    } catch (error) {
      console.error("Error al guardar el ID del amigo en AsyncStorage", error);
    }
  };

  /**
   * Función para eliminar un amigo de la lista.
   */
  const eliminarAmigo = async (idAmigo: number) => {
    if (!usuario) return;

    if (!idAmigo) {
      console.error("ID del amigo no válido:", idAmigo); // Verificación adicional
      return;
    }

    console.log("Enviando datos:", {
      idUsuario1: usuario.idUsuario,
      idUsuario2: idAmigo,
    });

    try {
      await axios.delete(`${BACKEND_URL}/api/amistad/eliminar`, {
        headers: { "Content-Type": "application/json" },
        data: {
          idUsuario1: usuario.idUsuario,
          idUsuario2: idAmigo,
        },
      });

      // Filtrar la lista de amigos eliminando al amigo con el ID especificado
      setAmigosDetalles((prevAmigosDetalles) =>
        prevAmigosDetalles.filter((amigo) => amigo.idUsuario !== idAmigo)
      );

      // Mostrar el mensaje de éxito
      setMensaje("¡Amigo eliminado con éxito!");

      // Ocultar el mensaje después de 3 segundos
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

        {/* Título */}
        <Text style={styles.titulo}>Lista de Amigos</Text>

        {/* Mostrar mensaje de éxito o error */}
        {mensaje && (
          <View style={styles.mensajeExitoContainer}>
            <Text style={styles.mensajeExito}>{mensaje}</Text>
          </View>
        )}

        {/* Contenedor para añadir nuevo amigo (ahora envío de solicitud) */}
        <View style={styles.addFriendContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del usuario" // Se actualiza el placeholder
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

        {/* Lista de amigos desplazable */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {amigosDetalles.map((amigo) => (
            <TouchableOpacity
              key={amigo.idUsuario}
              onPress={() => handlePress(amigo.idUsuario)}
              activeOpacity={0.7} // Da un efecto visual al presionar
            >
              <View style={styles.amigoContainer}>
                <View style={styles.cardHeader}>
                  <Image
                    source={
                      avatarMap[amigo.avatar || "avatar1"] ||
                      imagenPerfilDefecto
                    }
                    style={styles.imagenPerfil}
                  />

                   {/* Círculo de estado de conexión */}
                  <View
                    style={[
                      styles.estadoConexion,
                      amigo.enLinea ? styles.enLinea : styles.desconectado,
                    ]}
                  />

                  <Text style={styles.nombre}>{amigo.nombre}</Text>
                  <TouchableOpacity
                    style={styles.botonEliminar}
                    onPress={() => eliminarAmigo(amigo.idUsuario)}
                  >
                    <Text style={styles.botonAnadirTexto}>ELIMINAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botón para volver atrás (con imagen) */}
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

/**
 * Estilos de la pantalla de lista de amigos.
 */
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

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Contenedor para añadir amigo
  addFriendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },

  rank: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
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

  botonAnadirTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  scrollContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 80, // Espacio para evitar que el último elemento quede oculto
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

  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
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

  botonEliminar: {
    backgroundColor: "#FF0000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: "absolute",
    left: 230,
    top: "50%",
    transform: [{ translateY: -20 }],
  },

  estadoConexion: {
    width: 12,
    height: 12,
    borderRadius: 6,  
    left: 33,
    position: "absolute",  
    bottom: 0,  
    right: 0, 
  },

  enLinea: {
    backgroundColor: "green",  // Círculo verde para conectado
  },

  desconectado: {
    backgroundColor: "gray",  // Círculo gris para desconectado
  },
});
