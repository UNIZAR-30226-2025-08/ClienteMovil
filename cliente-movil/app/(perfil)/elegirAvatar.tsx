/**
 * @file ElegirAvatarScreen.tsx
 * @description Pantalla que permite a los usuarios seleccionar
 * un avatar para su perfil.
 * La pantalla muestra una lista de avatares disponibles y permite actualizar
 * el avatar en el backend.
 * Después de seleccionar un avatar, se guarda en el perfil del usuario.
 */

import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Text,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

/**
 * Imágenes utilizadas en la pantalla de selección de avatar.
 *
 * @remarks
 * Estas imágenes se usan como fondo de la pantalla y para el
 * botón de retroceso.
 */
const imagenFondo = require("@/assets/images/fondo-roles.jpg");
const imagenAtras = require("@/assets/images/botonAtras.png");

/**
 * Mapa de avatares disponibles para la selección.
 *
 * @remarks
 * Este mapa contiene las claves de los avatares y las rutas a las imágenes locales correspondientes.
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
 *
 * @remarks
 * Esta lista se utiliza para generar dinámicamente los botones de selección de avatar.
 */
const avatares = Object.keys(avatarMap);

/**
 * Pantalla de selección de avatar del usuario.
 *
 * @remarks
 * Esta pantalla permite al usuario seleccionar un avatar de una lista de opciones. Al seleccionar un avatar,
 * se realiza una solicitud al backend para actualizar el avatar del usuario en la base de datos.
 *
 * @returns {JSX.Element} Componente visual que permite al usuario seleccionar un avatar.
 */
export default function ElegirAvatarScreen(): JSX.Element {
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;
  const router = useRouter();

  /**
   * Estado para almacenar el avatar seleccionado por el usuario.
   *
   * @remarks
   * Este estado se utiliza para rastrear el avatar seleccionado antes de que se realice la actualización.
   */
  const [avatarSeleccionado, setAvatarSeleccionado] = useState<string | null>(
    null
  );

  /**
   * Función para manejar la selección del avatar.
   *
   * @param avatarId - Identificador del avatar seleccionado por el usuario.
   * @remarks
   * Cuando el usuario selecciona un avatar, esta función maneja el proceso de actualización en el backend,
   * incluyendo la obtención del ID de usuario y correo almacenados en `AsyncStorage`.
   * Si la actualización es exitosa, se guarda el avatar seleccionado en el almacenamiento local y se navega al perfil del usuario.
   */
  const seleccionarAvatar = async (avatarId: string) => {
    try {
      const idUsuario = await AsyncStorage.getItem("idUsuario"); // Recuperar ID del usuario

      const correo = await AsyncStorage.getItem("correoUsuario");

      if (!idUsuario) {
        Alert.alert("Error", "No se pudo obtener el ID del usuario.");
        return;
      }

      if (!correo) {
        Alert.alert("Error", "No se pudo obtener el correo del usuario.");
        return;
      }

      // Enviar solicitud al backend con el ID del usuario
      const response = await axios.put(
        `${BACKEND_URL}/api/usuario/actualizar`,
        {
          idUsuario: parseInt(idUsuario), // Convertimos a número
          avatar: avatarId,
        }
      );

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
   *
   * @remarks
   * Esta función utiliza el hook `router` para navegar a la pantalla anterior.
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
            <TouchableOpacity
              key={avatarId}
              onPress={() => seleccionarAvatar(avatarId)}
            >
              <Image source={avatarMap[avatarId]} style={styles.avatar} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón para regresar a la pantalla anterior */}
        <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
          <Image source={imagenAtras} style={styles.imageAtras} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

/**
 * Estilos de la pantalla de selección de avatar.
 *
 * @remarks
 * Los estilos están diseñados para asegurar que la interfaz sea visualmente
 * atractiva y funcional en diferentes tamaños de pantalla.
 * Se incluyen estilos para el fondo, los avatares, los botones, y el
 * título de la pantalla.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },

  avatarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
