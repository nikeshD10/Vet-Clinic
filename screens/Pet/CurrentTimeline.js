import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Animated,
  PanResponder,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Text,
  Dimensions,
} from "react-native";
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { AuthContext } from "../../services/authContext";
import DropDownPicker from "react-native-dropdown-picker";
import {
  collection,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { Button, ActivityIndicator, withTheme } from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import TimelineCard from "./components/TimelineCard";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { sendPushNotification } from "../Notification/Notification";

const CurrentTimeline = ({ route, navigation, theme }) => {
  const { admissionId, title } = route.params;
  const { user } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [isStatusClosed, setIsStatusClosed] = useState(false);
  const [currentCondition, setCurrentCondition] = useState(null);
  const [newCondition, setNewCondition] = useState({
    time: new Date().toLocaleString(),
    title: "",
    doctor_email: user?.email,
    description: "",
    imageUrls: [],
  });
  const [ownerDeviceToken, setOwnerDeviceToken] = useState(null);

  const [selectedCondition, setSelectedCondition] = useState(null);
  const [openCondition, setOpenCondition] = useState(false);
  const [conditionValue, setConditionValue] = useState(null);
  const [conditions, setConditions] = useState([
    { label: "Select Condition", value: null },
    { label: "Bad", value: "bad" },
    { label: "Good", value: "good" },
    { label: "Moderate", value: "moderate" },
  ]);

  const handleSelectCondition = useCallback((value) => {
    // setCurrentCondition(value);
    setSelectedCondition(value);
  }, []);

  const camera = useRef(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [openCamera, setOpenCamera] = useState(false);
  const [images, setImages] = useState([]);
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 250) {
          hideModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const showModal = useCallback(() => {
    setModalVisible(true);
    Animated.timing(translateY, {
      toValue: -0.0 * Dimensions.get("window").height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const hideModal = useCallback(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setModalVisible(false);
  }, [translateY]);

  const cleanEverthing = () => {
    hideModal();
    setOpenCondition(false);
    setConditionValue(null);
    // setCurrentCondition(null);
    setSelectedCondition(null);
    setNewCondition({
      ...newCondition,
      title: "",
      description: "",
      imageUrls: [],
    });
    setImages([]);
  };

  const onClickCamera = () => {
    requestPermission();
    hideModal();
    setOpenCamera(true);
  };

  const onTakePhoto = async () => {
    try {
      if (camera) {
        const data = await camera.current.takePictureAsync({
          quality: 1,
          base64: true,
          // exif: true,
        });
        setOpenCamera(false);
        showModal();
        setImages([...images, data.uri]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onRemovePhoto = (url) => {
    const filteredImages = images.filter((image) => image !== url);
    setImages(filteredImages);
  };

  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async () => {
    try {
      setSubmitting(true);
      if (
        newCondition.title === "" ||
        newCondition.description === "" ||
        selectedCondition === null
      ) {
        alert("Please fill all the fields");
        setSubmitting(false);
        return;
      }
      const urls = [];
      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];
        const splitFileName = imageUri.split("/");
        const [imageName] = splitFileName.slice(-1);
        try {
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function (e) {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", imageUri, true);
            xhr.send(null);
          });
          const storageRef = ref(
            storage,
            `admissions/${admissionId}/${imageName}`
          );
          await uploadBytes(storageRef, blob);
          blob.close();
          const url = await getDownloadURL(storageRef);
          urls.push(url);
          console.log("Image uploaded successfully!");
        } catch (error) {
          console.log(error);
        }
      }
      const collectionRef = collection(db, "admissions");
      const docRef = doc(collectionRef, admissionId);
      await updateDoc(docRef, {
        general_conditions: arrayUnion({ ...newCondition, imageUrls: urls }),
        current_condition: selectedCondition,
      });
      if (ownerDeviceToken) {
        await sendPushNotification(
          ownerDeviceToken,
          // user?.deviceId,
          newCondition.title,
          newCondition.description,
          {
            admissionId: admissionId,
            screen: "CurrentTimeline",
          }
        );
      }
      cleanEverthing();
      setSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const getOwnerToken = async (petId) => {
    try {
      const collectionRef = collection(db, "pets");
      const docRef = doc(collectionRef, petId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const ownerId = docSnap.data().ownerId;
        const ownerRef = doc(db, "users", ownerId);
        const ownerSnap = await getDoc(ownerRef);
        if (ownerSnap.exists()) {
          setOwnerDeviceToken(ownerSnap.data().deviceId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeline = async () => {
    setIsLoading(true);
    try {
      const collectionRef = collection(db, "admissions");
      const docRef = doc(collectionRef, admissionId);
      const unsubscribe = onSnapshot(docRef, async (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.status === "closed") {
            setIsStatusClosed(true);
          }
          setTimeline(data.general_conditions);
          setCurrentCondition(data.current_condition);
          const petId = data.petId;
          await getOwnerToken(petId);
          setIsLoading(false);
        } else {
          console.log("No such document!");
        }
      });
      return unsubscribe;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const [isCloseModalVisible, setIsCloseModalVisible] = useState(false);

  useEffect(() => {
    getTimeline();
  }, [admissionId]);

  const flatListRef = useRef(0);

  // Calculate item height based on your item layout
  const getItemLayout = (data, index) => ({
    length: theme.height / 4, // Replace ITEM_HEIGHT with your item's actual height
    offset: (theme.height / 4) * index,
    index,
  });

  useEffect(() => {
    if (title && flatListRef.current) {
      // Find the index of the item with the matching title
      const index = timeline.findIndex((item) => item.title === title);
      // Scroll to the item in the reversed FlatList
      if (index !== -1) {
        // const reversedIndex = timeline.length - 1 - index;
        flatListRef.current.scrollToIndex({
          // index: reversedIndex,
          index: index < 3 ? index : index - 1,
          animated: true,
        });
      }
    }
  }, [title, isLoading]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.xxl,
      backgroundColor: theme.colors.white,
    },
    list: {
      flex: 1,
      marginTop: theme.spacing.lg,
    },
    title: {
      ...theme.fonts.header,
    },
    descriptionContainer: {
      flexDirection: "row",
      paddingRight: theme.spacing.xxl,
    },
    image: {
      width: theme.layoutSize.vsm,
      height: theme.layoutSize.vsm,
      borderRadius: theme.roundness,
    },
    textDescription: {
      marginLeft: theme.spacing.mdSm,
      color: theme.colors.lightGrey,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: theme.colors.white,
      height: "75%",
      borderTopLeftRadius: theme.roundness,
      borderTopRightRadius: theme.roundness,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },
    input: {
      marginBottom: theme.spacing.lg,
      borderBottomWidth: 1,
      borderColor: theme.colors.lightGrey,
      paddingVertical: theme.spacing.mdSm,
    },
    dragIconContainer: {
      alignItems: "center",
      padding: 10,
    },
    dragIcon: {
      width: theme.layoutSize.vsm,
      height: theme.sizes.sm,
      backgroundColor: theme.colors.lightGrey,
      borderRadius: theme.radius.small,
    },
    cameraContainer: {
      flex: 1,
      minHeight: "100%",
      zIndex: 999,
    },
    takePictureIcon: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: "transparent",
      position: "absolute",
      bottom: 10,
      alignSelf: "center",
    },
    activityIndicatorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    capturedImageContainer: {
      width: theme.layoutSize.mdSm,
      height: theme.layoutSize.mdSm,
      margin: theme.spacing.vsm,
      position: "relative",
    },
    removeIcon: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    capturedImage: {
      width: theme.layoutSize.mdSm,
      height: theme.layoutSize.mdSm,
      zIndex: -1,
    },
    bottomContainer: {
      backgroundColor: theme.colors.darkBlue,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.mdSm,
    },
    closeButton: {
      margin: theme.spacing.sm,
      position: "absolute",
      right: 0,
    },
    addCircleIcon: {
      alignSelf: "center",
      marginVertical: theme.spacing.sm,
    },
    mainContainer: { flex: 1 },

    contidions: {
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      // borderRadius: theme.radius.max,
      height: 10,
      // width: theme.layoutSize.vsm,
      backgroundColor:
        currentCondition === "good"
          ? "green"
          : currentCondition === "moderate"
          ? "yellow"
          : "red",
    },
  });

  const [isClosing, setIsClosing] = useState(false);

  const handleCloseAdmission = async () => {
    setIsClosing(true);
    try {
      const collectionRef = collection(db, "admissions");
      const docRef = doc(collectionRef, admissionId);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await updateDoc(docRef, {
        status: "closed",
        discharge_date: new Date().toLocaleString(),
      });
      setIsClosing(false);
      setIsCloseModalVisible(false);
      navigation.navigate("Home");
    } catch (error) {
      setIsClosing(false);
      setIsCloseModalVisible(false);
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.mainContainer}>
        {openCamera && (
          <View style={styles.cameraContainer}>
            <Camera
              ref={camera}
              style={{ flex: 1 }}
              type={CameraType.back}
              ratio={"4:3"}
            >
              <Pressable style={styles.takePictureIcon}>
                <Ionicons
                  name="camera"
                  size={50}
                  color="white"
                  style={{ alignSelf: "center" }}
                  onPress={onTakePhoto}
                />
              </Pressable>
            </Camera>
          </View>
        )}
        {isLoading ? (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Modal transparent visible={isModalVisible} animationType="slide">
              <View style={styles.modalBackground}>
                {submitting ? (
                  <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" color="blue" />
                  </View>
                ) : (
                  <Animated.View
                    style={[
                      styles.modalContainer,
                      { transform: [{ translateY }] },
                    ]}
                  >
                    <View
                      style={styles.dragIconContainer}
                      {...panResponder.panHandlers}
                    >
                      <View style={styles.dragIcon}></View>
                    </View>
                    <TextInput
                      placeholder="Title"
                      style={styles.input}
                      value={newCondition.title}
                      onChangeText={(text) =>
                        setNewCondition({ ...newCondition, title: text })
                      }
                    />
                    <TextInput
                      placeholder="Description"
                      style={styles.input}
                      value={newCondition.description}
                      multiline={true}
                      onChangeText={(text) =>
                        setNewCondition({ ...newCondition, description: text })
                      }
                    />
                    <View style={{ marginVertical: 10 }}>
                      <DropDownPicker
                        open={openCondition}
                        value={conditionValue}
                        items={conditions}
                        setOpen={setOpenCondition}
                        setValue={setConditionValue}
                        setItems={setConditions}
                        onChangeValue={handleSelectCondition}
                        theme="DARK"
                        mode="BADGE"
                      />
                    </View>
                    <Pressable onPress={onClickCamera}>
                      <Ionicons
                        name="camera"
                        size={50}
                        color="black"
                        style={{ alignSelf: "center" }}
                      />
                    </Pressable>
                    {images.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {images.map((url, index) => (
                          <View
                            key={index}
                            style={styles.capturedImageContainer}
                          >
                            <TouchableOpacity
                              onPress={() => onRemovePhoto(url)}
                              style={styles.removeIcon}
                            >
                              <Ionicons
                                name="remove-circle"
                                size={24}
                                color={theme.colors.white}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{ uri: url }}
                              style={styles.capturedImage}
                            />
                          </View>
                        ))}
                      </View>
                    )}
                    <Button mode="contained" onPress={onSubmit}>
                      Submit
                    </Button>
                  </Animated.View>
                )}
              </View>
            </Modal>

            <FlatList
              ref={flatListRef}
              data={timeline.reverse()}
              keyExtractor={(item, index) => index.toString()}
              inverted
              initialNumToRender={3}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TimelineCard key={index.toString()} item={item} />
              )}
              getItemLayout={getItemLayout} // Provide the getItemLayout prop
            />
            {user?.role === "doctor" && !isStatusClosed && (
              <>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isCloseModalVisible}
                  onRequestClose={() =>
                    setIsCloseModalVisible(!isCloseModalVisible)
                  }
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isClosing ? (
                      <View>
                        <ActivityIndicator
                          size="large"
                          color={theme.colors.green}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          padding: theme.spacing.lg,
                          backgroundColor: theme.colors.white,
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.red,
                            fontSize: theme.sizes.md,
                            fontWeight: "bold",
                            textAlign: "center",
                            paddingVertical: theme.spacing.md,
                          }}
                        >
                          Confirm before closing the admission state?
                        </Text>
                        <Button
                          mode="contained"
                          style={{ marginBottom: theme.spacing.mdSm }}
                          buttonColor={theme.colors.tertiary}
                          onPress={handleCloseAdmission}
                        >
                          Close
                        </Button>
                        <Button
                          mode="outlined"
                          style={{ marginBottom: theme.spacing.mdSm }}
                          onPress={() =>
                            setIsCloseModalVisible(!isCloseModalVisible)
                          }
                        >
                          Cancel
                        </Button>
                      </View>
                    )}
                  </View>
                </Modal>

                <View style={styles.bottomContainer}>
                  <Pressable onPress={showModal}>
                    <Ionicons
                      name="add-circle"
                      size={theme.layoutSize.vsm}
                      color={theme.colors.white}
                      style={styles.addCircleIcon}
                    />
                  </Pressable>
                  <Button
                    mode="contained"
                    style={styles.closeButton}
                    onPressOut={() => setIsCloseModalVisible(true)}
                  >
                    Close
                  </Button>
                </View>
              </>
            )}
          </View>
        )}
        {!isStatusClosed && <View style={styles.contidions}></View>}
      </View>
    </>
  );
};

export default withTheme(CurrentTimeline);
