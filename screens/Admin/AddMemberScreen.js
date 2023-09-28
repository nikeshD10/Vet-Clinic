import {
  BackHandler,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { Button, TextInput, ActivityIndicator } from "react-native-paper";
import { auth, db } from "../../firebase";
import { AuthContext } from "../../services/authContext";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { withTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AddMemberScreen = ({ navigation, theme }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, bootstrapAsync } = useContext(AuthContext);
  const [doctor, setDoctor] = useState({
    role: "doctor",
    name: "",
    address: "",
    postalCode: "",
    phone: "",
    email: "",
    clinicId: user?.email,
    userID: "",
    profile: "",
    tokenPassword: "",
    chats: [],
    information: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Doctor",
    });
  }, [navigation]);

  const validateDoctor = () => {
    if (
      doctor.name === "" ||
      doctor.address === "" ||
      doctor.postalCode === "" ||
      doctor.phone === "" ||
      doctor.email === "" ||
      doctor.tokenPassword === "" ||
      doctor.information === ""
    ) {
      setError("Please fill in all fields");
      return false;
    } else if (doctor.email === user?.email) {
      setError("You cannot add yourself as a doctor");
      return false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(doctor.email)
    ) {
      setError("Please enter a valid email");
      return false;
    } else if (!/^[0-9]{4}-[0-9]{3}$/.test(doctor.postalCode)) {
      setError("Please enter a valid postal code");
      return false;
    } else if (!/^[0-9]+$/.test(doctor.phone)) {
      setError("Please enter a valid phone number");
      return false;
    } else if (doctor.tokenPassword.length < 6) {
      setError("Token password must be at least 6 characters");
      return false;
    } else if (doctor.phone.length < 9 || doctor.phone.length > 9) {
      setError("Please enter a valid phone number");
      return false;
    }
    setError(null);
    return true;
  };

  const handleAddDoctor = async () => {
    try {
      setIsLoading(true);
      Keyboard.dismiss();
      setFocusedInput(null);
      if (!validateDoctor()) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        return;
      }
      const collectionRefUser = collection(db, "users");
      const docRefUser = doc(collectionRefUser, doctor.email);
      const doctorSnap = await getDoc(docRefUser);
      if (doctorSnap.exists()) {
        const doctorPreviousClinicId = doctorSnap.data().clinicId;
        const clinicRef = doc(db, "clinics", doctorPreviousClinicId);
        await updateDoc(clinicRef, {
          members: arrayRemove(doctor.email),
        });
        const clinicRefNew = doc(db, "clinics", user?.email);
        await updateDoc(clinicRefNew, {
          members: arrayUnion(doctor.email),
        });
        await updateDoc(docRefUser, {
          clinicId: user.email,
        });
        await bootstrapAsync();
        setIsLoading(false);
        setDoctor({
          role: "doctor",
          name: "",
          address: "",
          postalCode: "",
          phone: "",
          email: "",
          clinicId: user?.email,
          userID: "",
          profile: "",
          tokenPassword: "",
          chats: [],
          information: "",
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          doctor.email,
          doctor.tokenPassword
        );
        await setDoc(docRefUser, {
          ...doctor,
          userID: userCredential.user.uid,
        });
        const collectionRefClinic = collection(db, "clinics");
        const docRefClinic = doc(collectionRefClinic, user?.email);
        await updateDoc(docRefClinic, {
          members: arrayUnion(doctor.email),
        });
        await bootstrapAsync();
        setIsLoading(false);
        setDoctor({
          role: "doctor",
          name: "",
          address: "",
          postalCode: "",
          phone: "",
          email: "",
          clinicId: user?.email,
          profile: "",
          userID: "",
          tokenPassword: "",
          chats: [],
          information: "",
        });
      }
    } catch (error) {
      setError("Something went wrong");
      setIsLoading(false);
      console.log("Add member", error);
    }
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

  const [focusedInput, setFocusedInput] = useState(null);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.green} />
        </View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <TextInput
            label="Name"
            value={doctor?.name}
            onChangeText={(name) =>
              setDoctor((prevData) => ({ ...prevData, name: name }))
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
            value={doctor?.address}
            onChangeText={(address) =>
              setDoctor((prevData) => ({ ...prevData, address: address }))
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
            value={doctor?.postalCode}
            onChangeText={(postalCode) =>
              setDoctor((prevData) => ({ ...prevData, postalCode: postalCode }))
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
            value={doctor?.phone}
            onChangeText={(phone) =>
              setDoctor((prevData) => ({ ...prevData, phone: phone }))
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
            value={doctor?.email}
            onChangeText={(email) =>
              setDoctor((prevData) => ({ ...prevData, email: email }))
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
            value={doctor?.tokenPassword}
            onChangeText={(tokenPassword) =>
              setDoctor((prevData) => ({
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
          <TextInput
            label="Information"
            value={doctor?.information}
            onChangeText={(information) =>
              setDoctor((prevData) => ({
                ...prevData,
                information: information,
              }))
            }
            mode="outlined"
            outlineStyle={styles.outlineStyle}
            style={[styles.textInput, { maxHeight: theme.layoutSize.mdSm }]}
            onFocus={() => handleFocus("information")}
            onBlur={handleBlur}
            multiline={true}
            left={
              <TextInput.Icon
                icon={() => (
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={24}
                    color={
                      focusedInput === "information"
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
            onPress={handleAddDoctor}
            style={{ margin: theme.spacing.mdSm }}
          >
            Add Doctor
          </Button>
        </ScrollView>
      )}
    </View>
  );
};

export default withTheme(AddMemberScreen);
