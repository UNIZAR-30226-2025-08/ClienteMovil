import { useState, useEffect, useRef } from "react";

const useTemporizador = (tiempoInicial = 30, activar = false) => {
  const [tiempoMax, setTiempoMax] = useState(tiempoInicial);
  const tiempoMaxRef = useRef(tiempoInicial);
  const [tiempoRestante, setTiempoRestante] = useState(tiempoInicial);
  const [temporizadorActivo, setTemporizadorActivo] = useState(activar);

  useEffect(() => {
    tiempoMaxRef.current = tiempoMax;
  }, [tiempoMax]);

  useEffect(() => {
    setTiempoMax(tiempoInicial);
    setTiempoRestante(tiempoInicial);
    tiempoMaxRef.current = tiempoInicial;
  }, [tiempoInicial]);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (temporizadorActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [temporizadorActivo, tiempoRestante]);

  const reiniciarTemporizador = () => {
    // Use ref value instead of state
    setTiempoRestante(tiempoMaxRef.current);
    setTemporizadorActivo(true);
  };

  const actualizarMaxTiempo = (nuevoTiempo: number) => {
    // Update both state and ref
    setTiempoMax(nuevoTiempo);
    tiempoMaxRef.current = nuevoTiempo;
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
