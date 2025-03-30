import React from "react";
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
import { useRouter } from "expo-router";

/**
 * Imagen de fondo de la pantalla.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");

/**
 * Imagen del botón para volver atrás.
 */
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Lista de amigos simulada.
 * En una aplicación real, estos datos deberían ser obtenidos desde un backend.
 */
const amigos = [
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
 * Pantalla que muestra la lista de amigos del usuario.
 * Permite invitar amigos a una partida o interactuar con ellos.
 * 
 * @returns {JSX.Element} Pantalla de lista de amigos.
 */
export default function AmigosScreen(): JSX.Element {
  const router = useRouter();

  /**
   * Muestra un mensaje de confirmación cuando un amigo es invitado.
   * 
   * @param amigoNombre Nombre del amigo al que se ha invitado.
   */
  const handleInvite = (amigoNombre: string) => {
    Alert.alert("Invitación", `Has invitado a ${amigoNombre}`);
  };

  return (
    <View style={styles.container}>
      {/* Fondo con overlay */}
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {/* Título */}
        <Text style={styles.titulo}>Lista de Amigos</Text>

        {/* Lista de amigos desplazable */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {amigos.map((amigo) => (
            <View key={amigo.id} style={styles.amigoContainer}>
              <Image source={amigo.imagen} style={styles.imagenPerfil} />
              <Text style={styles.nombre}>{amigo.nombre}</Text>

              {/* Botón "Invitar" */}
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={() => handleInvite(amigo.nombre)}
              >
                <Text style={styles.inviteButtonText}>Invitar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Botón para volver atrás */}
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
 * Estilos de la pantalla.
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
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo oscuro semitransparente
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
    paddingBottom: 80, // Espacio para evitar que el último elemento quede oculto
  },

  amigoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15, // Espacio entre amigos
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

  // Botón de "Invitar" (se sitúa a la derecha automáticamente con marginLeft: 'auto')
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
