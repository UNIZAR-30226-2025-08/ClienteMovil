/**
 * @file CirculoVotar - Componente que dispone en círculo imágenes de jugadores y muestra sus votos.
 *
 * Este componente calcula la posición de cada jugador en función del ángulo y del radio máximo,
 * renderizando cada imagen en una posición circular y mostrando una barra por cada voto recibido.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {any[]} props.imagenes - Arreglo de imágenes de los jugadores.
 * @param {number[]} props.votes - Arreglo con la cantidad de votos para cada jugador.
 * @param {number | null} props.selectedPlayer - Índice del jugador actualmente seleccionado.
 * @param {Function} props.onSelectPlayer - Función para manejar la selección de un jugador.
 */

import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { estilos } from "../jugando.styles";
import { CONSTANTES } from "../constantes";
const { NUMERICAS, DIMENSIONES, COLORES } = CONSTANTES;
const { ANCHO, ALTO } = DIMENSIONES;

interface CirculoVotarProps {
  imagenes: any[];
  votes: number[];
  selectedPlayer: number | null;
  onSelectPlayer: (index: number) => void;
}

const CirculoVotar: React.FC<CirculoVotarProps> = ({ imagenes, votes, selectedPlayer, onSelectPlayer }) => {
  // Calcula el radio máximo del círculo basado en las dimensiones mínimas de la pantalla y un multiplicador.
  const radioMaximoCalculado = Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_RADIO;
  // Calcula el tamaño de cada imagen proporcional al tamaño de la pantalla.
  const tamanioImagen = Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_TAMANIO_IMAGEN;
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
      {imagenes.slice(0, NUMERICAS.CANTIDAD_IMAGENES).map((img, indice) => {
        // Calcula el ángulo para posicionar la imagen de cada jugador uniformemente en el círculo.
        const angulo = (indice * 2 * Math.PI) / NUMERICAS.CANTIDAD_IMAGENES;
        // Calcula la posición X e Y basadas en el ángulo y el radio máximo.
        const x = radioMaximo * Math.cos(angulo);
        const y = radioMaximo * Math.sin(angulo);
        // Determina si el jugador actual está seleccionado para resaltar su imagen.
        const isSelected = selectedPlayer === indice;
        return (
          // Botón que representa cada jugador; al pulsar se ejecuta onSelectPlayer.
          <TouchableOpacity
            key={indice}
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
                },
              ]}
            >
              <Image source={img} style={estilos.imagenCirculo} />
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
