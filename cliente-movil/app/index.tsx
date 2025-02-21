import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import CustomButton from '../components/customButton';

import { useFonts } from 'expo-font';


const imagenPortada = require('@/assets/images/imagen-portada.png');
const imagenSoporte = require('@/assets/images/settings-portada.png');

export default function App() {

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
      <Text style={styles.title}>LOS HOMBRE LOBOS DE CASTRONEGRO</Text>

      <TouchableOpacity 
        style={styles.iconoBoton}
        onPress={() => Alert.alert("Has tocado el botón de la imagen")}>
        <Image source={imagenSoporte} style={styles.iconoSoporte} />
      </TouchableOpacity>

      <Link href="/elegirOpciones" style={styles.textoEntrar}>PULSA PARA ENTRAR</Link>
      <Text style={styles.textoSoporte}>Soporte</Text>

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
    fontSize: 40,
    fontWeight: 'bold',
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

  iconoSoporte: {
    position: 'absolute',
    bottom: 5,  // Ajusta la distancia desde la parte inferior
    right: 1,   // Ajusta la distancia desde la derecha
    width: 50,   // Ajusta el tamaño de la imagen 
    height: 50,  // Ajusta el tamaño de la imagen
    resizeMode: 'contain', // Ajusta el modo de escala de la imagen
  }, 
  textoSoporte: {
    position: 'absolute',
    bottom: 10,  // Justo debajo de la imagen
    right: 15,   // Alineado con la imagen
    fontSize: 12, // Tamaño pequeño
    color: 'white', // Color del texto
    textAlign: 'center',
  }, 
});
