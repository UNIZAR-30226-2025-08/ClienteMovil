import React, { useState } from "react";
import Constants from "expo-constants";
import axios from "axios";
import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";

import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

// Importación de imágenes utilizadas en la pantalla
const imagenPortada = require("@/assets/images/imagen-portada.png");
const imagenFondoInicioSesion = require("@/assets/images/fondo-inicio-sesion.jpg");

/**
 * Componente principal de la pantalla de registro
 *
 * @remarks
 * Este componente maneja el registro de nuevos usuarios con las siguientes características:
 * - Validación de campos obligatorios
 * - Validación de formato de correo electrónico
 * - Encriptación de contraseña antes de enviarla al servidor
 * - Manejo de errores y mensajes de retroalimentación
 *
 * @returns {JSX.Element | null} La pantalla de registro o null si las fuentes no están cargadas
 */
export default function RegistroScreen() {
  /** URL del backend obtenida de las constantes de Expo */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  /**
   * Estado para almacenar el nombre ingresado por el usuario.
   */
  const [nombre, setNombre] = useState("");

  /**
   * Estado para almacenar el correo ingresado por el usuario.
   */
  const [correo, setCorreo] = useState("");

  /**
   * Estado para almacenar la contraseña ingresada por el usuario.
   */
  const [contrasena, setContrasena] = useState("");

  /**
   * Estado para almacenar la confirmación de la contraseña ingresada.
   */
  const [confirmContrasena, setconfirmContrasena] = useState("");

  /**
   * Estado que controla la visibilidad de la contraseña.
   */
  const [secureText, setSecureText] = useState(true);

  /**
   * Estado que controla la visibilidad de la confirmación de la contraseña.
   */
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  /**
   * Hook de navegación para manejar redirecciones dentro de la aplicación.
   */
  const router = useRouter();

  /**
   * Carga la fuente personalizada "GhostShadow" utilizada en la aplicación.
   */
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null;
  }

  /**
   * Maneja el proceso de registro de usuario
   *
   * @remarks
   * Realiza las siguientes acciones:
   * 1. Valida los campos obligatorios
   * 2. Valida el formato del correo electrónico
   * 3. Encripta la contraseña
   * 4. Envía la solicitud al backend
   * 5. Maneja la respuesta, guarda los datos del usuario en AsyncStorage y navega a la pantalla de inicio
   *
   * @throws {Error} Si hay un error en el proceso de registro
   */
  const handleRegister = async () => {
    // Si el usuario no ha rellenado el campo de correo o contraseña
    // lanza un mensaje de que no se han rellenado los campos y no
    // manda la petición
    if (!nombre || !correo || !contrasena || !confirmContrasena) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    // Validación de coincidencia de contraseñas
    if (contrasena !== confirmContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Validación básica del correo electrónico
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!correoRegex.test(correo)) {
      Alert.alert("Error", "Por favor, ingresa un correo válido.");
      return;
    }

    // Intenta realizar una solicitud al backend de tipo POST con fetch(),
    // que realiza una petición HTTP, con 'POST' indicamos que estamos
    // enviando información al backend, 'headres' indica que estamos enviando
    // datos al backend en formato JSON y 'body' son la propia información que
    // vamos a enviar al backend en formato JSON
    try {
      // Generar hash SHA256 en el cliente
      const hashContrasena = CryptoJS.SHA256(contrasena).toString(
        CryptoJS.enc.Hex
      );

      const response = await axios.post(`${BACKEND_URL}/api/usuario/crear`, {
        nombre,
        correo,
        contrasena: hashContrasena, // Enviar la contraseña encriptada
      });
      if (response.status === 201) {
        const data = response.data;

        // Guardamos los datos del usuario en AsyncStorage para su uso posterior
        await AsyncStorage.setItem(
          "idUsuario",
          data.usuario.idUsuario.toString()
        );
        await AsyncStorage.setItem("nombreUsuario", data.usuario.nombre);
        await AsyncStorage.setItem("avatarUsuario", "avatar5"); //avatar por defecto
        await AsyncStorage.setItem("correoUsuario", data.usuario.correo);
        await AsyncStorage.setItem("fechaCreacion", data.usuario.fechaCreacion);
        await AsyncStorage.setItem("rolFavorito", data.usuario.rolFavorito);

        Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.", [
          { text: "OK", onPress: () => router.push("/entrar") },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "No se pudo registrar el usuario."
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ImageBackground
            source={imagenPortada}
            resizeMode="cover"
            style={styles.image}
          >
            {/* Título */}
            <Text style={styles.title}>LOS HOMBRES LOBOS DE CASTRONEGRO</Text>

            {/* Imagen de fondo de inicio de sesión */}
            <Image
              source={imagenFondoInicioSesion}
              style={styles.imagenRegistro}
            />

            {/* Formulario */}
            <View style={styles.formContainer}>
              <Text style={styles.tituloResgistrarse}>REGISTRARSE</Text>

              <Text style={styles.textoCorreo}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                value={nombre}
                onChangeText={setNombre}
                placeholderTextColor="#444"
              />

              <Text style={styles.textoCorreo}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu correo"
                value={correo}
                onChangeText={setCorreo}
                placeholderTextColor="#444"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.textoContrasena}>Contraseña</Text>
              <View style={styles.contrasenaContainer}>
                <TextInput
                  style={[styles.input, { width: "95%" }]}
                  placeholder="Contraseña"
                  value={contrasena}
                  onChangeText={setContrasena}
                  secureTextEntry={secureText}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                  <Text>{secureText ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.textoContrasena}>Confirmar contraseña</Text>
              <View style={styles.contrasenaContainer}>
                <TextInput
                  style={[styles.input, { width: "95%" }]}
                  placeholder="Confirmar Contraseña"
                  value={confirmContrasena}
                  onChangeText={setconfirmContrasena}
                  secureTextEntry={secureTextConfirm}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextConfirm(!secureTextConfirm)}
                >
                  <Text>{secureTextConfirm ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.botonEntrar}
                onPress={handleRegister}
              >
                <Text style={styles.textoEntrar}>REGISTRARSE</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Estilos de la pantalla
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

  title: {
    width: "90%",
    left: "6%",
    lineHeight: 60,
    fontSize: 30,
    color: "white",
    fontFamily: "GhostShadow",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
    position: "absolute",
    top: 50,
  },

  imagenRegistro: {
    position: "absolute",
    width: 320,
    height: 470,
    left: "9.5%",
    bottom: "13%",
    borderRadius: 30,
  },

  formContainer: {
    position: "absolute",
    width: "100%",
    bottom: "20%",
    alignItems: "center",
  },

  tituloResgistrarse: {
    fontFamily: "GhostShadow",
    fontSize: 30,
    color: "black",
  },

  textoCorreo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },

  textoContrasena: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },

  input: {
    width: "70%",
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },

  textoRegistro: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },

  linkRegistro: {
    color: "blue",
    fontWeight: "bold",
  },

  botonEntrar: {
    backgroundColor: "#008f39",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 45,
    marginTop: 15,
    borderRadius: 30,
  },

  textoEntrar: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },

  contrasenaContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
});
