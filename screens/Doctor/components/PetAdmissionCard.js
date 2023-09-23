import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { withTheme } from "react-native-paper";

const PetAdmissionCard = ({ petId, theme }) => {
  const navigation = useNavigation();

  const [pet, setPet] = useState(null);
  const [isPetAdmitted, setIsPetAdmitted] = useState(false);

  const getPet = async () => {
    try {
      const docRef = doc(db, "pets", petId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPet(docSnap.data());
        await checkIsPetAdmitted();
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsPetAdmitted = async () => {
    try {
      const collectionRef = collection(db, "admissions");
      const q = query(
        collectionRef,
        where("petId", "==", petId),
        where("status", "==", "ongoing")
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setIsPetAdmitted(false);
      } else {
        setIsPetAdmitted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPet();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: theme.radius.medium,
      margin: theme.spacing.mdSm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.lightGrey,
      alignItems: "center",
      elevation: theme.elevation.sm,
      ...theme.shadow.sm,
      borderWidth: 2,
      borderColor: isPetAdmitted ? theme.colors.green : theme.colors.lightGrey,
    },
    label: {
      fontWeight: "bold",
    },
    data: {
      fontWeight: "400",
    },
    infoContainer: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    profile: {
      width: theme.layoutSize.vsm,
      height: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
    },
    icon: {
      padding: theme.spacing.vsm,
      marginRight: theme.spacing.sm,
      borderRadius: theme.radius.rounded,
      borderWidth: 1,
      backgroundColor: theme.colors.secondary,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={() => navigation.navigate("PetDetail", { petId: pet.petId })}
      disabled={isPetAdmitted}
    >
      <View style={styles.infoContainer}>
        {pet?.profile ? (
          <Image
            source={{
              uri: pet?.profile,
            }}
            style={styles.profile}
          />
        ) : (
          <MaterialCommunityIcons
            name="horse-variant-fast"
            size={theme.sizes.xl}
            color={theme.colors.darkBlue}
            style={styles.icon}
          />
        )}

        <View>
          <Text style={styles.label}>
            Name {""}: <Text style={styles.data}>{pet?.name}</Text>
          </Text>
          <Text style={styles.label}>
            Age {""}: <Text style={styles.data}>{pet?.age}</Text>
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => navigation.navigate("AdmitPet", { petId: pet.petId })}
        disabled={isPetAdmitted}
      >
        <MaterialCommunityIcons
          name="heart-plus-outline"
          size={24}
          color={theme.colors.darkBlue}
        />
      </Pressable>
    </Pressable>
  );
};

export default withTheme(PetAdmissionCard);
