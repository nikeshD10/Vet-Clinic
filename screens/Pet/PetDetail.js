import { Image, StyleSheet, Text, View, RefreshControl } from "react-native";
import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import { Button, withTheme } from "react-native-paper";
import { db } from "../../firebase";
// prettier-ignore
import { getDoc, doc, onSnapshot, collection, query, where, getDocs,} from "firebase/firestore";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../services/authContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PetDetail = ({ route, theme }) => {
  const [petInfo, setPetInfo] = useState({});
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);
  const { clinicId } = user;

  const { petId, admissionId } = route.params;
  const [historyAdmissions, setHistoryAdmissions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getPetInfo = async () => {
    try {
      const docRef = doc(db, "pets", petId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const unsubscribe = onSnapshot(docRef, (doc) => {
          setPetInfo(doc.data());
          const admissions = doc.data()?.admissions;
          if (!admissionId) {
            setHistoryAdmissions(admissions);
          } else {
            setHistoryAdmissions(
              admissions?.filter((item) => item !== admissionId)
            );
          }
        });
        return () => unsubscribe();
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAdmissionIfRouteParamDoesNotExist = async () => {
    try {
      const collectionRef = collection(db, "admissions");
      const q = query(
        collectionRef,
        where("petId", "==", petId),
        where("status", "==", "ongoing"),
        where("clinicId", "==", user?.role === "admin" ? user?.email : clinicId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const admissionId = doc.data().admissionId;
        setHistoryAdmissions(
          historyAdmissions?.filter((item) => item !== admissionId)
        );
        navigation.setParams({ admissionId: admissionId });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const mainFunction = async () => {
    try {
      await getPetInfo();
      if (!admissionId && !!user) {
        await getAdmissionIfRouteParamDoesNotExist();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    mainFunction();
  }, [user, petId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: petInfo.name,
    });
  }, [petInfo.name, navigation]);

  const styles = StyleSheet.create({
    aboutContainer: {
      borderRadius: theme.radius.hard,
      backgroundColor: theme.colors.darkBlue,
      width: theme.layoutSize.sm,
      height: theme.layoutSize.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    aboutContainerTextHeader: {
      ...theme.fonts.small,
      color: theme.colors.white,
    },
    aboutContainerTextBody: {
      ...theme.fonts.medium,
      color: theme.colors.white,
    },
    buttonLabel: {
      ...theme.fonts.regular,
    },
    buttonStyle: {
      marginVertical: theme.spacing.sm,
      borderRadius: theme.spacing.sm,
      justifyContent: "center",
    },
    header: { ...theme.fonts.header },
    smallBoxContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: theme.spacing.md,
    },
    profileContainer: {
      padding: theme.spacing.md,
      borderWidth: 2,
      borderColor: "black",
      borderRadius: theme.radius.hard,
      position: "relative",
      backgroundColor: "#252250",
      alignItems: "center",
    },
    profileContainerImage: {
      // resizeMode: "contain",
      aspectRatio: 1,
      width: "100%",
      height: theme.layoutSize.lg,
      borderWidth: 2,
      borderColor: theme.colors.black,
      borderRadius: theme.radius.hard,
    },
    profileInfoContainer: {
      alignItems: "center",
      marginVertical: theme.spacing.sm,
    },
    profileInfoContainerHeader: {
      ...theme.fonts.header,
      color: theme.colors.white,
    },
    profileInfoContainerText: {
      ...theme.fonts.regular,
      color: theme.colors.white,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{ padding: theme.spacing.sm }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={mainFunction} />
      }
    >
      <View style={styles.profileContainer}>
        {petInfo?.profile ? (
          <Image
            source={{ uri: petInfo?.profile }}
            style={styles.profileContainerImage}
          />
        ) : (
          <View
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.hard,
              width: "100%",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name={
                petInfo?.petType === "Other"
                  ? "unicorn-variant"
                  : petInfo?.petType?.toLowerCase()
              }
              size={theme.layoutSize.lg}
              color={theme.colors.white}
            />
          </View>
        )}

        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileInfoContainerHeader}>{petInfo?.name}</Text>
          <Text style={styles.profileInfoContainerText}>
            Pet type : {petInfo?.petType}
          </Text>
        </View>
      </View>

      <View style={{ marginVertical: theme.spacing.sm }}>
        <Text style={styles.header}>About</Text>
        <View style={styles.smallBoxContainer}>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutContainerTextHeader}>AGE</Text>
            <Text style={styles.aboutContainerTextBody}>{petInfo?.age}</Text>
          </View>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutContainerTextHeader}>WEIGHT</Text>
            <Text style={styles.aboutContainerTextBody}>
              {petInfo?.weight} kg
            </Text>
          </View>

          <View style={styles.aboutContainer}>
            <Text style={styles.aboutContainerTextHeader}>HEIGHT</Text>
            <Text style={styles.aboutContainerTextBody}>
              {petInfo?.height} ft
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.header}>Medicals</Text>
        <View>
          {admissionId && (
            <Button
              mode="contained"
              style={styles.buttonStyle}
              labelStyle={styles.buttonLabel}
              onPress={() =>
                navigation.navigate("Timeline", {
                  admissionId: admissionId,
                })
              }
            >
              Current Treatment
            </Button>
          )}
          <Button
            mode="contained"
            style={styles.buttonStyle}
            labelStyle={styles.buttonLabel}
            onPress={() =>
              navigation.navigate("History", {
                historyAdmissions: historyAdmissions,
                petId: petId,
              })
            }
          >
            Pet Medical History
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default withTheme(PetDetail);
