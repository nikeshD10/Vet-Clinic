import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Button, withTheme } from "react-native-paper";
import PetAdmissionCard from "./PetAdmissionCard";
import { Ionicons } from "@expo/vector-icons";

const PetOwnerCard = ({ item, theme }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const buttonPress = () => {
    setModalVisible(true);
  };

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

  const [viewId, setViewId] = useState(false);
  const toggleViewId = () => {
    setViewId(!viewId);
  };

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Ionicons
            name="close-circle-outline"
            size={24}
            color="black"
            onPress={() => setModalVisible(false)}
            style={{ alignSelf: "flex-end", margin: 10 }}
          />

          <FlatList
            data={item.pets}
            keyExtractor={(petId) => petId}
            renderItem={({ item }) => (
              <PetAdmissionCard key={item} petId={item} />
            )}
          />
        </View>
      </Modal>
      <View style={styles.innerContainer}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image
            source={{
              uri:
                item.profile ||
                "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
            }}
            style={styles.image}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.data}>{item.name}</Text>
            <Pressable onPress={toggleViewId}>
              <Text numberOfLines={viewId ? 3 : 1} style={styles.data}>
                {item.email}
              </Text>
            </Pressable>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={buttonPress}
          style={{ margin: theme.spacing.mdSm }}
          labelStyle={{ fontSize: theme.sizes.mdSm }}
        >
          View Pets
        </Button>
      </View>
    </>
  );
};

export default withTheme(PetOwnerCard);
