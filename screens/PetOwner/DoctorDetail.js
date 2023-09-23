import { StyleSheet, Text, View, Image, Linking } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, withTheme } from "react-native-paper";
import { db } from "../../firebase";
// prettier-ignore
import { collection, getDoc, doc, onSnapshot, setDoc, query, where, updateDoc, arrayUnion, getDocs } from "firebase/firestore";
import { AuthContext } from "../../services/authContext";
import { useLayoutEffect } from "react";
import { Pressable } from "react-native";
import { ScrollView } from "react-native";

const DoctorDetail = ({ navigation, route, theme }) => {
  const { doctorId } = route.params;
  const { user } = useContext(AuthContext);
  const [doctorInfo, setDoctorInfo] = useState({});
  const [docId, setDocId] = useState("");
  const getDoctorInfo = async () => {
    try {
      const docRef = doc(db, "users", doctorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctorInfo(docSnap.data());
        // if (user?.role === "petOwner") {
        //   const docId = `${user?.email}+${doctorId}`;
        //   setChatPartner({
        //     name: docSnap.data().doctorName,
        //     email: docSnap.data().doctorId,
        //     profile: docSnap.data().doctorProfile,
        //   });
        //   await getChat(docId);
        // }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setDocId(`${user?.email}+${doctorId}`);
    (async () => await getDoctorInfo())();
  }, [doctorId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: doctorInfo?.name,
    });
  }, [doctorInfo, navigation]);

  const initiateChat = {
    clientId: user?.email,
    doctorId: doctorInfo?.email,
    messages: [],
    initiatedDate: new Date().toLocaleString(),
    chatStatus: "active",
    isMessageSeen: false,
    lastMessage: "",
    lastMessageSentBy: "",
    lastMessageSentDate: "",
  };

  const diallCall = () => {
    Linking.openURL(`tel:${doctorInfo?.phone}`);
  };

  const mailTo = () => {
    Linking.openURL(`mailto:${doctorInfo?.email}`);
  };

  const onPressChat = async () => {
    try {
      const collectionRef = collection(db, "chats");
      const q = query(
        collectionRef,
        where("clientId", "==", user?.email),
        where("doctorId", "==", doctorInfo?.email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const docRef = doc(collectionRef, docId);
        await setDoc(docRef, initiateChat);

        const usersCollectionRef = collection(db, "users");
        const clientDocRef = doc(usersCollectionRef, user?.email);

        await updateDoc(clientDocRef, {
          chats: arrayUnion(docId),
        });

        const doctorDocRef = doc(usersCollectionRef, doctorInfo?.email);
        await updateDoc(doctorDocRef, {
          chats: arrayUnion(docId),
        });

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          navigation.navigate("HomeStack", {
            screen: "Chat",
            params: {
              chatId: docId,
            },
          });
        } else {
          console.log("No chat document exists");
        }
      } else {
        querySnapshot.forEach(async (queryDoc) => {
          if (queryDoc.id === docId) {
            navigation.navigate("HomeStack", {
              screen: "Chat",
              params: {
                chatId: docId,
              },
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const styles = StyleSheet.create({
    header: {
      ...theme.fonts.header,
      marginLeft: theme.spacing.mdSm,
    },
    regularText: {
      ...theme.fonts.medium,
    },
    about: {
      ...theme.fonts.regular,
      marginLeft: theme.spacing.mdSm,
    },
    img: {
      resizeMode: "stretch",
      width: "100%",
      height: theme.layoutSize.lg,
      borderRadius: theme.radius.small,
    },
    imgContainer: {
      padding: theme.spacing.mdSm,
      borderRadius: theme.radius.medium,
      borderWidth: 2,
      borderColor: theme.colors.black,
      marginBottom: theme.spacing.mdSm,
    },
    container: {
      padding: theme.spacing.mdSm,
    },
    iconInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.vsm,
    },
    icon: { marginRight: theme.spacing.sm },
    infoContainer: {
      paddingLeft: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          source={
            doctorInfo?.profile
              ? { uri: doctorInfo.profile }
              : require("../../assets/welcomescreen.png")
          }
          style={styles.img}
        />
      </View>

      <Text style={[styles.header, { marginBottom: theme.spacing.sm }]}>
        {doctorInfo.name}
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.iconInfoContainer}>
          <Ionicons
            name="location"
            size={theme.sizes.lg}
            color={theme.colors.darkBlue}
            style={styles.icon}
          />
          <Text style={styles.regularText}>
            {doctorInfo.address} , {doctorInfo.postalCode}
          </Text>
        </View>
        <View style={styles.iconInfoContainer}>
          <Ionicons
            name="mail"
            size={theme.sizes.lg}
            color={theme.colors.darkBlue}
            style={styles.icon}
          />
          <Pressable onPress={mailTo}>
            <Text style={styles.regularText}>{doctorInfo.email}</Text>
          </Pressable>
        </View>
        <View style={styles.iconInfoContainer}>
          <Ionicons
            name="call"
            size={theme.sizes.lg}
            color={theme.colors.darkBlue}
            style={styles.icon}
          />
          <Pressable onPress={diallCall}>
            <Text style={styles.regularText}>{doctorInfo.phone}</Text>
          </Pressable>
        </View>
      </View>
      <View>
        <Text style={styles.header}>About</Text>
        <Text style={styles.about}>{doctorInfo?.information}</Text>
      </View>
      {user?.role === "petOwner" && (
        <Button
          mode="contained"
          onPress={onPressChat}
          style={{ marginVertical: theme.spacing.md }}
        >
          Chat
        </Button>
      )}
    </ScrollView>
  );
};

export default withTheme(DoctorDetail);
