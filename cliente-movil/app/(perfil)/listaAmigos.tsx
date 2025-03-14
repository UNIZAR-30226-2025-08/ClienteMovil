import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

/**
 * Imágenes utilizadas en la pantalla de lista de amigos.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

// Imagen por defecto para nuevos amigos (o la que prefieras)
const imagenPerfilDefecto = require("@/assets/images/imagenPerfil.webp");

/**
 * Lista inicial de amigos (Datos simulados).
 */
const amigosIniciales = [
  {
    id: 1,
    nombre: "Adrián Artigas",
    imagen: require("@/assets/images/imagenPerfil.webp"),
  },
  {
    id: 2,
    nombre: "Adrián Becerril",
    imagen: require("@/assets/images/imagenPerfil4.webp"),
  },
  {
    id: 3,
    nombre: "Nico Fabra",
    imagen: require("@/assets/images/imagenPerfil.webp"),
  },
  {
    id: 4,
    nombre: "Alberto Solaz",
    imagen: require("@/assets/images/imagenPerfil5.webp"),
  },
  {
    id: 5,
    nombre: "Enrique Baldovín",
    imagen: require("@/assets/images/imagenPerfil3.webp"),
  },
  {
    id: 6,
    nombre: "Marcos Ibáñez",
    imagen: require("@/assets/images/imagenPerfil8.webp"),
  },
  {
    id: 7,
    nombre: "Óscar Gil",
    imagen: require("@/assets/images/imagenPerfil2.webp"),
  },
  {
    id: 8,
    nombre: "Juan González",
    imagen: require("@/assets/images/imagenPerfil7.webp"),
  },
  {
    id: 9,
    nombre: "Blanca Gayarre",
    imagen: require("@/assets/images/imagenPerfil6.webp"),
  },
];

/**
 * Pantalla de lista de amigos.
 * Permite visualizar amigos, agregar nuevos y regresar a la pantalla anterior.
 * 
 * @returns {JSX.Element} Pantalla de lista de amigos.
 */
export default function AmigosScreen(): JSX.Element {
  const router = useRouter();

  // Lista de amigos en estado para poder modificarla
  const [amigos, setAmigos] = useState(amigosIniciales);

  // Estado para almacenar el nombre del nuevo amigo
  const [nuevoAmigo, setNuevoAmigo] = useState("");

  /**
   * Función para agregar un nuevo amigo a la lista.
   */
  const anadirAmigo = () => {
    // 1) Comprobamos que no esté vacío
    if (!nuevoAmigo.trim()) return;

    // 2) Creamos un ID nuevo (simplemente uno más que el mayor existente)
    const nuevoId =
      amigos.length > 0 ? Math.max(...amigos.map((a) => a.id)) + 1 : 1;

    // 3) Construimos el objeto del nuevo amigo
    const amigo = {
      id: nuevoId,
      nombre: nuevoAmigo.trim(),
      imagen: imagenPerfilDefecto, // Puedes poner otra imagen si quieres
    };

    // 4) Actualizamos la lista de amigos y limpiamos el input
    setAmigos([...amigos, amigo]);
    setNuevoAmigo("");
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

        {/* Contenedor para añadir nuevo amigo */}
        <View style={styles.addFriendContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del nuevo amigo"
            placeholderTextColor="#666"
            value={nuevoAmigo}
            onChangeText={setNuevoAmigo}
          />
          <TouchableOpacity style={styles.botonAnadir} onPress={anadirAmigo}>
            <Text style={styles.botonAnadirTexto}>AÑADIR</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de amigos desplazable */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {amigos.map((amigo) => (
            <View key={amigo.id} style={styles.amigoContainer}>
              <Image source={amigo.imagen} style={styles.imagenPerfil} />
              <Text style={styles.nombre}>{amigo.nombre}</Text>
            </View>
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

  // Contenedor para añadir amigo
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
    marginRight: 15,
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
});
