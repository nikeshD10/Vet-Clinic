import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../services/adminContext";
import { Button, withTheme } from "react-native-paper";
import { db } from "../../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

const AdminHome = ({ theme, navigation }) => {
  const { admin: user } = useContext(AdminContext);
  const [data, setData] = useState({
    client: 0,
    admission: 0,
    member: 0,
    pet: 0,
  });
  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    welComeHeader: {
      ...theme.fonts.header,
    },
    name: {
      ...theme.fonts.medium,
    },
    mainContainer: {
      flex: 1,
      borderTopLeftRadius: theme.radius.rounded,
      borderTopRightRadius: theme.radius.rounded,
      minHeight: "100%",
      backgroundColor: theme.colors.white,
      elevation: theme.elevation.md,
      marginTop: theme.spacing.vsm,
    },
    infoBox: {
      backgroundColor: theme.colors.darkBlue,
      height: theme.layoutSize.mdSm,
      width: theme.layoutSize.mdSm,
      borderRadius: theme.radius.hard,
      margin: theme.spacing.md,
      alignItems: "center",
      padding: theme.spacing.sm,
      justifyContent: "center",
    },
    infoBoxContainer: {
      padding: theme.spacing.md,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    infoBoxTextHeader: {
      ...theme.fonts.medium,
      color: theme.colors.orange,
    },
    infoBoxText: {
      ...theme.fonts.medium,
      color: theme.colors.white,
    },
    button: {
      margin: theme.spacing.md,
      borderRadius: theme.radius.rounded,
    },
  });

  const getClinicData = async () => {
    if (!!user) {
      if (user?.email === undefined) return;
      try {
        const collectionRef = collection(db, "clinics");
        const docRef = doc(collectionRef, user.email);
        const unsubscribe = onSnapshot(docRef, (doc) => {
          const data = doc.data();
          const { users, admissions, members, pets } = data;
          setData({
            client: users.length,
            admission: admissions.length,
            member: members.length,
            pet: pets.length,
          });
        });
        return unsubscribe;
      } catch (error) {
        console.log("Home", error);
      }
    }
  };

  useEffect(() => {
    getClinicData();
  }, [user]);

  return (
    <View>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.welComeHeader}>Welcome,</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <Image
          source={{
            uri: user?.logo,
          }}
          style={{
            width: theme.layoutSize.sm,
            height: theme.layoutSize.sm,
            borderRadius: theme.radius.rounded,
          }}
        />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.infoBoxContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTextHeader}>Client</Text>
            <Text style={styles.infoBoxText}>+{data?.client}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTextHeader}>Admission</Text>
            <Text style={styles.infoBoxText}>+{data?.admission}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTextHeader}>Member</Text>
            <Text style={styles.infoBoxText}>+{data?.member}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTextHeader}>Pet</Text>
            <Text style={styles.infoBoxText}>+{data?.pet}</Text>
          </View>
        </View>
        <View>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("ClientList")}
            style={styles.button}
          >
            View Client
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate("PetList")}
            style={styles.button}
          >
            View Pet
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AdmissionList")}
            style={styles.button}
          >
            All admissions
          </Button>
        </View>
      </View>
    </View>
  );
};

export default withTheme(AdminHome);
