import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import socket from "@/app/(sala)/socket"; // Módulo de conexión
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa la cabecera
import Cabecera from "@/components/Cabecera";

/**
 * Imágenes utilizadas en la pantalla de búsqueda de salas.
 */
const imagenFondo = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");
const iconoCandado = require("@/assets/images/candado.png");

/**
 * Pantalla para buscar y unirse a salas.
 * Permite seleccionar salas privadas e ingresar una contraseña si es necesario.
 *
 * @returns {JSX.Element} Pantalla de búsqueda de salas.
 */
export default function BuscarSalasScreen(): JSX.Element {
  /** Hook de navegación de Expo Router */
  const router = useRouter();

  const [salas, setSalas] = useState<any[]>([]);

  /**
   * Estado para controlar la visibilidad del modal de contraseña.
   */
  const [mostrarModal, setMostrarModal] = useState(false);

  /**
   * Estado para almacenar la contraseña ingresada.
   */
  const [password, setPassword] = useState("");

  /**
   * Estado para almacenar la sala seleccionada cuando es privada.
   */
  const [salaSeleccionada, setSalaSeleccionada] = useState<any>(null);

  // Al montar la pantalla, solicita la lista de salas activas
  useEffect(() => {
    // Solicitar al servidor la lista de salas
    socket.emit("obtenerSalas");

    // Escuchar el evento con la lista de salas
    socket.on("listaSalas", (listaSalas) => {
      console.log("Salas activas:", listaSalas);
      setSalas(listaSalas);
    });

    return () => {
      socket.off("listaSalas");
    };
  }, []);

  /**
   * Estado que almacena los datos del usuario.
   *
   * @type {Object | null} - Puede ser un objeto con las propiedades `id` y `nombre`
   * o `null` si no hay datos del usuario disponibles.
   *
   * @property {string} id - Identificador único del usuario.
   * @property {string} nombre - Nombre del usuario.
   *
   * Se utiliza para gestionar y acceder a la información del usuario en el componente.
   */
  const [usuarioData, setUsuarioData] = useState<{
    id: string;
    nombre: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    /**
     * Recupera de forma asíncrona los datos del usuario (nombre de usuario e ID de usuario) desde AsyncStorage
     * y actualiza el estado con los valores recuperados.
     */
    const obtenerDatosUsuario = async () => {
      const nombreUsuario = await AsyncStorage.getItem("nombreUsuario");
      const idUsuario = await AsyncStorage.getItem("idUsuario");
      const avatarUsuario = await AsyncStorage.getItem("avatarUsuario");
      if (nombreUsuario && idUsuario) {
        setUsuarioData({
          id: idUsuario,
          nombre: nombreUsuario,
          avatar: avatarUsuario ?? "avatar1",
        });
      }
    };

    obtenerDatosUsuario();
  }, []);
  /**
   * Al presionar una sala:
   * - Si es privada, se muestra el modal para ingresar la contraseña.
   * - Si es pública, se une directamente a la sala.
   */
  const handleSalaPress = (sala: any) => {
    if (sala.tipo.toLowerCase() === "privada") {
      setSalaSeleccionada(sala);
      setMostrarModal(true);
    } else if (usuarioData) {
      socket.emit("unirseSala", {
        idSala: sala.id,
        usuario: {
          id: usuarioData.id,
          nombre: usuarioData.nombre,
          avatar: usuarioData.avatar,
        },
      });
      // Se envía la data completa de la sala, incluida la propiedad maxJugadores
      router.push({
        pathname: "/(sala)/sala",
        params: { idSala: sala.id, salaData: JSON.stringify(sala) },
      });
    } else {
      Alert.alert("Usuario no disponible", "No hay datos de usuario.");
    }
  };

  /**
   * Al confirmar la contraseña en una sala privada, se emite el evento de unión.
   */
  const handleConfirmarPassword = () => {
    if (!usuarioData) {
      Alert.alert("Error", "No hay datos de usuario.");
      return;
    }
    if (password === salaSeleccionada.contrasena) {
      socket.emit("unirseSala", {
        idSala: salaSeleccionada.id,
        usuario: {
          id: usuarioData.id,
          nombre: usuarioData.nombre,
          avatar: usuarioData.avatar,
        },
        contrasena: password,
      });
      setMostrarModal(false);
      // Envía además la data completa de la sala
      router.push({
        pathname: "/(sala)/sala",
        params: {
          idSala: salaSeleccionada.id,
          salaData: JSON.stringify(salaSeleccionada),
        },
      });
    } else {
      Alert.alert("Contraseña incorrecta", "Por favor, intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imagenFondo} style={styles.image}>
        {/* Contenedor para la cabecera con posición absoluta */}
        <View style={styles.headerContainer}>
          <Cabecera />
        </View>

        {/* Contenido principal con paddingTop para dejar espacio a la cabecera */}
        <ScrollView contentContainerStyle={styles.scrollContenido}>
          {/* Título principal */}
          <Text style={styles.titulo}>BUSCAR{"\n"}SALAS</Text>

          {salas.map((sala, index) => {
            // Obtén la cantidad actual y el máximo de jugadores
            const currentPlayers = sala.jugadores ? sala.jugadores.length : 0;
            const maxPlayers = sala.maxJugadores;
            return (
              <TouchableOpacity
                key={index}
                style={styles.salaContainer}
                onPress={() => handleSalaPress(sala)}
              >
                <Text style={styles.texto}>
                  <Text style={styles.label}>ESTADO: </Text> {sala.estado}
                </Text>
                <Text style={styles.texto}>
                  <Text style={styles.label}>TIPO: </Text> {sala.tipo}
                </Text>
                {sala.privada && (
                  <Image source={iconoCandado} style={styles.iconoCandado} />
                )}
                <Text style={styles.texto}>
                  <Text style={styles.label}>NOMBRE: </Text> {sala.nombre}
                </Text>
                <Text style={styles.texto}>
                  <Text style={styles.label}>JUGADORES: </Text> {currentPlayers}{" "}
                  / {maxPlayers}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Botón para regresar */}
          <TouchableOpacity
            style={styles.botonAtras}
            onPress={() => router.back()}
          >
            <Image source={imagenAtras} style={styles.imagenAtras} />
          </TouchableOpacity>
        </ScrollView>

        {/* Modal de ingreso de contraseña para salas privadas */}
        <Modal visible={mostrarModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Introduce la contraseña</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.botonConfirmar}
                onPress={handleConfirmarPassword}
              >
                <Text style={styles.textoBotonConfirmar}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => setMostrarModal(false)}
              >
                <Text style={styles.textoBotonCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos de la pantalla de búsqueda de salas.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    position: "relative", // Para que el header se superponga
    justifyContent: "center",
    alignItems: "center",
  },

  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },

  titulo: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20, // Ajusta este valor según sea necesario para centrar el texto verticalmente
  },

  rectanglesContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  rectangle: {
    width: "80%", // Ajusta el tamaño del rectángulo
    height: 30, // Ajusta el tamaño del rectángulo
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Color negro semitransparente
    marginVertical: 10, // Espacio entre los rectángulos
  },

  salaContainer: {
    width: "90%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },

  texto: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },

  label: {
    fontWeight: "bold",
  },

  iconoCandado: {
    width: 20,
    height: 20,
    position: "absolute",
    right: 15,
    top: 15,
  },

  botonAtras: {
    marginTop: 20,
  },

  imagenAtras: {
    width: 50,
    height: 50,
    marginBottom: 60,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },

  botonConfirmar: {
    backgroundColor: "#008000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  textoBotonConfirmar: {
    color: "white",
    fontWeight: "bold",
  },

  botonCancelar: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
  },

  textoBotonCancelar: {
    color: "white",
    fontWeight: "bold",
  },

  scrollContenido: {
    paddingTop: 120, // Espacio suficiente para la cabecera y dropdown
    paddingBottom: 20,
    alignItems: "center",
    width: "80%",
  },
});
