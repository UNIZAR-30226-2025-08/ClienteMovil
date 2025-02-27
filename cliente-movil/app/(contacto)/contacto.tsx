import React, { useState, useEffect } from 'react';  // Importar useState desde React
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useFonts } from 'expo-font';


const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imagenContacto = require('@/assets/images/logo-soporte-tecnico.png');
const imagenPapiro = require('@/assets/images/papiro.png')
const imagenAtras = require('@/assets/images/botonAtras.png');

export default function contactoScreen() {

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
        <Text style={styles.tituloContacto}>CONTACTO</Text>
        <Image source={imagenContacto} style={styles.imageContacto}></Image>

        <Text style={styles.textoNombre}>Nombre</Text>
        <TextInput style={styles.smallInput} placeholder='Tu nombre' placeholderTextColor="#444" />

        <Text style={styles.textoCorreo}>Correo electrónico</Text>
        <TextInput style={styles.smallInput} placeholder='Tu correo' placeholderTextColor="#444" />

        <Text style={styles.textoAsunto}>Asunto</Text>
        <TextInput style={styles.bigInput} placeholder='Asunto' placeholderTextColor="#444" />

        <TouchableOpacity style={styles.botonEnviar} onPress={ () =>Alert.alert("Reporte enviado")}>
            <Text style={styles.textoEnviar}>ENVIAR</Text>
        </TouchableOpacity>

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
    left: '44%',  // Centra el contenedor horizontalmente

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

  imageContacto: {
    width: 170,  // Ajusta el tamaño de la imagen
    height: 170, // Ajusta el tamaño de la imagen
    left: "28%",
    top: "15%",
    position: 'absolute',
    borderRadius: 100,
  },

  tituloContacto: {
    position: 'absolute',  // Para posicionarlo de forma absoluta
    top: '5%',  // Colocamos el texto justo después de la imagen
    left: '36%',  // Centrado en el eje horizontal
    marginTop: 20,  // Ajustamos el margen para que esté justo debajo de la imagen (ajustamos este valor según el tamaño de la imagen)
    marginLeft: -60,  // Ajuste horizontal para centrar el texto
    color: 'white',  // Color del texto
    fontSize: 45,  // Tamaño del texto
    fontWeight: 'bold',  // Estilo del texto
    textAlign: 'center',  // Alineamos el texto al centro
  },

  textoNombre: {
    fontSize: 18,
    color: 'white',
    marginLeft: "20%",
    marginTop: 190,
  },

  textoCorreo: {
    fontSize: 18,
    color: 'white',
    marginLeft: "20%",
    marginTop: 20,
  },

  textoAsunto: {
    fontSize: 18,
    color: 'white',
    marginLeft: "20%",
    marginTop: 20,
  },

  smallInput: {
    marginLeft: "20%",
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '60%',
  },

  bigInput: {
    marginLeft: "20%",
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '60%',
    height: '20%',
    textAlignVertical: 'top',
  },

  botonEnviar: {
    backgroundColor: '#008f39',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 45,
    marginTop: 15,
    marginLeft: "30%",
    borderRadius: 30,
  },

  textoEnviar: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
});
