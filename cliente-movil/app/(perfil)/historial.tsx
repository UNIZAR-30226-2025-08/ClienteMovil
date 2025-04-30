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
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Imágenes utilizadas en la pantalla de historial de partidas.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

export default function HistorialPartidasScreen(): JSX.Element {
  const router = useRouter();

  // Recibimos opcionalmente el ID del usuario a consultar
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();

  const [partidas, setPartidas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState<any>(null);

  // Mapas de normalización
  const estadoMap: Record<string, string> = {
    en_curso: "En curso",
    "en curso": "En curso",
    terminada: "Terminada",
    finalizada: "Terminada",
  };
  const ganadoresMap: Record<string, string> = {
    empate: "Empate",
    lobos: "Lobos",
    aldeanos: "Aldeanos",
  };

  const irAtras = () => router.back();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        // Si vino por parámetro, lo usamos; si no, caemos en AsyncStorage
        let id: number;
        if (usuarioId) {
          id = parseInt(usuarioId, 10);
        } else {
          const idStr = await AsyncStorage.getItem("idUsuario");
          if (!idStr) {
            setError("Usuario no encontrado");
            setLoading(false);
            return;
          }
          id = parseInt(idStr, 10);
        }

        // Petición al backend
        const resp = await axios.get(
          `${Constants.expoConfig?.extra?.backendUrl}/api/juega/usuario/${id}`
        );
        const datos: any[] = resp.data || [];
        console.log("Datos recibidos del backend:", resp.data);

        // Mapear al resultado “Empate”/“Ganada”/“Perdida”
        const partidasMapeadas = datos.map((p) => {
          let resultado: string;
          if (p.ganadores === "empate") {
            resultado = "Empate";
          } else if (
            (p.rolJugado === "lobo" && p.ganadores === "lobos") ||
            (p.rolJugado !== "lobo" && p.ganadores === "aldeanos")
          ) {
            resultado = "Ganada";
          } else {
            resultado = "Perdida";
          }
          return { ...p, resultado };
        });

        setPartidas(partidasMapeadas);
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setError("No se pudo cargar el historial de partidas.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [usuarioId]);

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

        <Modal
          visible={!!partidaSeleccionada}
          transparent
          animationType="fade"
          onRequestClose={() => setPartidaSeleccionada(null)}
        >
          {partidaSeleccionada && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Detalles de la Partida</Text>

                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Fecha completa: </Text>
                  {new Date(partidaSeleccionada.fecha).toLocaleString()}
                </Text>

                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Modo: </Text>
                  {partidaSeleccionada.tipo.charAt(0).toUpperCase() +
                    partidaSeleccionada.tipo.slice(1)}
                </Text>

                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Estado: </Text>
                  {estadoMap[partidaSeleccionada.estado?.toLowerCase() || ""] ??
                    partidaSeleccionada.estado}
                </Text>

                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Ganadores: </Text>
                  {ganadoresMap[
                    partidaSeleccionada.ganadores?.toLowerCase() || ""
                  ] ?? "Sin determinar"}
                </Text>

                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Resultado: </Text>
                  {partidaSeleccionada.resultado}
                </Text>

                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Rol Jugado: </Text>
                  {partidaSeleccionada.rolJugado.charAt(0).toUpperCase() +
                    partidaSeleccionada.rolJugado.slice(1)}
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPartidaSeleccionada(null)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Modal>

        <View style={styles.tableHeader}>
          <Text style={styles.headerCellFecha}>Fecha</Text>
          <Text style={styles.headerCellModo}>Modo</Text>
          <Text style={styles.headerCellResultado}>Resultado</Text>
        </View>

        {!loading && !error && (
          <ScrollView style={styles.scrollContainer}>
            {partidas.map((p) => (
              <TouchableOpacity
                key={p.idPartida || p.id}
                onPress={() => setPartidaSeleccionada(p)}
              >
                <View style={styles.tableRow}>
                  <Text style={styles.cellFecha}>
                    {new Date(p.fecha).toLocaleDateString()}
                  </Text>
                  <Text style={styles.cellModo}>
                    {p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1)}
                  </Text>
                  <Text
                    style={[
                      styles.cellResultado,
                      p.resultado === "Ganada"
                        ? styles.victoria
                        : p.resultado === "Perdida"
                        ? styles.derrota
                        : {},
                    ]}
                  >
                    {p.resultado.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    color: "#fff",
  },

  tableHeader: {
    flexDirection: "row",
    width: "90%", // incrementa ancho para dar más espacio
    alignSelf: "center", // centra el header
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 16,
  },
  headerCellFecha: { flex: 2, fontWeight: "bold", fontSize: 16, color: "#fff" },
  headerCellModo: {
    flex: 2.5, // reduce un poco para dar sitio al resultado
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  headerCellResultado: {
    flex: 1.5, // aumenta espacio para que no se corte
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "right",
  },

  scrollContainer: {
    width: "92%", // igualar al header
    alignSelf: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  cellFecha: { flex: 2, fontSize: 14, color: "#333" },
  cellModo: { flex: 2.5, fontSize: 14, color: "#333", textAlign: "center" },
  cellResultado: {
    flex: 1.5, // coincide con headerCellResultado
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },

  victoria: { color: "green" },
  derrota: { color: "red" },

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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalLabel: { fontWeight: "bold" },
  modalText: { fontSize: 16, marginVertical: 4 },
  closeButton: { marginTop: 16, alignSelf: "flex-end" },
  closeButtonText: { color: "#007bff", fontSize: 16 },

  containerAtras: { position: "absolute", bottom: 20, left: "46%" },
  imageAtras: { width: 40, height: 40 },
});
