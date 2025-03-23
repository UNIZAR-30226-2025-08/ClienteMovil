import { useState, useEffect } from "react";
// Importamos la variable global para mantener la lógica existente
import { MODO_NOCHE_GLOBAL } from "../jugando";

/**
 * @hook useModoDiaNoche
 * @description Maneja el cambio entre modo noche y modo día.
 * @param animacionFondo - Animación utilizada para el fondo.
 */
const useModoDiaNoche = (animacionFondo: any) => {
  const [esDeNoche, setEsDeNoche] = useState(false);

  /**
   * @function setModoDiaNoche
   * @description Cambia entre modo noche y modo día.
   * @param {boolean} mode - Indica si se debe activar el modo noche.
   */
  const setModoDiaNoche = (mode: boolean) => {
    setEsDeNoche(mode);
    if (mode) {
      animacionFondo.fadeIn(500).start();
    } else {
      animacionFondo.fadeOut(500).start();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (MODO_NOCHE_GLOBAL !== esDeNoche) {
        setModoDiaNoche(MODO_NOCHE_GLOBAL);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [esDeNoche]);

  return { esDeNoche, setModoDiaNoche };
};

export default useModoDiaNoche;
