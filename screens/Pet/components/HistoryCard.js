import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { withTheme } from "react-native-paper";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const HistoryCard = ({ admissionId, theme }) => {
  const [admissionInfo, setAdmissionInfo] = useState({});
  const [clinicInfo, setClinicInfo] = useState({});

  const navigation = useNavigation();

  const getAdmissionInfo = async () => {
    try {
      const docRef = doc(db, "admissions", admissionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdmissionInfo(docSnap.data());
        const clinicRef = doc(db, "users", docSnap.data().clinicId);
        const clinicSnap = await getDoc(clinicRef);
        if (clinicSnap.exists()) {
          setClinicInfo({
            name: clinicSnap.data().name,
            address: clinicSnap.data().address,
            logo: clinicSnap.data().logo,
          });
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => await getAdmissionInfo())();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.md,
      borderRadius: theme.radius.hard,
      backgroundColor: theme.colors.secondary,
      margin: theme.spacing.sm,
      elevation: theme.elevation.md,
      ...theme.shadow.md,
      borderWidth: 1,
      borderColor: theme.colors.lightGrey,
    },
    header: {
      ...theme.fonts.medium,
    },
    normalText: {
      ...theme.fonts.small,
    },
    regularText: {
      ...theme.fonts.regular,
    },
    infoContainer: {
      flex: 1,
    },
    logo: {
      width: theme.layoutSize.sm,
      height: theme.layoutSize.sm,
      borderRadius: theme.radius.rounded,
    },
  });

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Timeline", {
          admissionId: admissionId,
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.header}>
            {admissionInfo?.symptoms}
          </Text>
          <Text style={[styles.regularText, { color: theme.colors.orange }]}>
            {clinicInfo?.name}
          </Text>

          <View>
            <Text style={styles.normalText}>
              {admissionInfo?.admission_date}
            </Text>
            <Text style={styles.normalText}>
              {admissionInfo?.discharge_date}
            </Text>
          </View>
        </View>
        <Image source={{ uri: clinicInfo?.logo }} style={styles.logo} />
      </View>
    </Pressable>
  );
};

export default withTheme(HistoryCard);
