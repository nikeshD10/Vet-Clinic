import React, { Component, useState } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const ForgotPassword = ({ navigation }) => {
  const [resetEmail, setResetEmail] = useState("");
  return (
    <View>
      <StatusBar style="auto" />
      <Image
        style={styles.img}
        source={require("../../assets/forgot_pass.png")}
      ></Image>
      <Text style={styles.header}>Forgot Password</Text>
      <View style={styles.ButtonView}>
        <TextInput
          style={styles.input}
          onChangeText={(resetEmail) => setResetEmail(resetEmail)}
          placeholder="E-mail"
        />
        <TouchableOpacity style={styles.ResetPassword}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.descText}>
        Already have an account?
        <Text
          style={{ color: "#6F5CE2" }}
          onPress={() => navigation.navigate("Login")}
        >
          {" "}
          Sign in
        </Text>
      </Text>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  img: {
    width: 325,
    height: 239,
    alignSelf: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 32,
    color: "black",
    textAlign: "center",
    marginBottom: 30,
  },
  descText: {
    fontStyle: "normal",
    fontSize: 16,
    color: "#ACA6A6",
    textAlign: "center",
  },
  buttonTxt: {
    fontWeight: "bold",
    fontSize: 24,
    color: "black",
    textAlign: "center",
  },
  ButtonView: {
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ResetPassword: {
    width: 300,
    padding: 10,
    backgroundColor: "#6F5CE2",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    margin: 10,
  },
  input: {
    width: 300,
    padding: 10,
    backgroundColor: "#ffff",
    alignItems: "center",
    borderRadius: 12,
    margin: 10,
    borderColor: "#6F5CE2",
    borderWidth: 2,
  },
});
