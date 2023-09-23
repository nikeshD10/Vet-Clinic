import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, withTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../../firebase";
import { getDoc, doc } from "firebase/firestore";

const ClosedAdmissionCard = ({ item, theme }) => {
  const navigation = useNavigation();
  const [pet, setPet] = useState(null);

  const getPet = async () => {
    try {
      const docRef = doc(db, "pets", item.petId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPet(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPet();
  }, []);

  const styles = StyleSheet.create({
    card: {
      margin: theme.spacing.mdSm,
      borderRadius: theme.radius.small,
      backgroundColor: theme.colors.secondary,
      padding: theme.spacing.sm,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: theme.elevation.lg,
      ...theme.shadow.md,
      borderLeftWidth: 3,
      borderColor: theme.colors.tertiary,
    },
    label: {
      fontWeight: "bold",
    },
    data: {
      fontWeight: "400",
    },
  });

  const [showMore, setShowMore] = useState(false);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>
          Pet name {""}: <Text style={styles.data}>{pet?.name}</Text>
        </Text>
        <Text style={styles.label}>
          Status {"     "} : <Text style={styles.data}>{item.status}</Text>
        </Text>
        <Text style={styles.label}>
          Owner {"     "} : <Text style={styles.data}>{pet?.ownerId}</Text>
        </Text>
        <Text style={styles.label}>
          Condition : <Text style={styles.data}> {item.current_condition}</Text>
        </Text>
        {showMore && (
          <Pressable>
            <Text style={styles.label}>
              Symptoms : <Text style={styles.data}> {item.symptoms}</Text>
            </Text>
          </Pressable>
        )}
      </View>
      <View style={{ alignItems: "center", justifyContent: "space-between" }}>
        <Button
          mode="contained"
          onPressOut={() =>
            navigation.navigate("Timeline", {
              admissionId: item.admissionId,
            })
          }
          labelStyle={{ fontSize: theme.sizes.mdSm }}
        >
          View more
        </Button>
        <Pressable onPress={handleShowMore}>
          <Text style={{ color: "grey" }}>●●●</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default withTheme(ClosedAdmissionCard);
