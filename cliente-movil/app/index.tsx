import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Link } from 'expo-router';

import { useFonts } from 'expo-font';


const imagenPortada = require('@/assets/images/imagen-portada.png');
const imagenGoogle = require('@/assets/images/google-icon.png');
const imagenFondoInicioSesion = require('@/assets/images/fondo-inicio-sesion.jpg');

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
        <Image source={imagenFondoInicioSesion} style={styles.imagenInicioSesion}></Image>
        <Text style={styles.tituloIniciarSesion}>INICIAR SESION</Text>

        <Text style={styles.textoCorreo}>Correo electrónico</Text>
        <TextInput style={styles.input} placeholder="Tu correo" placeholderTextColor="#444"></TextInput>

        <Text style={styles.textoPassword}>Contraseña</Text>
        <TextInput style={styles.input} placeholder="Tu contraseña" placeholderTextColor="#444"></TextInput>

        <Text style={styles.textoRegistro}>
            ¿No tienes cuenta? <Link href="/" style={styles.linkRegistro}>Regístrate</Link>
        </Text>
        <TouchableOpacity style={styles.botonGoogle}>
          <Image source={imagenGoogle} style={styles.imagenGoogle} />
          <Text style={styles.textoGoogle}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonEntrar}>
          <Link href={"/entrar"}>
            <Text style={styles.textoEntrar}>ENTRAR</Text>
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

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  title: {
    width: "90%",
    left: "6%",
    lineHeight: 60,
    fontSize: 30,
    color: 'white',
    fontFamily: 'GhostShadow',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    position: 'absolute', // Posiciona el texto de forma absoluta
    top: 50, // Ajusta la distancia desde la parte superior de la pantalla
  },

  imagenInicioSesion: {
    position: 'absolute',
    width: 320,
    height: 470,
    left: "9.5%",
    bottom: "13%",
    borderRadius: 30,
  },

  tituloIniciarSesion: {
    position: 'absolute',
    fontFamily: 'GhostShadow',
    fontSize: 30,
    left: "17%",
    bottom: "60%",
  },

  textoCorreo: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    left: "34%",
  },

  textoPassword: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    left: "40%",
  },

  input: {
    width: '70%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    left: "15.5%",
  },

  textoRegistro: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    bottom: "35%",
    left: "25%",
  },

  linkRegistro: {
    color: 'blue',
    fontWeight: 'bold',
  },

  botonGoogle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '70%',
    justifyContent: 'center',
    bottom: "29%",
    height: 35,
    left: "15.5%",
    elevation: 3, // Sombra en Android
  },

  imagenGoogle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  textoGoogle: {
    fontSize: 16,
  },

  botonEntrar: {
    position: 'absolute',
    backgroundColor: '#008f39',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 45,
    left: "32%",
    bottom: "18%",
    borderRadius: 30,
  },

  textoEntrar: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
