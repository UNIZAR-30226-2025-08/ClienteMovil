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

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");
const imagenPerfil = require("@/assets/images/imagenPerfil.webp");
const imagenListaAmigos = require("@/assets/images/imagen-lista-amigos.png");

export default function PerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [rolFavorito, setRolFavorito] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);


  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const avatar = await AsyncStorage.getItem("avatarUsuario");
        const rolFavorito = await AsyncStorage.getItem("rolFavorito");
        const fechaCreacion = await AsyncStorage.getItem("fechaCreacion");

        setNombre(nombre || "Usuario");
        setAvatar(avatar || null);
        setRolFavorito(rolFavorito || "aldeano");

        // Formatear la fecha de creación
        if (fechaCreacion) {
          const fechaFormateada = new Date(fechaCreacion);
          const dia = String(fechaFormateada.getDate()).padStart(2, "0"); // Asegura que tenga 2 dígitos
          const mes = String(fechaFormateada.getMonth() + 1).padStart(2, "0"); // Los meses van de 0-11, así que se suma 1
          const año = fechaFormateada.getFullYear();

          setFechaCreacion(`${dia}/${mes}/${año}`);
        } else {
          setFechaCreacion("Fecha desconocida");
        }

      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    cargarDatosUsuario();
  }, []);

  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null;
  }

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
        <Image source={avatar ? { uri: avatar } : imagenPerfil} style={styles.profileImage} />
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

          <Text style={styles.textoFecha}>Fecha de creación</Text>
          <Text style={styles.fechaCreacion}>{fechaCreacion}</Text>

          <Text style={styles.textoRol}>Rol favorito</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={rolFavorito}
              onValueChange={(itemValue) => setRolFavorito(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Aldeano" value="aldeano" />
              <Picker.Item label="Lobo" value="lobo" />
              <Picker.Item label="Vidente" value="vidente" />
              <Picker.Item label="Bruja" value="bruja" />
              <Picker.Item label="Cazador" value="cazador" />
              <Picker.Item label="Alguacil" value="alguacil" />
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

        <TouchableOpacity
          style={styles.botonGuardar}
          onPress={() => router.push("/elegirOpciones")}
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
    height: 45,
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
    height: 45, // Aumenta la altura del botón
    marginTop: 15,
    borderRadius: 10,
  },
  textoHistorial: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    textAlign: "center", // Alinea el texto al centro
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
