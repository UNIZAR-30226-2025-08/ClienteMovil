/**
 * @file Código necesario para compartir código entre pantallas dentro de `/app/(jugando)`.
 * @component
 * @returns {JSX.Element} Layout que renderiza las rutas hijas.
 */
import { Slot } from "expo-router";

export default function Layout() {
  return <Slot />;
}
