/**
 * @file BarraSuperior - Componente de la barra superior que muestra información del juego.
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
import { estilos } from "../../../utils/jugando/jugando.styles";
import { CONSTANTES } from "../../../utils/jugando/constantes";
const { TEXTOS, IMAGENES } = CONSTANTES;

const BarraSuperior: React.FC = () => (
  // Contenedor principal de la barra superior
  <View style={estilos.contenedorBarraSuperior}>
    {/* Sección izquierda: Información del pueblo */}
    <View style={estilos.seccionBarraSuperiorIzquierda}>
      <View style={estilos.contenedorBarraSuperiorItem}>
        <Image source={IMAGENES.PUEBLO} style={estilos.iconoBarraSuperior} />
        <View style={estilos.textoBarraSuperiorContainer}>
          <Text style={estilos.textoBarraSuperiorTitulo}>{TEXTOS.PUEBLO}</Text>
          <Text style={estilos.textoBarraSuperiorSub}>
            {TEXTOS.ESTADO_PUEBLO}
          </Text>
        </View>
      </View>
    </View>

    {/* Sección central: Información de la jornada */}
    <View style={estilos.seccionBarraSuperiorCentro}>
      <Text style={estilos.textoBarraSuperiorTitulo}>{TEXTOS.JORNADA}</Text>
      <Text style={estilos.textoBarraSuperiorSub}>{TEXTOS.DIA}</Text>
    </View>

    {/* Sección derecha: Información de los lobos */}
    <View style={estilos.seccionBarraSuperiorDerecha}>
      <View style={estilos.contenedorBarraSuperiorItem}>
        <View style={estilos.textoBarraSuperiorContainer}>
          <Text style={estilos.textoBarraSuperiorTitulo}>{TEXTOS.LOBOS}</Text>
          <Text style={estilos.textoBarraSuperiorSub}>
            {TEXTOS.ESTADO_LOBOS}
          </Text>
        </View>
        <Image source={IMAGENES.LOBOS} style={estilos.iconoBarraSuperior} />
      </View>
    </View>
  </View>
);

export default BarraSuperior;
