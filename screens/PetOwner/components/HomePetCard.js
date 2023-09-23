import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { withTheme } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

const HomePetCard = ({ item, theme }) => {
  const [pet, setPet] = useState({});
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  const getPet = () => {
    try {
      const docRef = doc(db, "pets", item.petId);
      onSnapshot(docRef, (doc) => {
        setPet(doc.data());
      });
    } catch (error) {
      console.log(error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.mdSm,
      width: theme.width - theme.spacing.mdSm * 2,
      borderRadius: theme.roundness,
      height: theme.layoutSize.mdLg,
      borderColor: theme.colors.black,
      borderWidth: 2,
    },
    image: {
      width: theme.layoutSize.sm,
      height: theme.layoutSize.sm,
      borderRadius: theme.radius.rounded,
      marginRight: theme.spacing.md,
    },
    infoContainer: {
      flex: 1,
      paddingLeft: theme.spacing.md,
    },
    name: {
      ...theme.fonts.medium,
      color: theme.colors.white,
    },
    info: {
      ...theme.fonts.regular,
      color: theme.colors.white,
    },
  });

  useEffect(() => {
    getPet();
    setIsLoading(false);
  }, []);
  return (
    <>
      {!isLoading && (
        <Pressable
          onPress={() => {
            // navigation.navigate("PetListStack", {
            //   screen: "PetDetail",
            //   params: {
            //     petId: item.petId,
            //     admissionId: item?.admissionId,
            //   },
            // });
            navigation.navigate("PetDetail", {
              petId: item.petId,
              admissionId: item?.admissionId,
            });
          }}
          style={styles.container}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{pet?.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="paw"
                size={theme.sizes.lg}
                color={theme.colors.secondary}
                style={{ paddingRight: theme.spacing.md }}
              />
              <Text style={styles.info}>{pet?.petType}</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="time"
                size={theme.sizes.lg}
                color={theme.colors.secondary}
                style={{ paddingRight: theme.spacing.md }}
              />
              <Text style={styles.info}>{pet?.age} yr</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="barbell"
                size={theme.sizes.lg}
                color={theme.colors.secondary}
                style={{ paddingRight: theme.spacing.md }}
              />
              <Text style={styles.info}>{pet?.weight} kg</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="arrow-expand-vertical"
                size={theme.sizes.lg}
                color={theme.colors.secondary}
                style={{ paddingRight: theme.spacing.md }}
              />
              <Text style={styles.info}>{pet?.height} ft</Text>
            </View>
          </View>

          <Image
            source={{
              uri:
                pet?.profile ||
                "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
            }}
            style={styles.image}
          />
        </Pressable>
      )}
    </>
  );
};

export default withTheme(HomePetCard);
