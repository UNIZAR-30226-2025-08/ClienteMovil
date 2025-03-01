import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';

import { useFonts } from 'expo-font';


const imagenPortada = require('@/assets/images/imagen-portada.png');
const imagenSoporte = require('@/assets/images/settings-portada.png');

export default function entrarScreen() {

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
        source={imagenPortada}
        resizeMode='cover'
        style={styles.image}
      >
      <Text style={styles.title}>LOS HOMBRES LOBOS DE CASTRONEGRO</Text>

      <Link href="/elegirOpciones" style={styles.textoEntrar}>PULSA PARA ENTRAR</Link>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    width: "90%",
    left: "6%",
    lineHeight: 60,
    color: 'white',
    fontFamily: 'GhostShadow',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    position: 'absolute', // Posiciona el texto de forma absoluta
    top: 50, // Ajusta la distancia desde la parte superior de la pantalla
  },

  textoEntrar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute', // Fija el contenedor en la parte inferior
    bottom: 70, // Ajusta la distancia desde la parte inferior
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
  },

  /* Envuelve la imagen en un TouchableOpacity */
  iconoBoton: {
    position: 'absolute',
    bottom: 15,
    right: 10,
  },
});
