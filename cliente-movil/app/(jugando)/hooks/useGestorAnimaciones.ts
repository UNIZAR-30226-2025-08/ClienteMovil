import { useState, useEffect } from "react";
import { Animated } from "react-native";

// Definir el tipo para los parámetros de la función
interface GestorAnimacionesParams {
  duracionFadeIn: number;
  duracionEspera: number;
  duracionFadeOut: number;
  numAnimaciones?: number; // Puede ser opcional, con valor por defecto 1
}

/**
 * Hook que gestiona las animaciones de opacidad para varios componentes.
 * Permite controlar animaciones de entrada (fade-in) y salida (fade-out) para varios elementos.
 *
 * @param {GestorAnimacionesParams} params Parámetros para configurar el comportamiento de las animaciones.
 * @returns {Object} Retorna un objeto con dos propiedades:
 *   - `opacities`: Un array de valores `Animated.Value` que representan la opacidad de cada animación.
 *   - `mostrarComponentes`: Un array de valores booleanos que indican si cada componente debe ser mostrado o no.
 */
const useGestorAnimaciones = ({
  duracionFadeIn,
  duracionEspera,
  duracionFadeOut,
  numAnimaciones = 1,
  start = false, // Para que no se haga trigger de la lógica de la animación hasta que se quiera
}: GestorAnimacionesParams & { start?: boolean }) => {
  // Crear un array de objetos Animated.Value para cada animación
  const [opacities] = useState(
    Array(numAnimaciones).fill(new Animated.Value(0))
  );

  // Crear un array para gestionar la visibilidad de los componentes
  const [mostrarComponentes, setMostrarComponentes] = useState(
    Array(numAnimaciones).fill(true) // Inicialmente, todos los componentes están visibles
  );

  useEffect(() => {
    if (!start) return; // Solo inicia la animación si 'start' es true

    // Función que maneja las animaciones en secuencia
    const animate = async () => {
      for (let i = 0; i < numAnimaciones; i++) {
        if (mostrarComponentes[i]) {
          // Animación de fade-in (entrada)
          await new Promise((resolve) => {
            Animated.timing(opacities[i], {
              toValue: 1, // Fade-in hasta opacidad 1
              duration: duracionFadeIn,
              useNativeDriver: true,
            }).start(resolve);
          });

          // Esperar antes de iniciar la animación de fade-out
          await new Promise((resolve) => setTimeout(resolve, duracionEspera));

          // Animación de fade-out (salida)
          await new Promise((resolve) => {
            Animated.timing(opacities[i], {
              toValue: 0, // Fade-out hasta opacidad 0
              duration: duracionFadeOut,
              useNativeDriver: true,
            }).start(resolve);
          });
        }
      }
    };

    animate();
  }, [
    start, // Se añade 'start' como dependencia para controlar el trigger
    duracionFadeIn,
    duracionEspera,
    duracionFadeOut,
    numAnimaciones,
    opacities,
    mostrarComponentes,
  ]);

  return { opacities, mostrarComponentes };
};

export default useGestorAnimaciones;
