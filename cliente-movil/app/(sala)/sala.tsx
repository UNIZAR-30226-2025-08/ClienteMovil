import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import socket from "@/app/(sala)/socket"; // Módulo de conexión
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Define el tipo para el estado del usuario
type UsuarioData = {
  id: string;
  nombre: string;
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

  // Obtén el idSala pasado como parámetro al navegar
  const { idSala, salaData } = useLocalSearchParams<{
    idSala: string;
    salaData: string;
  }>();
  const salaInfo = salaData ? JSON.parse(salaData) : null;

  const [players, setPlayers] = useState<Player[]>([]);
  // Nuevo estado para el nombre de la sala
  const [roomName, setRoomName] = useState(
    salaInfo && salaInfo.nombre && salaInfo.nombre.trim() !== ""
      ? salaInfo.nombre
      : "Sala sin nombre"
  );

  const [usuarioData, setUsuarioData] = useState<UsuarioData | null>(null);

  useEffect(() => {
    if (salaData) {
      const sala = JSON.parse(salaData);
      setPlayers(
        sala.jugadores.map((j: any) => ({
          id: j.id,
          name: j.nombre || j.id,
          level: 106,
          isReady: j.listo || false,
          isOwner: sala.lider === j.id,
        }))
      );
    }
    // Suscribirte a "actualizarSala" para cambios futuros...
    socket.on("actualizarSala", (sala) => {
      console.log("Evento actualizarSala recibido:", sala);
      setPlayers(
        sala.jugadores.map((j: any) => ({
          id: j.id,
          name: j.nombre || j.id,
          level: 106,
          isReady: j.listo || false,
          isOwner: sala.lider === j.id,
        }))
      );
      // Actualiza dinámicamente el nombre de la sala
      setRoomName(
        sala.nombre && sala.nombre.trim() !== ""
          ? sala.nombre
          : "Sala sin nombre"
      );
    });

    return () => {
      socket.off("actualizarSala");
    };
  }, []);

  // Efecto para recuperar el usuario desde AsyncStorage
  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      const nombreUsuario = await AsyncStorage.getItem("nombreUsuario");
      const idUsuario = await AsyncStorage.getItem("idUsuario");
      if (nombreUsuario && idUsuario) {
        setUsuarioData({ id: idUsuario, nombre: nombreUsuario });
      }
    };
    obtenerDatosUsuario();
  }, []);

  useEffect(() => {
    // Cuando un jugador se une a la sala
    socket.on("jugadorUnido", (data) => {
      console.log("Jugador unido:", data);
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        {
          id: data.id,
          name: data.nombre || data.id,
          level: 106, // Ajusta el nivel si corresponde
          isReady: false,
          isOwner: false,
        },
      ]);
    });

    // Cuando un jugador sale de la sala
    socket.on("jugadorSalido", (data) => {
      console.log("Jugador salió:", data);
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== data.id)
      );
    });

    // Cuando se cambia el estado (listo / no listo) de un jugador
    socket.on("estadoCambiado", ({ idUsuario, estado }) => {
      console.log("Estado cambiado:", idUsuario, estado);
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === idUsuario ? { ...player, isReady: estado } : player
        )
      );
    });

    // Cuando se expulsa a un jugador de la sala
    socket.on("expulsadoDeSala", ({ idExpulsado }) => {
      console.log("Expulsado de la sala:", idExpulsado);
      if (usuarioData && usuarioData.id === idExpulsado) {
        Alert.alert("Expulsado", "Has sido expulsado de la sala.");
        router.back();
      } else {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.id !== idExpulsado)
        );
      }
    });

    // Cuando la partida se inicia
    socket.on("enPartida", (data) => {
      console.log("Partida iniciada:", data);
      Alert.alert(
        "Inicio de Partida",
        data.mensaje || "La partida ha iniciado."
      );
      router.push("/(jugando)/jugando");
    });

    // Limpieza: removemos los listeners al desmontar el componente
    return () => {
      socket.off("jugadorUnido");
      socket.off("jugadorSalido");
      socket.off("estadoCambiado");
      socket.off("expulsadoDeSala");
      socket.off("enPartida");
    };
  }, [usuarioData]);

  /**
   * Alterna el estado de "Listo" de un jugador.
   *
   * @param playerName Nombre del jugador a modificar.
   */
  const toggleReady = (playerName: string) => {
    // Compara por nombre en lugar de comparar por ID
    if (!usuarioData || playerName !== usuarioData.nombre) {
      Alert.alert("No autorizado", "Solo puedes cambiar tu propio estado.");
      return;
    }

    const jugador = players.find((p) => p.name === playerName);
    if (jugador) {
      socket.emit("marcarEstado", {
        idSala,
        idUsuario: jugador.id, // el ID real del socket
        estado: !jugador.isReady,
      });
    }
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
          onPress={() => toggleReady(item.name)}
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
  const totalSlots = salaInfo?.maxJugadores || 8; // Si no hay data, se queda en 8 por defecto
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
        <Text style={styles.roomName}>{roomName}</Text>
      </View>

      {/* Info de la cuenta */}
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>
          {salaInfo && salaInfo.jugadores
            ? salaInfo.jugadores.find((jug: any) => jug.id === salaInfo.lider)
                ?.nombre
            : "Noom"}
        </Text>
        <Text style={styles.accountName}>Nivel 10</Text>
        <Text style={styles.accountName}>2000S</Text>
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
            { backgroundColor: allReady ? "#008000" : "#555" },
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
