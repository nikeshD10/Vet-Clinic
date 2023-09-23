import {
  StatusBar,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Button, Switch } from "react-native-paper";
import { withTheme, TextInput } from "react-native-paper";
import { db, storage } from "../../../firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, listAll } from "firebase/storage";

const EditUserProfile = ({ theme, navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = route.params;
  const [userData, setUserData] = useState({
    name: "",
    address: "",
    postalCode: "",
    phone: "",
    profile: "",
  });

  const getUserData = async () => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData({
          name: docSnap.data().name,
          address: docSnap.data().address,
          postalCode: docSnap.data().postalCode,
          phone: docSnap.data().phone,
          profile: docSnap.data().profile,
        });
      }
    } catch (e) {
      console.log("Error getting document:", e);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

  const updateUser = async () => {
    try {
      setIsLoading(true);
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, userId);
      if (isSwitchOn) {
        await removePhoto();
      }
      await updateDoc(
        docRef,
        isSwitchOn ? { ...userData, profile: "" } : userData
      );
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    await updateUser();
  };

  const removePhoto = async () => {
    try {
      const profileRef = ref(storage, `/users/${userId}/profile_picture`);
      // List all items in the directory
      const items = await listAll(profileRef);
      // Delete each item (file) in the directory
      await Promise.all(items.items.map((item) => deleteObject(item)));

      console.log(
        "Profile pictures directory and its contents deleted successfully."
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

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

  return (
    <>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.onAccept} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{ paddingBottom: theme.spacing.md, alignItems: "center" }}
          >
            <View style={styles.profile}>
              <Image
                source={{
                  uri:
                    userData?.profile ||
                    "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
                }}
                style={styles.roundImage}
              />
              {userData?.profile && (
                <>
                  <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                  <Text>To remove profile toggle it on</Text>
                </>
              )}
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
            </View>
            <Button mode="contained" onPress={handleUpdate}>
              {" "}
              Save{" "}
            </Button>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default withTheme(EditUserProfile);
