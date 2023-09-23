import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useContext } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "../../services/authContext";
import Lottie from "lottie-react-native";
import { withTheme } from "react-native-paper";

const LoadingScreen = ({ navigation, theme }) => {
  // const { user } = useContext(AuthContext);
  // useEffect(() => {
  //   console.log(user);
  //   // const unsubscribe = onAuthStateChanged(auth, async (u) => {
  //   const unsubscribe = async () => {
  //     try {
  //       if (user === null) {
  //         await new Promise((resolve) => setTimeout(resolve, 3000));
  //         navigation.navigate("Login");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   // });
  //   return unsubscribe;
  // }, [user]);

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
    </View>
  );
};

export default withTheme(LoadingScreen);
