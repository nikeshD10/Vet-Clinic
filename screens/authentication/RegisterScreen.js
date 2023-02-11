import React, { Component, useState } from "react";
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

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Image
          style={styles.img}
          source={require("../../assets/register_account.png")}
        ></Image>
        <Text style={styles.header}>Create Account</Text>
        <View style={styles.ButtonView}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(name) => setName(name)}
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Phone Number"
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            onChangeText={(email) => setEmail(email)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: "#6F5CE2" }]}
        >
          <Text style={{ color: "#ffff", fontWeight: "bold" }}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.greyText}>
          Already have an account?
          <Text
            style={{ color: "#6F5CE2", fontWeight: "bold" }}
            onPress={() => navigation.navigate("Login")}
          >
            Sign in
          </Text>
        </Text>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 345,
    height: 241,
    alignSelf: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 32,
    color: "black",
    textAlign: "center",
    marginBottom: 30,
  },
  greyText: {
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
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
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
    alignSelf: "center",
  },
});
export default RegisterScreen;
