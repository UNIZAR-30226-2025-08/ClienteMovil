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

/**
 * Pantalla de notificaciones.
 * 
 * Permite a los usuarios ver notificaciones de invitaciones a partidas y solicitudes de amistad.
 * Se pueden aceptar o denegar las notificaciones.
 * 
 * @returns {JSX.Element} Pantalla de notificaciones.
 */
export default function NotificacionesScreen(): JSX.Element {
  /**
   * Hook de navegación para manejar redirecciones dentro de la aplicación.
   */
  const router = useRouter();

  /**
   * Estado que almacena la lista de notificaciones.
   * 
   * Cada notificación tiene:
   * - `id`: Identificador único.
   * - `tipo`: Tipo de notificación (ej. invitación a partida, solicitud de amistad).
   * - `autor`: Nombre del usuario que genera la notificación.
   * - `fecha`: Fecha en que se generó la notificación.
   * - `mensaje`: Texto descriptivo de la notificación.
   */
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

  /**
   * Maneja la acción de aceptar una notificación.
   * 
   * @param {number} id - ID de la notificación que se acepta.
   */
  const handleAceptar = (id: number) => {
    // Aquí podrías llamar a un backend, etc.
    // Por ahora, simplemente eliminamos la notificación de la lista:
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
  };

  /**
   * Maneja la acción de denegar una notificación.
   * 
   * @param {number} id - ID de la notificación que se deniega.
   */
  const handleDenegar = (id: number) => {
    // Igual que en aceptar, simplemente eliminamos la notificación:
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
  };

  /**
   * Navega a la pantalla anterior.
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
