import { View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import PetCard from "../PetOwner/components/PetCard";

const PetList = () => {
  const [pets, setPets] = useState([]);

  const getClinicData = async () => {
    try {
      const collectionRef = collection(db, "clinics");
      const docRef = doc(collectionRef, auth.currentUser.email);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        const pets = doc.data().pets;
        setPets(pets);
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClinicData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pets}
        renderItem={({ item }) => <PetCard item={item} />}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PetList;
