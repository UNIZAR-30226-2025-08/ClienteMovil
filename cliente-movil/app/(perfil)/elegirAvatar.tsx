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

/**
 * Imágenes utilizadas en la pantalla de selección de avatar.
 */
const imagenFondo = require('@/assets/images/fondo-roles.jpg');
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Mapa de avatares disponibles para la selección.
 */
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

/**
 * Lista de identificadores de avatares disponibles.
 */
const avatares = Object.keys(avatarMap);

/**
 * Pantalla de selección de avatar del usuario.
 * Permite elegir un avatar y actualizarlo en el perfil del usuario.
 * 
 * @returns {JSX.Element} Pantalla de selección de avatar.
 */
export default function ElegirAvatarScreen(): JSX.Element {
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  const router = useRouter();

    /**
   * Estado para almacenar el avatar seleccionado.
   */
  const [avatarSeleccionado, setAvatarSeleccionado] = useState<string | null>(null);

  /**
   * Función para manejar la selección del avatar.
   * 
   * @param avatarId - Identificador del avatar seleccionado.
   */
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

  /**
   * Función para regresar a la pantalla anterior.
   */
  const irAtras = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>

      {/* Fondo de la pantalla */}
      <ImageBackground source={imagenFondo} style={styles.imageBackground}>
        <View style={styles.overlay} />

        {/* Título de la pantalla */}
        <Text style={styles.titulo}>Elige tu Avatar</Text>

        {/* Contenedor de avatares disponibles */}
        <View style={styles.avatarContainer}>
          {avatares.map((avatarId) => (
            <TouchableOpacity key={avatarId} onPress={() => seleccionarAvatar(avatarId)}>
              <Image source={avatarMap[avatarId]} style={styles.avatar} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón para regresar a la pantalla anterior */}
        <TouchableOpacity 
          style={styles.containerAtras} 
          onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos de la pantalla de selección de avatar.
 */
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
    ...StyleSheet.absoluteFillObject,  
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
