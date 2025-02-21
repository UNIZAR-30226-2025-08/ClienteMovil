import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';

import { useFonts } from 'expo-font';


const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imagenBruja = require('@/assets/images/bruja-icon.jpeg');
const imagenPapiro = require('@/assets/images/papiro.png')
const imagenAtras = require('@/assets/images/botonAtras.png');

export default function brujaScreen() {

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require('@/assets/fonts/ghost-shadow.ttf'),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode='cover'
        style={styles.image}
      >

      <View style={styles.overlay} />
      <Text style={styles.tituloBruja}>BRUJA</Text>
      <Image source={imagenBruja} style={styles.imageBruja}></Image>
      <Image source={imagenPapiro} style={styles.imagePapiro}></Image>
      <Text style={styles.textoBruja}>
            SE SEÑALARÁ AL JUGADOR QUE ESTÉ 
            APUNTO DE MORIR ESA NOCHE (SI LO HAY) Y ÉSTA DECIDIRÁ
        QUÉ HACER. PUEDE SALVARLO, GASTANDO LA
        POCIÓN DE VIDA O DEJARLO MORIR. A CONTINUACIÓN,
        LA BRUJA TIENE LA OPCIÓN DE GASTAR SU POCIÓN
        DE LA MUERTE PARA ELIMINAR AL JUGADOR 
        QUE DESEE. AMBAS POCIONES SOLO SE PUEDEN 
        USAR UNA VEZ EN LA PARTIDA. 
      </Text>

      <TouchableOpacity style={styles.containerAtras}>
        <Link href="/(roles)/roles"> {/* Ruta a la que quieres redirigir */}
            <Image source={imagenAtras} style={styles.imageAtras} />
        </Link>
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

  imageBruja: {
    width: 170,  // Ajusta el tamaño de la imagen
    height: 170, // Ajusta el tamaño de la imagen
    left: "30%",
    top: "15%",
    position: 'absolute'
  },

  tituloBruja: {
    position: 'absolute',  // Para posicionarlo de forma absoluta
    top: '5%',  // Colocamos el texto justo después de la imagen
    left: '49%',  // Centrado en el eje horizontal
    marginTop: 20,  // Ajustamos el margen para que esté justo debajo de la imagen (ajustamos este valor según el tamaño de la imagen)
    marginLeft: -60,  // Ajuste horizontal para centrar el texto
    color: 'white',  // Color del texto
    fontSize: 45,  // Tamaño del texto
    fontWeight: 'bold',  // Estilo del texto
    textAlign: 'center',  // Alineamos el texto al centro
  },

  textoBruja: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    width: 230,
    left: "25%",
    bottom: "25%"
  }
});
