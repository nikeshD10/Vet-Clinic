import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import React from "react";
import { AuthContext } from "../../services/authContext";
import { db } from "../../firebase";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import MemberComponent from "./components/MemberComponent";

const MemberListScreen = () => {
  const { user } = useContext(AuthContext);
  const [clinicData, setClinicData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getClinicData = async () => {
    try {
      const collectionRef = collection(db, "clinics");
      const docRef = doc(collectionRef, user?.email);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setClinicData(doc.data());
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    (async () => {
      await getClinicData();
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={clinicData?.members}
        renderItem={({ item }) => <MemberComponent memberEmail={item} />}
        keyExtractor={(item) => item}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await getClinicData();
              setRefreshing(false);
            }}
          />
        }
      />
    </View>
  );
};

export default MemberListScreen;

const styles = StyleSheet.create({});
