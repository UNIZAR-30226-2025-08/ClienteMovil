import React, { useState } from "react";
import Constants from "expo-constants";
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
import { Link } from "expo-router";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import axios from "axios";
import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "@/app/(sala)/socket";

const imagenPortada = require("@/assets/images/imagen-portada.png");
const imagenFondoInicioSesion = require("@/assets/images/fondo-inicio-sesion.jpg");

/**
 * Componente principal de la pantalla de inicio de sesión.
 *
 * @remarks
 * Este componente maneja la autenticación de usuarios mediante correo electrónico y contraseña.
 *
 * @returns {JSX.Element | null} La pantalla de inicio de sesión o null si las fuentes no están cargadas
 */
export default function App(): JSX.Element | null {
  /** URL del backend obtenida de las constantes de Expo */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  /** Hook de navegación de Expo Router */
  const router = useRouter();

  /** Estado para el correo electrónico del usuario */
  const [correo, setCorreo] = useState("");

  /** Estado para la contraseña del usuario */
  const [contrasena, setContrasena] = useState("");

  /** Estado para el id del usuario. Sólo usado tras iniciar sesión */
  const [idUsuario, setIdUsuario] = useState("");

  /**
   * Estado para controlar la visibilidad de la contraseña.
   */
  const [secureText, setSecureText] = useState(true);

  /**
   * Hook para cargar fuentes personalizadas.
   */
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  /**
   * Si no están cargadas las fuentes, retorna null.
   * Esto evita que la aplicación intente renderizarse antes
   * de que las fuentes estén listas.
   */
  if (!loaded) {
    return null;
  }

  /**
   * Maneja el proceso de inicio de sesión
   *
   * @remarks
   * Realiza las siguientes acciones:
   * 1. Valida las credenciales
   * 2. Encripta la contraseña
   * 3. Envía la solicitud al backend
   * 4. Maneja la respuesta y navega al dashboard si es exitosa
   *
   * @throws {Error} Si hay un error en el proceso de autenticación
   */
  const handleLogin = async (): Promise<void> => {
    // Si el usuario no ha rellenado el campo de correo o contraseña
    // lanza un mensaje de que no se han rellenado los campos y no
    // manda la petición
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
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

      // Enviar datos al backend
      const response = await axios.post(`${BACKEND_URL}/api/usuario/login`, {
        correo,
        contrasena: hashContrasena, // Enviar la contraseña encriptada
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("ID del usuario:", data.usuario.idUsuario); // Depuración en consola
        await AsyncStorage.setItem(
          "idUsuario",
          data.usuario.idUsuario.toString()
        );
        // Guardamos el correo en AsyncStorage para su uso posterior
        await AsyncStorage.setItem("nombreUsuario", data.usuario.nombre);
        if (data.usuario.avatar) {
          await AsyncStorage.setItem("avatarUsuario", data.usuario.avatar);
        }

        if (data.usuario.idUsuario) {
          await AsyncStorage.setItem(
            "idUsuario",
            String(data.usuario.idUsuario)
          );
        }

        await AsyncStorage.setItem("correoUsuario", data.usuario.correo);

        await AsyncStorage.setItem(
          "rolFavorito",
          data.usuario.rolFavorito || "aldeano"
        );
        await AsyncStorage.setItem(
          "fechaCreacion",
          data.usuario.fechaCreacion || "Fecha desconocida"
        );

        Alert.alert(
          "Inicio de sesión exitoso",
          `Bienvenido, ${data.usuario.nombre}`
        );

        // Verificar si es administrador
        const adminResponse = await axios.post(
          `${BACKEND_URL}/api/admin/esAdministrador`,
          {
            idUsuario: data.usuario.idUsuario,
          }
        );
        if (adminResponse.data.esAdministrador) {
          await AsyncStorage.setItem("esAdministrador", "true");
          socket.emit("registrarUsuario", {
            idUsuario: data.usuario.idUsuario,
          });
        } else {
          await AsyncStorage.setItem("esAdministrador", "false");
          socket.emit("registrarUsuario", {
            idUsuario: data.usuario.idUsuario,
          });
          setIdUsuario(data.usuario.idUsuario);
        }
        router.push("/entrar");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Credenciales incorrectas."
        );
      }
    } catch (error) {
      console.error("Error en el login:", error); // Esto va a imprimir más detalles en la consola
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
              style={styles.imagenInicioSesion}
            />

            {/* Formulario */}
            <View style={styles.formContainer}>
              <Text style={styles.tituloIniciarSesion}>INICIAR SESION</Text>

              <Text style={styles.textoCorreo}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu correo"
                placeholderTextColor="#444"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.textoContrasena}>Contraseña</Text>
              <View style={styles.contrasenaContainer}>
                <TextInput
                  style={[styles.input, { width: "95%" }]}
                  placeholder="Tu contraseña"
                  placeholderTextColor="#444"
                  value={contrasena}
                  onChangeText={setContrasena}
                  secureTextEntry={secureText}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                  <Text>{secureText ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.textoRegistro}>
                ¿No tienes cuenta?{" "}
                <Link href="/registro" style={styles.linkRegistro}>
                  Regístrate
                </Link>
              </Text>

              <TouchableOpacity
                style={styles.botonEntrar}
                onPress={handleLogin}
              >
                <Text style={styles.textoEntrar}>ENTRAR</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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

  imagenInicioSesion: {
    position: "absolute",
    width: "80%",
    height: undefined,
    aspectRatio: 320 / 470,
    left: "10%",
    bottom: "13%",
    borderRadius: 30,
  },

  formContainer: {
    position: "absolute",
    width: "100%",
    bottom: "26%",
    alignItems: "center",
  },

  tituloIniciarSesion: {
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
    top: 20,
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
    width: 210,
    height: 65,
    top: 50,
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
