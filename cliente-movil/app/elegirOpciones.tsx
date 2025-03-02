import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';


const imagenPortada = require('@/assets/images/imagen-portada.png');
const imagenPerfil = require('@/assets/images/imagenPerfil.webp');

export default function opcionesScreen() {

  const router = useRouter();

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

      <View style={styles.overlay} />
      <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.contenedorPerfil}>
        <Image source={imagenPerfil} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.nombrePlayer}>Player 1</Text>
      <Link href="/(partida)/elegirTipoPartida" style={styles.textoPartida}>JUGAR</Link>
      <Link href={"/(comoJugar)/comoJugar"} style={styles.textoComoJugar}>¿CÓMO JUGAR?</Link>
      <Link href={"/roles"} style={styles.textoRoles}>ROLES</Link>
      <Link href={"/(opciones)/opciones"} style={styles.textoOpciones}>OPCIONES</Link>
      <Link href={"/(contacto)/contacto"} style={styles.textoContacto}>CONTACTO</Link>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  contenedorPerfil: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    zIndex: 1,
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,  // Cubre toda el área de la imagen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo negro semitransparente, puedes ajustar la opacidad
  },

  profileImage: {
    width: 100,  
    height: 100, 
    borderRadius: 100,
  },

  nombrePlayer: {
    position: 'absolute',  // Para posicionarlo de forma absoluta
    top: '18%',  // Colocamos el texto justo después de la imagen
    left: '57%',  // Centrado en el eje horizontal
    marginTop: 60,  // Ajustamos el margen para que esté justo debajo de la imagen (ajustamos este valor según el tamaño de la imagen)
    marginLeft: -60,  // Ajuste horizontal para centrar el texto
    color: 'white',  // Color del texto
    fontSize: 18,  // Tamaño del texto
    fontWeight: 'bold',  // Estilo del texto
    textAlign: 'center',  // Alineamos el texto al centro
  },

  textoPartida: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute', // Fija el contenedor en la parte inferior
    top: 250, // Ajusta la distancia desde la parte inferior
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoComoJugar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute', // Fija el contenedor en la parte inferior
    top: 325, // Ajusta la distancia desde la parte inferior
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoRoles: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute', // Fija el contenedor en la parte inferior
    top: 400, // Ajusta la distancia desde la parte inferior
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoOpciones: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute', // Fija el contenedor en la parte inferior
    top: 475, // Ajusta la distancia desde la parte inferior
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
  },

  textoContacto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute', // Fija el contenedor en la parte inferior
    top: 550, // Ajusta la distancia desde la parte inferior
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
  },
});
