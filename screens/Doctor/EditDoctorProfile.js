import {
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { withTheme, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { DoctorContext } from "../../services/doctorContext";

const EditDoctorProfile = ({ theme, route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({});

  const {
    doctor: user,
    updateDoctor: updateUser,
    updateProfile,
  } = useContext(DoctorContext);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handlePress = () => {
    setIsPressed(!isPressed);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      minHeight: "100%",
    },
    profile: {
      margin: theme.spacing.md,
      alignItems: "center",
    },
    profile_background: {
      borderRadius: theme.roundness,
      height: theme.layoutSize.lg,
      width: "100%",
    },
    roundImage: {
      borderRadius: theme.radius.max,
      height: theme.layoutSize.mdSm,
      width: theme.layoutSize.mdSm,
    },
    imageOnPress: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      // padding: theme.spacing.sm,// To make transparent black background push little up
      borderRadius: theme.radius.rounded,
    },
    editableImageView: {
      borderRadius: theme.radius.max,
      height: theme.layoutSize.mdSm,
      width: theme.layoutSize.mdSm,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
    },

    textInput: {
      marginTop: theme.spacing.md,
      borderRadius: theme.radius.harden,
    },
  });

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      if (image) {
        const url = await updateProfile(image, userData.email);
        await updateUser({ ...userData, profile: url });
      } else {
        await updateUser(userData);
      }
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      setImage(null);
      console.log(error);
    }
  };

  const pickImage = async () => {
    await requestMediaLibraryPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.onAccept} />
        </View>
      ) : (
        <View
          style={{
            paddingBottom: theme.spacing.md,
            alignItems: "center",
          }}
        >
          <View style={styles.profile}>
            <TouchableWithoutFeedback onPress={handlePress}>
              <View style={styles.editableImageView}>
                <Image
                  source={{
                    uri: !image
                      ? userData?.profile ||
                        "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png"
                      : image,
                  }}
                  style={styles.roundImage}
                />

                {isPressed && (
                  <View style={styles.imageOnPress}>
                    <FontAwesome
                      name="pencil"
                      size={theme.sizes.lg}
                      color="white"
                      style={{ alignSelf: "center" }}
                      onPress={pickImage}
                    />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ minWidth: "100%", padding: theme.spacing.sm }}>
            <TextInput
              label="Name"
              value={userData.name}
              onChangeText={(text) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  name: text,
                }))
              }
              mode="outlined"
              style={styles.textInput}
            />

            <TextInput
              label="Phone Number"
              value={userData.phone}
              onChangeText={(phone) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  phoneNumber: phone,
                }))
              }
              mode="outlined"
              style={styles.textInput}
            />

            <TextInput
              label="Address"
              value={userData.address}
              onChangeText={(address) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  address: address,
                }))
              }
              mode="outlined"
              style={styles.textInput}
            />
            <TextInput
              label="Postal Code"
              value={userData.postalCode}
              onChangeText={(code) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  postalCode: code,
                }))
              }
              mode="outlined"
              style={styles.textInput}
            />

            <TextInput
              label="Information"
              value={userData.information}
              onChangeText={(information) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  information: information,
                }))
              }
              mode="outlined"
              style={[styles.textInput, { maxHeight: theme.layoutSize.mdSm }]}
              multiline={true}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleUpdate}
            style={{
              paddingHorizontal: theme.spacing.md,
              marginVertical: theme.spacing.lg,
            }}
          >
            Save
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default withTheme(EditDoctorProfile);
