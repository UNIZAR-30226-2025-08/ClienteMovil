/**
 * @file CirculoVotar - Componente que dispone en círculo imágenes de jugadores y muestra sus votos.
 *
 * Este componente calcula la posición de cada jugador en función del ángulo y del radio máximo,
 * renderizando cada imagen en una posición circular y mostrando una barra por cada voto recibido.
 * Si el jugador está muerto, se muestra un ícono de calavera sobre su avatar.
 * Si hay más de 10 jugadores, reduce el tamaño de los iconos y de los nombres, aumenta ligeramente el radio,
 * y acerca los nombres a las imágenes.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {any[]} props.jugadores - Arreglo de objetos de los jugadores.
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

  // Escala para iconos y nombres si hay más de 10 jugadores
  const escala = cantidadJugadores > 10 ? 0.8 : 1;
  // El offset del borde de texto escala junto con el texto
  const borderOffset = escala;
  // Radio extra si hay más de 10 jugadores
  const factorRadio = cantidadJugadores > 10 ? 1.1 : 1;

  // Cálculo base de radio y tamaño de imagen
  const radioBase = Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_RADIO;
  const tamanioBase = Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_TAMANIO_IMAGEN;

  // Ajustes según escala y factorRadio
  const radioCalc = radioBase * factorRadio;
  const tamanioImagen = tamanioBase * escala;
  const radio = radioCalc - tamanioImagen / 2;
  // Desplazamiento vertical del nombre para acercarlo a la imagen
  const offsetNombre = cantidadJugadores > 10 ? -tamanioImagen * 0.3 : 0;

  return (
    <View
      style={[
        estilos.contenedorCirculo,
        {
          width: radioCalc * 2,
          height: radioCalc * 2,
          marginLeft: -radioCalc,
          marginTop: -radioCalc,
        },
      ]}
    >
      {jugadores.map((jugador, index) => {
        const angulo = (index * 2 * Math.PI) / cantidadJugadores;
        const x = radio * Math.cos(angulo);
        const y = radio * Math.sin(angulo) * (1 - NUMERICAS.FACTOR_ENCOGIMIENTO_VERTICAL);

        const estaSeleccionado = JugadorSeleccionado === index;
        const avatarKey = jugador.avatar?.toLowerCase() ?? "avatar1";
        const avatarFuente = avatarMap[avatarKey] || avatarMap.avatar1;
        if (!avatarMap[avatarKey]) console.warn(`⚠️ Avatar no encontrado para key: ${avatarKey}`);

        return (
          <TouchableOpacity
            key={jugador.id}
            onPress={() => onSelectPlayer(index)}
            style={[
              estilos.contenedorJugador,
              { transform: [{ translateX: x }, { translateY: y }] },
            ]}
            activeOpacity={0.7}
          >
            <View
              style={[
                estilos.contenedorImagenCirculo,
                {
                  width: tamanioImagen,
                  height: tamanioImagen,
                  borderWidth: 3,
                  borderColor: estaSeleccionado ? COLORES.SELECCIONADO : "white",
                },
              ]}
            >
              <Image source={avatarFuente} style={estilos.imagenCirculo} />
              {!jugador.estaVivo && (
                <Image
                  source={imagenCalavera}
                  style={[
                    estilos.imagenCirculo,
                    { position: "absolute", top: 0, left: 0, opacity: 0.9 },
                  ]}
                />
              )}
            </View>
            <View
              style={{
                position: "relative",
                transform: [{ scale: escala }],
                marginTop: offsetNombre,
              }}
            >
              {[ -borderOffset, borderOffset ].map((dx) => (
                <Text
                  key={dx}
                  style={[
                    estilos.nombreJugadorPartida,
                    { position: "absolute", top: dx, left: dx, color: "white" },
                  ]}
                >
                  {jugador.nombre}
                </Text>
              ))}
              <Text style={estilos.nombreJugadorPartida}>{jugador.nombre}</Text>
            </View>
            <View style={estilos.contenedorVotos}>
              {Array.from({ length: votes[index] }).map((_, i) => (
                <View key={i} style={estilos.barraVoto} />
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CirculoVotar;
