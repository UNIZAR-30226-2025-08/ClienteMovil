/**
 * @file TopBar - Componente de la barra superior que muestra información del juego.
 *
 * Muestra datos sobre el pueblo, la jornada y los lobos en tres secciones:
 * - Izquierda: Información del pueblo.
 * - Centro: Información de la jornada.
 * - Derecha: Información de los lobos.
 *
 * @component
 */
import React from "react";
import { View, Image, Text } from "react-native";
import { estilos } from "../jugando.styles";
import { CONSTANTES } from "../constants";
const { TEXTOS, IMAGENES } = CONSTANTES;

const TopBar: React.FC = () => (
  // Contenedor principal de la barra superior
  <View style={estilos.contenedorTopBar}>
    
    {/* Sección izquierda: Información del pueblo */}
    <View style={estilos.seccionTopBarIzquierda}>
      <View style={estilos.contenedorTopBarItem}>
        <Image source={IMAGENES.PUEBLO} style={estilos.iconoTopBar} />
        <View style={estilos.textoTopBarContainer}>
          <Text style={estilos.textoTopBarTitulo}>{TEXTOS.PUEBLO}</Text>
          <Text style={estilos.textoTopBarSub}>{TEXTOS.ESTADO_PUEBLO}</Text>
        </View>
      </View>
    </View>
    
    {/* Sección central: Información de la jornada */}
    <View style={estilos.seccionTopBarCentro}>
      <Text style={estilos.textoTopBarTitulo}>{TEXTOS.JORNADA}</Text>
      <Text style={estilos.textoTopBarSub}>{TEXTOS.DIA}</Text>
    </View>
    
    {/* Sección derecha: Información de los lobos */}
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
