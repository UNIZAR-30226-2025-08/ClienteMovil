/**
 * @file Código necesario para compartir código entre pantallas dentro de `/app/(jugando)`.
 * @component
 * @returns {JSX.Element} Layout que renderiza las rutas hijas.
 */
import { Slot } from "expo-router";
import React from "react";

export default function Layout() {
  return <Slot />;
}
