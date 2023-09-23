import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { db, auth } from "../../firebase";
import { useState, useEffect } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import AdmissionCard from "./components/AdmissionCard";

const AdmissionList = () => {
  const [admissionList, setAdmissionList] = useState([]);

  const getAllAdmissions = async () => {
    try {
      const collectionRef = collection(db, "clinics");
      const docRef = doc(collectionRef, auth.currentUser.email);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        const data = doc.data().admissions;
        setAdmissionList(data);
      });

      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAdmissions();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <FlatList
        data={admissionList}
        renderItem={({ item }) => <AdmissionCard admission={item} />}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AdmissionList;
