import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { withTheme } from "react-native-paper";
import { db } from "../../../firebase";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const DoctorCard = ({ item, theme }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const styles = StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: theme.radius.hard,
      borderColor: theme.colors.black,
      borderWidth: 2,
      width: theme.width - theme.spacing.mdSm * 2,
      overflow: "hidden", // it is impprtant to set this property to hidden, otherwise the borderRadius won't work for children elements
    },
    cardBody: {
      padding: theme.spacing.sm,
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
    },
    cardTitle: {
      color: theme.colors.white,
      ...theme.fonts.regular,
    },
    cardBodyText: {
      color: theme.colors.white,
      ...theme.fonts.small,
    },
    cardImage: {
      width: "100%",
      height: theme.layoutSize.mdSm,
      borderTopLeftRadius: theme.radius.hard,
      borderTopRightRadius: theme.radius.hard,
    },
    detailContainer: {
      paddingRight: theme.spacing.md,
      paddingLeft: theme.spacing.sm,
      flex: 10,
    },
  });

  const [doctorInfo, setDoctorInfo] = useState({});

  const getDoctorInfo = () => {
    try {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, item);
      onSnapshot(docRef, (doc) => {
        setDoctorInfo(doc.data());
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    setIsLoading(false);
  }, []);

  const { email, name, phone, profile } = doctorInfo;

  return (
    <>
      {!isLoading && (
        <View style={[styles.card]}>
          <View style={styles.cardImage}>
            <Image
              source={{
                uri:
                  profile ||
                  "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
              }}
              style={{
                resizeMode: "contain",
                flex: 1,
              }}
            />
          </View>

          <View style={styles.cardBody}>
            <View style={styles.detailContainer}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.cardBodyText}>{email}</Text>
              <Text style={styles.cardBodyText}>{phone}</Text>
            </View>
            <View style={{ alignSelf: "center", flex: 1 }}>
              <Ionicons
                name={"chevron-forward-circle-outline"}
                size={23}
                color={theme.colors.white}
                onPress={() => {
                  // navigation.navigate("ClinicStack", {
                  //   screen: "DoctorDetail",
                  //   params: { doctorId: item },
                  // });
                  navigation.navigate("DoctorDetail", { doctorId: item });
                }}
              ></Ionicons>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default withTheme(DoctorCard);
