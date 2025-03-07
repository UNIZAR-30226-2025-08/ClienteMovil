import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

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
      <TouchableOpacity style={styles.botonAtras} onPress={irAtras}>
        <Text style={styles.textoBotonAtras}>ATRÁS</Text>
      </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  botonAtras: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  textoBotonAtras: {
    fontWeight: "bold",
    color: "#000",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
});
