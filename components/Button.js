import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { fontSizes, radius, spacing } from "../utils/sizes";
import { colors } from "../utils/colors";

const Button = ({ text, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.buttonStyle, { backgroundColor: color }]}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: radius.cornerHarden,
    padding: spacing.sm,
    backgroundColor: "#2C4975",
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: fontSizes.md,
    textAlign: "center",
  },
});
