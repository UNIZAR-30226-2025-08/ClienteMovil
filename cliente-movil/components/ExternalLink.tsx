import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";

/**
 * Props para el componente ExternalLink
 * @extends Omit<ComponentProps<typeof Link>, "href">
 */
type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** URL a la que se redirigirá al hacer clic */
  href: string;
};

/**
 * Componente que maneja enlaces externos, abriéndolos en el navegador del dispositivo
 * en plataformas móviles y en una nueva pestaña en web.
 *
 * @param props - Propiedades del componente
 * @param props.href - URL a la que se redirigirá
 * @param props.rest - Resto de propiedades del componente Link
 * @returns Componente Link con comportamiento personalizado para enlaces externos
 */
export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as unknown as import("expo-router").Href}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
