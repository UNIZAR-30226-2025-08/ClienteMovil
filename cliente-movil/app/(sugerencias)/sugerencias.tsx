import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Importación de imágenes utilizadas en la pantalla de sugerencias.
 *
 * @remarks
 * Estas imágenes incluyen el fondo de la pantalla, el logo de soporte técnico,
 * el botón de regreso, y otras imágenes decorativas para la pantalla de contacto.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenContacto = require("@/assets/images/logo-soporte-tecnico.png");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Componente que representa la pantalla de sugerencias.
 *
 * Este componente permite a los usuarios enviar una sugerencia, ingresando su nombre, correo y asunto.
 * La sugerencia se envía a un backend para ser almacenada en la base de datos.
 *
 * @returns {JSX.Element | null} Retorna el componente de sugerencias o null si no se ha cargado la fuente.
 */
export default function SugerenciasScreen(): JSX.Element | null {
  /**
   * URL del backend obtenida de las constantes de Expo.
   *
   * @constant {string | undefined}
   */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  /**
   * Hook de navegación para manejar la navegación en la aplicación.
   */
  const router = useRouter();

  // Estados para cada input
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");

  /**
   * Carga la fuente personalizada GhostShadow.
   *
   * @constant {boolean} loaded - Indica si la fuente ha sido cargada.
   */
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  /**
   * Navega a la pantalla anterior.
   *
   * @remarks
   * Utiliza el hook `useRouter` para retroceder en el stack de navegación.
   */
  const irAtras = (): void => {
    router.back(); // Regresa a la pantalla anterior
  };

  /**
   * Envía la sugerencia ingresada al backend para su almacenamiento.
   *
   * @async
   * @returns {Promise<void>} Promesa que se resuelve cuando la sugerencia se envía o se produce un error.
   *
   * @remarks
   * - Valida que los campos de nombre, correo y asunto estén completos.
   * - Obtiene el ID del usuario desde AsyncStorage.
   * - Realiza una petición POST al endpoint `${BACKEND_URL}/api/sugerencias/enviar`.
   * - Si la petición es exitosa, limpia los campos de entrada.
   */
  const enviarSugerencia = async (): Promise<void> => {
    // Validar que se hayan ingresado los campos requeridos
    if (!asunto) {
      Alert.alert("Por favor, completa todos los campos.");
      return;
    }

    /*
     * Obtenemos el ID del usuario que envía la sugerencia al Backend
     * para que se guarde en los registros de la BD
     */
    const idUsuarioString = await AsyncStorage.getItem("idUsuario");
    if (!idUsuarioString) {
      Alert.alert("Error", "No se encontró el id de usuario.");
      return;
    }
    const idUsuario = parseInt(idUsuarioString, 10);
    // Depuración del id del usuario
    console.log("ID usuario enviado:", idUsuario);

    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/sugerencias/enviar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario,
          contenido: asunto, // O puedes combinar los campos si lo prefieres
        }),
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        Alert.alert("Sugerencia enviada", "Gracias por tu sugerencia.");
        // Limpiar campos después de enviar
        setNombre("");
        setCorreo("");
        setAsunto("");
      } else {
        Alert.alert(
          "Error",
          data.error || "Ocurrió un error al enviar la sugerencia."
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  /**
   * Estilos utilizados en la pantalla de contacto.
   *
   * @constant {StyleSheet.NamedStyles<any>}
   */
  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <Text style={styles.tituloContacto}>SUGERENCIAS</Text>
        <Image source={imagenContacto} style={styles.imageContacto}></Image>

        {/* Campo de entrada para el asunto */}
        <Text style={styles.textoAsunto}>Asunto</Text>
        <TextInput
          style={styles.bigInput}
          placeholderTextColor="#444"
          value={asunto}
          onChangeText={setAsunto}
          placeholder="Escribe el asunto aquí..."
          multiline={true} // Permite varias líneas
          numberOfLines={15} // Define el número de líneas visibles inicialmente
          textAlignVertical="top" // Alinea el texto en la parte superior
        />

        {/* Botón de enviar mensaje */}
        <TouchableOpacity style={styles.botonEnviar} onPress={enviarSugerencia}>
          <Text style={styles.textoEnviar}>ENVIAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonEnviar, { marginTop: 10 }]}
          onPress={() => router.push("/(sugerencias)/listarSugerencias")}
        >
          <Text style={styles.textoEnviar}>VER SUGERENCIAS</Text>
        </TouchableOpacity>

        {/* Botón de regresar a la pantalla anterior */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos para la pantalla de contacto.
 *
 * @remarks
 * Se utilizan estilos específicos para cada sección de la pantalla de
 * sugerencias, incluyendo el fondo, los botones, los campos de entrada,
 * y la posición de los textos e imágenes.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  containerAtras: {
    position: "absolute",
    bottom: 20,
    left: "44%",
  },

  imageAtras: {
    height: 40,
    width: 40,
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

  imageContacto: {
    width: 170,
    height: 170,
    left: "28%",
    top: "15%",
    position: "absolute",
    borderRadius: 100,
  },

  tituloContacto: {
    position: "absolute",
    top: "5%",
    left: "28%",
    marginTop: 20,
    marginLeft: -60,
    color: "white",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  textoAsunto: {
    fontSize: 16,
    color: "white",
    marginLeft: "20%",
    marginTop: 195,
    textAlign: "left",
  },

  smallInput: {
    marginLeft: "20%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "60%",
  },

  bigInput: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: "20%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "60%",
    height: "35%",
    textAlignVertical: "top",
  },

  botonEnviar: {
    backgroundColor: "#008f39",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 45,
    marginTop: 15,
    marginLeft: "30%",
    borderRadius: 30,
  },

  textoEnviar: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
