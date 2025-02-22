import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useFonts } from 'expo-font';


const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imagenCazador = require('@/assets/images/cazador-icon.jpeg');
const imagenAlguacil = require('@/assets/images/alguacil-icon.png');
const imagenVidente = require('@/assets/images/vidente-icon.jpeg');
const imagenBruja = require('@/assets/images/bruja-icon.jpeg');
const imagenAldeano = require('@/assets/images/aldeano-icon.jpeg');
const imagenLobo = require('@/assets/images/hombre-lobo-icon.jpeg');
const imagenAtras = require('@/assets/images/botonAtras.png');

export default function rolesScreen() {

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
      <Text style={styles.tituloRoles}>ROLES</Text>

      <TouchableOpacity style={styles.containerCazador}>
        <Link href="/(roles)/(personajes)/cazador"> {/* Ruta a la que quieres redirigir */}
            <Image source={imagenCazador} style={styles.imageIconos} />
        </Link>
      </TouchableOpacity>
      <Text style={styles.textoCazador}>CAZADOR</Text>

      <TouchableOpacity style={styles.containerAlguacil}>
        <Link href="/(roles)/(personajes)/alguacil"> {/* Ruta a la que quieres redirigir */}
            <Image source={imagenAlguacil} style={styles.imageIconos} />
        </Link>
      </TouchableOpacity>
      <Text style={styles.textoAlguacil}>ALGUACIL</Text>

      <TouchableOpacity style={styles.containerVidente}>
        <Link href="/(roles)/(personajes)/vidente"> {/* Ruta a la que quieres redirigir */}
            <Image source={imagenVidente} style={styles.imageIconos} />
        </Link>
      </TouchableOpacity>
      <Text style={styles.textoVidente}>VIDENTE</Text>

      <TouchableOpacity style={styles.containerBruja}>
        <Link href="/(roles)/(personajes)/bruja"> {/* Ruta a la que quieres redirigir */}
            <Image source={imagenBruja} style={styles.imageIconos} />
        </Link>
      </TouchableOpacity>
      <Text style={styles.textoBruja}>BRUJA</Text>

      <TouchableOpacity style={styles.containerAldeano}>
        <Link href="/(roles)/(personajes)/aldeano"> {/* Ruta a la que quieres redirigir */}
            <Image source={imagenAldeano} style={styles.imageIconos} />
        </Link>
      </TouchableOpacity>
      <Text style={styles.textoAldeano}>ALDEANO</Text>

      <TouchableOpacity style={styles.containerLobo}>
        <Link href="/(roles)/(personajes)/lobo"> {/* Ruta a la que quieres redirigir */}
            <Image source={imagenLobo} style={styles.imageIconos} />
        </Link>
      </TouchableOpacity>
      <Text style={styles.textoLobo}>LOBO</Text>


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

  containerCazador: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 200,  // Ajusta este valor para mover la imagen más abajo
    left: '28%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  containerAlguacil: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 200,  // Ajusta este valor para mover la imagen más abajo
    right: '8%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  containerVidente: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 375,  // Ajusta este valor para mover la imagen más abajo
    left: '28%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  containerBruja: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 375,  // Ajusta este valor para mover la imagen más abajo
    right: '8%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  containerAldeano: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 550,  // Ajusta este valor para mover la imagen más abajo
    left: '28%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  containerLobo: {
    position: 'absolute', // Asegúrate de que el contenedor tenga un posicionamiento absoluto
    top: 550,  // Ajusta este valor para mover la imagen más abajo
    right: '8%',
    marginLeft: -50,  // Asegura que la imagen esté centrada
  },

  containerAtras: {
    position: 'absolute',
    bottom: 20,  // Mantén este valor para la distancia desde el fondo
    left: '46%',  // Centra el contenedor horizontalmente

  },

  textoCazador: {
    position: 'absolute',
    top: 310,  // Ajusta la posición según la imagen
    left: '21%',
    color: 'white',  // Color del texto
    fontSize: 16,    // Tamaño del texto
    fontWeight: 'bold',
    textAlign: 'center',  // Centrado horizontal
  },

  textoAlguacil: {
    position: 'absolute',
    top: 310,  // Ajusta la posición según la imagen
    right: '12%',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  textoVidente: {
    position: 'absolute',
    top: 490,  // Ajusta la posición según la imagen
    left: '22%',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  textoBruja: {
    position: 'absolute',
    top: 490,  // Ajusta la posición según la imagen
    right: '16%',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  textoAldeano: {
    position: 'absolute',
    top: 670,  // Ajusta la posición según la imagen
    left: '21%',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  textoLobo: {
    position: 'absolute',
    top: 670,  // Ajusta la posición según la imagen
    right: '17%',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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

  overlay: {
    ...StyleSheet.absoluteFillObject,  // Cubre toda el área de la imagen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo negro semitransparente, puedes ajustar la opacidad
  },

  imageIconos: {
    width: 110,  // Ajusta el tamaño de la imagen
    height: 110, // Ajusta el tamaño de la imagen
  },

  profileImage: {
    width: 100,  // Ajusta el tamaño de la imagen
    height: 100, // Ajusta el tamaño de la imagen
    position: 'absolute',
    top: 100,  // Centra la imagen en el eje vertical
    left: '50%',
    marginLeft: -50,  // Desplaza la imagen hacia la izquierda para que esté completamente centrada (mitad del ancho de la imagen)
    zIndex: 1, 
    borderRadius: 50,
  },

  tituloRoles: {
    position: 'absolute',  // Para posicionarlo de forma absoluta
    top: '8%',  // Colocamos el texto justo después de la imagen
    left: '49%',  // Centrado en el eje horizontal
    marginTop: 20,  // Ajustamos el margen para que esté justo debajo de la imagen (ajustamos este valor según el tamaño de la imagen)
    marginLeft: -60,  // Ajuste horizontal para centrar el texto
    color: 'white',  // Color del texto
    fontSize: 45,  // Tamaño del texto
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
