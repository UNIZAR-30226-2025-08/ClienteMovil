import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";

const imagenFondo = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");
const iconoCandado = require("@/assets/images/candado.png");

const salas = [
  { estado: "Sala", tipo: "Privada", nombre: "SADADDSADADSSAS", privada: true },
  {
    estado: "En Partida",
    tipo: "Pública",
    nombre: "SADADDSADADSSAS",
    privada: false,
  },
  { estado: "Empezando", tipo: "Privada", nombre: "Empezando", privada: true },
];

export default function BuscarSalasScreen() {
  const router = useRouter();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [password, setPassword] = useState("");
  const [salaSeleccionada, setSalaSeleccionada] = useState<{
    estado: string;
    tipo: string;
    nombre: string;
    privada: boolean;
  } | null>(null);

  const handleSalaPress = (sala: {
    estado: string;
    tipo: string;
    nombre: string;
    privada: boolean;
  }) => {
    if (sala.privada) {
      setSalaSeleccionada(sala);
      setMostrarModal(true);
    } else {
      router.push("/(sala)/sala");
    }
  };

  const handleConfirmarPassword = () => {
    // Aquí puedes agregar la lógica para verificar la contraseña
    if (password === "1234") {
      // Ejemplo de contraseña
      setMostrarModal(false);
      router.push("/(sala)/sala");
    } else {
      Alert.alert("Contraseña incorrecta", "Por favor, intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imagenFondo} style={styles.image}>
        <Text style={styles.titulo}>BUSCAR{"\n"}SALAS</Text>

        <View style={styles.rectanglesContainer}>
          <View style={styles.rectangle} />
          <View style={styles.rectangle} />
          <View style={styles.rectangle} />
        </View>

        {salas.map((sala, index) => (
          <TouchableOpacity
            key={index}
            style={styles.salaContainer}
            onPress={() => handleSalaPress(sala)}
          >
            <Text style={styles.texto}>
              <Text style={styles.label}>ESTADO: </Text> {sala.estado}
            </Text>
            <Text style={styles.texto}>
              <Text style={styles.label}>TIPO: </Text> {sala.tipo}
            </Text>
            {sala.privada && (
              <Image source={iconoCandado} style={styles.iconoCandado} />
            )}
            <Text style={styles.texto}>
              <Text style={styles.label}>NOMBRE: </Text> {sala.nombre}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.botonAtras}
          onPress={() => router.back()}
        >
          <Image source={imagenAtras} style={styles.imagenAtras} />
        </TouchableOpacity>

        <Modal visible={mostrarModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Introduce la contraseña</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.botonConfirmar}
                onPress={handleConfirmarPassword}
              >
                <Text style={styles.textoBotonConfirmar}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => setMostrarModal(false)}
              >
                <Text style={styles.textoBotonCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 80, // Ajusta este valor según sea necesario para centrar el texto verticalmente
  },
  rectanglesContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  rectangle: {
    width: "80%", // Ajusta el tamaño del rectángulo
    height: 30, // Ajusta el tamaño del rectángulo
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Color negro semitransparente
    marginVertical: 10, // Espacio entre los rectángulos
  },
  salaContainer: {
    width: "90%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  texto: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  iconoCandado: {
    width: 20,
    height: 20,
    position: "absolute",
    right: 15,
    top: 15,
  },
  botonAtras: {
    marginTop: 20,
  },
  imagenAtras: {
    width: 50,
    height: 50,
    marginBottom: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  botonConfirmar: {
    backgroundColor: "#008000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textoBotonConfirmar: {
    color: "white",
    fontWeight: "bold",
  },
  botonCancelar: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
  },
  textoBotonCancelar: {
    color: "white",
    fontWeight: "bold",
  },
});
