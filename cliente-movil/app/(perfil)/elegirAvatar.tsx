import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Text,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imagenFondo = require('@/assets/images/fondo-roles.jpg');

// Lista de avatares disponibles
const avatares = [
  require('@/assets/images/imagenPerfil.webp'),
  require('@/assets/images/imagenPerfil2.webp'),
  require('@/assets/images/imagenPerfil3.webp'),
  require('@/assets/images/imagenPerfil4.webp'),
  require('@/assets/images/imagenPerfil5.webp'),
  require('@/assets/images/imagenPerfil6.webp'),
  require('@/assets/images/imagenPerfil7.webp'),
  require('@/assets/images/imagenPerfil8.webp'),
];

export default function ElegirAvatarScreen() {
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  const router = useRouter();
  const [avatarSeleccionado, setAvatarSeleccionado] = useState<string | null>(null);

  // Manejar la selección del avatar
  const seleccionarAvatar = async (avatarPath: string) => {
    setAvatarSeleccionado(avatarPath);
    try {
      const correo = await AsyncStorage.getItem('correoUsuario'); // Obtener correo del usuario
      if (!correo) return Alert.alert("Error", "No se pudo obtener el correo del usuario.");

      // Enviar el avatar seleccionado al backend
      const response = await fetch(`${BACKEND_URL}/api/usuario/actualizarAvatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, avatar: avatarPath })
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el avatar.");
      }

      // Guardar el nuevo avatar en AsyncStorage
      await AsyncStorage.setItem('avatarUsuario', avatarPath);

      Alert.alert("Éxito", "Avatar actualizado correctamente.");
      router.push('/perfil'); // Redirigir de nuevo a la pantalla de perfil
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el avatar.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imagenFondo} style={styles.imageBackground}>
        <View style={styles.overlay} />
        <Text style={styles.titulo}>Elige tu Avatar</Text>
        <View style={styles.avatarContainer}>
          {avatares.map((avatar, index) => (
            <TouchableOpacity key={index} onPress={() => seleccionarAvatar(avatar)}>
              <Image source={avatar} style={styles.avatar} />
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    margin: 10,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,  // Cubre toda el área de la imagen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo negro semitransparente, puedes ajustar la opacidad
},
});
