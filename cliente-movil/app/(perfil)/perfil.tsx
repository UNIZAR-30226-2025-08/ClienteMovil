import React, { useState, useEffect } from "react"; // Importar useState desde React
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
import { Picker } from "@react-native-picker/picker"; // Importamos Picker

import { useFonts } from "expo-font";

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenPapiro = require("@/assets/images/papiro.png");
const imagenAtras = require("@/assets/images/botonAtras.png");
const imagenPerfil = require("@/assets/images/imagenPerfil.webp");
const imagenListaAmigos = require("@/assets/images/imagen-lista-amigos.png");

export default function PerfilScreen() {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require("@/assets/fonts/ghost-shadow.ttf"),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  const irAtras = () => {
    router.back(); // Regresa a la pantalla anterior
  };

  // Estado para el rol favorito seleccionado
  const [rolFavorito, setRolFavorito] = useState("");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <Image source={imagenPerfil} style={styles.profileImage} />
        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() => router.push("/(perfil)/elegirAvatar")}
        >
          <Text style={styles.textoBotonEditar}>EDITAR</Text>
        </TouchableOpacity>
        <Image source={imagenPapiro} style={styles.imagePapiro}></Image>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.textoNombre}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nuevo nombre"
            placeholderTextColor="#444"
            autoCapitalize="none"
          />

          <Text style={styles.textoFecha}>Fecha de creación</Text>
          <Text style={styles.fechaCreacion}>27/01/2025</Text>

          <Text style={styles.textoRol}>Rol favorito</Text>
          {/* Lista desplegable para elegir el rol */}
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
            ></Image>
            <Text style={styles.textoGuardar}>LISTA AMIGOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonGuardar}
            onPress={() => router.push("/elegirOpciones")}
          >
            <Text style={styles.textoGuardar}>GUARDAR</Text>
          </TouchableOpacity>
        </View>

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
    width: 100, // Ajusta el tamaño de la imagen
    height: 100, // Ajusta el tamaño de la imagen
    position: "absolute",
    top: 80, // Centra la imagen en el eje vertical
    left: "50%",
    marginLeft: -50, // Desplaza la imagen hacia la izquierda para que esté completamente centrada (mitad del ancho de la imagen)
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
  },

  textoGuardar: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject, // Cubre toda el área de la imagen
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo negro semitransparente, puedes ajustar la opacidad
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
