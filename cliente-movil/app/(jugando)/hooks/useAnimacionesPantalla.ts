/**
 * @file animacionesPantalla.ts
 * @description Centraliza todas las animaciones usadas en la pantalla de juego, tanto las animaciones iniciales como las nuevas.
 */

import { administradorAnimaciones } from "../hooks/animaciones";
import { ejecutarCadenaAnimacion } from "../utilidades/gestorCadenaAnimaciones";

const adminAnim = administradorAnimaciones();

export const animacionTexto = adminAnim.crearAnimacion(0);
export const animacionRol = adminAnim.crearAnimacion(0);
export const animacionInicio = adminAnim.crearAnimacion(0);
export const animacionFondo = adminAnim.crearAnimacion(1);
export const animacionEmpiezanVotacionesAlguacil = adminAnim.crearAnimacion(0);
export const animacionEmpiezanVotacionesSospechososSerLobo1 =
  adminAnim.crearAnimacion(0);
export const animacionEmpiezanVotacionesSospechososSerLobo2 =
  adminAnim.crearAnimacion(0);
export const animacionCazadorDisparo = adminAnim.crearAnimacion(0);
export const animacionBrujaCura = adminAnim.crearAnimacion(0);
export const animacionBrujaVeneno = adminAnim.crearAnimacion(0);
export const animacionDormir = adminAnim.crearAnimacion(0);
export const animacionDevoraHombresLobo = adminAnim.crearAnimacion(0);
export const animacionHombresLoboDormir = adminAnim.crearAnimacion(0);
export const animacionBrujaDespierta = adminAnim.crearAnimacion(0);
export const animacionBrujaDuerme = adminAnim.crearAnimacion(0);
export const animacionVidenteDuerme = adminAnim.crearAnimacion(0);
export const animacionVidenteDespierta = adminAnim.crearAnimacion(0);
export const animacionNocheSupervivientes = adminAnim.crearAnimacion(0);
export const animacionJugadorAlguacil = adminAnim.crearAnimacion(0);
export const animacionVotacionesConcluidas = adminAnim.crearAnimacion(0);
export const animacionElegidoPueblo = adminAnim.crearAnimacion(0);

export const administrador_animaciones = adminAnim;

/* ---------------------------------------------------------------------------
   Funciones de ejecución de animaciones (homogéneas para todas)
   Cada función utiliza el helper ejecutarCadenaAnimacion para encadenar la animación
   y el efecto de fadeOut del fondo.
--------------------------------------------------------------------------- */

/**
 * Ejecuta la animación de "HAS SIDO DISPARADO POR EL CAZADOR".
 * El texto se mostrará en azul.
 */
export function ejecutarAnimacionCazadorDisparo(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "cazador-disparo",
    animacionCazadorDisparo,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "EMPIZAN VOTACIONES ALGUACIL".
 */
export function ejecutarAnimacionEmpiezanVotacionesAlguacil(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "empiezan-votaciones-alguacil",
    animacionEmpiezanVotacionesAlguacil,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "HAS SIDO CURADO POR LA BRUJA".
 * El texto se mostrará en naranja.
 */
export function ejecutarAnimacionBrujaCura(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "bruja-cura",
    animacionBrujaCura,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "HAS SIDO ENVENENADO POR LA BRUJA".
 * El texto se mostrará en naranja.
 */
export function ejecutarAnimacionBrujaVeneno(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "bruja-veneno",
    animacionBrujaVeneno,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "ESTÁS DURMIENDO".
 */
export function ejecutarAnimacionDormir(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "dormir",
    animacionDormir,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "HAS SIDO EL DEVORADO POR LOS HOMBRES LOBO".
 * El texto se mostrará en rojo.
 */
export function ejecutarAnimacionDevoraHombresLobo(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "devora-hombres-lobo",
    animacionDevoraHombresLobo,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "LOS HOMBRES LOBO SACIADOS VUELVEN A DORMIRSE Y SUEÑAN CON PRÓXIMAS Y SABROSAS VÍCTIMAS".
 * El texto se mostrará en rojo.
 */
export function ejecutarAnimacionHombresLoboDormir(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "hombres-lobo-dormir",
    animacionHombresLoboDormir,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "LA BRUJA SE DESPIERTA, OBSERVA LA NUEVA VÍCTIMA DE LOS HOMBRES LOBO. USARÁ SU POCIÓN CURATIVA O SU POCIÓN VENENOSA".
 * El texto se mostrará en naranja.
 */
export function ejecutarAnimacionBrujaDespierta(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "bruja-despierta",
    animacionBrujaDespierta,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "LA BRUJA SE VUELVE A DORMIR".
 * El texto se mostrará en naranja.
 */
export function ejecutarAnimacionBrujaDuerme(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "bruja-duerme",
    animacionBrujaDuerme,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "LA VIDENTE SE VUELVE A DORMIR".
 * El texto se mostrará en morado.
 */
export function ejecutarAnimacionVidenteDuerme(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "vidente-duerme",
    animacionVidenteDuerme,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "LA VIDENTE SE DESPIERTA Y SEÑALA A UN JUGADOR DEL QUE QUIERE CONOCER LA VERDADERA PERSONALIDAD".
 * El texto se mostrará en morado.
 */
export function ejecutarAnimacionVidenteDespierta(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "vidente-despierta",
    animacionVidenteDespierta,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "SE HACE DE NOCHE; LOS SUPERVIVIENTES VUELVEN A DORMIR".
 */
export function ejecutarAnimacionNocheSupervivientes(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "noche-supervivientes",
    animacionNocheSupervivientes,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "JUGADOR 4 ES EL AGUACIL".
 * El número "4" es variable y puede modificarse en ejecución.
 */
export function ejecutarAnimacionJugadorAlguacil(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>,
  numeroAlguacil: number
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  // Se puede utilizar numeroAlguacil para personalizar el mensaje si es necesario.
  ejecutarCadenaAnimacion(
    "jugador-alguacil",
    animacionJugadorAlguacil,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "LAS VOTACIONES HAN CONCLUIDO".
 */
export function ejecutarAnimacionVotacionesConcluidas(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "votaciones-concluidas",
    animacionVotacionesConcluidas,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}

/**
 * Ejecuta la animación de "HAS SIDO EL ELEGIDO POR EL PUEBLO".
 * El texto se mostrará en amarillo.
 */
export function ejecutarAnimacionElegidoPueblo(
  setMostrar: (valor: boolean) => void,
  animFondo: any,
  setCurrentAnimacion: (nombre: string) => void,
  iniciarAnimacion: (
    nombreAnimacion: string,
    anim: any,
    animatedValue: any,
    valorFinal: number,
    callback: () => void
  ) => void,
  iniciarDelay: (delay: number, callback: () => void) => void,
  startFadeOutNowRef: React.MutableRefObject<(() => void) | null>
) {
  animFondo.value.setValue(1);
  setMostrar(true);
  ejecutarCadenaAnimacion(
    "elegido-pueblo",
    animacionElegidoPueblo,
    administrador_animaciones.RETRASO_ANIMACION,
    () => {
      setCurrentAnimacion("fondo-fadeOut");
      iniciarAnimacion(
        "fondo-fadeOut",
        animFondo.fadeOut(),
        animFondo.value,
        0,
        () => {
          setMostrar(false);
          setCurrentAnimacion("");
        }
      );
    },
    setCurrentAnimacion,
    iniciarAnimacion,
    iniciarDelay,
    startFadeOutNowRef
  );
}
