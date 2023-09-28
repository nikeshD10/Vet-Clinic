import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { db } from "../../firebase";
// prettier-ignore
import { useState, useCallback, useContext, useLayoutEffect } from "react";
import { Searchbar, withTheme } from "react-native-paper";
import { AuthContext } from "../../services/authContext";
// prettier-ignore
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import PetOwnerCard from "./components/PetOwnerCard";
import { useFocusEffect } from "@react-navigation/native";
import OngoingAdmissionCard from "./components/OngoingAdmissionCard";
import ClosedAdmissionCard from "./components/ClosedAdmissionCard";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

const DoctorHome = ({ navigation, theme }) => {
  const { user } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [ongoingResults, setOngoingResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOverLayer, setShowOverLayer] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      setSearchResults([]);
      setShowOverLayer(false);
    }, [])
  );

  const getOngoingAdmissions = async () => {
    try {
      const q = query(
        collection(db, "admissions"),
        where("clinicId", "==", user?.clinicId),
        where("status", "==", "ongoing"),
        orderBy("admission_date", "desc"),
        limit(4)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
          count++;
          if (count <= 4) {
            results.push(doc.data());
          }
        });
        setOngoingResults(results);
      });
      return unsubscribe;
    } catch (error) {}
  };

  const [closedAdmissions, setClosedAdmissions] = useState([]);

  const getRecentClosedAdmissions = async () => {
    try {
      const q = query(
        collection(db, "admissions"),
        where("clinicId", "==", user?.clinicId),
        where("status", "==", "closed"),
        orderBy("discharge_date", "desc"),
        limit(4)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
          count++;
          if (count <= 4) {
            results.push(doc.data());
          }
        });
        setClosedAdmissions(results);
      });
      return unsubscribe;
    } catch (error) {}
  };

  useEffect(() => {
    if (user?.clinicId) {
      (async () => {
        await getOngoingAdmissions();
        await getRecentClosedAdmissions();
      })();
    }
  }, []);

  const styles = StyleSheet.create({
    ongoingAdmissionHeader: {
      textAlign: "center",
      ...theme.fonts.medium,
    },
    ongoingAdmissionContainer: {
      // flex: 1,
      justifyContent: "center",
    },
    viewAll: {
      textAlign: "center",
      ...theme.fonts.regular,
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="chatbubbles-outline"
            size={theme.sizes.lg}
            onPress={() => navigation.navigate("Message")}
            style={{ marginHorizontal: theme.spacing.md }}
          />
        </View>
      ),
    });
  }, [navigation]);

  const onClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowOverLayer(false);
    Keyboard.dismiss();
  };

  const handleSearch = (value) => {
    if (value.length === 0) {
      setShowOverLayer(false);
    }
    setSearchQuery(value);
  };

  const searchPetOwner = async () => {
    if (searchQuery.length > 0) {
      const q = query(
        collection(db, "users"),
        where("clinicId", "==", user?.clinicId),
        where("role", "==", "petOwner"),
        where("email", ">=", searchQuery),
        where("email", "<=", searchQuery + "\uf8ff"),
        orderBy("email"),
        limit(10)
      );
      const results = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setShowOverLayer(true);
      return results;
    } else {
      setShowOverLayer(false);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    (async () => {
      const results = await searchPetOwner();
      setSearchResults(results);
    })();
  }, [searchQuery]);

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        placeholder="Search Pet Owner"
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ borderRadius: 0, position: "relative" }}
        onIconPress={onClearSearch}
        onClearIconPress={onClearSearch}
        onKeyPress={({ nativeEvent }) => {
          if (nativeEvent.key === "Enter") {
            Keyboard.dismiss();
          }
        }}
      />
      {showOverLayer && (
        <View
          style={{
            height: "100%",
            backgroundColor: theme.colors.secondary,
            paddingBottom: theme.spacing.xxxl,
          }}
        >
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <PetOwnerCard key={item.email} item={item} />
            )}
            keyboardShouldPersistTaps="always"
            initialNumToRender={10}
            contentContainerStyle={{ paddingBottom: theme.spacing.xxxl }}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xxxl }}>
        <Text style={styles.ongoingAdmissionHeader}>Ongoing Admissions</Text>
        {ongoingResults.map((item, index) => {
          if (index >= 3) return;
          return <OngoingAdmissionCard key={item.admissionId} item={item} />;
        })}
        {ongoingResults.length > 3 && (
          <Pressable
            onPress={() => navigation.navigate("OngoingAdmissionList")}
          >
            <Text style={styles.viewAll}>view all</Text>
          </Pressable>
        )}

        <Text style={styles.ongoingAdmissionHeader}>
          Recent Closed Admissions
        </Text>
        {closedAdmissions.map((item, index) => {
          if (index >= 3) return;
          return <ClosedAdmissionCard key={item.admissionId} item={item} />;
        })}
        {closedAdmissions.length > 3 && (
          <Pressable onPress={() => navigation.navigate("ClosedAdmissionList")}>
            <Text style={styles.viewAll}>view all</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};

export default withTheme(DoctorHome);
