import React from 'react';  // Importar useState desde React
import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';


/**
 * Importación de imágenes utilizadas en la pantalla de contacto.
 */
const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imagenContacto = require('@/assets/images/logo-soporte-tecnico.png');
const imagenPapiro = require('@/assets/images/papiro.png')
const imagenAtras = require('@/assets/images/botonAtras.png');

/**
 * Pantalla de contacto.
 * Permite a los usuarios enviar un mensaje de contacto con su nombre, correo y asunto.
 *
 * @returns {JSX.Element} Pantalla de contacto.
 */
export default function ContactoScreen(): JSX.Element | null {

  const router = useRouter();  // Usamos useRouter para manejar la navegación

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require('@/assets/fonts/ghost-shadow.ttf'),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  /**
   * Función para volver a la pantalla anterior.
   */
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

        {/* Campo de entrada para el nombre */}
        <Text style={styles.textoNombre}>Nombre</Text>
        <TextInput style={styles.smallInput} placeholder='Tu nombre' placeholderTextColor="#444" />

        {/* Campo de entrada para el correo electrónico */}
        <Text style={styles.textoCorreo}>Correo electrónico</Text>
        <TextInput style={styles.smallInput} placeholder='Tu correo' placeholderTextColor="#444" />

        {/* Campo de entrada para el asunto */}
        <Text style={styles.textoAsunto}>Asunto</Text>
        <TextInput style={styles.bigInput} placeholder='Asunto' placeholderTextColor="#444" />

        {/* Botón de enviar mensaje */}
        <TouchableOpacity style={styles.botonEnviar} onPress={ () =>Alert.alert("Reporte enviado")}>
            <Text style={styles.textoEnviar}>ENVIAR</Text>
        </TouchableOpacity>

        {/* Botón de regresar a la pantalla anterior */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
            <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>

        </ImageBackground>
    </View>
  );
}

/**
 * Estilos para la pantalla de contacto.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  containerAtras: {
    position: 'absolute',
    bottom: 20,  
    left: '44%',  

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
    ...StyleSheet.absoluteFillObject,  
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },

  imageContacto: {
    width: 170,  
    height: 170, 
    left: "28%",
    top: "15%",
    position: 'absolute',
    borderRadius: 100,
  },

  tituloContacto: {
    position: 'absolute',  
    top: '5%',  
    left: '36%',  
    marginTop: 20,  
    marginLeft: -60,  
    color: 'white', 
    fontSize: 45, 
    fontWeight: 'bold', 
    textAlign: 'center',  
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
