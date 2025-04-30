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
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

/**
 * Mapa de claves de avatar a sus respectivas imágenes.
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

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");
const imagenListaAmigos = require("@/assets/images/imagen-lista-amigos.png");

/**
 * Pantalla de perfil del usuario.
 *
 * Permite la edición del nombre, la selección de un rol favorito
 * y la visualización del avatar. También se pueden acceder a la
 * lista de amigos y al historial de partidas.
 *
 * @returns {JSX.Element} Pantalla de perfil del usuario.
 */
export default function PerfilScreen(): JSX.Element | null {
  /**
   * Hook de navegación para manejar redirecciones dentro de la aplicación.
   */
  const router = useRouter();

  /**
   * Estado del nombre del usuario.
   */
  const [nombre, setNombre] = useState("");

  /**
   * Estado del rol favorito del usuario.
   */
  const [rolFavorito, setRolFavorito] = useState("");

  /**
   * Estado que almacena la fecha de creación del perfil del usuario.
   */
  const [fechaCreacion, setFechaCreacion] = useState<string | null>(null);

  /**
   * Estado que almacena la imagen del avatar del usuario.
   */
  const [avatar, setAvatar] = useState<any>(null);

  /**
   * Estado de carga de la pantalla.
   */
  const [loading, setLoading] = useState(true); // Estado de carga

  /**
   * URL del backend obtenida de las constantes de Expo.
   */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  /**
   * Carga los datos del usuario desde el backend y los almacena en el estado.
   *
   * Obtiene el correo del usuario almacenado en AsyncStorage, realiza una
   * petición a la API para obtener los datos del usuario y los asigna a los
   * estados correspondientes.
   */
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const correo = await AsyncStorage.getItem("correoUsuario");

        if (!correo) return;

        const response = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener`,
          { correo }
        );

        if (response.status === 200) {
          const data = response.data.usuario;
          setNombre(data.nombre);
          setAvatar(data.avatar || ""); // Si no hay avatar, usa string vacío
          setRolFavorito(data.rolFavorito || ""); // Cargar el rol favorito

          // Guardar la fecha en AsyncStorage si aún no está guardada
          if (data.fechaCreacion) {
            await AsyncStorage.setItem("fechaCreacion", data.fechaCreacion);
            setFechaCreacion(data.fechaCreacion);
          }

          // Mapeamos la clave de avatar a un recurso local
          if (data.avatar) {
            const imagenLocal = avatarMap[data.avatar];
            setAvatar(imagenLocal || null);
          } else {
            setAvatar(null);
          }
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  /**
   * Guarda los datos del usuario actualizados en el backend.
   *
   * Realiza una petición `PUT` a la API para actualizar los datos del usuario.
   * Antes de enviar la solicitud, valida que el usuario tenga un ID y un rol favorito seleccionado.
   * Si la actualización es exitosa, se almacenan los datos localmente.
   */
  const guardarDatosUsuario = async () => {
    try {
      const idUsuario = await AsyncStorage.getItem("idUsuario");

      if (!idUsuario) {
        Alert.alert("Error", "No se pudo obtener el ID del usuario.");
        return;
      }

      // Aseguramos que rolFavorito y avatar sean cadenas de texto válidas
      if (!rolFavorito) {
        Alert.alert("Error", "Selecciona un rol favorito antes de guardar.");
        return;
      }

      const response = await axios.put(
        `${BACKEND_URL}/api/usuario/actualizar`,
        {
          idUsuario: parseInt(idUsuario),
          nombre: nombre,
          rolFavorito: rolFavorito,
        }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("nombreUsuario", nombre);
        await AsyncStorage.setItem("rolFavorito", rolFavorito);
        Alert.alert("Éxito", "Datos actualizados correctamente.");
      } else {
        throw new Error("Error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error);
      Alert.alert("Error", "No se pudieron actualizar los datos.");
    }
  };

  /**
   * Carga la fuente personalizada de la aplicación.
   */
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null;
  }

  /**
   * Redirige a la pantalla principal de opciones.
   */
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

        <Image source={avatar} style={styles.profileImage} />

        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() => router.push("/(perfil)/elegirAvatar")}
        >
          <Text style={styles.textoBotonEditar}>EDITAR</Text>
        </TouchableOpacity>
        <Image source={imagenPapiro} style={styles.imagePapiro} />

        <View style={styles.formContainer}>
          <Text style={styles.textoNombre}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nuevo nombre"
            placeholderTextColor="#444"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.fechaCreacion}>
            {fechaCreacion
              ? new Date(fechaCreacion).toLocaleDateString("es-ES")
              : "Cargando..."}
          </Text>

          <Text style={styles.textoRol}>Rol favorito</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={rolFavorito}
              onValueChange={(itemValue) => setRolFavorito(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Aldeano" value="aldeano" />
              <Picker.Item label="Hombre lobo" value="lobo" />
              <Picker.Item label="Vidente" value="vidente" />
              <Picker.Item label="Bruja" value="bruja" />
              <Picker.Item label="Cazador" value="cazador" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.botonListaAmigos}
            onPress={() => router.push("/(perfil)/listaAmigos")}
          >
            <Image
              source={imagenListaAmigos}
              style={styles.listaAmigosImagen}
            />
            <Text style={styles.textoGuardar}>LISTA AMIGOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonHistorial}
            onPress={() => router.push("/(perfil)/historial")}
          >
            <Text style={styles.textoHistorial}>HISTORIAL DE PARTIDAS</Text>
          </TouchableOpacity>
        </View>

        {/* Reutilizando el mismo botón "GUARDAR" */}
        <TouchableOpacity
          style={styles.botonGuardar}
          onPress={guardarDatosUsuario}
        >
          <Text style={styles.textoGuardar}>GUARDAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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

  profileImage: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 80,
    left: "50%",
    marginLeft: -50,
    zIndex: 1,
    borderRadius: 50,
  },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  imagePapiro: {
    height: 420,
    width: 333,
    position: "absolute",
    bottom: "20%",
    left: "8%",
  },

  formContainer: {
    position: "absolute",
    width: "100%",
    bottom: "25%",
    alignItems: "center",
    gap: 4,
  },

  textoNombre: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },
  textoFecha: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },

  fechaCreacion: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },

  textoRol: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },

  input: {
    width: "70%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },

  botonGuardar: {
    backgroundColor: "#008f39",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 45,
    marginTop: 15,
    borderRadius: 30,
    position: "absolute",
    bottom: 95, // Ajusta este valor según sea necesario para posicionar el botón por encima del botón "VOLVER"
    left: "50%",
    marginLeft: -75, // Centra el botón horizontalmente
  },

  textoGuardar: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  pickerContainer: {
    width: "68%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginTop: 5,
    justifyContent: "center",
  },

  picker: {
    height: 60,
    width: "100%",
    color: "black",
  },

  botonListaAmigos: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 50,
    marginTop: 15,
    borderRadius: 10,
  },

  listaAmigosImagen: {
    width: 20,
    height: 20,
  },

  botonHistorial: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 50,
    marginTop: 15,
    borderRadius: 10,
  },

  textoHistorial: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },

  botonEditar: {
    position: "absolute",
    top: 182,
    left: "50%",
    marginLeft: -50,
    backgroundColor: "#008f39",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 35,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },

  textoBotonEditar: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
