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
import axios from "axios";

const imagenFondo = require('@/assets/images/fondo-roles.jpg');
const imagenAtras = require("@/assets/images/botonAtras.png");

const avatarMap: Record<string, any> = {
  avatar1: require("@/assets/images/imagenPerfil.webp"),
  avatar2: require("@/assets/images/imagenPerfil2.webp"),
  avatar3: require("@/assets/images/imagenPerfil3.webp"),
  avatar4: require("@/assets/images/imagenPerfil4.webp"),
  avatar5: require("@/assets/images/imagenPerfil5.webp"),
  avatar6: require("@/assets/images/imagenPerfil6.webp"),
  avatar7: require("@/assets/images/imagenPerfil7.webp"),
  avatar8: require("@/assets/images/imagenPerfil8.webp"),
};

// Lista de avatares para selección
const avatares = Object.keys(avatarMap);


export default function ElegirAvatarScreen() {
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  const router = useRouter();
  const [avatarSeleccionado, setAvatarSeleccionado] = useState<string | null>(null);

  // Manejar la selección del avatar
  const seleccionarAvatar = async (avatarId: string) => {
    try {
      const idUsuario = await AsyncStorage.getItem("idUsuario"); // Recuperar ID del usuario
  
      const correo = await AsyncStorage.getItem("correoUsuario");

      if (!idUsuario) {
        Alert.alert("Error", "No se pudo obtener el ID del usuario.");
        return;
      }

      if(!correo) {
        Alert.alert("Error", "No se pudo obtener el correo del usuario.");
        return;
      }
  
      // Enviar solicitud al backend con el ID del usuario
      const response = await axios.put(`${BACKEND_URL}/api/usuario/actualizar`, {
        idUsuario: parseInt(idUsuario), // Convertimos a número
        avatar: avatarId,
      });
  
      if (response.status === 200) {
        await AsyncStorage.setItem("avatarUsuario", avatarId);
        Alert.alert("Éxito", "Avatar actualizado correctamente.");
        router.push("/perfil");
      } else {
        throw new Error("Error al actualizar el avatar.");
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error);
      Alert.alert("Error", "No se pudo actualizar el avatar.");
    }
  };


  const irAtras = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <ImageBackground source={imagenFondo} style={styles.imageBackground}>
        <View style={styles.overlay} />
        <Text style={styles.titulo}>Elige tu Avatar</Text>
        <View style={styles.avatarContainer}>
          {avatares.map((avatarId) => (
            <TouchableOpacity key={avatarId} onPress={() => seleccionarAvatar(avatarId)}>
              <Image source={avatarMap[avatarId]} style={styles.avatar} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={styles.containerAtras} 
          onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
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

  containerAtras: {
    position: "absolute",
    bottom: 20,
    left: "46%",
  },

  imageAtras: {
    height: 40,
    width: 40,
  },
});
