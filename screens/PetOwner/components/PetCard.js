import { StyleSheet, Text, View, Image, Modal } from "react-native";
import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { db } from "../../../firebase";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { withTheme, Button, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../../../services/authContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PetCard = ({ item, theme }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [pet, setPet] = useState({});
  const [admissionId, setAdmissionId] = useState(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: theme.spacing.mdSm,
      padding: theme.spacing.mdSm,
      backgroundColor: theme.colors.white,
      borderRadius: theme.radius.medium,
      shadowColor: theme.colors.black,
      elevation: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderLeftWidth: 5,
      borderLeftColor: admissionId ? theme.colors.green : theme.colors.red,
    },
    detailContainer: {
      // flex: 1,
    },
    profile: {
      width: theme.layoutSize.vsm,
      height: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      marginRight: theme.spacing.mdSm,
    },
    textStyles: {
      fontSize: 16,
      fontWeight: "bold",
    },

    isAdmittedColor: {
      backgroundColor: theme.colors.green,
      padding: theme.spacing.vsm,
      borderRadius: theme.radius.rounded,
      height: theme.sizes.lg,
      width: theme.sizes.lg,
    },
    unadmittedColor: {
      backgroundColor: theme.colors.red,
      padding: theme.spacing.vsm,
      borderRadius: theme.radius.rounded,
      height: theme.sizes.lg,
      width: theme.sizes.lg,
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
  });

  const getPet = async () => {
    const docRef = doc(db, "pets", item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setPet(doc.data());
      });
      return unsubscribe;
    }
  };

  const isPetAdmitted = async () => {
    try {
      const collectionRef = collection(db, "admissions");
      const q = query(
        collectionRef,
        where("petId", "==", item),
        where("status", "==", "ongoing")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          setAdmissionId(null);
        } else {
          querySnapshot.forEach((doc) => {
            setAdmissionId(doc.id);
          });
        }
      });
      return unsubscribe;
    } catch (error) {}
  };

  useEffect(() => {
    if (item) {
      (async () => await getPet())();
      (async () => await isPetAdmitted())();
    }
  }, [item]);

  const [deleting, setDeleting] = useState(false);

  const [editDeleteModalVisible, setEditDeleteModalVisible] = useState(false);

  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const handleEdit = () => {
    setEditDeleteModalVisible(false);
    // navigation.navigate("EditUser", { userId: client });
  };

  const handleDelete = () => {
    setConfirmDeleteModalVisible(true);
  };

  const handleContainerPress = () => {
    setEditDeleteModalVisible(false);
    navigation.navigate("PetDetail", {
      petId: pet.petId,
      admissionId: admissionId,
    });
  };

  const handleDeleteModalCancelPress = () => {
    setConfirmDeleteModalVisible(false);
    setEditDeleteModalVisible(false);
  };

  const handleDeleteModalDeletePress = async () => {
    await deletePet();
    setConfirmDeleteModalVisible(false);
  };

  const [pressed, setPressed] = useState(false);

  const deletePet = async () => {
    setDeleting(true);
    try {
      const clinicDoc = doc(db, "clinics", user?.email);
      await updateDoc(clinicDoc, {
        pets: arrayRemove(item),
      });

      const ownerDoc = doc(db, "users", pet?.ownerId);
      await updateDoc(ownerDoc, {
        pets: arrayRemove(item),
      });

      const docRef = doc(db, "pets", item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const admissions = docSnap.data()?.admissions;
        if (admissions.length > 0) {
          admissions.forEach(async (item) => {
            const admissionDocRef = doc(db, "admissions", item);
            await deleteDoc(admissionDocRef);
          });
        } else {
          console.log("No admission");
        }
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.log(error);
    }
    setDeleting(false);
  };

  return (
    <Pressable style={[styles.container, pressed && { opacity: 0.5 }]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDeleteModalVisible}
        onRequestClose={() => {
          setConfirmDeleteModalVisible(!confirmDeleteModalVisible);
        }}
        style={{ position: "absolute" }}
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
        style={styles.detailContainer}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
      >
        <Text style={styles.textStyles}>
          Name {"   "}: {pet?.name}
        </Text>
        <Text>
          Age {"        "}: {pet?.age}
        </Text>
        <Text>
          Height {"   "}: {pet?.height} ft
        </Text>
        <Text>
          Weight {"  "}: {pet?.weight} kg
        </Text>
      </Pressable>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {editDeleteModalVisible ? (
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
        ) : (
          pet?.profile && (
            <Image source={{ uri: pet.profile }} style={styles.profile} />
          )
        )}

        {user?.role === "admin" && (
          <Pressable
            onPress={() => setEditDeleteModalVisible(!editDeleteModalVisible)}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={theme.colors.darkBlue}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default withTheme(PetCard);
