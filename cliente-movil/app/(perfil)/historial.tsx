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
 *
 * @remarks
 * Estas imágenes se usan como fondo y para el botón de "Atras" en la pantalla.
 */
const imagenFondoRoles = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Pantalla de historial de partidas del usuario.
 *
 * Permite al usuario ver su historial de partidas, con detalles como la fecha,
 * el modo de juego y el resultado. También permite ver más detalles de cada partida.
 *
 * @returns {JSX.Element} Componente que representa la pantalla de historial de partidas.
 */
export default function HistorialPartidasScreen(): JSX.Element {
  const router = useRouter();

  /*
   * Recibimos opcionalmente el ID del usuario a consultar
   */
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();

  /*
   * Estado para almacenar las partidas obtenidas del backend
   */
  const [partidas, setPartidas] = useState<any[]>([]);

  /*
   * Estado de carga
   */
  const [loading, setLoading] = useState<boolean>(true);

  /*
   * Estado para almacenar errores
   */
  const [error, setError] = useState<string | null>(null);

  /*
   * Estado para la partida seleccionada (para mostrar detalles en modal)
   */
  const [partidaSeleccionada, setPartidaSeleccionada] = useState<any>(null);

  /**
   * Mapas de normalización de estado de las partidas.
   *
   * @type {Record<string, string>}
   */
  const estadoMap: Record<string, string> = {
    en_curso: "En curso",
    "en curso": "En curso",
    terminada: "Terminada",
    finalizada: "Terminada",
  };

  /**
   * Mapa de los ganadores de la partida.
   *
   * @type {Record<string, string>}
   */
  const ganadoresMap: Record<string, string> = {
    empate: "Empate",
    lobos: "Lobos",
    aldeanos: "Aldeanos",
  };

  /**
   * Función para navegar hacia la pantalla anterior.
   */
  const irAtras = () => router.back();

  /**
   * Efecto para cargar el historial de partidas desde el backend.
   * Si se recibe el `usuarioId` como parámetro, se usa ese; si no, se obtiene de `AsyncStorage`.
   * Al finalizar, actualiza el estado con el historial de partidas.
   *
   * @remarks
   * Este efecto se ejecuta una sola vez cuando la pantalla se monta.
   */
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

  /**
   * Estilos de la pantalla de historial de partidas.
   *
   * @remarks
   * Los estilos están diseñados para proporcionar una buena experiencia visual y asegurar que la información
   * se muestra de manera ordenada, tanto en pantallas de dispositivos pequeños como grandes.
   */
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
    width: "90%",
    alignSelf: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 16,
  },

  headerCellFecha: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },

  headerCellModo: {
    flex: 2.5,
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },

  headerCellResultado: {
    flex: 1.5,
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "right",
  },

  scrollContainer: {
    width: "92%",
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

  cellFecha: {
    flex: 2,
    fontSize: 14,
    color: "#333",
  },

  cellModo: {
    flex: 2.5,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },

  cellResultado: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },

  victoria: {
    color: "green",
  },

  derrota: {
    color: "red",
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
