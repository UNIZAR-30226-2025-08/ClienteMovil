import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";

/**
 * Imágenes utilizadas en la pantalla de opciones.
 */
const imagenFondo = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");
const iconoVolumenBajo = require("@/assets/images/Volume x.png");
const iconoVolumenAlto = require("@/assets/images/Volume 2.png");
const iconoLuna = require("@/assets/images/luna.png");
const iconoSol = require("@/assets/images/sol.png");

/**
 * Pantalla de opciones del juego.
 * Permite ajustar el volumen, brillo y activar/desactivar notificaciones.
 *
 * @returns {JSX.Element} Pantalla de configuración.
 */
export default function OpcionesScreen(): JSX.Element {
  const router = useRouter();

  /**
   * Estado para controlar el volumen del juego.
   */
  const [volumen, setVolumen] = useState(0.5);

  /**
   * Estado para controlar el brillo de la pantalla.
   */
  const [brillo, setBrillo] = useState(0.5);

  /**
   * Estado para controlar si las notificaciones están activadas o no.
   */
  const [notificaciones, setNotificaciones] = useState(true);

  return (
    <View style={styles.container}>

      {/* Imagen de fondo */}
      <ImageBackground source={imagenFondo} style={styles.image}>

        {/* Título principal */}
        <Text style={styles.titulo}>OPCIONES</Text>

        {/* Ajuste de Volumen */}
        <Text style={styles.label}>VOLUMEN</Text>
        <View style={styles.sliderContainer}>
          <Image source={iconoVolumenBajo} style={styles.icono} />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volumen}
            onValueChange={setVolumen}
            minimumTrackTintColor="#FFD700"
            thumbTintColor="#FFD700"
          />
          <Image source={iconoVolumenAlto} style={styles.icono} />
        </View>

        {/* Ajuste de Brillo */}
        <Text style={styles.label}>BRILLO</Text>
        <View style={styles.sliderContainer}>
          <Image source={iconoLuna} style={styles.icono} />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={brillo}
            onValueChange={setBrillo}
            minimumTrackTintColor="#FFD700"
            thumbTintColor="#FFD700"
          />
          <Image source={iconoSol} style={styles.icono} />
        </View>

        {/* Activar/Desactivar Notificaciones */}
        <View style={styles.notificacionesContainer}>
          <Text style={styles.label}>NOTIFICACIONES DEL JUEGO</Text>
          <Switch
            value={notificaciones}
            onValueChange={setNotificaciones}
            trackColor={{ false: "#777", true: "#FFD700" }}
            thumbColor="#FFF"
          />
        </View>

        {/* Botón para volver atrás */}
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

/**
 * Estilos de la pantalla de opciones.
 */
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
    marginBottom: 20,
  },

  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },

  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
  },

  slider: {
    flex: 1,
    marginHorizontal: 10,
  },

  icono: {
    width: 25,
    height: 25,
  },

  notificacionesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 20,
  },

  botonAtras: {
    marginTop: 20,
  },
  
  imagenAtras: {
    width: 50,
    height: 50,
  },
});
