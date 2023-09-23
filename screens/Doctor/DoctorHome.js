import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
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
        where("status", "==", "ongoing")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });
        setOngoingResults(results);
      });
      return unsubscribe;

      // const querySnapshot = await getDocs(q);
      // const results = [];
      // querySnapshot.forEach((doc) => {
      //   results.push(doc.data());
      // });
      // setOngoingResults(results);
    } catch (error) {
      console.log(error);
    }
  };

  const [closedAdmissions, setClosedAdmissions] = useState([]);

  const getRecentClosedAdmissions = async () => {
    try {
      const q = query(
        collection(db, "admissions"),
        where("clinicId", "==", user?.clinicId),
        where("status", "==", "closed")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });
        setClosedAdmissions(results);
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await getOngoingAdmissions();
      await getRecentClosedAdmissions();
    })();
  }, []);

  const styles = StyleSheet.create({
    ongoingAdmissionHeader: {
      textAlign: "center",
      ...theme.fonts.medium,
    },
    ongoingAdmissionContainer: {
      flex: 1,
      justifyContent: "center",
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
  };

  // const handleSearch = async (value) => {
  //   setSearchQuery(value);
  //   if (value.length > 0) {
  //     console.log(value.length);
  //     try {
  //       const q = query(
  //         collection(db, "users"),
  //         where("clinicId", "==", user?.clinicId),
  //         where("role", "==", "petOwner"),
  //         where("email", ">=", value)
  //       );
  //       const querySnapshot = await getDocs(q);
  //       const results = [];
  //       querySnapshot.forEach((doc) => {
  //         results.push(doc.data());
  //       });
  //       setShowOverLayer(true);
  //       setSearchResults(results);
  //     } catch (error) {
  //       setShowOverLayer(false);
  //       setSearchQuery("");
  //       setSearchResults([]);
  //     }
  //   } else {
  //     console.log("empty");
  //     setShowOverLayer(false);
  //     setSearchQuery("");
  //     setSearchResults([]);
  //   }
  // };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users"),
          where("clinicId", "==", user?.clinicId),
          where("role", "==", "petOwner"),
          where("email", ">=", searchQuery),
          orderBy("email"),
          limit(10)
        ),
        (querySnapshot) => {
          const results = [];
          querySnapshot.forEach((doc) => {
            results.push(doc.data());
          });
          setShowOverLayer(true);
          setSearchResults(results);
        }
      );
      return unsubscribe;
    } else {
      setShowOverLayer(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <Searchbar
          placeholder="Search Pet Owner"
          onChangeText={handleSearch}
          value={searchQuery}
          style={{ borderRadius: 0, position: "relative" }}
          onClearIconPress={onClearSearch}
          // onFocus={() => setShowOverLayer(true)}
          // onBlur={() => setShowOverLayer(false)}
        />
        {showOverLayer && (
          <View
            style={{
              height: "100%",
              backgroundColor: theme.colors.secondary,
            }}
          >
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <PetOwnerCard key={item.email} item={item} />
              )}
              keyboardShouldPersistTaps="always"
            />
          </View>
        )}
        <View style={styles.ongoingAdmissionContainer}>
          <Text style={styles.ongoingAdmissionHeader}>Ongoing Admissions</Text>
          <FlatList
            data={ongoingResults}
            keyExtractor={(item) => item.admissionId}
            renderItem={({ item }) => (
              <OngoingAdmissionCard key={item.admissionId} item={item} />
            )}
          />
        </View>

        <View style={styles.ongoingAdmissionContainer}>
          <Text style={styles.ongoingAdmissionHeader}>Recent Admissions</Text>
          <FlatList
            data={closedAdmissions}
            keyExtractor={(item) => item.admissionId}
            renderItem={({ item }) => (
              <ClosedAdmissionCard key={item.admissionId} item={item} />
            )}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default withTheme(DoctorHome);
