import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { db } from "../../../firebase";
import {
  doc,
  onSnapshot,
  collection,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { ActivityIndicator, Button, withTheme } from "react-native-paper";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MemberComponent = ({ memberEmail, theme }) => {
  const navigation = useNavigation();

  const [memberData, setMemberData] = useState(null);

  const getMemberData = async () => {
    try {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, memberEmail);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setMemberData(doc.data());
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const [deleting, setDeleting] = useState(false);
  const deleteMember = async () => {
    if (!!memberData) {
      setDeleting(true);
      const response = await fetch(
        `http://38.242.156.151:5000/deleteUserByUid?uid=${memberData?.userID}`,
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

      const clinicRef = doc(collection(db, "clinics"), memberData?.clinicId);
      await updateDoc(clinicRef, {
        members: arrayRemove(memberEmail),
      });

      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, memberEmail);
      await deleteDoc(docRef);

      setDeleting(false);
    }
  };

  useEffect(() => {
    getMemberData();
  }, []);

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
    doctorImage: {
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
    navigation.navigate("EditUser", { userId: memberEmail });
  };

  const handleDelete = () => {
    setConfirmDeleteModalVisible(true);
  };

  const handleContainerPress = () => {
    setEditDeleteModalVisible(false);
    navigation.navigate("DoctorDetail", { doctorId: memberEmail });
  };

  const handleDeleteModalCancelPress = () => {
    setConfirmDeleteModalVisible(false);
  };

  const handleDeleteModalDeletePress = async () => {
    await deleteMember();
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
              memberData?.profile ||
              "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
          }}
          style={styles.doctorImage}
        />

        <View>
          <Text> {memberData?.name} </Text>
          <Text> {memberData?.email} </Text>
          <Text> {memberData?.phone} </Text>
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

export default withTheme(MemberComponent);
