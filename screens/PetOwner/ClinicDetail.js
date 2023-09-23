import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import { db } from "../../firebase";
import { collection, getDoc, doc } from "firebase/firestore";
import { AuthContext } from "../../services/authContext";
import { Ionicons } from "@expo/vector-icons";
import { Button, withTheme } from "react-native-paper";
import DoctorInfoCard from "./components/DoctorInfoCard";

const ClinicDetail = ({ theme, navigation }) => {
  const { user } = useContext(AuthContext);
  const { clinicId } = user;
  const [clinicInfo, setClinicInfo] = useState({});
  const [doctors, setDoctors] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const getClinicInfo = async () => {
    try {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, clinicId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClinicInfo(docSnap.data());
      }

      const clinicCollectionRef = collection(db, "clinics");
      const clinicDocRef = doc(clinicCollectionRef, clinicId);
      const clinicDocSnap = await getDoc(clinicDocRef);
      if (clinicDocSnap.exists()) {
        setDoctors(clinicDocSnap.data().members);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClinicInfo();
  }, []);

  const styles = StyleSheet.create({
    header: {
      ...theme.fonts.header,
    },
    regularText: {
      ...theme.fonts.regular,
    },
    imageContainer: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.small,
      borderWidth: 2,
      borderColor: theme.colors.black,
      marginBottom: theme.spacing.sm,
    },
    img: {
      resizeMode: "contain",
      width: "100%",
      height: theme.layoutSize.lg,
      borderRadius: theme.radius.small,
    },
    detailContainer: {
      paddingLeft: theme.spacing.mdSm,
      marginBottom: theme.spacing.md,
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.vsm,
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: clinicInfo.name,
    });
  }, [clinicInfo, navigation]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingBottom: theme.spacing.xxxl,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getClinicInfo} />
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            clinicInfo?.logo
              ? { uri: clinicInfo.logo }
              : require("../../assets/welcomescreen.png")
          }
          style={styles.img}
        />
      </View>

      <Text style={[styles.header, { marginBottom: theme.spacing.sm }]}>
        {clinicInfo.name}
      </Text>
      <View style={styles.detailContainer}>
        <View style={styles.infoContainer}>
          <Ionicons
            name="location"
            size={24}
            color="black"
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={styles.regularText}>
            {clinicInfo.address} , {clinicInfo.postalCode}, {clinicInfo.city}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons
            name="mail"
            size={theme.sizes.lg}
            color="black"
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={styles.regularText}>{clinicInfo.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons
            name="call"
            size={theme.sizes.lg}
            color="black"
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={styles.regularText}>{clinicInfo.phone}</Text>
        </View>
      </View>

      <View>
        <Text style={[styles.header, { paddingLeft: theme.spacing.sm }]}>
          Doctors
        </Text>
        {doctors.map((doctorId) => (
          <DoctorInfoCard key={doctorId} doctorId={doctorId} />
        ))}
      </View>
    </ScrollView>
  );
};

export default withTheme(ClinicDetail);
