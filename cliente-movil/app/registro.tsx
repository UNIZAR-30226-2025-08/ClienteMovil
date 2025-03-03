import React, { useState } from 'react';
import Constants from 'expo-constants';

import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

const imagenPortada = require('@/assets/images/imagen-portada.png');
const imagenGoogle = require('@/assets/images/google-icon.png');
const imagenFondoInicioSesion = require('@/assets/images/fondo-inicio-sesion.jpg');

export default function App() {
  // Recuperar la URL de backend desde Constants
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  // 'nombre' almacena el valor escrito en el campo nombre y 
  // 'setNombre' es una funcion que actualiza el valor cuando el usuario escribe
  const [nombre, setNombre] = useState('');

  // 'correo' almacena el valor escrito en el campo correo y 
  // 'setCorreo' es una funcion que actualiza el valor cuando el usuario escribe
  const [correo, setCorreo] = useState('');

  // 'contrasena' almacena el valor escrito en el campo contraseña y 
  // 'setContrasena' es una funcion que actualiza el valor cuando el usuario escribe
  const [contrasena, setContrasena] = useState('');

  // 'confirmContrasena' almacena el valor escrito en el campo confirmar contraseña y
  // 'setconfirmContrasena' es una funcion que actualiza el valor cuando el usuario escribe
  const [confirmContrasena, setconfirmContrasena] = useState('');
  
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  const router = useRouter();

  const [loaded] = useFonts({
    GhostShadow: require('@/assets/fonts/ghost-shadow.ttf'),
  });

  if (!loaded) {
    return null;
  }

  // Función para registrar al usuario
  const handleRegister = async () => {

    // Si el usuario no ha rellenado el campo de correo o contraseña
    // lanza un mensaje de que no se han rellenado los campos y no 
    // manda la petición
    if (!nombre || !correo || !contrasena || !confirmContrasena) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (contrasena !== confirmContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Validación básica del correo electrónico
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!correoRegex.test(correo)) {
      Alert.alert('Error', 'Por favor, ingresa un correo válido.');
      return;
    }

    // Intenta realizar una solicitud al backend de tipo POST con fetch(), 
    // que realiza una petición HTTP, con 'POST' indicamos que estamos 
    // enviando información al backend, 'headres' indica que estamos enviando
    // datos al backend en formato JSON y 'body' son la propia información que
    // vamos a enviar al backend en formato JSON
    try {
      const response = await fetch(`${BACKEND_URL}/api/usuario/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.', [
          { text: 'OK', onPress: () => router.push('/entrar') }
        ]);
      } else {
        Alert.alert('Error', data.message || 'No se pudo registrar el usuario.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ImageBackground source={imagenPortada} resizeMode="cover" style={styles.image}>
            {/* Título */}
            <Text style={styles.title}>LOS HOMBRES LOBOS DE CASTRONEGRO</Text>

            {/* Imagen de fondo de inicio de sesión */}
            <Image source={imagenFondoInicioSesion} style={styles.imagenRegistro} />

            {/* Formulario */}
            <View style={styles.formContainer}>
              <Text style={styles.tituloResgistrarse}>REGISTRARSE</Text>

              <Text style={styles.textoCorreo}>Nombre</Text>
              <TextInput style={styles.input} placeholder="Tu nombre" value={nombre} onChangeText={setNombre}
              placeholderTextColor="#444" />

              <Text style={styles.textoCorreo}>Correo electrónico</Text>
              <TextInput style={styles.input} placeholder="Tu correo" value={correo} onChangeText={setCorreo}
              placeholderTextColor="#444" autoCapitalize="none" keyboardType="email-address" />

              <Text style={styles.textoContrasena}>Contraseña</Text>
              <View style={styles.contrasenaContainer}>
                <TextInput 
                  style={[styles.input, { width: '95%' }]}
                  placeholder="Contraseña" 
                  value={contrasena} 
                  onChangeText={setContrasena} 
                  secureTextEntry={secureText} 
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                  <Text>{secureText ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.textoContrasena}>Confirmar contraseña</Text>
              <View style={styles.contrasenaContainer}>
                <TextInput 
                  style={[styles.input, { width: '95%' }]} 
                  placeholder="Confirmar Contraseña" 
                  value={confirmContrasena} 
                  onChangeText={setconfirmContrasena} 
                  secureTextEntry={secureTextConfirm} 
                />
                <TouchableOpacity onPress={() => setSecureTextConfirm(!secureTextConfirm)}>
                  <Text>{secureTextConfirm ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.botonGoogle}>
                <Image source={imagenGoogle} style={styles.imagenGoogle} />
                <Text style={styles.textoGoogle}>Registrarse con Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botonEntrar} onPress={handleRegister}>
                  <Text style={styles.textoEntrar}>REGISTRARSE</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    position: 'absolute',
    top: 50,
  },
  imagenRegistro: {
    position: 'absolute',
    width: 320,
    height: 470,
    left: "9.5%",
    bottom: "13%",
    borderRadius: 30,
  },
  formContainer: {
    position: 'absolute',
    width: '100%',
    bottom: "20%",
    alignItems: 'center',
  },
  tituloResgistrarse: {
    fontFamily: 'GhostShadow',
    fontSize: 30,
    color: 'black',
  },
  textoCorreo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  textoContrasena: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  input: {
    width: '70%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  textoRegistro: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  linkRegistro: {
    color: 'blue',
    fontWeight: 'bold',
  },
  botonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '70%',
    justifyContent: 'center',
    marginTop: 15,
    height: 35,
    elevation: 3,
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
    backgroundColor: '#008f39',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 45,
    marginTop: 15,
    borderRadius: 30,
  },
  textoEntrar: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  contrasenaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
});
