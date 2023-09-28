// prettier-ignore
import { StyleSheet, Text, View, FlatList, Animated, Image } from "react-native";
// prettier-ignore
import React, { useContext, useState, useRef, useMemo, useLayoutEffect } from "react";
import { AuthContext } from "../../services/authContext";
import { db } from "../../firebase";
// prettier-ignore
import { collection, getDocs, query, where, onSnapshot, doc } from "firebase/firestore";
import { withTheme } from "react-native-paper";
import HomePetCard from "./components/HomePetCard";
import Pagination from "./components/Pagination";
import DoctorCard from "./components/DoctorCard";
import { ScrollView } from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ theme, navigation }) => {
  const { user } = useContext(AuthContext);
  const [admittedPets, setAdmittedPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Is used to keep track of the index of currently visible pet card.
  const [ongoingPetIndex, setOngoingPetIndex] = useState(0);
  const [doctorCardIndex, setDoctorCardIndex] = useState(0);
  // Used to keep track of the horizontal scroll position of the flatlist
  const scrollX = useRef(new Animated.Value(0)).current;

  const scrollXDoctor = useRef(new Animated.Value(0)).current;

  // This function is responsible for updating the scrollX value when the user
  // scrolls the Flatlist.
  const handleOnScroll = (event) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  const handleOnScrollDoctorCard = (event) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollXDoctor,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  // It is pased on to the Flatlist's onViewableItemsChanged prop. It is called
  // when the viewable items in the Flatlist changes. It is used to keep track
  // of the index of the currently visible pet card.
  // How does it keep track of the index of the currently visible pet card?
  // The viewableItems array contains the currently visible items in the
  // Flatlist. The first item in the array is the currently visible item. So
  // we can get the index of the currently visible item by accessing the index
  // property of the first item in the viewableItems array.

  const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
    // Timing Issue: The handleOnViewableItemsChanged function is being executed when the viewable items change. If for some reason, the viewableItems array is empty or undefined, then accessing viewableItems[0] would result in this error. This could occur if the event is triggered before the viewableItems array is properly populated.
    if (viewableItems && viewableItems.length > 0) {
      setOngoingPetIndex(viewableItems[0].index);
    }
  }).current;

  const handleOnViewableItemsChangedDoctor = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setDoctorCardIndex(viewableItems[0].index);
    }
  }).current;

  // This is the configuration object for the onViewableItemsChanged prop.
  // It is used to configure the onViewableItemsChanged callback.
  // The itemVisiblePercentThreshold property is used to specify the minimum
  // percentage of the item that must be visible in order for the item to be
  // considered as viewable.

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const { pets } = user;
  const getOnGoingPetAdmission = async () => {
    try {
      const promises = pets.map(async (pet) => {
        const collectionRef = collection(db, "admissions");
        const q = query(
          collectionRef,
          where("petId", "==", pet),
          where("clinicId", "==", user.clinicId),
          where("status", "==", "ongoing")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => {
          return {
            admissionId: doc.id,
            petId: pet,
          };
        });
      });

      const results = await Promise.all(promises);
      const admittedPetIds = results.flat();

      setAdmittedPets(admittedPetIds);
    } catch (error) {
      console.log(error);
      setAdmittedPets([]);
    }
  };

  const getDoctors = async () => {
    try {
      const collectionRef = collection(db, "clinics");
      const docRef = doc(collectionRef, user.clinicId);
      onSnapshot(docRef, (doc) => {
        const { members } = doc.data();
        setDoctors(members);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    if (!user) return;
    (async () => await getOnGoingPetAdmission())();
    (async () => await getDoctors())();
    setIsLoading(false);
  }, [user]);

  const [allPets, setAllPets] = useState([]);

  useEffect(() => {
    if (!!user && admittedPets.length === 0) {
      const yourPets = [];
      for (let i = 0; i < pets.length; i++) {
        yourPets.push({
          petId: pets[i],
        });
      }
      // console.log(yourPets);
      setAllPets(yourPets);
    }
  }, [admittedPets]);

  const styles = StyleSheet.create({
    topSection: {
      padding: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    img: {
      width: theme.layoutSize.sm,
      height: theme.layoutSize.sm,
      borderRadius: theme.radius.rounded,
      borderWidth: 2,
      borderColor: theme.colors.black,
    },
    innerMainContainer: {
      backgroundColor: theme.colors.white,
      // minHeight: "100%",
      flex: 1,
      borderTopLeftRadius: theme.radius.rounded,
      borderTopRightRadius: theme.radius.rounded,
      paddingHorizontal: theme.spacing.mdSm,
      paddingTop: theme.spacing.xxl,
      elevation: theme.elevation.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 1.0,
      shadowRadius: 10,
      marginTop: theme.spacing.sm,
    },
    boxContainer: {
      marginBottom: theme.spacing.lg,
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
            name="notifications-outline"
            size={theme.sizes.lg}
            onPress={() => navigation.navigate("Notification")}
            style={{ marginHorizontal: theme.spacing.md }}
          />

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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topSection}>
        <View>
          <Text style={theme.fonts.header}>Hi {user?.name}</Text>
          <Text style={theme.fonts.regular}>How can I help you today?</Text>
        </View>

        <Image
          style={styles.img}
          source={{
            uri:
              user?.profile ||
              "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
          }}
        />
      </View>
      {!isLoading && (
        <View style={styles.innerMainContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: theme.spacing.xxxl }}
          >
            <View style={styles.boxContainer}>
              <Text
                style={[theme.fonts.header, { marginLeft: theme.spacing.sm }]}
              >
                Your Pets
              </Text>

              {!allPets ? (
                <>
                  <FlatList
                    data={admittedPets}
                    initialNumToRender={1}
                    renderItem={({ item }) => (
                      <HomePetCard key={item.petId} item={item} />
                    )}
                    keyExtractor={(item) => item.petId}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      marginVertical: theme.spacing.mdSm,
                    }}
                    pagingEnabled
                    onScroll={handleOnScroll}
                    onViewableItemsChanged={handleOnViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    decelerationRate={"fast"}
                  />
                  <Pagination
                    data={admittedPets}
                    scrollX={scrollX}
                    index={ongoingPetIndex}
                  />
                </>
              ) : (
                <>
                  <FlatList
                    data={allPets}
                    initialNumToRender={1}
                    renderItem={({ item }) => (
                      <HomePetCard key={item.petId} item={item} />
                    )}
                    keyExtractor={(item) => item.petId}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      marginVertical: theme.spacing.mdSm,
                    }}
                    pagingEnabled
                    onScroll={handleOnScroll}
                    onViewableItemsChanged={handleOnViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    decelerationRate={"fast"}
                  />
                  <Pagination
                    data={allPets}
                    scrollX={scrollX}
                    index={ongoingPetIndex}
                  />
                </>
              )}
            </View>

            <View style={styles.boxContainer}>
              <Text
                style={[theme.fonts.header, { marginLeft: theme.spacing.sm }]}
              >
                Doctors
              </Text>
              <FlatList
                data={doctors}
                initialNumToRender={1}
                renderItem={({ item }) => <DoctorCard key={item} item={item} />}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginVertical: theme.spacing.mdSm,
                }}
                pagingEnabled
                onScroll={handleOnScrollDoctorCard}
                onViewableItemsChanged={handleOnViewableItemsChangedDoctor}
                viewabilityConfig={viewabilityConfig}
                decelerationRate={"fast"}
              />
              <Pagination
                data={doctors}
                scrollX={scrollXDoctor}
                index={doctorCardIndex}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default withTheme(Home);
