import React, {useState} from 'react';  // Importar useState desde React
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
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * Importación de imágenes utilizadas en la pantalla de contacto.
 */
const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imagenContacto = require('@/assets/images/logo-soporte-tecnico.png');
const imagenAtras = require('@/assets/images/botonAtras.png');

/**
 * Pantalla de contacto.
 * Permite a los usuarios enviar un mensaje de contacto con su nombre, correo y asunto.
 *
 * @returns {JSX.Element} Pantalla de contacto.
 */
export default function ContactoScreen(): JSX.Element | null {

  /**
 * URL del backend obtenida de las constantes de Expo.
 */
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  const router = useRouter();  // Usamos useRouter para manejar la navegación

    // Estados para cada input
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [asunto, setAsunto] = useState('');

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

  const enviarSugerencia = async () => {
    // Validar que se hayan ingresado los campos requeridos
    if (!nombre || !correo || !asunto) {
      Alert.alert("Por favor, completa todos los campos.");
      return;
    }

    /*
    * Obtenemos el ID del usuario que envía la sugerencia al Backend
    * para que se guarde en los registros de la BD
    */
    const idUsuarioString = await AsyncStorage.getItem('idUsuario');
    if (!idUsuarioString) {
      Alert.alert("Error", "No se encontró el id de usuario.");
      return;
    }
    const idUsuario = parseInt(idUsuarioString, 10);
    // Depuración del id del usuario
    console.log("ID usuario enviado:", idUsuario);

    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/sugerencias/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idUsuario,
          contenido: asunto  // O puedes combinar los campos si lo prefieres
        })
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        Alert.alert("Sugerencia enviada", "Gracias por tu sugerencia.");
        // Limpiar campos después de enviar
        setNombre('');
        setCorreo('');
        setAsunto('');
      } else {
        Alert.alert("Error", data.error || "Ocurrió un error al enviar la sugerencia.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
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
        <TextInput 
          style={styles.smallInput} 
          placeholder='Tu nombre' 
          placeholderTextColor="#444" 
          value={nombre}
          onChangeText={setNombre}
        />

        {/* Campo de entrada para el correo electrónico */}
        <Text style={styles.textoCorreo}>Correo electrónico</Text>
        <TextInput 
          style={styles.smallInput} 
          placeholder='Tu correo' 
          placeholderTextColor="#444" 
          value={correo}
          onChangeText={setCorreo}
        />

        {/* Campo de entrada para el asunto */}
        <Text style={styles.textoAsunto}>Asunto</Text>
        <TextInput 
          style={styles.bigInput} 
          placeholder='Asunto' 
          placeholderTextColor="#444" 
          value={asunto}
          onChangeText={setAsunto}
        />

        {/* Botón de enviar mensaje */}
        <TouchableOpacity 
          style={styles.botonEnviar} 
          onPress={enviarSugerencia}>
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
