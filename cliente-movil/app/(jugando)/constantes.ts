/**
 * @file Constantes globales de la partida.
 * - La mayoría están **hardcoded por diseño**.
 * - Otras están **hardcoded temporalmente** por falta de integración con el backend (marcadas con "TODO").
 * @module constantes
 */
import { Dimensions } from "react-native";

/**
 * @constant {number} ANCHO - Ancho de la pantalla en píxeles.
 * @constant {number} ALTO - Alto de la pantalla en píxeles.
 */
const { width: ANCHO, height: ALTO } = Dimensions.get("window");

/**
 * @constant CONSTANTES - Contiene todos los valores globales utilizados en la partida.
 */
export const CONSTANTES = {
  TEXTOS: {
    INICIAL: "AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS",
    ROL_TITULO: "TU ROL ES",
    INICIO_PARTIDA: "EMPIEZA LA PARTIDA",
    BOTON_HABILIDAD: "HABILIDAD",
    BOTON_CHAT: "CHAT",
    BOTON_PASAR_TURNO: "Pasar turno",
    BOTON_VOTAR: "Votar",
    PUEBLO: "PUEBLO",
    LOBOS: "LOBOS",
    JORNADA: "JORNADA 2", // TODO
    DIA: "DÍA 2", // TODO
    ESTADO_PUEBLO: "5/6 vivos",
    ESTADO_LOBOS: "2/2 vivos",

    /**
     * @constant CHAT - Contiene los textos utilizados en el chat.
     */
    CHAT: {
      PLACEHOLDER: "Enviar un mensaje",
      ENVIAR: "Enviar",
      TITULO: "CHAT",
      CERRAR: "X",
      MENSAJES_INICIALES: [
        { id: 1, texto: "Jugador 2: Mensaje de prueba" }, // TODO
        { id: 2, texto: "Jugador 5: Otro mensaje" }, // TODO
      ],
    },
  },

  /**
   * @constant NUMERICAS - Contiene valores numéricos relacionados con la lógica del juego.
   */
  NUMERICAS: {
    CANTIDAD_IMAGENES: 8,
    TIEMPO_INICIAL: 60, // segundos
    MULTIPLICADOR_RADIO: 0.45,
    MULTIPLICADOR_TAMANIO_IMAGEN: 0.13,
    DURACION_ANIMACION: 1500,
    RETRASO_ANIMACION: 3000,
    BORDE_RADIO_BOTON: ANCHO * 0.0556,
    TAMANIO_ICONO_BOTON: ANCHO * 0.1,
    TAMANIO_TEMPORIZADOR: ANCHO * 0.15,
  },

  /**
   * @constant IMAGENES - Contiene referencias a los recursos gráficos utilizados en la partida.
   */
  IMAGENES: {
    FONDO: require("@/assets/images/fondo-partida-v2.png"),
    LOBO_ROL: require("@/assets/images/hombre-lobo-icon.jpeg"),
    HABILIDAD: require("@/assets/images/hombre-lobo-icon.jpeg"),
    PUEBLO: require("@/assets/images/pueblo-barra-arriba-juego.png"),
    LOBOS: require("@/assets/images/lobo-barra-arriba-juego.png"),
    JUGADORES: require("@/assets/images/jugador-icono.jpg"), // TODO
    ALDEANO: require("@/assets/images/aldeano-icon.jpeg"),
    BRUJA: require("@/assets/images/bruja-icon.jpeg"),
    CAZADOR: require("@/assets/images/cazador-icon.jpeg"),
  },

  /**
   * @constant DIMENSIONES - Define dimensiones basadas en la pantalla del dispositivo.
   */
  DIMENSIONES: {
    ANCHO,
    ALTO,
    RADIO_MAXIMO: Math.min(ANCHO, ALTO) * 0.45,
    TAMANIO_IMAGEN: Math.min(ANCHO, ALTO) * 0.13,
  },

  /**
   * @constant COLORES - Define la paleta de colores utilizada en la UI.
   */
  COLORES: {
    SELECCIONADO: "#33FF00",
    NOCTURNO: "rgba(38, 37, 34, 0.7)",
    TEXTO_PRINCIPAL: "white",
    FONDO_CHAT: "#262522",
  },
};

/**
 * @typedef {"aldeano" | "lobo" | "bruja" | "cazador"} Rol
 * @description Define los posibles roles en la partida.
 */
export type Rol = "aldeano" | "lobo" | "bruja" | "cazador";
