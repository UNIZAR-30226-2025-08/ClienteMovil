import { Link, Stack } from "expo-router";
import { StyleSheet, View, Animated } from "react-native";
import { useState, useEffect } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  // Estado para la animación de la imagen
  const [bounceAnim] = useState(new Animated.Value(1));

  // Efecto de animación al cargar la pantalla
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        {/* Imagen de error con animación */}
        <Animated.Image
          source={require("@/assets/images/pantallaError.jpg")}
          style={[styles.image, { transform: [{ scale: bounceAnim }] }]}
        />
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>
            Whoops! This screen doesn't exist.
          </ThemedText>
          <ThemedText style={styles.description}>
            We couldn't find the page you were looking for. But don't worry, you
            can go back home!
          </ThemedText>
          <Link href="/" style={styles.link}>
            <ThemedText type="link" style={styles.linkText}>
              Go to home screen
            </ThemedText>
          </Link>
        </View>
      </ThemedView>
    </>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 20,
  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    opacity: 0.8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },

  link: {
    marginTop: 20,
    paddingVertical: 10,
  },

  linkText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "600",
  },
});
