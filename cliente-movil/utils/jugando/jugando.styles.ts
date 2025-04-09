/**
 * @file jugando.styles.ts
 * @description Estilos para la pantalla de juego. Define la apariencia y disposición de los componentes visuales.
 *
 * @module jugando.styles
 */

import { Dimensions, StyleSheet } from "react-native";

// Para que la partida sea épicamente responsiva
/**
 * @constant {number} ancho - Ancho de la pantalla en píxeles.
 * @constant {number} alto - Alto de la pantalla en píxeles.
 */
const { width: ancho, height: alto } = Dimensions.get("window");

/**
 * @constant BORDE_RADIO_BOTON - Radio del borde de los botones, calculado en base al ancho de la pantalla.
 * @constant TAMANIO_ICONO_BOTON - Tamaño del ícono dentro de los botones.
 * @constant TAMANIO_TEMPORIZADOR - Tamaño del temporizador central.
 */
const BORDE_RADIO_BOTON = ancho * 0.0556;
const TAMANIO_ICONO_BOTON = ancho * 0.1;
const TAMANIO_TEMPORIZADOR = ancho * 0.15;

/**
 * @constant textoBlancoCorben - Estilo base para textos blancos con fuente "Corben".
 */
const textoBlancoCorben = {
  color: "white",
  fontFamily: "Corben",
};

/**
 * @constant estilos - Contiene los estilos de la pantalla de juego.
 */
