import { StyleSheet, Text, View, Keyboard } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  TextInput,
  ActivityIndicator,
  withTheme,
} from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { db } from "../../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { AuthContext } from "../../services/authContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

const AdmitPet = ({ route, navigation, theme }) => {
  const { user } = useContext(AuthContext);
  const { petId } = route.params;

  const [admission, setAdmission] = useState({
    petId: petId || "",
    doctorId: user?.email || "",
    clinicId: user?.clinicId || "",
    admission_date: new Date().toLocaleString(),
    symptoms: "",
    current_condition: "",
    status: "ongoing",
    discharge_date: "",
    general_conditions: [],
    admissionId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openCondition, setOpenCondition] = useState(false);
  const [conditionValue, setConditionValue] = useState(null);
  const [conditions, setConditions] = useState([
    { label: "Select Condition", value: null },
    { label: "Bad", value: "bad" },
    { label: "Good", value: "good" },
    { label: "Moderate", value: "moderate" },
  ]);

  const handleSelectCondition = (value) => {
    setAdmission({ ...admission, current_condition: value });
  };

  const onAdmitPet = async () => {
    try {
      setIsLoading(true);
      const admissionCollectionRef = collection(db, "admissions");
      const admissionDocRef = doc(admissionCollectionRef);
      await setDoc(admissionDocRef, {
        ...admission,
        admissionId: admissionDocRef.id,
      });

      const clinicDocRef = doc(db, "clinics", user?.clinicId);
      await updateDoc(clinicDocRef, {
        admissions: arrayUnion(admissionDocRef.id),
      });

      const petDocRef = doc(db, "pets", petId);
      await updateDoc(petDocRef, {
        admissions: arrayUnion(admissionDocRef.id),
      });
      setIsLoading(false);
      setAdmission({
        petId: petId || "",
        doctorId: user?.email || "",
        clinicId: user?.clinicId || "",
        admission_date: new Date().toLocaleString(),
        symptoms: "",
        current_condition: "",
        status: "ongoing",
        discharge_date: "",
        general_conditions: [],
        admissionId: "",
      });
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    indicatorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
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

  const [focusedInput, setFocusedInput] = useState(false);

  return (
    <Pressable
      onPress={() => {
        if (focusedInput) {
          Keyboard.dismiss();
        }
      }}
      style={styles.container}
    >
      <View>
        {isLoading ? (
          <View style={styles.indicatorContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <View>
            {error && <Text>{error}</Text>}

            <TextInput
              label="Symptoms"
              value={admission.symptoms}
              onChangeText={(text) =>
                setAdmission({ ...admission, symptoms: text })
              }
              mode="outlined"
              multiline={true}
              numberOfLines={3}
              outlineStyle={styles.outlineStyle}
              style={[styles.textInput, { maxHeight: theme.layoutSize.md }]}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="account-injury"
                      size={24}
                      color={
                        focusedInput
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                />
              }
            />
            <View style={{ marginVertical: theme.spacing.lg }}>
              <DropDownPicker
                open={openCondition}
                value={conditionValue}
                items={conditions}
                setOpen={setOpenCondition}
                setValue={setConditionValue}
                setItems={setConditions}
                onChangeValue={handleSelectCondition}
                theme="DARK"
                mode="BADGE"
              />
            </View>
            <Button
              mode="contained"
              onPress={onAdmitPet}
              style={{
                marginVertical: theme.spacing.lg,
                borderRadius: theme.radius.small,
              }}
            >
              Admit Pet
            </Button>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default withTheme(AdmitPet);
