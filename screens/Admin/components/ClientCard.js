import { StyleSheet, Text, View, Pressable, Image, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, withTheme, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ClientCard = ({ client, theme }) => {
  const [clientInfo, setClientInfo] = useState({});

  const navigation = useNavigation();

  const getClientInfo = async () => {
    try {
      const docRef = doc(db, "users", client);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setClientInfo(doc.data());
      });
      return unsubscribe;
    } catch (e) {
      console.log("Error getting document:", e);
    }
  };

  useEffect(() => {
    getClientInfo();
  }, []);

  const [deleting, setDeleting] = useState(false);
  const deleteClient = async () => {
    try {
      if (!!clientInfo) {
        setDeleting(true);
        const response = await fetch(
          `http://38.242.156.151:5000/deleteUserByUid?uid=${clientInfo?.userID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "text/html",
            },
          }
        );

        if (response.status !== 200) {
          alert("Something went wrong");
          setDeleting(false);
          return;
        }

        const clinicRef = doc(collection(db, "clinics"), clientInfo?.clinicId);
        await updateDoc(clinicRef, {
          users: arrayRemove(client),
        });

        // delete pets related to user
        const { pets, chats } = clientInfo;
        if (pets.length > 0) {
          pets.forEach(async (pet) => {
            const petRef = doc(collection(db, "pets"), pet);
            // delete admissions related to pet

            const getPet = await getDoc(petRef);
            if (!getPet.exists()) return;
            const admissionsOfPet = getPet.data().admissions;
            if (admissionsOfPet.length > 0) {
              admissionsOfPet.forEach(async (admission) => {
                const admissionRef = doc(
                  collection(db, "admissions"),
                  admission
                );
                await updateDoc(clinicRef, {
                  admissions: arrayRemove(admission),
                });
                await deleteDoc(admissionRef);
              });
            }
            // delete pet document
            await updateDoc(clinicRef, {
              pets: arrayRemove(pet),
            });
            await deleteDoc(petRef);
          });
        }
        // delete chat related to user
        if (chats.length > 0) {
          chats.forEach(async (chat) => {
            const chatRef = doc(collection(db, "chats"), chat);
            await deleteDoc(chatRef);
            // delete chatId from doctor
            const doctorEmail = getDoctorEmailFromChatId(chat);
            const doctorRef = doc(collection(db, "users"), doctorEmail);
            await updateDoc(doctorRef, {
              chats: arrayRemove(chat),
            });
          });
        }

        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, client);
        await deleteDoc(docRef);

        setDeleting(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorEmailFromChatId = (chatId) => {
    const splitChatId = chatId.split("+");
    const doctorEmail = splitChatId[1];
    return doctorEmail;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.secondary,
      padding: theme.spacing.mdSm,
      margin: theme.spacing.sm,
      borderRadius: theme.radius.hard,
      maxWidth: "100%",
      elevation: theme.elevation.md,
      ...theme.shadow.md,
      borderLeftWidth: 2,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    centeredView: {
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.vsm,
    },

    modalView: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    modalCenteredView: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.white,
      borderRadius: theme.radius.hard,
      elevation: theme.elevation.md,
    },

    button: {
      marginBottom: theme.spacing.vsm,
    },
    deleteModalButton: {
      marginBottom: theme.spacing.sm,
      width: theme.layoutSize.lg,
    },
    modalHeaderText: {
      ...theme.fonts.medium,
      color: theme.colors.tertiary,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    clientImage: {
      height: theme.layoutSize.vsm,
      width: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      borderWidth: 1,
      marginRight: theme.spacing.sm,
    },

    infoContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      justifyContent: "flex-start",
    },
  });

  const [editDeleteModalVisible, setEditDeleteModalVisible] = useState(false);

  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const handleEdit = () => {
    setEditDeleteModalVisible(false);
    navigation.navigate("EditUser", { userId: client });
  };

  const handleDelete = () => {
    setConfirmDeleteModalVisible(true);
  };

  const handleContainerPress = () => {
    setEditDeleteModalVisible(false);
    navigation.navigate("ClientProfile", { clientId: client });
  };

  const handleDeleteModalCancelPress = () => {
    setConfirmDeleteModalVisible(false);
  };

  const handleDeleteModalDeletePress = async () => {
    await deleteClient();
    setConfirmDeleteModalVisible(false);
  };

  const [pressed, setPressed] = useState(false);

  return (
    <Pressable style={[styles.container, pressed && { opacity: 0.5 }]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDeleteModalVisible}
        onRequestClose={() => {
          setConfirmDeleteModalVisible(!confirmDeleteModalVisible);
        }}
      >
        <View style={styles.modalView}>
          {deleting ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <View style={styles.modalCenteredView}>
              <Text style={styles.modalHeaderText}>
                {" "}
                Are you sure you want to delete user account?{" "}
              </Text>

              <Button
                onPress={handleDeleteModalDeletePress}
                mode="contained"
                buttonColor={theme.colors.error}
                style={styles.deleteModalButton}
              >
                Delete
              </Button>

              <Button
                onPress={handleDeleteModalCancelPress}
                mode="outlined"
                style={styles.deleteModalButton}
                textColor={theme.colors.error}
              >
                Cancel
              </Button>
            </View>
          )}
        </View>
      </Modal>

      <Pressable
        onPress={handleContainerPress}
        style={styles.infoContainer}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
      >
        <Image
          source={{
            uri:
              clientInfo?.profile ||
              "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
          }}
          style={styles.clientImage}
        />

        <View>
          <Text> {clientInfo?.name} </Text>
          <Text> {clientInfo?.email} </Text>
          <Text> {clientInfo?.phone} </Text>
        </View>
      </Pressable>

      {editDeleteModalVisible && (
        <View style={styles.centeredView}>
          <Button
            onPress={handleEdit}
            mode="contained"
            style={styles.button}
            buttonColor={theme.colors.primary}
            contentStyle={{ width: theme.layoutSize.mdSm }}
          >
            Edit
          </Button>
          <Button
            onPress={handleDelete}
            mode="contained"
            style={styles.button}
            buttonColor={theme.colors.error}
            contentStyle={{ width: theme.layoutSize.mdSm }}
          >
            Delete
          </Button>
        </View>
      )}
      <Pressable
        onPress={() => setEditDeleteModalVisible(!editDeleteModalVisible)}
      >
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={theme.colors.darkBlue}
        />
      </Pressable>
    </Pressable>
  );
};

export default withTheme(ClientCard);
