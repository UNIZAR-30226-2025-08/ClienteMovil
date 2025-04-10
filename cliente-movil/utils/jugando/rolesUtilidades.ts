/**
 * @file roleUtils.ts
 * @description Funciones utilitarias para obtener información sobre los roles dentro de la partida.
 * Todas las funciones son **puras** y utilizan arrow syntax.
 */
import { CONSTANTES, Rol } from "./constantes";
const { TEXTOS, IMAGENES } = CONSTANTES;

/**
 * @function getInfoRol
 * @description Obtiene la información necesaria para mostrar el pop-up de "HABILIDAD" y el rol
 * durante la partida, combinando los detalles de la habilidad y la representación visual del rol.
 *
 * @param {Rol} rol - El rol del jugador actual.
 * @returns {Object} Objeto que contiene:
 *   - habilidadInfo: { descripcion, recuerda, imagen }
 *   - roleInfo: { roleName, image }
 *
 * @example
 * const info = getInfoRol("Bruja");
 * console.log(info.habilidadInfo.descripcion); // "Como bruja, tienes dos pociones: una para salvar a un jugador y otra para envenenar..."
 * console.log(info.roleInfo.roleName); // "BRUJA"
 */
export const getInfoRol = (rol: Rol) => {
  let habilidadInfo;
  let roleInfo;
  switch (rol) {
    case "Aldeano":
      habilidadInfo = {
        descripcion:
          "Como aldeano, no posees una habilidad especial, pero tu voto es crucial para la aldea.",
        recuerda: "",
        imagen: IMAGENES.ALDEANO,
      };
      roleInfo = { roleName: "ALDEANO", image: IMAGENES.ALDEANO };
      break;
    case "Hombre lobo":
      habilidadInfo = {
        descripcion:
          "Eres El Lobo. Tienes el poder de matar a un jugador durante la noche, pero ten cuidado de no ser descubierto.",
        recuerda:
          "Recuerda: Los lobos deben ponerse de acuerdo sobre a quién asesinar en la noche.",
        imagen: IMAGENES.HABILIDAD,
      };
      roleInfo = { roleName: "HOMBRE LOBO", image: IMAGENES.LOBO_ROL };
      break;
    case "Bruja":
      habilidadInfo = {
        descripcion:
          "Como bruja, tienes dos pociones: una para salvar a un jugador y otra para envenenar. Úsalas con sabiduría.",
        recuerda: "Recuerda: Cada poción solo se puede usar una vez.",
        imagen: IMAGENES.BRUJA,
      };
      roleInfo = { roleName: "BRUJA", image: IMAGENES.BRUJA };
      break;
    case "Cazador":
      habilidadInfo = {
        descripcion:
          "Si mueres, puedes disparar a otro jugador en venganza. Usa tu habilidad para proteger a la aldea.",
        recuerda:
          "Recuerda: Tu disparo final puede cambiar el destino del juego.",
        imagen: IMAGENES.CAZADOR,
      };
      roleInfo = { roleName: "CAZADOR", image: IMAGENES.CAZADOR };
      break;
    case "Vidente":
      habilidadInfo = {
        descripcion:
          "Como vidente, tienes la capacidad de descubrir la verdadera identidad de un jugador cada noche. Observa con cuidado y elige bien a quién investigar.",
        recuerda:
          "Recuerda: La información que obtengas puede ser crucial para salvar a la aldea o desenmascarar a los lobos.",
        imagen: IMAGENES.VIDENTE,
      };
      roleInfo = { roleName: "VIDENTE", image: IMAGENES.VIDENTE };
      break;
    default:
      habilidadInfo = {
        descripcion: "??????.",
        recuerda: "Recuerda: ??????.",
        imagen: IMAGENES.IMAGEN_MISSING,
      };
      roleInfo = { roleName: "??????", image: IMAGENES.IMAGEN_MISSING };
      break;
  }
  return { habilidadInfo, roleInfo };
};
