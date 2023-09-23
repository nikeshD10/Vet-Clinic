import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Button, withTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const DoctorInfoCard = ({ doctorId, theme }) => {
  const [doctorInfo, setDoctorInfo] = useState({});
  const navigation = useNavigation();

  const getDoctorInfo = async () => {
    try {
      const docRef = doc(db, "users", doctorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctorInfo(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
      borderRadius: theme.radius.small,
      backgroundColor: theme.colors.secondary,
      padding: theme.spacing.mdSm,
      elevation: theme.elevation.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      ...theme.shadow.md,
    },
    innerContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    profile: {
      width: theme.sizes.xxl,
      height: theme.sizes.xxl,
      borderRadius: theme.radius.rounded,
      marginRight: theme.spacing.mdSm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={{
            uri:
              doctorInfo?.profile ||
              "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
          }}
          style={styles.profile}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700" }}>{doctorInfo?.name} </Text>
          <Text>{doctorInfo?.email} </Text>
          <Text>{doctorInfo?.phone} </Text>
        </View>
      </View>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("DoctorDetail", { doctorId })}
      >
        more
      </Button>
    </View>
  );
};

export default withTheme(DoctorInfoCard);
