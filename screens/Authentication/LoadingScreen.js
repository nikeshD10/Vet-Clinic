import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Lottie from "lottie-react-native";
import { ActivityIndicator, withTheme } from "react-native-paper";

const LoadingScreen = ({ theme }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#264653",
    },
    lottieImage: {
      width: theme.layoutSize.lg,
      height: theme.layoutSize.lg,
    },
    header: {
      color: "#fff",
      fontSize: 32,
      fontWeight: "bold",
      position: "absolute",
      top: theme.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <Lottie
        source={require("../../assets/animation/doctor_pet.json")}
        style={styles.lottieImage}
        autoPlay
        loop
      />
      <Text style={styles.header}>Vet Clinic</Text>
      {/* <ActivityIndicator size="large" color={theme.colors.secondary} /> */}
    </View>
  );
};

export default withTheme(LoadingScreen);
