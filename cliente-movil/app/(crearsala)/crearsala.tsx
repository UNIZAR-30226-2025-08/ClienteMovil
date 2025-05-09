import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import socket from "@/app/(sala)/socket"; // Módulo de conexión con socket.io
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cabecera from "@/components/Cabecera";

/**
 * Definición de los roles disponibles en el juego con sus imágenes y cantidad inicial.
 */
const rolesData = [
  {
    id: 1,
    nombre: "Hombre lobo",
    imagen: require("@/assets/images/hombre-lobo-icon.jpeg"),
    cantidad: 1,
  },
  {
    id: 2,
    nombre: "Bruja",
    imagen: require("@/assets/images/bruja-icon.jpeg"),
    cantidad: 0,
  },
  {
    id: 3,
    nombre: "Vidente",
    imagen: require("@/assets/images/vidente-icon.jpeg"),
    cantidad: 1,
  },
  {
    id: 4,
    nombre: "Aldeano",
    imagen: require("@/assets/images/aldeano-icon.jpeg"),
    cantidad: 3,
  },
  {
    id: 5,
    nombre: "Cazador",
    imagen: require("@/assets/images/cazador-icon.jpeg"),
    cantidad: 0,
  },
];

/**
 * Componente principal para la creación de una sala de juego.
 * Permite configurar el nombre del servidor, la privacidad, la cantidad de jugadores y los roles asignados.
 *
 * @returns {JSX.Element} Pantalla de creación de sala.
 */
