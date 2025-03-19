import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import socket from "@/app/(sala)/socket"; // Importa el módulo de conexión
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Definición de los roles disponibles en el juego con sus imágenes y cantidad inicial.
 */
const rolesData = [
  {
    id: 1,
    nombre: "Hombre Lobo",
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
    cantidad: 0,
  },
  {
    id: 4,
    nombre: "Aldeano",
    imagen: require("@/assets/images/aldeano-icon.jpeg"),
    cantidad: 4,
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
 * Permite configurar el nombre del servidor, la privacidad y la cantidad de roles.
 *
 * @returns {JSX.Element} Pantalla de creación de sala.
 */
const CrearSala = (): JSX.Element => {
  const router = useRouter();

  // Estado para el nombre del servidor
  const [nombreServidor, setNombreServidor] = useState(
    'Servidor de "nombreJugador"'
  );

  // Estado para la privacidad (Privada/Pública)
  const [privacidad, setPrivacidad] = useState("Privada");

  // Estado para la contraseña de la sala (si es privada)
  const [password, setPassword] = useState("");

  // Estado para la cantidad de cada rol en la partida
  const [rolesCantidad, setRolesCantidad] = useState(rolesData);

  // Estado para controlar la visibilidad del popup de información del rol
  const [mostrarPopup, setMostrarPopup] = useState(false);

  // Estado para el rol seleccionado en el popup
  const [rolSeleccionado, setRolSeleccionado] = useState<
    (typeof rolesData)[0] | null
  >(null);

  // Función para crear la sala
  const crearSala = async () => {
    // Obtener el nombre del usuario real
    const nombreUsuario = await AsyncStorage.getItem("nombreUsuario");
    const usuarioData = {
      nombre: nombreUsuario || "Usuario",
    };

    const datosSala = {
      nombreSala: nombreServidor,
      tipo: privacidad.toLowerCase(), // "privada" o "pública"
      contrasena: password,
      maxJugadores: numJugadores, // Puedes parametrizarlo según la cantidad de roles o slots
      // Incluye otros parámetros necesarios (por ejemplo, roles)
      usuario: usuarioData, // Usamos los datos reales del usuario
    };

    // Emite el evento "crearSala" al servidor
    socket.emit("crearSala", datosSala);
  };
  
  // Escuchar la respuesta de creación
  React.useEffect(() => {
    socket.on("salaCreada", (sala) => {
      console.log("Sala creada", sala);
      // Pasa la data de la sala para inicializar el estado en la siguiente pantalla
      router.push({ pathname: "/(sala)/sala", 
        params: { 
          idSala: sala.id, 
          salaData: JSON.stringify(sala) } });
    });

    return () => {
      socket.off("salaCreada");
    };
  }, []);

  /**
   * Cálculo del número total de jugadores en la partida basado en la cantidad de roles.
   */
  const numJugadores = useMemo(
    () => rolesCantidad.reduce((acc, rol) => acc + rol.cantidad, 0),
    [rolesCantidad]
  );

  /**
   * Alterna entre "Pública" y "Privada" la privacidad de la sala.
   */
  const cambiarPrivacidad = () => {
    setPrivacidad(privacidad === "Pública" ? "Privada" : "Pública");
  };

  /**
   * Modifica la cantidad de un rol específico en la partida.
   * Se aplican restricciones como:
   * - Máximo de 3 lobos.
   * - Máximo de 2 para roles especiales (Bruja, Cazador, Vidente).
   * - Límite total de 18 jugadores.
   *
   * @param rol - El rol a modificar.
   * @param incremento - Número de jugadores a sumar o restar.
   */
  const modificarCantidad = (
    rol: (typeof rolesData)[0],
    incremento: number
  ) => {
    setRolesCantidad((prevRoles) =>
      prevRoles.map((r) => {
        if (r.id === rol.id) {
          let nuevaCantidad = r.cantidad + incremento;
          if (nuevaCantidad < 0) nuevaCantidad = 0;
          if (numJugadores >= 18 && incremento > 0) return r;
          if (rol.nombre === "Hombre Lobo" && nuevaCantidad > 3) return r;
          if (
            ["Bruja", "Cazador", "Vidente"].includes(rol.nombre) &&
            nuevaCantidad > 2
          )
            return r;
          return { ...r, cantidad: nuevaCantidad };
        }
        return r;
      })
    );
  };

  /**
   * Determina si el botón "Crear Sala" debe estar deshabilitado.
   * Requisitos:
   * - Mínimo 5 jugadores.
   * - Al menos un hombre lobo.
   * - No puede haber más lobos que aldeanos.
   */
  const botonCrearDeshabilitado = useMemo(() => {
    const lobos =
      rolesCantidad.find((r) => r.nombre === "Hombre Lobo")?.cantidad || 0;
    const aldeanos =
      rolesCantidad.find((r) => r.nombre === "Aldeano")?.cantidad || 0;
    return numJugadores < 5 || lobos === 0 || lobos >= aldeanos;
  }, [rolesCantidad, numJugadores]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/fondo-roles.jpg")}
        style={styles.image}
      >
        {/* Título */}
        <Text style={styles.header}>Server Settings</Text>

        {/* Input para el nombre del servidor */}
        <Text style={styles.label}>Nombre del Servidor:</Text>
        <TextInput
          style={styles.input}
          value={nombreServidor}
          onChangeText={setNombreServidor}
          placeholder="Introduce un nombre"
        />

        {/* Número de jugadores */}
        <Text style={styles.label}>Número de jugadores: {numJugadores}</Text>

        {/* Selector de privacidad */}
        <View style={styles.privacidadContainer}>
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.privacidadBotones}>
            <Button title="⇦" onPress={cambiarPrivacidad} />
            <Text style={styles.label}>{privacidad}</Text>
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

        {/* Lista de roles disponibles */}
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
              <Button
                title="-"
                onPress={() => modificarCantidad(rol, -1)}
                disabled={rol.cantidad === 0}
              />
              <Button title="+" onPress={() => modificarCantidad(rol, 1)} />
            </View>
          </View>
        ))}

        {/* Botón para crear la sala */}
        <Button
          title="Crear Sala"
          disabled={botonCrearDeshabilitado}
          onPress={crearSala}
        />

        {/* Modal de información del rol seleccionado */}
        <Modal visible={mostrarPopup} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.label}>{rolSeleccionado?.nombre}</Text>
            <Image source={rolSeleccionado?.imagen} style={styles.rolImagen} />
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
  },

  label: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
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

  rolContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  rolImagen: { 
    width: 50, 
    height: 50, 
    marginRight: 10 
  },

  botonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default CrearSala;
