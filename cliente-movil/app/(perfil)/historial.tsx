import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  ActivityIndicator,
  Modal, // ← asegúrate de importar Modal
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Imágenes utilizadas en la pantalla de historial de partidas.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Pantalla que muestra el historial de partidas del usuario.
 * Permite visualizar las partidas jugadas con sus resultados.
 *
 * @returns {JSX.Element} Pantalla de historial de partidas.
 */
export default function HistorialPartidasScreen(): JSX.Element {
  const router = useRouter();
  const [partidas, setPartidas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState<any>(null);

  /**
   * Función para regresar a la pantalla anterior.
   */
  const irAtras = () => router.back();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const idStr = await AsyncStorage.getItem("idUsuario");
        if (!idStr) {
          setError("Usuario no encontrado");
          return;
        }
        const idUsuario = parseInt(idStr, 10);
        const resp = await axios.get(
          `${Constants.expoConfig?.extra?.backendUrl}/api/juega/usuario/${idUsuario}`
        );
        const datos: any[] = resp.data || [];
        const resultadoMap = datos.map((p) => {
          let resultado: string;
          if (p.ganadores === "empate") {
            resultado = "Empate";
          } else if (
            (p.rolJugado === "lobo" && p.ganadores === "lobos") ||
            (p.rolJugado !== "lobo" && p.ganadores === "aldeanos")
          ) {
            resultado = "Victoria";
          } else {
            resultado = "Derrota";
          }
          return { ...p, resultado };
        });
        setPartidas(resultadoMap);
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setError("No se pudo cargar el historial");
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        <Text style={styles.titulo}>Historial de Partidas</Text>

        {loading && <ActivityIndicator size="large" color="#fff" />}
        {!loading && error && (
          <Text style={[styles.titulo, { color: "red", marginTop: 20 }]}>
            {error}
          </Text>
        )}

        {/* Modal de detalles de la partida */}
        <Modal
          visible={!!partidaSeleccionada}
          transparent
          animationType="fade"
          onRequestClose={() => setPartidaSeleccionada(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles de la Partida</Text>

              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Fecha completa: </Text>
                {new Date(partidaSeleccionada?.fecha).toLocaleString()}
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Modo: </Text>
                {partidaSeleccionada?.tipo.charAt(0).toUpperCase() +
                  partidaSeleccionada?.tipo.slice(1)}
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Estado: </Text>
                {partidaSeleccionada?.estado === "en_curso"
                  ? "En curso"
                  : "Terminada"}
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Ganadores: </Text>
                {partidaSeleccionada?.ganadores
                  ? partidaSeleccionada?.ganadores.charAt(0).toUpperCase() +
                    partidaSeleccionada?.ganadores.slice(1)
                  : "Sin determinar"}
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Rol Jugado: </Text>
                {partidaSeleccionada?.rolJugado.charAt(0).toUpperCase() +
                  partidaSeleccionada?.rolJugado.slice(1)}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPartidaSeleccionada(null)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Lista de partidas */}
        {!loading && !error && (
          <ScrollView style={styles.scrollContainer}>
            {partidas.map((partida) => (
              <TouchableOpacity
                key={partida.idPartida || partida.id}
                onPress={() => setPartidaSeleccionada(partida)}
              >
                <View style={styles.partidaItem}>
                  <Text style={styles.fecha}>
                    {new Date(partida.fecha).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.resultado,
                      partida.resultado === "Victoria"
                        ? styles.victoria
                        : partida.resultado === "Derrota"
                        ? styles.derrota
                        : {},
                    ]}
                  >
                    {partida.resultado.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Botón atrás */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos de la pantalla de historial de partidas.
 */
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalLabel: {
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 4,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
});
