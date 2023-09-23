import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import React from "react";
import { db } from "../../../firebase";
import { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { withTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AdmissionCard = ({ admission, theme }) => {
  const [admissionData, setAdmissionData] = useState(null);
  const [petInfo, setPetInfo] = useState(null);

  const navigation = useNavigation();

  const getAdmissionData = async () => {
    try {
      const collectionRef = collection(db, "admissions");
      const docRef = doc(collectionRef, admission);

      const unsubscribe = onSnapshot(docRef, async (doc) => {
        const data = doc.data();
        const admission_data = {
          admission_date: data?.admission_date,
          petId: data?.petId,
          status: data?.status,
          discharge_date: data?.discharge_date,
          symptoms: data?.symptoms,
        };
        setAdmissionData(admission_data);
        await getPetInfo(admission_data.petId);
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const getPetInfo = async (petId) => {
    try {
      const collectionRef = collection(db, "pets");
      const docRef = doc(collectionRef, petId);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        const data = doc.data();
        const petData = {
          profile: data?.profile,
          name: data?.name,
        };
        setPetInfo(petData);
      });

      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdmissionData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.sm,
      width: theme.width - theme.spacing.sm * 2,
      borderRadius: theme.radius.hard,
      backgroundColor: theme.colors.white,
      elevation: theme.elevation.md,
      ...theme.shadow.md,
      borderLeftWidth: 2,
      marginVertical: theme.spacing.sm,
      borderLeftColor:
        admissionData?.status === "ongoing"
          ? theme.colors.green
          : theme.colors.tertiary,
    },

    petImage: {
      height: theme.layoutSize.vsm,
      width: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      borderWidth: 1,
      marginRight: theme.spacing.sm,
    },
    icon: {
      height: theme.layoutSize.vsm,
      width: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      backgroundColor: theme.colors.white,
      padding: theme.spacing.vsm,
      marginRight: theme.spacing.sm,
      justifyContent: "center",
      borderWidth: 1,
      alignItems: "center",
    },
    date: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    data: {
      flex: 1,
    },
  });

  const [expanded, setExpanded] = React.useState(false);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Timeline", { admissionId: admission })
      }
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
    >
      {petInfo?.profile ? (
        <Image source={{ uri: petInfo?.profile }} style={styles.petImage} />
      ) : (
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name="paw"
            size={theme.sizes.xl}
            color={theme.colors.darkBlue}
          />
        </View>
      )}

      <View style={styles.data}>
        <Pressable onPress={() => setExpanded(!expanded)}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={expanded ? 0 : 1}
            style={{ ...theme.fonts.medium }}
          >
            {admissionData?.symptoms}
          </Text>
        </Pressable>

        <Text style={{ ...theme.fonts.regular, color: theme.colors.orange }}>
          {petInfo?.name}
        </Text>
        <View style={styles.date}>
          <Text style={{ ...theme.fonts.small }}>
            {admissionData?.admission_date}
          </Text>
          <Text style={{ ...theme.fonts.small, color: theme.colors.tertiary }}>
            {admissionData?.discharge_date}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default withTheme(AdmissionCard);