const CrearSala = (): JSX.Element => {
  const router = useRouter();

  // Ajustar el tipo de usuario para incluir 'id'
  const [usuario, setUsuario] = useState<{
    nombre: string;
    id?: string;
    avatar: string | null;
  } | null>(null);
  const [nombreServidor, setNombreServidor] = useState("");

  // Estado para la privacidad ("publica" o "Privada")
  const [privacidad, setPrivacidad] = useState("Privada");

  // Estado para el letrero de privacidad ("Pública" o "Privada")
  const [privacidadVisual, setPrivacidadVisual] = useState(" Privada ");

  // Estado para la contraseña (si la sala es privada)
  const [password, setPassword] = useState("");

  // Estado para la cantidad de cada rol en la partida
  const [rolesCantidad, setRolesCantidad] = useState(rolesData);

  // Estados para el popup (mostrar información de un rol)
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<{
    id: number;
    nombre: string;
    imagen: any;
    cantidad: number;
  } | null>(null);

  // Al iniciar el componente, se busca el usuario guardado (simulando la autenticación)
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const nombreGuardado = await AsyncStorage.getItem("nombreUsuario");
        const idGuardado = await AsyncStorage.getItem("idUsuario");
        const avatarUsuario = await AsyncStorage.getItem("avatarUsuario");
        if (nombreGuardado && idGuardado) {
          // Ahora se guarda también el 'id'
          const usuarioObj = {
            nombre: nombreGuardado,
            id: idGuardado,
            avatar: avatarUsuario ?? "avatar1",
          };
          setUsuario(usuarioObj);
          setNombreServidor(`Servidor de "${usuarioObj.nombre}"`);
        } else {
          Alert.alert("Debes iniciar sesión para crear una sala.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error obteniendo el usuario:", error);
      }
    };
    fetchUsuario();
  }, []);

  // Número total de jugadores calculado a partir de los roles
  const numJugadores = useMemo(
    () =>
      rolesCantidad.reduce((acum, rol) => {
        return acum + rol.cantidad;
      }, 0),
    [rolesCantidad]
  );

  // Determina si el botón de "Crear Sala" debe estar deshabilitado (mínimo 5 jugadores)
  const botonCrearDeshabilitado = useMemo(
    () => numJugadores < 1,
    [numJugadores]
  );

  /**
   * Ajusta automáticamente las cantidades de cada rol según el número de jugadores y la privacidad.
   * Para salas públicas se asignan roles especiales fijos y se calcula la cantidad de aldeanos;
   * para salas privadas se aplican otros ajustes según ciertas condiciones.
   */
  const ajustarRoles = () => {
    let jugadores = numJugadores;
    let newRoles = [...rolesCantidad];
    // Ajuste del número de "Hombre lobo"
    let lobos = jugadores >= 12 ? 3 : jugadores >= 8 ? 2 : 1;
    newRoles = newRoles.map((r) =>
      r.nombre === "Hombre lobo" ? { ...r, cantidad: lobos } : r
    );

    if (privacidad === "publica") {
      // Para sala pública, se fijan ciertos roles
      newRoles = newRoles.map((r) => {
        if (r.nombre === "Vidente") return { ...r, cantidad: 1 };
        if (r.nombre === "Bruja")
          return { ...r, cantidad: jugadores >= 8 ? 1 : 0 };
        if (r.nombre === "Cazador")
          return { ...r, cantidad: jugadores >= 12 ? 1 : 0 };
        return r;
      });
      const totalRolesEspeciales = newRoles.reduce(
        (sum, rol) => (rol.nombre !== "Aldeano" ? sum + rol.cantidad : sum),
        0
      );
      newRoles = newRoles.map((r) =>
        r.nombre === "Aldeano"
          ? { ...r, cantidad: jugadores - totalRolesEspeciales }
          : r
      );
    } else {
      // Para sala privada se aplican otros ajustes
      if (jugadores !== 7 && jugadores !== 11) {
        const totalRolesEspeciales = newRoles.reduce(
          (sum, rol) => (rol.nombre !== "Aldeano" ? sum + rol.cantidad : sum),
          0
        );
        newRoles = newRoles.map((r) =>
          r.nombre === "Aldeano"
            ? { ...r, cantidad: jugadores - totalRolesEspeciales }
            : r
        );
      }
      if (jugadores !== 8 && jugadores !== 12) {
        const totalRolesEspeciales = newRoles.reduce(
          (sum, rol) => (rol.nombre !== "Aldeano" ? sum - rol.cantidad : sum),
          0
        );
        newRoles = newRoles.map((r) =>
          r.nombre === "Aldeano"
            ? { ...r, cantidad: jugadores + totalRolesEspeciales }
            : r
        );
      }
    }
    setRolesCantidad(newRoles);
  };

  // Se ejecuta el ajuste de roles cada vez que cambie la privacidad o el número de jugadores
  useEffect(() => {
    ajustarRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privacidad, numJugadores]);

  /**
   * Alterna entre "publica" y "Privada" la privacidad de la sala.
   */
  const cambiarPrivacidad = () => {
    setPrivacidad((prev) => (prev === "publica" ? "Privada" : "publica"));
    setPrivacidadVisual((prev) =>
      prev === " Pública " ? " Privada " : " Pública "
    );
  };

  /**
   * Incrementa el número de jugadores (aumenta la cantidad de "Aldeano") siempre que no se supere el máximo.
   */
  const incrementarJugadores = () => {
    if (numJugadores < 18) {
      setRolesCantidad((prevRoles) =>
        prevRoles.map((r) =>
          r.nombre === "Aldeano" ? { ...r, cantidad: r.cantidad + 1 } : r
        )
      );
    }
  };

  /**
   * Decrementa el número de jugadores (disminuye la cantidad de "Aldeano") siempre que se mantenga el mínimo.
   */
  const decrementarJugadores = () => {
    if (numJugadores > 1) {
      setRolesCantidad((prevRoles) =>
        prevRoles.map((r) =>
          r.nombre === "Aldeano" && r.cantidad > 0
            ? { ...r, cantidad: r.cantidad - 1 }
            : r
        )
      );
    }
  };

  /**
   * Incrementa la cantidad de un rol específico en partidas privadas.
   * Se evitan incrementos para salas públicas, para "Hombre lobo" o si se alcanzó el máximo.
   */
  const incrementarRol = (rol: {
    id: number;
    nombre: string;
    imagen: any;
    cantidad: number;
  }) => {
    if (
      privacidad === "publica" ||
      rol.nombre === "Hombre lobo" ||
      numJugadores >= 18
    )
      return;
    if (
      (rol.nombre === "Bruja" || rol.nombre === "Vidente") &&
      rol.cantidad >= 1
    )
      return;
    if (rol.nombre === "Cazador" && rol.cantidad >= 2) return;
    setRolesCantidad((prevRoles) =>
      prevRoles.map((r) =>
        r.id === rol.id ? { ...r, cantidad: r.cantidad + 1 } : r
      )
    );
  };

  /**
   * Decrementa la cantidad de un rol específico en partidas privadas.
   */
  const decrementarRol = (rol: {
    id: number;
    nombre: string;
    imagen: any;
    cantidad: number;
  }) => {
    if (
      privacidad === "publica" ||
      rol.nombre === "Hombre lobo" ||
      rol.cantidad <= 0
    )
      return;
    setRolesCantidad((prevRoles) =>
      prevRoles.map((r) =>
        r.id === rol.id ? { ...r, cantidad: r.cantidad - 1 } : r
      )
    );
  };

  /**
   * Función para crear la sala utilizando websockets.
   */
  const crearSala = () => {
    const maxRolesEspeciales = rolesCantidad
      .filter((rol) => rol.nombre !== "Aldeano")
      .reduce((sum, rol) => sum + rol.cantidad, 0);

    if (privacidad === "Privada" && !password) {
      Alert.alert(
        "Error en la contraseña",
        "La contraseña no puede ser vacía."
      );
    } else {
      // 1. Construir un objeto con las cantidades de cada rol
      const rolesObject: Record<string, number> = rolesCantidad.reduce(
        (acc, rol) => {
          acc[rol.nombre] = rol.cantidad;
          return acc;
        },
        {} as Record<string, number>
      );

      // 2. Incluir este objeto en el payload que envías al servidor
      const datosSala = {
        nombreSala: nombreServidor,
        tipo: privacidad.toLowerCase(),
        contrasena: privacidad === "Privada" ? password : null,
        maxJugadores: numJugadores,
        maxRolesEspeciales,
        usuario: {
          id: usuario?.id,
          nombre: usuario?.nombre,
          avatar: usuario?.avatar, // Asegúrate de incluirlo
        },
        maxRoles: rolesObject,
      };

      //console.log("Datos de la sala a enviar:", datosSala);

      socket.emit("crearSala", datosSala);
    }
  };

  // Escuchar respuesta del servidor sobre la creación de la sala
  React.useEffect(() => {
    socket.on("salaCreada", (sala) => {
      if (sala && sala.id) {
        AsyncStorage.setItem("salaActual", JSON.stringify(sala));
        router.push({
          pathname: "/(sala)/sala",
          params: {
            idSala: sala.id,
            salaData: JSON.stringify(sala),
          },
        });
      } else {
        Alert.alert(
          "Error",
          "Hubo un error al crear la sala. Por favor, inténtalo nuevamente."
        );
      }
    });

    socket.on("errorSala", (msg) => {
      Alert.alert("Error al crear la sala", msg);
    });

    return () => {
      socket.off("salaCreada");
      socket.off("errorSala");
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/fondo-roles.jpg")}
        style={styles.image}
      >
        <View style={styles.headerContainer}>
          <Cabecera />
        </View>

        {/* Input para el nombre del servidor */}
        <Text style={[styles.label, { marginTop: 90 }]}>
          Nombre del Servidor:
        </Text>
        <TextInput
          style={styles.input}
          value={nombreServidor}
          onChangeText={setNombreServidor}
          placeholder="Servidor de..."
        />

        {/* Número de jugadores */}
        <View style={styles.jugadoresContainer}>
          {/* Texto y número de jugadores juntos */}
          <Text style={styles.label}>Número de jugadores: {numJugadores}</Text>

          {/* Contenedor de los botones - y + */}
          <View style={styles.botonesJugadores}>
            <Button
              title="-"
              onPress={decrementarJugadores}
              disabled={numJugadores <= 1}
            />
            <Button
              title="+"
              onPress={incrementarJugadores}
              disabled={numJugadores >= 18}
            />
          </View>
        </View>

        {/* Selector de privacidad */}
        <View style={styles.privacidadContainer}>
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.privacidadBotones}>
            <Button title="⇦" onPress={cambiarPrivacidad} />
            <Text style={styles.label}>{privacidadVisual}</Text>
            <Button title="⇨" onPress={cambiarPrivacidad} />
          </View>
        </View>

        {/* Input de contraseña si la sala es privada */}
        {privacidad === "Privada" && (
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Introduce una contraseña"
            secureTextEntry
          />
        )}

        {/* Lista de roles asignados */}
        <Text style={styles.label}>Roles asignados:</Text>
        {rolesCantidad.map((rol) => (
          <View key={rol.id} style={styles.rolContainer}>
            <TouchableOpacity
              onPress={() => {
                setRolSeleccionado(rol);
                setMostrarPopup(true);
              }}
            >
              <Image source={rol.imagen} style={styles.rolImagen} />
            </TouchableOpacity>
            <Text style={styles.label}>
              {rol.nombre}: {rol.cantidad}
            </Text>
            <View style={styles.botonContainer}>
              {rol.cantidad > 0 &&
                privacidad !== "publica" &&
                rol.nombre !== "Hombre lobo" && (
                  <Button title="-" onPress={() => decrementarRol(rol)} />
                )}
              <Button title="+" onPress={() => incrementarRol(rol)} />
            </View>
          </View>
        ))}

        {/* Botón para crear la sala */}
        <Button
          title="Crear Sala"
          disabled={botonCrearDeshabilitado}
          onPress={crearSala}
        />

        {/* Modal para mostrar información del rol */}
        <Modal visible={mostrarPopup} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.label}>{rolSeleccionado?.nombre}</Text>
            {rolSeleccionado?.imagen && (
              <Image source={rolSeleccionado.imagen} style={styles.rolImagen} />
            )}
            <Button title="Cerrar" onPress={() => setMostrarPopup(false)} />
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  privacidadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  privacidadBotones: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  botonesJugadores: {
    flexDirection: "row",
    marginLeft: 20, // Espacio entre el texto y los botones
    gap: 8, // Espacio entre los botones - y +
  },
  jugadoresContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  jugadoresSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  numText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  rolContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  rolImagen: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  botonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    gap: 8, // Espacio entre los botones - y +
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

export default CrearSala;
