import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';

import CustomButton from './components/customButton';

import * as Font from 'expo-font';  // Importación correcta


const imagenPortada = require('./assets/images/imagen-portada.png');
const imagenSoporte = require('./assets/images/soporte-inicio.png');

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

      <TouchableOpacity 
        style={styles.iconoBoton}
        onPress={() => Alert.alert("Has tocado el botón de la imagen")}>
        <Image source={imagenSoporte} style={styles.iconoSoporte} />
      </TouchableOpacity>

      <Text style={styles.textoSoporte}>Soporte</Text>

      </ImageBackground>
      {/* Botón personalizado en la parte inferior */}
      <View style={styles.buttonContainer}>
        <CustomButton 
          title="PULSA PARA ENTRAR"
          onPress={() => Alert.alert("¡Juego Iniciado!")}
          bgColor="rgba(255, 255, 255, 0.3)" // Fondo semitransparente
          textColor="#fff"
          width="100%"
          fontFamily="ghost-shadow"
        />
      </View>
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
  },

  buttonContainer: {
    position: 'absolute', // Fija el contenedor en la parte inferior
    bottom: 70, // Ajusta la distancia desde la parte inferior
    width: '100%',
    borderRadius: '90%',
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
