import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { db } from "../../../firebase";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { withTheme } from "react-native-paper";

const PetCard = ({ item, theme }) => {
  const navigation = useNavigation();
  const [pet, setPet] = useState({});
  const [admissionId, setAdmissionId] = useState(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: theme.spacing.mdSm,
      padding: theme.spacing.mdSm,
      backgroundColor: theme.colors.white,
      borderRadius: theme.radius.medium,
      shadowColor: theme.colors.black,
      elevation: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderLeftWidth: 5,
      borderLeftColor: admissionId ? theme.colors.green : theme.colors.red,
    },
    detailContainer: {
      // flex: 1,
    },
    profile: {
      width: theme.layoutSize.vsm,
      height: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      marginRight: theme.spacing.mdSm,
    },
    textStyles: {
      fontSize: 16,
      fontWeight: "bold",
    },

    isAdmittedColor: {
      backgroundColor: theme.colors.green,
      padding: theme.spacing.vsm,
      borderRadius: theme.radius.rounded,
      height: theme.sizes.lg,
      width: theme.sizes.lg,
    },
    unadmittedColor: {
      backgroundColor: theme.colors.red,
      padding: theme.spacing.vsm,
      borderRadius: theme.radius.rounded,
      height: theme.sizes.lg,
      width: theme.sizes.lg,
    },
  });

  const getPet = async () => {
    const docRef = doc(db, "pets", item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setPet(doc.data());
      });
      return unsubscribe;
    }
  };

  const isPetAdmitted = async () => {
    try {
      const collectionRef = collection(db, "admissions");
      const q = query(
        collectionRef,
        where("petId", "==", item),
        where("status", "==", "ongoing")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          setAdmissionId(null);
        } else {
          querySnapshot.forEach((doc) => {
            setAdmissionId(doc.id);
          });
        }
      });
      return unsubscribe;
    } catch (error) {}
  };

  useEffect(() => {
    if (item) {
      (async () => await getPet())();
      (async () => await isPetAdmitted())();
    }
  }, []);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("PetDetail", {
          petId: pet.petId,
          admissionId: admissionId,
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.detailContainer}>
          <Text style={styles.textStyles}>
            Name {"   "}: {pet?.name}
          </Text>
          <Text>
            Age {"        "}: {pet?.age}
          </Text>
          <Text>
            Height {"   "}: {pet?.height} ft
          </Text>
          <Text>
            Weight {"  "}: {pet?.weight} kg
          </Text>
        </View>
        {pet?.profile && (
          <Image source={{ uri: pet.profile }} style={styles.profile} />
        )}
      </View>
    </Pressable>
  );
};

export default withTheme(PetCard);
