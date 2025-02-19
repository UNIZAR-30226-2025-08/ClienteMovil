import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress, bgColor = "#007bff", textColor = "#fff", width = "80%", height = 50 }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: bgColor, width, height }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomButton;
