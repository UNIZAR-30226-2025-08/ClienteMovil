import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  bgColor?: string;
  textColor?: string;
  width?: number | `${number}%`;
  height?: number;
  fontFamily?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  bgColor = "#007bff",
  textColor = "#fff",
  width,
  height,
  fontFamily,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          width: width ?? "80%",
          height: height ?? 50,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontFamily }]}>
        {title}
      </Text>
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
