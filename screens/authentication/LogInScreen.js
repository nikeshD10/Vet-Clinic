import React, { useState, useEffect } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";

const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = ({ navigation }) => {
    console.log(email);
    console.log(password);
  };
  return (
    <SafeAreaView>
      <StatusBar style="auto/" />
      <ScrollView>
        <Image
          style={styles.img}
          source={require("../../assets/sign_in.png")}
        ></Image>

        <View>
          <TextInput
            style={styles.input}
            onChangeText={(email) => setEmail(email)}
            placeholder="E-mail"
          />

          <TextInput
            style={styles.input}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry
            placeholder="Password"
          />
        </View>
        <Text
          style={styles.greyText}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Forgot Password? {"\n\n"}
        </Text>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: "#6F5CE2" }]}
          onPress={() => handleSignIn()}
        >
          <Text style={{ color: "#ffff", fontWeight: "bold" }}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.greyText}>
          Don't have an account?
          <Text
            style={{ color: "#6F5CE2", fontWeight: "bold" }}
            onPress={() => navigation.navigate("Register")}
          >
            Create Account
          </Text>
        </Text>
        {/* <Text style={styles.greyText}>
          Are you an vet?
          <Text style={{ color: "#6F5CE2" }}> Get here! {"\n"}</Text>
        </Text> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  img: {
    width: 308,
    height: 256,
    alignSelf: "center",
  },
  greyText: {
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
  InputBox: {
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 300,
    padding: 10,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    margin: 10,
    borderColor: "#6F5CE2",
    borderWidth: 2,
    alignSelf: "center",
  },
});
