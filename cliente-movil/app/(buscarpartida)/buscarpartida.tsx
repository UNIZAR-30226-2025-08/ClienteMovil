import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
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
          <View key={index} style={styles.salaContainer}>
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
          </View>
        ))}

        <TouchableOpacity
          style={styles.botonAtras}
          onPress={() => router.back()}
        >
          <Image source={imagenAtras} style={styles.imagenAtras} />
        </TouchableOpacity>
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
});
