import { CONSTANTES, Rol } from "./constants";
const { TEXTOS, IMAGENES } = CONSTANTES;
export const getHabilidadInfo = (rol: Rol) => {
  switch (rol) {
    case "aldeano":
      return {
        descripcion: "Como aldeano, no posees una habilidad especial, pero tu voto es crucial para la aldea.",
        recuerda: "",
        imagen: IMAGENES.ALDEANO
      };
    case "lobo":
      return {
        descripcion: TEXTOS.HABILIDAD.DESCRIPCION_LOBO,
        recuerda: TEXTOS.HABILIDAD.RECUERDA_LOBO,
        imagen: IMAGENES.HABILIDAD
      };
    case "bruja":
      return {
        descripcion: "Como bruja, tienes dos pociones: una para salvar a un jugador y otra para envenenar. Úsalas con sabiduría.",
        recuerda: "Recuerda: Cada poción solo se puede usar una vez.",
        imagen: IMAGENES.BRUJA
      };
    case "cazador":
      return {
        descripcion: "Si mueres, puedes disparar a otro jugador en venganza. Usa tu habilidad para proteger a la aldea.",
        recuerda: "Recuerda: Tu disparo final puede cambiar el destino del juego.",
        imagen: IMAGENES.CAZADOR
      };
    default:
      return {
        descripcion: TEXTOS.HABILIDAD.DESCRIPCION_LOBO,
        recuerda: TEXTOS.HABILIDAD.RECUERDA_LOBO,
        imagen: IMAGENES.HABILIDAD
      };
  }
};
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
      return { roleName: "HOMBRE LOBO", image: IMAGENES.LOBO_ROL };
  }
};
