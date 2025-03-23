/**
 * @file roleUtils.ts
 * @description Funciones utilitarias para obtener información sobre los roles dentro de la partida.
 * Todas las funciones son **puras** y utilizan arrow syntax.
 */
import { CONSTANTES, Rol } from "../constantes";
const { TEXTOS, IMAGENES } = CONSTANTES;

/**
 * @function getHabilidadInfo
 * @description Obtiene la información necesaria para mostrar el pop-up de "HABILIDAD" dentro de la partida.
 * Incluye descripción de la habilidad, recordatorio e imagen representativa del rol.
 *
 * @param {Rol} rol - El rol del jugador actual.
 * @returns {Object} Objeto con los detalles de la habilidad.
 * @returns {string} return.descripcion - Explicación de la habilidad del rol.
 * @returns {string} return.recuerda - Recordatorio importante sobre el uso de la habilidad.
 * @returns {any} return.imagen - Imagen asociada al rol.
 *
 * @example
 * const info = getHabilidadInfo("bruja");
 * console.log(info.descripcion); // "Como bruja, tienes dos pociones: una para salvar a un jugador y otra para envenenar."
 */
export const getHabilidadInfo = (rol: Rol) => {
  switch (rol) {
    case "aldeano":
      return {
        descripcion:
          "Como aldeano, no posees una habilidad especial, pero tu voto es crucial para la aldea.",
        recuerda: "",
        imagen: IMAGENES.ALDEANO,
      };
    case "lobo":
      return {
        descripcion:
          "Eres El Lobo. Tienes el poder de matar a un jugador durante la noche, pero ten cuidado de no ser descubierto.",
        recuerda:
          "Recuerda: Los lobos deben ponerse de acuerdo sobre a quién asesinar en la noche.",
        imagen: IMAGENES.HABILIDAD,
      };
    case "bruja":
      return {
        descripcion:
          "Como bruja, tienes dos pociones: una para salvar a un jugador y otra para envenenar. Úsalas con sabiduría.",
        recuerda: "Recuerda: Cada poción solo se puede usar una vez.",
        imagen: IMAGENES.BRUJA,
      };
    case "cazador":
      return {
        descripcion:
          "Si mueres, puedes disparar a otro jugador en venganza. Usa tu habilidad para proteger a la aldea.",
        recuerda:
          "Recuerda: Tu disparo final puede cambiar el destino del juego.",
        imagen: IMAGENES.CAZADOR,
      };
    default:
      return {
        descripcion:
          "Eres El Lobo. Tienes el poder de matar a un jugador durante la noche, pero ten cuidado de no ser descubierto.",
        recuerda:
          "Recuerda: Los lobos deben ponerse de acuerdo sobre a quién asesinar en la noche.",
        imagen: IMAGENES.HABILIDAD,
      };
  }
};

/**
 * @function getRoleInfo
 * @description Obtiene la información visual para mostrar el rol del jugador durante la animación de inicio de la partida.
 *
 * @param {Rol} rol - El rol del jugador actual.
 * @returns {Object} Objeto con el nombre del rol y su imagen correspondiente.
 * @returns {string} return.roleName - Nombre del rol en mayúsculas.
 * @returns {any} return.image - Imagen representativa del rol.
 *
 * @example
 * const info = getRoleInfo("cazador");
 * console.log(info.roleName); // "CAZADOR"
 */
export const getRoleInfo = (rol: Rol) => {
  switch (rol) {
    case "aldeano":
      return { roleName: "ALDEANO", image: IMAGENES.ALDEANO };
    case "lobo":
      return { roleName: "HOMBRE LOBO", image: IMAGENES.LOBO_ROL };
    case "bruja":
      return { roleName: "BRUJA", image: IMAGENES.BRUJA };
    case "cazador":
      return { roleName: "CAZADOR", image: IMAGENES.CAZADOR };
    default:
      return { roleName: "ALDEANO", image: IMAGENES.ALDEANO }; // Si hay un error el ususario tendrá información de que es un aldeano lel.
  }
};
