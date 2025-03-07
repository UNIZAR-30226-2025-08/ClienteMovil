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

const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
// Asegúrate de tener tu imagen de "botón atrás"
const imagenAtras = require("@/assets/images/botonAtras.png");

export default function HistorialPartidasScreen() {
  const router = useRouter();

  // Ejemplo de datos de partidas (puedes reemplazarlos por datos reales)
  const [partidas, setPartidas] = useState([
    { id: 1, fecha: "2025-03-01", resultado: "victoria" },
    { id: 2, fecha: "2025-03-02", resultado: "derrota" },
    { id: 3, fecha: "2025-03-03", resultado: "victoria" },
    { id: 4, fecha: "2025-03-04", resultado: "derrota" },
  ]);

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

        <Text style={styles.titulo}>Historial de Partidas</Text>

        <ScrollView style={styles.scrollContainer}>
          {partidas.map((partida) => (
            <View key={partida.id} style={styles.partidaItem}>
              <Text style={styles.fecha}>Fecha: {partida.fecha}</Text>
              <Text
                style={[
                  styles.resultado,
                  partida.resultado === "victoria"
                    ? styles.victoria
                    : styles.derrota,
                ]}
              >
                {partida.resultado.toUpperCase()}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Botón de ir atrás con la imagen */}
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
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
    color: "#fff",
  },
  scrollContainer: {
    width: "90%",
  },
  partidaItem: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  fecha: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultado: {
    fontSize: 18,
    fontWeight: "bold",
  },
  victoria: {
    color: "green",
  },
  derrota: {
    color: "red",
  },
  // Estilos para el nuevo botón de atrás con imagen
  containerAtras: {
    position: "absolute",
    bottom: 20,
    left: "46%",
  },
  imageAtras: {
    width: 40,
    height: 40,
  },
});
