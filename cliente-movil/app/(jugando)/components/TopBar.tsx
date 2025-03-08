import React from "react";
import { View, Image, Text } from "react-native";
import { estilos } from "../jugando.styles";
import { CONSTANTES } from "../constants";
const { TEXTOS, IMAGENES } = CONSTANTES;
const TopBar: React.FC = () => (
  <View style={estilos.contenedorTopBar}>
    <View style={estilos.seccionTopBarIzquierda}>
      <View style={estilos.contenedorTopBarItem}>
        <Image source={IMAGENES.PUEBLO} style={estilos.iconoTopBar} />
        <View style={estilos.textoTopBarContainer}>
          <Text style={estilos.textoTopBarTitulo}>{TEXTOS.PUEBLO}</Text>
          <Text style={estilos.textoTopBarSub}>{TEXTOS.ESTADO_PUEBLO}</Text>
        </View>
      </View>
    </View>
    <View style={estilos.seccionTopBarCentro}>
      <Text style={estilos.textoTopBarTitulo}>{TEXTOS.JORNADA}</Text>
      <Text style={estilos.textoTopBarSub}>{TEXTOS.DIA}</Text>
    </View>
    <View style={estilos.seccionTopBarDerecha}>
      <View style={estilos.contenedorTopBarItem}>
        <View style={estilos.textoTopBarContainer}>
          <Text style={estilos.textoTopBarTitulo}>{TEXTOS.LOBOS}</Text>
          <Text style={estilos.textoTopBarSub}>{TEXTOS.ESTADO_LOBOS}</Text>
        </View>
        <Image source={IMAGENES.LOBOS} style={estilos.iconoTopBar} />
      </View>
    </View>
  </View>
);
export default TopBar;
