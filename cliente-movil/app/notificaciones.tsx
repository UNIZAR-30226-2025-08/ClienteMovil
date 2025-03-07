import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

// Reemplaza con la ruta de tu imagen de fondo
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
// Reemplaza con la ruta de tu botón de atrás
const imagenAtras = require("@/assets/images/botonAtras.png");

export default function NotificacionesScreen() {
  const router = useRouter();

  // Lista de notificaciones en estado local.
  // Cada notificación tiene la estructura que necesites.
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      tipo: "invitacion-partida",
      autor: "Adrián Artigas",
      fecha: "2025-03-06",
      mensaje: "te ha invitado a una partida",
    },
    {
      id: 2,
      tipo: "solicitud-amistad",
      autor: "María García",
      fecha: "2025-03-07",
      mensaje: "quiere ser tu amigo",
    },
    {
      id: 3,
      tipo: "invitacion-partida",
      autor: "Juan Pérez",
      fecha: "2025-03-07",
      mensaje: "quiere ser tu amigo",
    },
    // Agrega las notificaciones que quieras...
  ]);

  // Función para manejar la aceptación
  const handleAceptar = (id: number) => {
    // Aquí podrías llamar a un backend, etc.
    // Por ahora, simplemente eliminamos la notificación de la lista:
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Función para manejar la denegación
  const handleDenegar = (id: number) => {
    // Igual que en aceptar, simplemente eliminamos la notificación:
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Navegar hacia atrás
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

        {/* Título */}
        <Text style={styles.titulo}>Notificaciones</Text>

        {/* Lista de notificaciones */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {notificaciones.map((notif) => (
            <View key={notif.id} style={styles.notificacionContainer}>
              <Text style={styles.textoNotificacion}>
                <Text style={styles.autor}>{notif.autor}</Text> {notif.mensaje}
              </Text>

              {/* Botones de aceptar o denegar */}
              <View style={styles.botonesContainer}>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => handleAceptar(notif.id)}
                >
                  <Text style={styles.botonTexto}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.boton, styles.botonDenegar]}
                  onPress={() => handleDenegar(notif.id)}
                >
                  <Text style={styles.botonTexto}>Denegar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Si no hay notificaciones, puedes mostrar un texto */}
          {notificaciones.length === 0 && (
            <Text style={styles.sinNotificaciones}>
              No tienes notificaciones pendientes
            </Text>
          )}
        </ScrollView>

        {/* Botón para volver atrás */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1 },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    marginTop: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 60,
  },

  notificacionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  textoNotificacion: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },

  autor: {
    fontWeight: "bold",
    color: "#000",
  },

  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  boton: {
    backgroundColor: "#008f39",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
  },

  botonDenegar: {
    backgroundColor: "red",
  },

  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  sinNotificaciones: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },

  // Botón de volver atrás con imagen
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
