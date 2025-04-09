import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  BackHandler,
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
  avatar: string;
  isReady: boolean;
  isOwner?: boolean; // Indica si es el dueño de la sala
};

// Define el tipo para el estado del usuario
type UsuarioData = {
  id: string;
  nombre: string;
  avatar?: string;
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

  const [rolUsuario, setRolUsuario] = useState<string | null>(null);

  // Obtén el idSala pasado como parámetro al navegar
  const { idSala, salaData } = useLocalSearchParams<{
    idSala: string;
    salaData: string;
  }>();

  // Parsea la data de la sala y obtiene el maximo de jugadores (por defecto 8)
  const salaInfo = salaData ? JSON.parse(salaData) : {};
  const totalSlots = salaInfo?.maxJugadores || 8;

  console.log("Información de la sala:", salaInfo);

  const [players, setPlayers] = useState<Player[]>([]);
  // Nuevo estado para el nombre de la sala
  const [roomName, setRoomName] = useState(
    salaInfo && salaInfo.nombre && salaInfo.nombre.trim() !== ""
      ? salaInfo.nombre
      : "Sala sin nombre"
  );

  const [usuarioData, setUsuarioData] = useState<UsuarioData | null>(null);
  const [partidaPendiente, setPartidaPendiente] = useState<any>(null);

  useEffect(() => {
    const handleBackPress = () => {
      if (!usuarioData) {
        Alert.alert(
          "Error",
          "Se ha producido un error al acceder a tu usuario."
        );
        return true; // Bloquea la acción de retroceso
      }

      Alert.alert("Salir de la sala", "¿Estás seguro de que quieres salir?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          onPress: () => {
            socket.emit("salirSala", {
              idSala,
              idUsuario: usuarioData.id, // El ID real del usuario
            });

            router.back(); // Regresa a la pantalla anterior
          },
        },
      ]);

      return true; // Bloquea la acción por defecto (para que espere la confirmación)
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [usuarioData, idSala, socket]);

  useEffect(() => {
    if (salaData) {
      const sala = JSON.parse(salaData);
      setPlayers(
        sala.jugadores.map((j: any) => ({
          id: j.id,
          name: j.nombre || j.id,
          avatar: j.avatar,
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
          avatar: j.avatar,
          isReady: j.listo || false,
          isOwner: String(j.id) === String(sala.lider), // Asegura comparación correcta
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
      const avatarUsuario = await AsyncStorage.getItem("avatarUsuario");
      console.log("Valor real en AsyncStorage: ", avatarUsuario);
      if (nombreUsuario && idUsuario) {
        setUsuarioData({
          id: idUsuario,
          nombre: nombreUsuario,
          avatar: avatarUsuario ?? "avatar1",
        });
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
          avatar: data.avatar,
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

    // Escuchar evento de asignación de rol
    socket.on("rolAsignado", (data) => {
      console.log("📥 Rol recibido:", data.rol);
      setRolUsuario(data.rol);
    });

    // Escuchar evento de inicio de partida
    socket.on("enPartida", (data) => {
      console.log("Partida iniciada:", data);
      Alert.alert(
        "Inicio de Partida",
        data.mensaje || "La partida ha iniciado."
      );
      setPartidaPendiente(data); // Guarda los datos de la partida hasta que el rol esté disponible
    });

    // Cuando se produce un error
    socket.on("error", (data) => {
      console.log("Error recibido del servidor:", data);

      Alert.alert(
        "Error",
        data ||
          "Ha ocurrido un error en el servidor. Inténtalo de nuevo más tarde."
      );
    });

    // Limpieza: removemos los listeners al desmontar el componente
    return () => {
      socket.off("jugadorUnido");
      socket.off("jugadorSalido");
      socket.off("estadoCambiado");
      socket.off("expulsadoDeSala");
      socket.off("rolAsignado");
      socket.off("enPartida");
    };
  }, [usuarioData]);

  // Cuando `rolUsuario` cambia, verificamos si hay una partida pendiente
  useEffect(() => {
    if (rolUsuario && partidaPendiente) {
      console.log("Rol confirmado:", rolUsuario);
      console.log("Partida en curso:", partidaPendiente);

      if (!usuarioData) {
        Alert.alert(
          "Error",
          "Se ha producido un error al acceder a tu usuario."
        );
        return;
      }

      console.log("Futura partida:", partidaPendiente.partidaID);

      router.push({
        pathname: "/(jugando)/jugando",
        params: {
          idSala: partidaPendiente.partidaID,
          salaData: JSON.stringify(partidaPendiente.sala),
          rol: rolUsuario,
          usuarioID: usuarioData.id,
          usuarioNombre: usuarioData.nombre,
        },
      });

      setPartidaPendiente(null); // Limpia la partida pendiente
    }
  }, [rolUsuario, partidaPendiente]);

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
   * Verifica si la cantidad de jugadores es igual al número máximo de jugadores.
   */
  const playersComplete = players.length === totalSlots;

  /**
   * Maneja el botón "Iniciar Partida".
   * Solo permite avanzar si todos los jugadores están listos y la sala está completa.
   */
  const handleIniciarPartida = () => {
    if (!usuarioData) {
      Alert.alert("Error", "No se pudo obtener la información del usuario.");
      return;
    }

    const getLiderId = (): string | null => {
      const lider = players.find((player) => player.isOwner);
      return lider ? lider.id : null;
    };
    const esLider = usuarioData ? usuarioData.id === getLiderId() : false;

    const usuarioId = usuarioData.id.trim(); // Asegurar que no haya espacios
    const liderId = players.find((p) => p.isOwner)?.id?.trim();

    console.log(
      "Usuario ID:",
      usuarioData?.id,
      "Tipo:",
      typeof usuarioData?.id,
      "Lider ID:",
      liderId
    );

    if (!esLider) {
      Alert.alert(
        "No eres el líder",
        "Solo el líder puede iniciar la partida."
      );
      return;
    }

    // Verificar que la cantidad de jugadores sea la correcta y que todos estén listos
    console.log(
      "Estado de los jugadores:",
      players.map((player) => `${player.name}: ${player.isReady}`)
    );
    console.log("¿Todos listos?", allReady);
    console.log("¿Sala completa?", playersComplete);

    if (!playersComplete) {
      Alert.alert(
        "Esperando jugadores",
        "No puedes iniciar la partida hasta que se hayan unido todos los jugadores."
      );
      return;
    }

    if (!allReady) {
      Alert.alert(
        "Faltan jugadores por estar listos",
        "No puedes iniciar la partida hasta que todos estén listos."
      );
      return;
    }

    // Emitir evento de inicio de partida al servidor
    socket.emit("iniciarPartida", {
      idSala,
      idLider: usuarioData.id,
    });
  };

  /**
   * Función para manejar el botón "Volver" y regresar a la pantalla anterior.
   */
  const handleVolver = () => {
    if (!usuarioData) {
      Alert.alert("Error", "No se pudo obtener la información del usuario.");
      return;
    }
    socket.emit("salirSala", {
      idSala,
      idUsuario: usuarioData.id, // el ID real del socket
    });
    router.back(); // Regresa a la pantalla anterior
  };

  /**
   * Función para manejar la invitación de amigos a la sala.
   */
  const handleInvitarAmigos = () => {
    if (!salaInfo?.codigoInvitacion) {
      Alert.alert("Error", "No se pudo obtener el código de invitación.");
      return;
    }
    router.push({
      pathname: "/(sala)/invitaramigos",
      params: {
        idSala: idSala,
      },
    });
  };

  /**
   * Renderiza cada tarjeta de jugador.
   */
  const renderPlayerItem = ({ item }: { item: Player }) => {
    const esLider = usuarioData?.id === players.find((p) => p.isOwner)?.id;
    const soyYo = item.id === usuarioData?.id;

    return (
      <View style={styles.playerCard}>
        {item.isOwner && <Text style={styles.ownerCrown}>👑</Text>}
        <Text style={styles.playerName}>{item.name}</Text>

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

        {/* Botón de expulsar visible solo para el líder y no para sí mismo */}
        {esLider && !soyYo && (
          <TouchableOpacity
            style={styles.botonExpulsar}
            onPress={() => {
              Alert.alert(
                "¿Expulsar jugador?",
                `¿Estás seguro de que quieres expulsar a ${item.name}?`,
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Expulsar",
                    onPress: () => {
                      socket.emit("expulsarJugador", {
                        idSala,
                        idLider: usuarioData?.id,
                        idExpulsado: item.id,
                      });
                    },
                    style: "destructive",
                  },
                ]
              );
            }}
          >
            <Text style={styles.textoBotonExpulsar}>Expulsar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /**
   * Crea espacios vacíos para representar los slots disponibles en la sala.
   */
  const emptySlotsCount = totalSlots - players.length;
  const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => ({
    id: `empty-${i}`,
    name: "Vacío",
    avatar: "avatar1",
    isReady: false,
  }));

  return (
    <View style={styles.container}>
      {/* Encabezado (Nombre De La Sala) */}
      <View style={styles.headerContainer}>
        <Text style={styles.roomName}>{roomName}</Text>
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

        {/* Deshabilita el botón si no están todos listos o no está completa la sala */}
        <TouchableOpacity
          style={[
            styles.buttonStart,
            {
              backgroundColor: allReady && playersComplete ? "#008000" : "#555",
            },
          ]}
          onPress={handleIniciarPartida}
          disabled={!allReady || !playersComplete}
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

  botonExpulsar: {
    marginTop: 6,
    backgroundColor: "#800000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  textoBotonExpulsar: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
