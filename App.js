import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import * as Font from 'expo-font';  // Importación correcta


const imagenPortada = require('./assets/images/imagen-portada.png');

export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Cargar las fuentes cuando la aplicación inicie
    loadFonts();
  }, []); // El array vacío hace que solo se ejecute una vez cuando la app se monta

  const loadFonts = async () => {
    await Font.loadAsync({
      'ghost-shadow': require('./assets/fonts/GhostShadow.ttf'),
    });

    setFontsLoaded(true); // Una vez cargada la fuente, actualizamos el estado
  }

  if (!fontsLoaded) {
    return <Text>Cargando fuente...</Text>; // Mostrar mensaje mientras carga la fuente
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenPortada}
        style={styles.image}
      >
      <Text style={styles.title}>LOS HOMBRE LOBOS DE CASTRONEGRO</Text>
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
    fontFamily: 'ghost-shadow',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    position: 'absolute', // Posiciona el texto de forma absoluta
    top: 50, // Ajusta la distancia desde la parte superior de la pantalla
  }
});
