import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { estilos } from "../jugando.styles";
import { CONSTANTES } from "../constants";
const { NUMERICAS, DIMENSIONES, COLORES } = CONSTANTES;
const { ANCHO, ALTO } = DIMENSIONES;
interface VotingCircleProps {
  imagenes: any[];
  votes: number[];
  selectedPlayer: number | null;
  onSelectPlayer: (index: number) => void;
}
const VotingCircle: React.FC<VotingCircleProps> = ({ imagenes, votes, selectedPlayer, onSelectPlayer }) => {
  const radioMaximoCalculado = Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_RADIO;
  const tamanioImagen = Math.min(ANCHO, ALTO) * NUMERICAS.MULTIPLICADOR_TAMANIO_IMAGEN;
  const radioMaximo = radioMaximoCalculado - tamanioImagen / 2;
  return (
    <View style={[estilos.contenedorCirculo, { width: radioMaximoCalculado * 2, height: radioMaximoCalculado * 2, marginLeft: -radioMaximoCalculado, marginTop: -radioMaximoCalculado }]}>
      {imagenes.slice(0, NUMERICAS.CANTIDAD_IMAGENES).map((img, indice) => {
        const angulo = (indice * 2 * Math.PI) / NUMERICAS.CANTIDAD_IMAGENES;
        const x = radioMaximo * Math.cos(angulo);
        const y = radioMaximo * Math.sin(angulo);
        const isSelected = selectedPlayer === indice;
        return (
          <TouchableOpacity key={indice} onPress={() => onSelectPlayer(indice)} style={[estilos.contenedorJugador, { transform: [{ translateX: x }, { translateY: y }] }]} activeOpacity={0.7}>
            <View style={[estilos.contenedorImagenCirculo, { width: tamanioImagen, height: tamanioImagen, borderWidth: 3, borderColor: isSelected ? COLORES.SELECCIONADO : "white" }]}>
              <Image source={img} style={estilos.imagenCirculo} />
            </View>
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
export default VotingCircle;
