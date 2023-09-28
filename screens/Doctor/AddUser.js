import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { auth, db } from "../../firebase";
import { useState, useContext } from "react";
import { Button, TextInput, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../../services/authContext";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withTheme } from "react-native-paper";

const AddUser = ({ theme, navigation }) => {
  const { user, bootstrapAsync } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [petOwner, setPetOwner] = useState({
    role: "petOwner",
    name: "",
    address: "",
    postalCode: "",
    phone: "",
    email: "",
    tokenPassword: "",
    userID: "",
    pets: [],
    chats: [],
    clinicId: user?.clinicId,
    deviceId: "",
  });

  const validatePetOwner = () => {
    if (
      petOwner.address === "" ||
      petOwner.postalCode === "" ||
      petOwner.phone === "" ||
      petOwner.email === "" ||
      petOwner.tokenPassword === ""
    ) {
      setError("Please fill in all fields");
      return false;
    } else if (
      !/^[0-9]{4}-[0-9]{3}$/.test(petOwner.postalCode) ||
      !/^[0-9]+$/.test(petOwner.phone)
    ) {
      setError("Please enter a valid postal code or phone number");
      return false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(petOwner.email)
    ) {
      setError("Please enter a valid email");
      return false;
    } else if (petOwner.phone.length < 9 || petOwner.phone.length > 9) {
      setError("Please enter a valid phone number");
      return false;
    } else if (petOwner.tokenPassword.length < 6) {
      setError("Token password must be greater than 6 character");
      return false;
    }
    setError(null);
    return true;
  };

  const handleAddPetOwner = async () => {
    try {
      if (validatePetOwner()) {
        setIsLoading(true);

        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, petOwner.email);

        const petOwnerSnap = await getDoc(docRef);
        if (petOwnerSnap.exists()) {
          // Remove petOwner from previous clinic
          const petOwnerPreviousClinicId = petOwnerSnap.data().clinicId;
          const clinicRef = doc(db, "clinics", petOwnerPreviousClinicId);
          await updateDoc(clinicRef, {
            users: arrayRemove(petOwner.email),
          });

          // Removing pet registred under user from previous clinic and removing pet from clinic pets field
          const petOwnerPets = petOwnerSnap.data().pets;
          for (let i = 0; i < petOwnerPets.length; i++) {
            const clinicRef = doc(db, "clinics", petOwnerPreviousClinicId);
            await updateDoc(clinicRef, {
              pets: arrayRemove(petOwnerPets[i]),
            });
          }

          // Adding pet registred under user to new clinic and adding pet to clinic pets field
          for (let i = 0; i < petOwnerPets.length; i++) {
            const clinicRef = doc(db, "clinics", user?.clinicId);
            await updateDoc(clinicRef, {
              pets: arrayUnion(petOwnerPets[i]),
            });
          }

          // Add petOwner to new clinic
          const clinicRefNew = doc(db, "clinics", user?.clinicId);
          await updateDoc(clinicRefNew, {
            users: arrayUnion(petOwner.email),
          });

          // Update petOwner clinicId
          await updateDoc(docRef, {
            clinicId: user?.clinicId,
          });

          await bootstrapAsync();
          setIsLoading(false);
          setPetOwner({
            role: "petOwner",
            name: "",
            address: "",
            postalCode: "",
            phone: "",
            email: "",
            tokenPassword: "",
            userID: "",
            pets: [],
            chats: [],
            clinicId: user?.clinicId,
            deviceId: "",
          });
        } else {
          const userRef = await createUserWithEmailAndPassword(
            auth,
            petOwner.email,
            petOwner.tokenPassword
          );

          await setDoc(docRef, { ...petOwner, userID: userRef.user.uid });
          await setDoc(doc(db, "notifications", petOwner.email), {
            notifications: [],
          });

          const clinicRef = doc(db, "clinics", user?.clinicId);
          await updateDoc(clinicRef, {
            users: arrayUnion(petOwner.email),
          });
          await bootstrapAsync();
          setIsLoading(false);
          setPetOwner({
            role: "petOwner",
            name: "",
            address: "",
            postalCode: "",
            phone: "",
            email: "",
            tokenPassword: "",
            clinicId: user?.clinicId,
            userID: "",
            pets: [],
            chats: [],
            deviceId: "",
          });
          handleBlur();
          navigation.navigate("AddPet", { ownerEmail: petOwner.email });
        }
      }
    } catch (error) {
      setError("Something went wrong");
      setIsLoading(false);
      console.log(error);
    }
  };

  const [focusedInput, setFocusedInput] = useState(null);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
    },
    outlineStyle: {
      backgroundColor: theme.colors.white,
      borderWidth: 2,
      borderRadius: theme.radius.hard,
    },
    textInput: {
      marginTop: theme.spacing.sm,
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {error && <Text style={{ color: "red" }}>{error}</Text>}

            <TextInput
              label="Name"
              value={petOwner?.name}
              onChangeText={(name) =>
                setPetOwner((prevData) => ({ ...prevData, name: name }))
              }
              mode="outlined"
              outlineStyle={styles.outlineStyle}
              style={styles.textInput}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="account"
                      size={24}
                      color={
                        focusedInput === "name"
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                />
              }
            />
            <TextInput
              label="Address"
              value={petOwner?.address}
              onChangeText={(address) =>
                setPetOwner((prevData) => ({ ...prevData, address: address }))
              }
              mode="outlined"
              outlineStyle={styles.outlineStyle}
              style={styles.textInput}
              onFocus={() => handleFocus("address")}
              onBlur={handleBlur}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={24}
                      color={
                        focusedInput === "address"
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                />
              }
            />

            <TextInput
              label="Postal-Code"
              value={petOwner?.postalCode}
              onChangeText={(postalCode) =>
                setPetOwner((prevData) => ({
                  ...prevData,
                  postalCode: postalCode,
                }))
              }
              mode="outlined"
              outlineStyle={styles.outlineStyle}
              style={styles.textInput}
              onFocus={() => handleFocus("postalCode")}
              onBlur={handleBlur}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="crosshairs-gps"
                      size={24}
                      color={
                        focusedInput === "postalCode"
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                />
              }
            />

            <TextInput
              label="Phone"
              value={petOwner?.phone}
              onChangeText={(phone) =>
                setPetOwner((prevData) => ({ ...prevData, phone: phone }))
              }
              mode="outlined"
              outlineStyle={styles.outlineStyle}
              style={styles.textInput}
              onFocus={() => handleFocus("phone")}
              onBlur={handleBlur}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="cellphone-wireless"
                      size={24}
                      color={
                        focusedInput === "phone"
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                />
              }
            />

            <TextInput
              label="Email"
              value={petOwner?.email}
              onChangeText={(email) =>
                setPetOwner((prevData) => ({ ...prevData, email: email }))
              }
              mode="outlined"
              outlineStyle={styles.outlineStyle}
              style={styles.textInput}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="email"
                      size={24}
                      color={
                        focusedInput === "email"
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                />
              }
            />

            <TextInput
              label="Token Password"
              value={petOwner?.tokenPassword}
              onChangeText={(tokenPassword) =>
                setPetOwner((prevData) => ({
                  ...prevData,
                  tokenPassword: tokenPassword,
                }))
              }
              mode="outlined"
              outlineStyle={styles.outlineStyle}
              style={styles.textInput}
              onFocus={() => handleFocus("tokenPassword")}
              onBlur={handleBlur}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="hand-coin"
                      size={24}
                      color={
                        focusedInput === "tokenPassword"
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleAddPetOwner}
              style={{ margin: theme.spacing.mdSm }}
            >
              Add Pet Owner
            </Button>
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default withTheme(AddUser);