export const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: alto * 0.07,
  },

  fondo: {
    width: "100%",
    height: "100%",
  },

  superposicion: {
    backgroundColor: "rgba(38, 37, 34, 0.95)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  contenedorTexto: {
    position: "absolute",
    width: "80%",
    top: "25%",
    justifyContent: "center",
    alignItems: "center",
  },

  texto: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.09,
    textAlign: "center",
    paddingHorizontal: ancho * 0.05,
  },

  contenedorRol: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    top: "35%",
    flexDirection: "column",
  },

  contenedorTextoRol: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: alto * 0.1,
    paddingHorizontal: ancho * 0.05,
  },

  textoRol: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.1,
    textAlign: "center",
    lineHeight: ancho * 0.12,
    paddingVertical: alto * 0.005,
    includeFontPadding: true,
  },

  imagenRol: {
    width: ancho * 0.35,
    height: ancho * 0.35,
    marginBottom: alto * 0.05,
  },

  nombreRol: {
    textAlign: "center",
    fontSize: ancho * 0.12,
    fontFamily: "Corben",
    fontWeight: "bold",
  },

  textoInicio: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.1,
    textAlign: "center",
    top: "115%",
    paddingHorizontal: ancho * 0.05,
  },

  contenedorBotones: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: ancho * 0.1,
  },

  botonHabilidad: {
    flex: 1,
    backgroundColor: "#262522",
    height: alto * 0.13,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: BORDE_RADIO_BOTON,
    borderTopRightRadius: BORDE_RADIO_BOTON,
    maxWidth: "45%",
    marginRight: ancho * 0.12,
  },

  botonChat: {
    flex: 1,
    backgroundColor: "#262522",
    height: alto * 0.07,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: BORDE_RADIO_BOTON,
    borderTopRightRadius: BORDE_RADIO_BOTON,
    maxWidth: "45%",
    marginLeft: ancho * 0.02,
  },

  nombreJugadorPartida: {
    marginTop: 4,
    color: "black",
    fontWeight: "bold",
  },

  iconoBoton: {
    width: TAMANIO_ICONO_BOTON,
    height: TAMANIO_ICONO_BOTON,
    marginBottom: ancho * 0.02,
  },

  textoBoton: {
    color: "white",
    fontSize: ancho * 0.05,
    fontWeight: "bold",
    textAlign: "center",
  },

  contenedorBarraSuperior: {
    position: "absolute",
    top: alto * 0.06,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#262522",
    paddingVertical: alto * 0.03,
    paddingHorizontal: ancho * 0.04,
  },

  seccionBarraSuperiorIzquierda: {
    flex: 1,
    alignItems: "flex-start",
  },

  seccionBarraSuperiorCentro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  seccionBarraSuperiorDerecha: {
    flex: 1,
    alignItems: "flex-end",
  },

  contenedorBarraSuperiorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: ancho * 0.02,
  },

  iconoBarraSuperior: {
    width: ancho * 0.1,
    height: ancho * 0.1,
    borderRadius: ancho * 0.02,
  },

  textoBarraSuperiorContainer: {
    flexDirection: "column",
  },

  textoBarraSuperiorTitulo: {
    color: "white",
    fontSize: ancho * 0.04,
    fontWeight: "bold",
  },

  textoBarraSuperiorSub: {
    color: "white",
    fontSize: ancho * 0.03,
    fontWeight: "bold",
    opacity: 0.9,
  },

  contenedorCirculo: {
    position: "absolute",
    top: "67%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
  },

  contenedorJugador: {
    position: "absolute",
    alignItems: "center",
  },

  contenedorImagenCirculo: {
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  imagenCirculo: {
    width: "100%",
    height: "100%",
  },

  contenedorVotos: {
    position: "absolute",
    bottom: -alto * 0.025,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: ancho * 0.005,
  },

  barraVoto: {
    width: ancho * 0.008,
    height: alto * 0.015,
    backgroundColor: "black",
    borderRadius: ancho * 0.002,
  },

  contenedorTemporizador: {
    position: "absolute",
    top: alto * 0.2,
    left: ancho * 0.05,
    zIndex: 2,
  },

  circuloTemporizador: {
    width: TAMANIO_TEMPORIZADOR,
    height: TAMANIO_TEMPORIZADOR,
    borderRadius: TAMANIO_TEMPORIZADOR / 2,
    backgroundColor: "#262522",
    justifyContent: "center",
    alignItems: "center",
  },

  textoTemporizador: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.05,
    fontWeight: "bold",
  },

  contenedorBotonesDerecha: {
    position: "absolute",
    top: alto * 0.2,
    right: ancho * 0.05,
    zIndex: 2,
    gap: ancho * 0.02,
  },

  botonAccion: {
    backgroundColor: "#262522",
    paddingVertical: alto * 0.02,
    paddingHorizontal: ancho * 0.06,
    borderRadius: ancho * 0.07,
    alignItems: "center",
    minWidth: ancho * 0.33,
  },

  botonVotar: {
    backgroundColor: "#262522",
  },

  contenedorChat: {
    position: "absolute",
    zIndex: 9999,
    left: ancho * 0.05,
    right: ancho * 0.05,
    bottom: 0,
    height: alto * 0.87,
    backgroundColor: "#262522",
    borderTopLeftRadius: ancho * 0.05,
    borderTopRightRadius: ancho * 0.05,
    padding: ancho * 0.04,
    borderWidth: ancho * 0.002,
    elevation: 50,
    shadowColor: "#262522",
    shadowOffset: { width: 0, height: alto * 0.003 },
    shadowOpacity: 0.5,
    shadowRadius: ancho * 0.02,
  },

  botonCerrarChat: {
    position: "absolute",
    top: alto * 0.02,
    right: ancho * 0.04,
    zIndex: 99999,
    padding: ancho * 0.02,
    backgroundColor: "#262522",
    borderRadius: ancho * 0.015,
    minWidth: ancho * 0.08,
    minHeight: ancho * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },

  textoCerrarChat: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    includeFontPadding: true,
    textAlignVertical: "center",
    marginBottom: -alto * 0.005,
  },

  tituloChat: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: alto * 0.02,
  },

  separadorChat: {
    height: 1,
    backgroundColor: "white",
    marginVertical: alto * 0.02,
  },

  contenedorMensajesChat: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: alto * 0.02,
  },

  mensajeChat: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.04,
    marginBottom: alto * 0.015,
    lineHeight: ancho * 0.05,
    includeFontPadding: true,
  },

  contenedorEntradaChat: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: alto * 0.02,
  },

  entradaChat: {
    ...textoBlancoCorben,
    flex: 1,
    height: alto * 0.07,
    borderWidth: ancho * 0.002,
    borderColor: "white",
    backgroundColor: "#262522",
    borderRadius: ancho * 0.02,
    paddingHorizontal: ancho * 0.03,
    fontSize: ancho * 0.04,
  },

  botonEnviarChat: {
    backgroundColor: "green",
    height: alto * 0.07,
    justifyContent: "center",
    paddingHorizontal: ancho * 0.04,
    borderRadius: ancho * 0.02,
    borderWidth: ancho * 0.002,
    marginLeft: ancho * 0.02,
  },

  textoBotonEnviarChat: {
    ...textoBlancoCorben,
    fontWeight: "bold",
    fontSize: ancho * 0.04,
  },

  contenedorHabilidad: {
    position: "absolute",
    zIndex: 9999,
    left: ancho * 0.05,
    right: ancho * 0.05,
    bottom: 0,
    height: alto * 0.6,
    backgroundColor: "#262522",
    borderTopLeftRadius: ancho * 0.05,
    borderTopRightRadius: ancho * 0.05,
    padding: ancho * 0.04,
    borderWidth: ancho * 0.002,
    elevation: 50,
    shadowColor: "#262522",
    shadowOffset: { width: 0, height: alto * 0.003 },
    shadowOpacity: 0.5,
    shadowRadius: ancho * 0.02,
  },

  botonCerrarHabilidad: {
    position: "absolute",
    top: alto * 0.02,
    right: ancho * 0.04,
    zIndex: 99999,
    padding: ancho * 0.02,
    backgroundColor: "#262522",
    borderRadius: ancho * 0.015,
    minWidth: ancho * 0.08,
    minHeight: ancho * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },

  textoCerrarHabilidad: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    includeFontPadding: true,
    textAlignVertical: "center",
    marginBottom: -alto * 0.005,
  },

  contenedorTituloHabilidad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: alto * 0.02,
  },

  iconoHabilidadPopup: {
    width: ancho * 0.12,
    height: ancho * 0.12,
    marginRight: ancho * 0.02,
  },

  tituloHabilidad: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.07,
    fontWeight: "bold",
    textAlign: "center",
  },

  separadorHabilidad: {
    height: 1,
    backgroundColor: "white",
    marginVertical: alto * 0.02,
  },

  contenedorInfoHabilidad: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: alto * 0.02,
  },

  textoHabilidad: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.05,
    marginBottom: alto * 0.015,
    lineHeight: ancho * 0.06,
    includeFontPadding: true,
  },

  textoRecuerda: {
    ...textoBlancoCorben,
    fontSize: ancho * 0.045,
    marginTop: alto * 0.02,
    lineHeight: ancho * 0.055,
    includeFontPadding: true,
  },

  contenedorError: {
    position: "absolute",
    top: alto * 0.08,
    alignSelf: "center",
    backgroundColor: "#ff4444",
    paddingVertical: alto * 0.02,
    paddingHorizontal: ancho * 0.05,
    borderRadius: alto * 0.03,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: ancho * 0.005,
      height: alto * 0.005,
    },
    shadowOpacity: 0.25,
    shadowRadius: alto * 0.005,
    maxWidth: ancho * 0.9,
    minHeight: alto * 0.06,
    alignItems: "center",
    justifyContent: "center",
  },

  textoError: {
    ...textoBlancoCorben,
    fontSize: alto * 0.02,
    textAlign: "center",
    lineHeight: alto * 0.03,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  iconoAlguacil: {
    width: alto * 0.09,
    height: alto * 0.09,
    position: "absolute",
    top: "30%",
    left: "3%",
    alignSelf: "center",
    zIndex: 1,
  },
});
