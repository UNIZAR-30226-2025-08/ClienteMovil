import { useState, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Hook que gestiona las animaciones de opacidad para varios componentes.
 * Permite controlar animaciones de entrada (fade-in) y salida (fade-out) para varios elementos.
 *
 * @param {Object} params Parámetros para configurar el comportamiento de las animaciones.
 * @param {number} params.duracionFadeIn Duración de la animación de fade-in (entrada) en milisegundos.
 * @param {number} params.duracionEspera Duración de la espera entre fade-in y fade-out en milisegundos.
 * @param {number} params.duracionFadeOut Duración de la animación de fade-out (salida) en milisegundos.
 * @param {number} [params.numAnimaciones=1] Número de animaciones a gestionar. Por defecto es 1.
 *
 * @returns {Object} Retorna un objeto con dos propiedades:
 *   - `opacities`: Un array de valores `Animated.Value` que representan la opacidad de cada animación.
 *   - `mostrarComponentes`: Un array de valores booleanos que indican si cada componente debe ser mostrado o no.
 *
 * @example
 *
 * Para controlar varias animaciones, este hook devuelve un array de opacidades y otro de visibilidad.
 * Puedes usarlo de la siguiente manera:
 *
 * 1. **Animaciones secuenciales**: Si deseas que las animaciones se reproduzcan una tras otra, puedes configurar `numAnimaciones` para que sea mayor que 1 y gestionar el estado de cada componente en secuencia.
 *
 * 2. **Animaciones esporádicas**: Si necesitas que las animaciones se reproduzcan de manera independiente, puedes manipular `mostrarComponentes` para que se muestren de manera intermitente.
 *
 * ```ts
 * const { opacities, mostrarComponentes } = useGestorAnimaciones({
 *   duracionFadeIn: 1000,
 *   duracionEspera: 2000,
 *   duracionFadeOut: 1000,
 *   numAnimaciones: 3, // Controla 3 animaciones
 * });
 *
 * // Asumiendo 3 componentes:
 * <Animacion1 opacity={opacities[0]} mostrarComponente={mostrarComponentes[0]} />
 * <Animacion2 opacity={opacities[1]} mostrarComponente={mostrarComponentes[1]} />
 * <Animacion3 opacity={opacities[2]} mostrarComponente={mostrarComponentes[2]} />
 * ```
 */
const useGestorAnimaciones = ({
  duracionFadeIn,
  duracionEspera,
  duracionFadeOut,
  numAnimaciones = 1, // Número de animaciones a controlar
}) => {
  // Crear un array de objetos Animated.Value para cada animación
  const [opacities] = useState(
    Array(numAnimaciones)
      .fill()
      .map(() => new Animated.Value(0)) // Inicializamos cada opacidad a 0
  );

  // Crear un array para gestionar la visibilidad de los componentes
  const [mostrarComponentes, setMostrarComponentes] = useState(
    Array(numAnimaciones).fill(true) // Inicialmente, todos los componentes están visibles
  );

  useEffect(() => {
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
