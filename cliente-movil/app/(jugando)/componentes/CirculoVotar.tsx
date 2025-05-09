/**
 * @file CirculoVotar - Componente que dispone en círculo imágenes de jugadores y muestra sus votos.
 *
 * Este componente calcula la posición de cada jugador en función del ángulo y del radio máximo,
 * renderizando cada imagen en una posición circular y mostrando una barra por cada voto recibido.
 * Si el jugador está muerto, se muestra un ícono de calavera sobre su avatar.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {any[]} props.imagenes - Arreglo de imágenes de los jugadores.
 * @param {number[]} props.votes - Arreglo con la cantidad de votos para cada jugador.
 * @param {number | null} props.JugadorSeleccionado - Índice del jugador actualmente seleccionado.
 * @param {Function} props.onSelectPlayer - Función para manejar la selección de un jugador.
 */

import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { estilos } from "../../../utils/jugando/jugando.styles";
import { CONSTANTES } from "../../../utils/jugando/constantes";

const { NUMERICAS, DIMENSIONES, COLORES } = CONSTANTES;
const { ANCHO, ALTO } = DIMENSIONES;

// Mapa de avatares
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

// Imagen de calavera para jugadores muertos
const imagenCalavera = require("@/assets/images/calavera.png");

interface CirculoVotarProps {
  jugadores: {
    id: string;
    nombre: string;
    avatar?: string;
    listo: boolean;
    rol: string;
    estaVivo: boolean;
    esAlguacil: boolean;
    haVisto: boolean;
    pocionCuraUsada: boolean;
    pocionMatarUsada: boolean;
  }[];
  votes: number[];
  JugadorSeleccionado: number | null;
  onSelectPlayer: (index: number) => void;
}

const CirculoVotar: React.FC<CirculoVotarProps> = ({
  jugadores,
  votes,
  JugadorSeleccionado,
  onSelectPlayer,
}) => {
  const cantidadJugadores = jugadores.length;

  // Calcula el radio máximo del círculo basado en las dimensiones mínimas de la pantalla y un multiplicador.
  const radioMaximoCalculado =
    Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_RADIO;
  // Calcula el tamaño de cada imagen proporcional al tamaño de la pantalla.
  const tamanioImagen =
    Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_TAMANIO_IMAGEN;
  // Ajusta el radio máximo restando la mitad del tamaño de la imagen para asegurar que la imagen se vea completa.
  const radioMaximo = radioMaximoCalculado - tamanioImagen / 2;

  return (
    // Contenedor principal del círculo. Se establece el tamaño del contenedor en función del radio calculado.
    <View
      style={[
        estilos.contenedorCirculo,
        {
          width: radioMaximoCalculado * 2,
          height: radioMaximoCalculado * 2,
          marginLeft: -radioMaximoCalculado,
          marginTop: -radioMaximoCalculado,
        },
      ]}
    >
      {jugadores.map((jugador, indice) => {
        // Calcula el ángulo para posicionar la imagen de cada jugador uniformemente en el círculo.
        const angulo = (indice * 2 * Math.PI) / cantidadJugadores;
        // Calcula la posición X e Y basadas en el ángulo y el radio máximo.
        const x = radioMaximo * Math.cos(angulo);
        const y =
          radioMaximo *
          Math.sin(angulo) *
          (1 - NUMERICAS.FACTOR_ENCOGIMIENTO_VERTICAL);
        const isSelected = JugadorSeleccionado === indice;

        //console.log(`Jugador: ${jugador.nombre}, avatar: ${jugador.avatar}`);

        // Normalizamos la clave del avatar (por si viene con mayúsculas)
        const avatarKey = jugador.avatar?.toLowerCase() ?? "avatar1";
        const avatarFuente = avatarMap[avatarKey] ?? avatarMap.avatar1;

        if (!avatarMap[avatarKey]) {
          console.warn(`⚠️ Avatar no encontrado para key: ${avatarKey}`);
        }

        return (
          // Botón que representa cada jugador; al pulsar se ejecuta onSelectPlayer.
          <TouchableOpacity
            key={jugador.id}
            onPress={() => onSelectPlayer(indice)}
            style={[
              estilos.contenedorJugador,
              { transform: [{ translateX: x }, { translateY: y }] },
            ]}
            activeOpacity={0.7}
          >
            {/* Contenedor de la imagen del jugador con borde que resalta si está seleccionado */}
            <View
              style={[
                estilos.contenedorImagenCirculo,
                {
                  width: tamanioImagen,
                  height: tamanioImagen,
                  borderWidth: 3,
                  borderColor: isSelected ? COLORES.SELECCIONADO : "white",
                  position: "relative",
                },
              ]}
            >
              <Image source={avatarFuente} style={estilos.imagenCirculo} />

              {/* Superposición de calavera para jugadores muertos */}
              {jugador.estaVivo === false && (
                <Image
                  source={imagenCalavera}
                  style={[
                    estilos.imagenCirculo,
                    {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      // tintColor: "#FFF",
                      opacity: 0.9,
                    },
                  ]}
                />
              )}
            </View>

            {/* Nombre del jugador */}
            <View style={{ position: "relative" }}>
              {/* Copias en blanco para que el texto tenga un borde */}
              <Text
                style={[
                  estilos.nombreJugadorPartida,
                  {
                    position: "absolute",
                    top: 1,
                    left: 1,
                    color: "white",
                  },
                ]}
              >
                {jugador.nombre}
              </Text>
              <Text
                style={[
                  estilos.nombreJugadorPartida,
                  {
                    position: "absolute",
                    top: 1,
                    left: -1,
                    color: "white",
                  },
                ]}
              >
                {jugador.nombre}
              </Text>
              <Text
                style={[
                  estilos.nombreJugadorPartida,
                  {
                    position: "absolute",
                    top: -1,
                    left: 1,
                    color: "white",
                  },
                ]}
              >
                {jugador.nombre}
              </Text>
              <Text
                style={[
                  estilos.nombreJugadorPartida,
                  {
                    position: "absolute",
                    top: -1,
                    left: -1,
                    color: "white",
                  },
                ]}
              >
                {jugador.nombre}
              </Text>
              {/* Texto principal */}
              <Text style={estilos.nombreJugadorPartida}>{jugador.nombre}</Text>
            </View>

            {/* Contenedor que muestra barras de votos: una barra por cada voto recibido */}
            <View style={estilos.contenedorVotos}>
              {Array.from({ length: votes[indice] }).map((_, index) => (
                <View key={index} style={estilos.barraVoto} />
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CirculoVotar;
