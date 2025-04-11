import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

const NotificationButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/notificaciones")}
    >
      <View style={styles.iconContainer}>
        <Image
          source={require("@/assets/images/noti_icon.png")}
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  iconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    padding: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default NotificationButton;
