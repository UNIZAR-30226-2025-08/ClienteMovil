import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

/**
 * Tipo de datos para representar un jugador dentro de la sala.
 */
type Player = {
  id: string;
  name: string;
  level: number;
  isReady: boolean;
  isOwner?: boolean; // Indica si es el dueño de la sala
};

/**
 * Pantalla de sala previa a la partida.
 * 
 * Permite a los jugadores unirse, marcarse como listos y al anfitrión iniciar la partida.
 * 
 * @returns {JSX.Element} Pantalla de la sala previa al juego.
 */
export default function SalaPreviaScreen(): JSX.Element {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  /**
   * Estado con la información de los jugadores en la sala.
   */
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Jugador1", level: 106, isReady: true, isOwner: true },
    { id: "2", name: "Jugador2", level: 106, isReady: true },
    { id: "3", name: "Jugador3", level: 106, isReady: false },
    // Puedes añadir más o dejar placeholders
  ]);

  /**
   * Alterna el estado de "Listo" de un jugador.
   * 
   * @param playerId ID del jugador a modificar.
   */
  const toggleReady = (playerId: string) => {
    setPlayers((prevState) =>
      prevState.map((p) =>
        p.id === playerId ? { ...p, isReady: !p.isReady } : p
      )
    );
  };

  /**
   * Verifica si todos los jugadores en la sala están listos.
   */
  const allReady = players.every((player) => player.isReady);

  /**
   * Maneja el botón "Iniciar Partida".
   * Solo permite avanzar si todos los jugadores están listos.
   */
  const handleIniciarPartida = () => {
    if (allReady) {
      router.push("/(jugando)/jugando"); // Cambia a la pantalla de juego
    } else {
      Alert.alert(
        "Faltan jugadores por estar listos",
        "No puedes iniciar la partida hasta que todos estén listos."
      );
    }
  };

  /**
   * Función para manejar el botón "Volver" y regresar a la pantalla anterior.
   */
  const handleVolver = () => {
    router.back(); // Regresa a la pantalla anterior
  };

  /**
   * Función para manejar la invitación de amigos a la sala.
   */
  const handleInvitarAmigos = () => {
    router.push("/(sala)/invitaramigos");
  };

  /**
   * Renderiza cada tarjeta de jugador.
   */
  const renderPlayerItem = ({ item }: { item: Player }) => {
    return (
      <View style={styles.playerCard}>
        {item.isOwner && <Text style={styles.ownerCrown}>👑</Text>}
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerLevel}>Level {item.level}</Text>

        {/* Estado Listo / No Listo */}
        <TouchableOpacity
          style={[
            styles.readyButton,
            item.isReady ? styles.ready : styles.notReady,
          ]}
          onPress={() => toggleReady(item.id)}
        >
          <Text style={styles.readyButtonText}>
            {item.isReady ? "¡Listo!" : "No Listo"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Crea espacios vacíos para representar los slots disponibles en la sala.
   */
  const totalSlots = 8;
  const emptySlotsCount = totalSlots - players.length;
  const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => ({
    id: `empty-${i}`,
    name: "Vacío",
    level: 0,
    isReady: false,
  }));

  return (
    <View style={styles.container}>
      {/* Encabezado (Nombre De La Sala) */}
      <View style={styles.headerContainer}>
        <Text style={styles.roomName}>Nombre De La Sala</Text>
      </View>

      {/* Info de la cuenta */}
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>NombreCuenta</Text>
        <Text>Nivel 10</Text>
        <Text>2000S</Text>
      </View>

      {/* Lista de jugadores + slots vacíos */}
      <View style={styles.playersContainer}>
        <FlatList
          data={[...players, ...emptySlots]}
          keyExtractor={(item) => item.id}
          numColumns={4} // 4 columnas (como en tu diseño)
          renderItem={renderPlayerItem}
          columnWrapperStyle={{ justifyContent: "center" }}
        />
      </View>

      {/* Zona de botones inferiores */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.buttonBack} onPress={handleVolver}>
          <Text style={styles.backText}>VOLVER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonInvite}
          onPress={handleInvitarAmigos}
        >
          <Text style={styles.inviteText}>INVITAR AMIGOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonStart,
            { backgroundColor: allReady ? "#008000" : "#555" }, // Se colorea verde si todos están listos
          ]}
          onPress={handleIniciarPartida}
          disabled={!allReady}
        >
          <Text style={styles.startText}>INICIAR PARTIDA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },

  headerContainer: {
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: "#333",
  },

  roomName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },

  accountInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#444",
  },

  accountName: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,
  },

  playersContainer: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
  },

  playerCard: {
    width: 80,
    height: 120,
    margin: 8,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  ownerCrown: {
    position: "absolute",
    top: 5,
    right: 5,
    fontSize: 20,
  },

  playerName: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },

  playerLevel: {
    color: "#ccc",
    fontSize: 12,
    marginBottom: 5,
  },

  readyButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
  },

  ready: {
    backgroundColor: "green",
  },

  notReady: {
    backgroundColor: "red",
  },

  readyButtonText: {
    color: "#fff",
    fontSize: 12,
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#333",
  },

  buttonBack: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },

  backText: {
    color: "#fff",
    fontWeight: "bold",
  },

  buttonInvite: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },

  inviteText: {
    color: "#fff",
    fontWeight: "bold",
  },

  buttonStart: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  
  startText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
