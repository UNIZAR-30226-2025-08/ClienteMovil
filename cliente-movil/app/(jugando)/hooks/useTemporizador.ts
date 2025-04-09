import { useState, useEffect } from "react";
import { CONSTANTES } from "../../../utils/jugando/constantes";

/**
 * @hook useTemporizador
 * @description Maneja el temporizador del juego: decrementa el tiempo y permite reiniciarlo.
 * @param {number} tiempoInicial - Valor inicial del temporizador.
 * @param {boolean} activar - Bandera para activar el temporizador.
 */
const useTemporizador = (tiempoInicial = 30, activar = false) => {
  // Inicializamos el tiempo restante y el valor máximo con el valor actual de tiempoInicial.
  const [tiempoMax, setTiempoMax] = useState(tiempoInicial);
  const [tiempoRestante, setTiempoRestante] = useState(tiempoInicial);
  const [temporizadorActivo, setTemporizadorActivo] = useState(activar);

  // Si el valor de tiempoInicial cambia, actualizamos el estado para reflejar el nuevo valor.
  useEffect(() => {
    setTiempoMax(tiempoInicial);
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
   * @description Reinicia el temporizador al valor actual del tiempo máximo y lo activa.
   */
  const reiniciarTemporizador = () => {
    setTiempoRestante(tiempoMax);
    setTemporizadorActivo(true);
  };

  /**
   * @function actualizarMaxTiempo
   * @description Cambia el valor máximo del temporizador y reinicia el tiempo restante.
   * @param {number} nuevoTiempo - Nuevo valor del temporizador.
   */
  const actualizarMaxTiempo = (nuevoTiempo: number) => {
    setTiempoMax(nuevoTiempo);
    setTiempoRestante(nuevoTiempo);
  };

  return {
    tiempoRestante,
    reiniciarTemporizador,
    setTemporizadorActivo,
    temporizadorActivo,
    actualizarMaxTiempo,
  };
};

export default useTemporizador;
