import { StyleSheet, View, FlatList } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../services/authContext";
import PetCard from "./components/PetCard";

const PetList = () => {
  const { user } = useContext(AuthContext);
  const { pets } = user;

  return (
    <View>
      <FlatList
        data={pets}
        renderItem={({ item }) => <PetCard item={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default PetList;

const styles = StyleSheet.create({});
