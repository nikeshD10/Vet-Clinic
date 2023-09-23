import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { withTheme } from "react-native-paper";

const PetOwnerInfoCard = ({ item, theme, handlePress }) => {
  const [petOwner, setPetOwner] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", item), (doc) => {
      setPetOwner(doc.data());
    });
    return unsubscribe;
  }, [item]);

  const styles = StyleSheet.create({
    innerContainer: {
      margin: theme.spacing.mdSm,
      borderRadius: theme.radius.small,
      backgroundColor: theme.colors.lightGrey,
      padding: theme.spacing.sm,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: theme.elevation.sm,
      ...theme.shadow.sm,
    },
    data: {
      ...theme.fonts.regular,
    },
    image: {
      width: theme.layoutSize.vsm,
      height: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      marginRight: theme.spacing.sm,
    },
  });

  const handleCardPress = () => {
    handlePress(item);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.innerContainer,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={handleCardPress}
    >
      <Image
        source={{
          uri:
            petOwner.profile ||
            "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
        }}
        style={styles.image}
      />
      <View>
        <Text style={styles.data}>{petOwner?.name}</Text>
        <Text style={styles.data}>{petOwner?.email}</Text>
      </View>
    </Pressable>
  );
};

export default withTheme(PetOwnerInfoCard);
