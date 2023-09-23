import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { db } from "../../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { AdminContext } from "../../services/adminContext";
import { FlatList } from "react-native";
import ClientCard from "./components/ClientCard";
import { withTheme } from "react-native-paper";

const ClientList = ({ navigation, theme }) => {
  const [clients, setClients] = useState([]);

  const { admin } = useContext(AdminContext);

  useEffect(() => {
    const q = collection(db, "clinics");
    const docRef = doc(db, "clinics", admin.email);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const data = doc.data();
      setClients(data.users);
    });
    return unsubscribe;
  }, []);
  const styles = StyleSheet.create({
    flatListStyle: {
      paddingBottom: theme.spacing.xxxl,
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Client List",
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={clients}
        renderItem={({ item }) => <ClientCard client={item} />}
        keyExtractor={(item) => item}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListStyle}
      />
    </View>
  );
};

export default withTheme(ClientList);
