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

const CrearSala = () => {
  const router = useRouter();
  const [nombreServidor, setNombreServidor] = useState(
    'Servidor de "nombreJugador"'
  );
  const [privacidad, setPrivacidad] = useState("Privada");
  const [password, setPassword] = useState("");
  const [rolesCantidad, setRolesCantidad] = useState(rolesData);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<
    (typeof rolesData)[0] | null
  >(null);

  const numJugadores = useMemo(
    () => rolesCantidad.reduce((acc, rol) => acc + rol.cantidad, 0),
    [rolesCantidad]
  );

  const cambiarPrivacidad = () => {
    setPrivacidad(privacidad === "Pública" ? "Privada" : "Pública");
  };

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
        <Text style={styles.header}>Server Settings</Text>

        <Text style={styles.label}>Nombre del Servidor:</Text>
        <TextInput
          style={styles.input}
          value={nombreServidor}
          onChangeText={setNombreServidor}
          placeholder="Introduce un nombre"
        />

        <Text style={styles.label}>Número de jugadores: {numJugadores}</Text>

        <View style={styles.privacidadContainer}>
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.privacidadBotones}>
            <Button title="⇦" onPress={cambiarPrivacidad} />
            <Text style={styles.label}>{privacidad}</Text>
            <Button title="⇨" onPress={cambiarPrivacidad} />
          </View>
        </View>

        {privacidad === "Privada" && (
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Introduce una contraseña"
            secureTextEntry
          />
        )}

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

        <Button
          title="Crear Sala"
          disabled={botonCrearDeshabilitado}
          onPress={() => router.push("/(sala)/sala")}
        />

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
  label: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
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
  rolImagen: { width: 50, height: 50, marginRight: 10 },
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
