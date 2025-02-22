import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useFonts } from 'expo-font';


const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imagenLuna = require('@/assets/images/imagen-luna.png');
const imagenPapiro = require('@/assets/images/papiro.png')
const imagenAtras = require('@/assets/images/botonAtras.png');

export default function turnoNocheScreen() {

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
      <Text style={styles.tituloTurnoNoche}>NOCHE</Text>
      <Image source={imagenLuna} style={styles.imageLuna}></Image>
      <Image source={imagenPapiro} style={styles.imagePapiro}></Image>
      <Text style={styles.textoTurnoNoche}>
        Todos los jugadores tienen los ojos cerrados, salvo aquellos 
        que van siendo llamados por el narrador y actúan en silencio.
        Orden de actuar durante la noche: vidente, hombres lobo, bruja.
        Vidente: elige un jugador y el Narrador le mostrará la carta de dicho jugador.
        Hombres Lobo: los hombres lobo abrirán los ojos para elegir a su próxima víctima, 
        cuya muerte se hará efectiva y anunciada en el próximo turno de día. Si no hay 
        unanimidad en la designación de la víctima, no hay muerte, por lo que dispondrán 
        de un tiempo limitado para elegir a su víctima (a discreción del Narrador).
        Bruja: El Narrador le señala el jugador que está a punto de morir en esa noche 
        (si lo hay) y ésta decidirá qué hacer. Puede salvarlo, 
        gastando su Poción de la Vida, o dejarlo morir. A continuación, 
        la bruja tiene la opción de gastar su Poción de la Muerte para eliminar 
        al jugador que desee. Ambas pociones son de solo un uso durante la partida.
        En caso de que suceda la muerte del Cazador: El Narrador le comunicará que ha 
        sido asesinado y el cazador podrá eliminar a un jugador de su elección.
      </Text>

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

  containerAtras: {
    position: 'absolute',
    bottom: 20,  // Mantén este valor para la distancia desde el fondo
    left: '46%',  // Centra el contenedor horizontalmente

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

  imageLuna: {
    width: 170,  // Ajusta el tamaño de la imagen
    height: 170, // Ajusta el tamaño de la imagen
    left: "30%",
    top: "15%",
    position: 'absolute',
    borderRadius: 100,
  },

  tituloTurnoNoche: {
    position: 'absolute',  // Para posicionarlo de forma absoluta
    top: '5%',  // Colocamos el texto justo después de la imagen
    left: '47%',  // Centrado en el eje horizontal
    marginTop: 20,  // Ajustamos el margen para que esté justo debajo de la imagen (ajustamos este valor según el tamaño de la imagen)
    marginLeft: -60,  // Ajuste horizontal para centrar el texto
    color: 'white',  // Color del texto
    fontSize: 45,  // Tamaño del texto
    fontWeight: 'bold',  // Estilo del texto
    textAlign: 'center',  // Alineamos el texto al centro
  },

  textoTurnoNoche: {
    fontSize: 10.5,
    fontWeight: 'bold',
    position: 'absolute',
    width: 230,
    left: "25%",
    bottom: "18%"
  }
});
