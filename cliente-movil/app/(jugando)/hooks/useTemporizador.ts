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
  // Inicializamos el tiempo restante con el valor actual de tiempoInicial.
  const [tiempoRestante, setTiempoRestante] = useState(tiempoInicial);
  const [temporizadorActivo, setTemporizadorActivo] = useState(activar);

  // Si el valor de tiempoInicial cambia, actualizamos el estado para reflejar el nuevo valor.
  useEffect(() => {
    setTiempoRestante(tiempoInicial);
  }, [tiempoInicial]);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (temporizadorActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    }
    // Se limpia el intervalo en cada render o cuando el componente se desmonte.
    return () => clearInterval(intervalo);
  }, [temporizadorActivo, tiempoRestante]);

  /**
   * @function reiniciarTemporizador
   * @description Reinicia el temporizador al valor actual de tiempoInicial y lo activa.
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
