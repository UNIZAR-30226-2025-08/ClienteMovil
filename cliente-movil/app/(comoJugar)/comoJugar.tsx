import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useFonts } from 'expo-font';


const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imageLobo = require('@/assets/images/lobo.png');
const imagenPapiro = require('@/assets/images/papiro.png')
const imageFondoTurnos = require('@/assets/images/fondo-turnos-explicacion.jpg');
const imagenAtras = require('@/assets/images/botonAtras.png');
const imagenLuna = require('@/assets/images/imagen-luna.png');
const imagenSol = require('@/assets/images/imagen-sol.jpg');

export default function comoJugarScreen() {

  const router = useRouter();  // Usamos useRouter para manejar la navegación

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require('@/assets/fonts/ghost-shadow.ttf'),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  const irAtras = () => {
    router.back();  // Regresa a la pantalla anterior
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode='cover'
        style={styles.image}
      >

      <View style={styles.overlay} />
      <Text style={styles.tituloComoJugar}>¿CÓMO JUGAR?</Text>
      <Image source={imageLobo} style={styles.imageLobo}></Image>
      <Image source={imagenPapiro} style={styles.imagePapiro}></Image>
      <Text style={styles.textoComoJugar}>
      Se reparten los roles a los jugadores. Cada jugador mira su carta para 
      saber cuál es su personaje, información que mantendrá en secreto a 
      menos que sea eliminado. El Narrador decide si los aldeanos votarán 
      ahora un Alguacil (función adicional, independiente del personaje) 
      por mayoría simple, o si el Alguacil será elegido más tarde en el 
      transcurso de la partida. El voto del Alguacil cuenta como dos votos. 
      El juego comienza en la noche.
      </Text>

      <TouchableOpacity style={styles.containerTurnoNoche}>
        <View style={styles.turnoContainer}>
          <Link href="/(comoJugar)/(turnos)/turnoNoche"> {/* Ruta a la que quieres redirigir */}
            <View style={styles.imageContainer}>
              <Image source={imageFondoTurnos} style={styles.imageFondoTurnos} />
              <View style={styles.overlayTurno} />
            </View>
          </Link>
        </View>
      </TouchableOpacity>

      <Text style={styles.textoNoche}>NOCHE</Text>
      <Image source={imagenLuna} style={styles.imagenTurnoNoche1}></Image>
      <Image source={imagenLuna} style={styles.imagenTurnoNoche2}></Image>

      <TouchableOpacity style={styles.containerTurnoDia}>
        <View style={styles.turnoContainer}>
          <Link href="/(comoJugar)/(turnos)/turnoDia"> {/* Ruta a la que quieres redirigir */}
            <View style={styles.imageContainer}>
              <Image source={imageFondoTurnos} style={styles.imageFondoTurnos} />
              <View style={styles.overlayTurno} />
            </View>
          </Link>
        </View>
      </TouchableOpacity>

      <Text style={styles.textoDia}>DIA</Text>
      <Image source={imagenSol} style={styles.imagenTurnoDia1}></Image>
      <Image source={imagenSol} style={styles.imagenTurnoDia2}></Image>

      <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
            <Image source={imagenAtras} style={styles.imageAtras} />
      </TouchableOpacity>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  turnoContainer: {
    position: 'absolute', // Para permitir que los elementos absolutos se ubiquen dentro de este contenedor
    width: 220,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    position: 'relative',  // Esto asegura que el overlay esté en el mismo contenedor
    width: 220,  // El mismo tamaño que la imagen
    height: 40,  // El mismo tamaño que la imagen
  },

  overlayTurno: {
    position: 'absolute',  // Ahora se coloca sobre la imagen
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Aumentar la opacidad si es necesario
  },

  containerAtras: {
    position: 'absolute',
    bottom: 20,  // Mantén este valor para la distancia desde el fondo
    left: '46%',  // Centra el contenedor horizontalmente

  },

  containerTurnoNoche: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 570,  // Ajusta este valor para mover la imagen más abajo
    left: '35%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  containerTurnoDia: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 630,  // Ajusta este valor para mover la imagen más abajo
    left: '35%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  imageAtras: {
    height: 40,
    width: 40,
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  imageFondoTurnos: {
    width: 220,  // Ajusta el tamaño de la imagen
    height: 40, // Ajusta el tamaño de la imagen
  },

  imagePapiro: {
    height: 400,
    width: 300,
    position: 'absolute',
    bottom: "10%",
    left: "13%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,  // Cubre toda el área de la imagen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo negro semitransparente, puedes ajustar la opacidad
  },

  imageLobo: {
    width: 170,  // Ajusta el tamaño de la imagen
    height: 170, // Ajusta el tamaño de la imagen
    left: "29%",
    top: "15%",
    position: 'absolute'
  },

  tituloComoJugar: {
    position: 'absolute',  // Para posicionarlo de forma absoluta
    top: '5%',  // Colocamos el texto justo después de la imagen
    left: '25%',  // Centrado en el eje horizontal
    marginTop: 20,  // Ajustamos el margen para que esté justo debajo de la imagen (ajustamos este valor según el tamaño de la imagen)
    marginLeft: -60,  // Ajuste horizontal para centrar el texto
    color: 'white',  // Color del texto
    fontSize: 45,  // Tamaño del texto
    fontWeight: 'bold',  // Estilo del texto
    textAlign: 'center',  // Alineamos el texto al centro
  },

  textoComoJugar: {
    fontSize: 13,
    fontWeight: 'bold',
    position: 'absolute',
    width: 230,
    left: "25%",
    top: "45%",
  },

  textoNoche: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    left: "43%",
    bottom: "25%",
  },

  textoDia: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    left: "47%",
    bottom: "17.5%",
  },

  imagenTurnoNoche1: {
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: "24.3%",
    left: "28%",
    borderRadius: 100,
  },

  imagenTurnoNoche2: {
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: "24.3%",
    left: "66%",
    borderRadius: 100,
  },

  imagenTurnoDia1: {
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: "16.8%",
    left: "28%",
    borderRadius: 100,
  },

  imagenTurnoDia2: {
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: "16.8%",
    left: "66%",
    borderRadius: 100,
  },
});
