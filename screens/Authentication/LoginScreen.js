import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../services/authContext";
import { useEffect } from "react";
import {
  ActivityIndicator,
  TextInput,
  Button,
  withTheme,
} from "react-native-paper";

const LoginScreen = ({ navigation, theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signIn, isSigningIn, error } = useContext(AuthContext);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });
  }, []);

  const styles = StyleSheet.create({
    img: {
      width: theme.width * 0.9,
      height: theme.height / 3,
      alignSelf: "center",
    },
    input: {
      width: theme.width * 0.9,
      marginVertical: theme.spacing.mdSm,
      alignSelf: "center",
    },
    outlineStyle: {
      borderRadius: theme.radius.medium,
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },

    buttonStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: theme.width * 0.9,
      alignSelf: "center",
      borderRadius: theme.radius.medium,
    },
    errorText: {
      color: theme.colors.tertiary,
      textAlign: "center",
      marginVertical: theme.spacing.md,
      ...theme.fonts.regular,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        style={styles.img}
        source={require("../../assets/sign_in.png")}
      ></Image>

      {isSigningIn ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: theme.spacing.xxl }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View>
            <TextInput
              placeholder="Email"
              value={email}
              mode="outlined"
              onChangeText={setEmail}
              style={styles.input}
              outlineStyle={styles.outlineStyle}
            />
            <TextInput
              placeholder="Password"
              value={password}
              mode="outlined"
              secureTextEntry={!passwordVisible}
              onChangeText={setPassword}
              style={styles.input}
              outlineStyle={styles.outlineStyle}
              right={
                <TextInput.Icon
                  icon={!passwordVisible ? "eye" : "eye-off"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
            />
          </View>
          <Button
            title="Sign In"
            contentStyle={styles.buttonStyle}
            style={{ marginTop: theme.spacing.md }}
            onPress={() => signIn(email, password)}
            mode="contained"
          >
            Sign In
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default withTheme(LoginScreen);
