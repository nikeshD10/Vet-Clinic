import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useEffect } from "react";
import { withTheme } from "react-native-paper";
import { FlatList } from "react-native";
import HistoryCard from "./components/HistoryCard";

const HistoryAdmission = ({ route, theme }) => {
  const { historyAdmissions } = route.params;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={historyAdmissions}
        renderItem={({ item }) => <HistoryCard admissionId={item} />}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default withTheme(HistoryAdmission);
