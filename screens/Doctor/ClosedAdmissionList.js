import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import ClosedAdmissionCard from "./components/ClosedAdmissionCard";
import { db } from "../../firebase";
import { useContext, useLayoutEffect, useState, useEffect } from "react";
import { AuthContext } from "../../services/authContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const ClosedAdmissionList = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [closedAdmissions, setClosedAdmissions] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Closed Admissions",
    });
  }, [navigation]);

  const getClosedAdmissions = async () => {
    try {
      const q = query(
        collection(db, "admissions"),
        where("clinicId", "==", user?.clinicId),
        where("status", "==", "closed"),
        orderBy("discharge_date", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });
        setClosedAdmissions(results);
      });
      return unsubscribe;
    } catch (error) {}
  };

  useEffect(() => {
    if (user?.clinicId) {
      (async () => {
        await getClosedAdmissions();
      })();
    }
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={closedAdmissions}
        keyExtractor={(item) => item.admissionId}
        renderItem={({ item }) => (
          <ClosedAdmissionCard key={item.admissionId} item={item} />
        )}
      />
    </View>
  );
};

export default ClosedAdmissionList;
