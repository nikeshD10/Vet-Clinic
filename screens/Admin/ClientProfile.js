import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import React from "react";
import { withTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import PetCard from "../PetOwner/components/PetCard";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const ClientProfile = ({ route, theme }) => {
  const { clientId } = route.params;
  const [clientInfo, setClientInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const getClientInfo = async () => {
    try {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, clientId);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setClientInfo(doc.data());
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClientInfo();
  }, [clientId]);

  const styles = StyleSheet.create({
    header: {
      ...theme.fonts.header,
    },
    regularText: {
      ...theme.fonts.regular,
    },
    imageContainer: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.small,
      borderWidth: 2,
      borderColor: theme.colors.black,
      marginBottom: theme.spacing.sm,
    },
    img: {
      width: "100%",
      height: theme.layoutSize.lg,
      borderRadius: theme.radius.small,
    },
    detailContainer: {
      paddingLeft: theme.spacing.mdSm,
      marginBottom: theme.spacing.md,
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.vsm,
    },
  });

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: clientInfo?.name,
    });
  }, [navigation, clientId, clientInfo]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingBottom: theme.spacing.xxxl,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getClientInfo} />
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              clientInfo.profile ||
              "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
          }}
          style={styles.img}
        />
      </View>

      <Text style={[styles.header, { marginBottom: theme.spacing.sm }]}>
        {clientInfo.name}
      </Text>
      <View style={styles.detailContainer}>
        <View style={styles.infoContainer}>
          <Ionicons
            name="location"
            size={24}
            color="black"
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={styles.regularText}>
            {clientInfo.address} , {clientInfo.postalCode}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons
            name="mail"
            size={theme.sizes.lg}
            color="black"
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={styles.regularText}>{clientInfo.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons
            name="call"
            size={theme.sizes.lg}
            color="black"
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={styles.regularText}>{clientInfo.phone}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.header}>Pets</Text>
        {clientInfo?.pets?.map((petId) => (
          <PetCard key={petId} item={petId} />
        ))}
      </View>
    </ScrollView>
  );
};

export default withTheme(ClientProfile);
