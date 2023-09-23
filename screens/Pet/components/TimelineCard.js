import { StyleSheet, Text, View, Image, Modal, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { useEffect, useContext, useState } from "react";
import { db } from "../../../firebase";
//  prettier-ignore
import { collection, onSnapshot, updateDoc, doc, getDoc, getDocs, query, where, setDoc, arrayUnion } from "firebase/firestore";
import { AuthContext } from "../../../services/authContext";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { withTheme } from "react-native-paper";

const TimelineCard = ({ item, theme }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    profile: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const getDoctorInfo = async () => {
    try {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, item?.doctor_email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctorInfo({
          name: docSnap.data().name,
          profile: docSnap.data().profile,
        });
      }
    } catch (error) {}
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      width: "100%",
      height: "100%",
      padding: theme.spacing.lg,
    },
    modal: {
      backgroundColor: "white",
      height: "50%",
      justifyContent: "flex-end",
      borderRadius: theme.radius.medium,
      width: "100%",
    },
    scrollViewContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    image: {
      width: theme.layoutSize.xl,
      height: theme.layoutSize.xl,
      borderRadius: theme.radius.medium,
      resizeMode: "cover",
      // transform: [{ rotate: "270deg" }],
      margin: theme.spacing.mdSm,
    },
    leftContainerView: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.mdSm,
      width: "100%",
    },
    leftContainer: {
      width: "30%",
      borderRadius: 0,
      borderRightWidth: 3,
      borderRightColor: "blue",
      justifyContent: "center",
      paddingVertical: "20%",
      alignItems: "center",
    },
    doctorIcon: {
      resizeMode: "contain",
      width: theme.layoutSize.vsm,
      height: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
    },
    ellipse: {
      position: "absolute",
      bottom: 0,
      right: -13,
    },
    rightContainer: {
      width: "70%",
      paddingLeft: theme.spacing.mdSm,
      paddingVertical: "10%",
    },
    time: {
      ...theme.fonts.small,
    },
    header: {
      ...theme.fonts.header,
    },
    description: {
      ...theme.fonts.medium,
    },
    doctorName: {
      ...theme.fonts.regular,
      textAlign: "left",
    },
  });

  useEffect(() => {
    (async () => await getDoctorInfo())();
    setIsLoading(false);
  }, []);

  const onPressDoctorSection = async () => {
    if (user?.role === "petOwner" && doctorInfo?.name) {
      const initiateChat = {
        clientId: user?.email,
        doctorId: item?.doctor_email,
        messages: [],
        initiatedDate: new Date().toLocaleString(),
        chatStatus: "active",
        isMessageSeen: false,
        lastMessage: "",
        lastMessageSentBy: "",
        lastMessageSentDate: "",
      };

      try {
        const collectionRef = collection(db, "chats");
        const q = query(
          collectionRef,
          where("clientId", "==", user?.email),
          where("doctorId", "==", item?.doctor_email)
        );
        const querySnapshot = await getDocs(q);
        const docId = `${user?.email}+${item?.doctor_email}`;
        const docRef = doc(collectionRef, docId);
        if (querySnapshot.empty) {
          await setDoc(docRef, initiateChat);
          const usersCollectionRef = collection(db, "users");
          const clientDocRef = doc(usersCollectionRef, user?.email);
          await updateDoc(clientDocRef, {
            chats: arrayUnion(docId),
          });
          const doctorDocRef = doc(usersCollectionRef, item?.doctor_email);
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
          }
        } else {
          querySnapshot.forEach(async (queryDoc) => {
            if (queryDoc.id === docId) {
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                navigation.navigate("HomeStack", {
                  screen: "Chat",
                  params: {
                    chatId: docId,
                  },
                });
              }
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {!isLoading && (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <Ionicons
                  name="close-circle"
                  size={30}
                  color="black"
                  style={{ alignSelf: "flex-end", padding: 10 }}
                  onPress={() => setModalVisible(false)}
                />

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollViewContainer}
                >
                  {item.imageUrls.map((image, index) => (
                    <Image
                      key={index.toString()}
                      source={image && { uri: image }}
                      style={styles.image}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          <View style={styles.leftContainerView}>
            <View style={styles.leftContainer}>
              <Pressable onPress={() => onPressDoctorSection()}>
                <Image
                  source={{
                    uri:
                      doctorInfo?.profile ||
                      "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
                  }}
                  style={styles.doctorIcon}
                />
              </Pressable>
              <Ionicons
                name="ellipse"
                size={20}
                color="blue"
                style={styles.ellipse}
              />
              <Text style={styles.doctorName}>
                {doctorInfo?.name || item?.doctor_email}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.header}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              {item.imageUrls.length > 0 && (
                <Button
                  mode="contained"
                  onPress={() => setModalVisible(true)}
                  style={{ width: 150, borderRadius: 8, marginVertical: 10 }}
                >
                  View Images
                </Button>
              )}
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default withTheme(TimelineCard);
