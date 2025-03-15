import React from 'react';  // Importar useState desde React
import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

/**
 * Importación de imágenes utilizadas en la pantalla del turno de día.
 */
const imagenFondoRoles = require('@/assets/images/fondo-roles.jpg');
const imagenSol = require('@/assets/images/imagen-sol.jpg');
const imagenPapiro = require('@/assets/images/papiro.png')
const imagenAtras = require('@/assets/images/botonAtras.png');

/**
 * Pantalla del turno de día en el juego.
 * Explica las mecánicas del juego cuando es de día.
 *
 * @returns {JSX.Element} Pantalla de explicación del turno de día.
 */
export default function TurnoDiaScreen(): JSX.Element | null {

  const router = useRouter();  // Usamos useRouter para manejar la navegación

  // Cargar la fuente GhostShadow
  const [loaded] = useFonts({
    GhostShadow: require('@/assets/fonts/ghost-shadow.ttf'),
  });

  if (!loaded) {
    return null; // Esperar a que se cargue la fuente
  }

  /**
   * Función para regresar a la pantalla anterior.
   */
  const irAtras = () => {
    router.back();  // Regresa a la pantalla anterior
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagenFondoRoles}
        resizeMode='cover'
        style={styles.image}
      >

      <View style={styles.overlay} />
      <Text style={styles.tituloTurnoDia}>DIA</Text>
      <Image source={imagenSol} style={styles.imageSol}></Image>
      <Image source={imagenPapiro} style={styles.imagePapiro}></Image>
      <Text style={styles.textoTurnoDia}>
        DIA (todos los jugadores tienen los ojos abiertos y hablan, 
        tratando de encontrar a los hombres lobo, mientras los hombres 
        lobo se hace pasar por aldeanos).
        El narrador indicará quién ha muerto durante la noche anterior. 
        Durante la fase del día, todos los jugadores intentarán descubrir quién(es) 
        entre ellos es un hombre lobo y tras debatir, votarán a un jugador a su 
        elección para ser linchado (el jugador con más votos será eliminado de 
        la partida y mostrará públicamente su carta).
        Las fases de noche y día se alternan sucesivamente hasta que únicamente 
        queden hombres lobo o aldeanos vivos y la partida termine con la 
        victoria de uno de los dos bandos.
      </Text>

      {/* Botón de regreso */}
      <TouchableOpacity style={styles.containerAtras} onPress={irAtras}>
            <Image source={imagenAtras} style={styles.imageAtras} />
      </TouchableOpacity>

      </ImageBackground>
    </View>
  );
}

/**
 * Estilos para la pantalla del turno de día.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  containerAtras: {
    position: 'absolute',
    bottom: 20,  
    left: '46%',  

  },

  imageAtras: {
    height: 40,
    width: 40,
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  imagePapiro: {
    height: 400,
    width: 300,
    position: 'absolute',
    bottom: "10%",
    left: "13%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,  
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  imageSol: {
    width: 170,  
    height: 170, 
    left: "30%",
    top: "15%",
    position: 'absolute',
    borderRadius: 100,
  },

  tituloTurnoDia: {
    position: 'absolute',  
    top: '5%',  
    left: '57%',  
    marginTop: 20,  
    marginLeft: -60, 
    color: 'white',  
    fontSize: 45, 
    fontWeight: 'bold',  
    textAlign: 'center',  
  },

  textoTurnoDia: {
    fontSize: 10.5,
    fontWeight: 'bold',
    position: 'absolute',
    width: 230,
    left: "25%",
    bottom: "30%"
  }
});
