// prettier-ignore
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, Pressable, Image, FlatList, KeyboardAvoidingView } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../services/authContext";
// prettier-ignore
import { Button, TextInput, ActivityIndicator, withTheme } from "react-native-paper";
// prettier-ignore
import { collection, doc, arrayUnion, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";
import PetOwnerInfoCard from "./components/PetOwnerInfoCard";

const PetRegistration = ({ theme, route }) => {
  const { user } = useContext(AuthContext);
  const { ownerEmail } = route.params;
  const [pet, setPet] = useState({
    name: "",
    age: "",
    petType: "",
    weight: "",
    height: "",
    ownerId: "",
    petId: "",
    profile: "",
    admissions: [],
  });

  useEffect(() => {
    if (ownerEmail) {
      setPet({ ...pet, ownerId: ownerEmail });
    }
  }, [ownerEmail]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (image) => {
    const email = auth.currentUser.email;
    try {
      const imageUri = image;
      const splitFileName = imageUri.split("/");
      const [imageName] = splitFileName.slice(-1);
      try {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", imageUri, true);
          xhr.send(null);
        });
        const storageRef = ref(storage, `users/${email}/pets/${imageName}`);
        await uploadBytes(storageRef, blob);
        blob.close();
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfOwnerExists = async () => {
    const userCollection = collection(db, "users");
    const userRef = doc(userCollection, pet.ownerId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return true;
    } else {
      return false;
    }
  };

  const resetRouteParams = () => {
    route.params = {};
  };

  const handlePetRegistration = async () => {
    setIsLoading(true);
    try {
      if (image) {
        const ownerExists = await checkIfOwnerExists();
        if (!ownerExists) {
          throw new Error("Owner ID does not exist");
        }
        const url = await updateProfile(image);
        const collectionPetRef = collection(db, "pets");
        const petRef = doc(collectionPetRef);
        await setDoc(petRef, { ...pet, petId: petRef.id, profile: url });

        const userRef = collection(db, "users");
        const docRefUser = doc(userRef, pet.ownerId);
        await updateDoc(docRefUser, {
          pets: arrayUnion(petRef.id),
        });

        const doctorRef = collection(db, "clinics");
        const docRefDoctor = doc(doctorRef, user?.clinicId);
        await updateDoc(docRefDoctor, {
          pets: arrayUnion(petRef.id),
        });
        setIsLoading(false);
        setPet({
          name: "",
          age: "",
          petType: "",
          weight: "",
          height: "",
          ownerId: "",
          petId: "",
          profile: "",
          admissions: [],
        });
        setImage(null);
        setError(null);
        handleBlur();
        resetRouteParams();
      } else {
        throw new Error("Please choose a photo");
      }
    } catch (error) {
      setError(error.message);
      setImage(null);
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
    },
    outlineStyle: {
      backgroundColor: theme.colors.white,
      borderWidth: 2,
      borderRadius: theme.radius.hard,
    },
    textInput: {
      marginTop: theme.spacing.sm,
    },
    loadingIndicator: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    cameraIcon: {
      justifyContent: "center",
      alignItems: "center",
      margin: theme.spacing.mdSm,
    },
    roundImage: {
      borderRadius: theme.radius.max,
      height: theme.layoutSize.mdSm,
      width: theme.layoutSize.mdSm,
      borderWidth: 1,
    },
    dropdownStyle: {
      marginTop: theme.spacing.sm,
      backgroundColor: theme.colors.white,
      borderWidth: 1,
      borderColor:
        pet.ownerId.length > 0 ? theme.colors.darkBlue : "transparent",
      borderRadius: theme.radius.hard,
      marginHorizontal: theme.spacing.sm,
      maxHeight: theme.layoutSize.xl,
    },

    dropdownList: {
      backgroundColor: "white", // Set the background color
      maxHeight: 200, // Set the fixed height
      borderWidth: 1, // Add border to the dropdown
      borderColor: "lightgray", // Border color
      borderRadius: 4, // Rounded corners
    },

    dropdownContent: {
      flexGrow: 1, // Allow content to scroll inside the fixed height
    },

    dropdownItem: {
      padding: 10, // Add some padding to each item
      borderBottomWidth: 1, // Add a border to separate items
      borderBottomColor: "lightgray", // Border color
    },
    dropdownOutlineStyle: {
      backgroundColor: theme.colors.white,
      borderWidth: 2,
      borderRadius: theme.radius.hard,
      marginTop: theme.spacing.sm,
    },
  });

  const [focusedInput, setFocusedInput] = useState(null);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const [image, setImage] = useState(null);

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    }
  };

  const pickImage = async () => {
    await requestMediaLibraryPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [petOwners, setPetOwners] = useState([]);
  const [filteredPetOwners, setFilteredPetOwners] = useState([]);

  const fetchPetOwners = async () => {
    try {
      const clinicCollection = collection(db, "clinics");
      const clinicRef = doc(clinicCollection, user?.clinicId);
      const clinicDoc = await getDoc(clinicRef);
      if (clinicDoc.exists()) {
        setPetOwners(clinicDoc.data().users);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPetOwners();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredPetOwners = petOwners.filter((petOwner) => {
        return petOwner.toLowerCase().startsWith(query.toLowerCase());
      });
      setFilteredPetOwners(filteredPetOwners);
    } else {
      setFilteredPetOwners([]);
      setPet({ ...pet, ownerId: "" });
    }
  };

  // flat list problem of double tap to be able to write input
  // so to solve problem  ReactElement example (notice that the component is passed directly, there is no function in ListHeaderComponent; you can also extract this as another component if you want):
  // i.e we need to pass wrap code in react fragment <> </> and pass it inside ListHeaderComponent instead of storing it into a new functional component
  //https://stackoverflow.com/questions/69837357/problem-keyboard-hide-after-write-one-char-in-textinput-textinput-inside-flatli
  const handleSelectPetOwner = (petOwner) => {
    setPet({ ...pet, ownerId: petOwner });
    setFilteredPetOwners([]);
  };

  const optionForPetType = [
    { id: 1, label: "Dog", value: "Dog" },
    { id: 2, label: "Cat", value: "Cat" },
    { id: 3, label: "Bird", value: "Bird" },
    { id: 4, label: "Rabbit", value: "Rabbit" },
    { id: 5, label: "Other", value: "Other" },
  ];

  const [selectedPetType, setSelectedPetType] = useState("Select Pet Type");

  const handleSelectPetType = (petType) => {
    setSelectedPetType(petType);
    setPet({ ...pet, petType: petType });
    togglePetTypeDropdown();
  };

  const [showPetTypeDropdown, setShowPetTypeDropdown] = useState(false);

  const togglePetTypeDropdown = () => {
    setShowPetTypeDropdown(!showPetTypeDropdown);
  };

  const handlePressPetType = () => {
    togglePetTypeDropdown();
    if (showPetTypeDropdown) {
      handleBlur();
    } else {
      handleFocus("petType");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <FlatList
            data={filteredPetOwners}
            renderItem={({ item }) => (
              <PetOwnerInfoCard
                item={item}
                handlePress={handleSelectPetOwner}
              />
            )}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable style={styles.cameraIcon} onPress={pickImage}>
                    {image ? (
                      <Image
                        source={{
                          uri: image,
                        }}
                        style={styles.roundImage}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="camera"
                        size={theme.layoutSize.mdSm}
                        color={theme.colors.darkBlue}
                      />
                    )}

                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>Choose photo</Text>
                      {image && (
                        <Pressable onPress={() => setImage(null)}>
                          <MaterialCommunityIcons
                            name="close"
                            size={theme.sizes.lg}
                            color={theme.colors.tertiary}
                          />
                        </Pressable>
                      )}
                    </View>
                  </Pressable>
                </View>
                {error && (
                  <Text
                    style={{
                      color: theme.colors.tertiary,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </Text>
                )}

                <TextInput
                  label="Name"
                  value={pet?.name}
                  onChangeText={(text) => setPet({ ...pet, name: text })}
                  mode="outlined"
                  outlineStyle={styles.outlineStyle}
                  style={styles.textInput}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="paw"
                          size={24}
                          color={
                            focusedInput === "name"
                              ? theme.colors.primary
                              : theme.colors.darkBlue
                          }
                        />
                      )}
                    />
                  }
                />

                <TextInput
                  label="Age"
                  value={pet?.age}
                  onChangeText={(text) => setPet({ ...pet, age: text })}
                  mode="outlined"
                  outlineStyle={styles.outlineStyle}
                  style={styles.textInput}
                  onFocus={() => handleFocus("age")}
                  onBlur={handleBlur}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="timer-sand"
                          size={24}
                          color={
                            focusedInput === "age"
                              ? theme.colors.primary
                              : theme.colors.darkBlue
                          }
                        />
                      )}
                    />
                  }
                />

                {/* <TextInput
                label="Pet Type"
                value={pet?.petType}
                onChangeText={(text) => setPet({ ...pet, petType: text })}
                mode="outlined"
                outlineStyle={styles.outlineStyle}
                style={styles.textInput}
                onFocus={() => handleFocus("petType")}
                onBlur={handleBlur}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name="shape-plus"
                        size={24}
                        color={
                          focusedInput === "petType"
                            ? theme.colors.primary
                            : theme.colors.darkBlue
                        }
                      />
                    )}
                  />
                }
              /> */}

                <Button
                  onChangeText={(text) => setPet({ ...pet, petType: text })}
                  style={styles.dropdownOutlineStyle}
                  labelStyle={{
                    color:
                      focusedInput === "petType"
                        ? theme.colors.primary
                        : theme.colors.darkBlue,
                  }}
                  onPress={handlePressPetType}
                  contentStyle={{ justifyContent: "flex-start" }}
                  mode="outlined"
                  icon={() => (
                    <MaterialCommunityIcons
                      name="shape-plus"
                      size={24}
                      style={{ marginRight: theme.spacing.sm }}
                      color={
                        focusedInput === "petType"
                          ? theme.colors.primary
                          : theme.colors.darkBlue
                      }
                    />
                  )}
                >
                  {selectedPetType}
                </Button>

                {showPetTypeDropdown && (
                  <View style={styles.dropdownStyle}>
                    <FlatList
                      data={optionForPetType}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <Pressable
                          style={styles.dropdownItem}
                          onPress={() => handleSelectPetType(item.value)}
                        >
                          <Text>{item.label}</Text>
                        </Pressable>
                      )}
                    />
                  </View>
                )}

                <TextInput
                  label="Weight KG"
                  value={pet?.weight}
                  onChangeText={(text) => setPet({ ...pet, weight: text })}
                  mode="outlined"
                  outlineStyle={styles.outlineStyle}
                  style={styles.textInput}
                  onFocus={() => handleFocus("weight")}
                  onBlur={handleBlur}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="weight-kilogram"
                          size={24}
                          color={
                            focusedInput === "weight"
                              ? theme.colors.primary
                              : theme.colors.darkBlue
                          }
                        />
                      )}
                    />
                  }
                />

                <TextInput
                  label="Height ft"
                  value={pet?.height}
                  onChangeText={(text) => setPet({ ...pet, height: text })}
                  mode="outlined"
                  outlineStyle={styles.outlineStyle}
                  style={styles.textInput}
                  onFocus={() => handleFocus("height")}
                  onBlur={handleBlur}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="human-male-height"
                          size={24}
                          color={
                            focusedInput === "height"
                              ? theme.colors.primary
                              : theme.colors.darkBlue
                          }
                        />
                      )}
                    />
                  }
                />

                <TextInput
                  label="Owner ID"
                  value={pet?.ownerId || searchQuery}
                  onChangeText={onChangeSearch}
                  mode="outlined"
                  outlineStyle={styles.outlineStyle}
                  style={styles.textInput}
                  onFocus={() => handleFocus("ownerId")}
                  onBlur={handleBlur}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="horse-human"
                          size={24}
                          color={
                            focusedInput === "ownerId"
                              ? theme.colors.primary
                              : theme.colors.darkBlue
                          }
                        />
                      )}
                    />
                  }
                />
              </>
            }
            ListFooterComponent={
              <>
                <Button
                  mode="contained"
                  onPress={handlePetRegistration}
                  style={{ margin: theme.spacing.mdSm }}
                >
                  Register Pet
                </Button>
              </>
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default withTheme(PetRegistration);
