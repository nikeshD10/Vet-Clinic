import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useLayoutEffect } from "react";
import { db } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../services/authContext";
import OngoingAdmissionCard from "./components/OngoingAdmissionCard";
import { withTheme } from "react-native-paper";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const OngoingAdmissionList = ({ navigation, theme }) => {
  const { user } = useContext(AuthContext);
  const [ongoingResults, setOngoingResults] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Ongoing Admissions",
    });
  }, [navigation]);

  const getOngoingAdmissions = async () => {
    try {
      const q = query(
        collection(db, "admissions"),
        where("clinicId", "==", user?.clinicId),
        where("status", "==", "ongoing"),
        orderBy("admission_date", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });
        setOngoingResults(results);
      });
      return unsubscribe;
    } catch (error) {}
  };

  useEffect(() => {
    if (user?.clinicId) {
      (async () => {
        await getOngoingAdmissions();
      })();
    }
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={ongoingResults}
        keyExtractor={(item) => item.admissionId}
        renderItem={({ item }) => (
          <OngoingAdmissionCard key={item.admissionId} item={item} />
        )}
      />
    </View>
  );
};

export default withTheme(OngoingAdmissionList);
