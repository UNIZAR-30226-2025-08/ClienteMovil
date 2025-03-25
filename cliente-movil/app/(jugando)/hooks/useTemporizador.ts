import { useState, useEffect } from "react";
import { CONSTANTES } from "../../../utils/jugando/constantes";

/**
 * @hook useTemporizador
 * @description Maneja el temporizador del juego: decrementa el tiempo y permite reiniciarlo.
 * @param {number} tiempoInicial - Valor inicial del temporizador.
 * @param {boolean} activar - Bandera para activar el temporizador.
 */
const useTemporizador = (
  tiempoInicial = CONSTANTES.NUMERICAS.TIEMPO_INICIAL,
  activar = false
) => {
  const [tiempoRestante, setTiempoRestante] = useState(tiempoInicial);
  const [temporizadorActivo, setTemporizadorActivo] = useState(activar);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (temporizadorActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    }
    // Nota: Cuando tiempoRestante llega a 0, la acción de cambio de modo noche se gestionará en el componente principal.
    return () => clearInterval(intervalo);
  }, [temporizadorActivo, tiempoRestante]);

  /**
   * @function reiniciarTemporizador
   * @description Reinicia el temporizador al valor inicial y lo activa.
   */
  const reiniciarTemporizador = () => {
    setTiempoRestante(tiempoInicial);
    setTemporizadorActivo(true);
  };

  return {
    tiempoRestante,
    reiniciarTemporizador,
    setTemporizadorActivo,
    temporizadorActivo,
  };
};

export default useTemporizador;
