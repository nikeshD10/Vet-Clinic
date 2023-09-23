import { StatusBar, View, Text } from "react-native";
import React, { useState, useContext } from "react";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { withTheme } from "react-native-paper";
import { AuthContext } from "../../services/authContext";

const ChangePassword = ({ theme, navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      if (newPassword === confirmPassword) {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword
        );
        reauthenticateWithCredential(user, credential)
          .then(() => {
            updatePassword(user, newPassword)
              .then(async () => {
                alert("Password updated!");
                await logout();
                setIsLoading(false);
                setError(null);
              })
              .catch((e) => {
                setError("Unsuccessfull to update password");
                setIsLoading(false);
              });
          })
          .catch((e) => {
            setError("Old password is incorrect");
            setIsLoading(false);
          });
      } else {
        setError("Passwords do not match");
        setIsLoading(false);
      }
    } catch (e) {
      setError("Something went wrong");
      setIsLoading(false);
      navigation.goBack();
    }
  };
  return (
    <View>
      {!isLoading ? (
        <>
          <View
            style={{
              alignItems: "center",
              marginTop: theme.spacing.xl,
              marginHorizontal: theme.spacing.sm,
              padding: theme.spacing.md,
              borderWidth: 2,
              borderColor: "black",
              borderRadius: theme.roundness,
              backgroundColor: theme.colors.white,
            }}
          >
            <View style={{ width: "100%" }}>
              {error && (
                <Text
                  style={{
                    color: theme.colors.red,
                    textAlign: "center",
                    marginBottom: theme.spacing.md,
                  }}
                >
                  {error}
                </Text>
              )}
              <TextInput
                label="Current Password"
                value={currentPassword}
                onChangeText={(currentPassword) =>
                  setCurrentPassword(currentPassword)
                }
                mode="outlined"
                outlineStyle={{ borderRadius: theme.roundness }}
                style={{ marginVertical: theme.spacing.md }}
                secureTextEntry={!isCurrentPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={isCurrentPasswordVisible ? "eye-off" : "eye"}
                    onPress={() =>
                      setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                    }
                  />
                }
              />
              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={(newPassword) => setNewPassword(newPassword)}
                mode="outlined"
                outlineStyle={{ borderRadius: theme.roundness }}
                style={{ marginVertical: theme.spacing.md }}
                secureTextEntry={!isNewPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={isNewPasswordVisible ? "eye-off" : "eye"}
                    onPress={() =>
                      setIsNewPasswordVisible(!isNewPasswordVisible)
                    }
                  />
                }
              />
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
                mode="outlined"
                outlineStyle={{ borderRadius: theme.roundness }}
                style={{ marginVertical: 16 }}
                secureTextEntry={!isConfirmPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    onPress={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  />
                }
              />
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Button
              mode="contained"
              style={{
                backgroundColor: theme.colors.green,
                borderRadius: theme.roundness,
                marginVertical: theme.spacing.md,
                width: "80%",
              }}
              labelStyle={theme.fonts.regular}
              onPress={onSubmit}
            >
              SAVE
            </Button>
          </View>
        </>
      ) : (
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
};

export default withTheme(ChangePassword);
