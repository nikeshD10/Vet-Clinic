import { useState, useEffect, useLayoutEffect } from "react";
import { View, FlatList, StyleSheet, Modal, Text } from "react-native";
import { db, auth } from "../../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import NotificationCard from "./components/NotificationCard";
import { Button, ActivityIndicator, withTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(expoPushToken, title, body, data) {
  try {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: data,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.log(error);
  }
}

const NotificationScreen = ({ theme }) => {
  const [notifications, setNotifications] = useState([]); // [ {identifier, data, body, title, date}
  const navigation = useNavigation();
  const getYourNotifications = async () => {
    try {
      const email = auth.currentUser.email;
      const docRef = doc(db, "notifications", email);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setNotifications(doc.data().notifications);
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getYourNotifications();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: theme.spacing.xl }}>
          <MaterialCommunityIcons
            name="delete-circle"
            size={theme.sizes.xl}
            color={theme.colors.red}
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      ),
    });
  }, [navigation]);

  const styles = StyleSheet.create({
    flatListStyle: {
      paddingBottom: theme.spacing.xxxl,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: theme.spacing.md,
    },
    modalView: {
      width: "100%",
      margin: theme.spacing.lg,
      backgroundColor: "white",
      padding: theme.spacing.xl,
      borderRadius: theme.roundness,
      alignItems: "center",
      shadowColor: "#000",
      ...theme.shadow.sm,
    },

    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    buttonStyle: {
      width: "100%",
      marginTop: theme.spacing.md,
      borderWidth: 2,
      borderRadius: theme.roundness,
      borderColor: theme.colors.tertiary,
    },
  });

  const handleClearNotifications = async () => {
    try {
      setIsClearing(true);
      const email = auth.currentUser.email;
      const docRef = doc(db, "notifications", email);
      await updateDoc(docRef, {
        notifications: [],
      });
      setIsModalVisible(!isModalVisible);
      setIsClearing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          {isClearing ? (
            <ActivityIndicator size="large" color={theme.colors.tertiary} />
          ) : (
            <View style={styles.modalView}>
              <Text style={theme.fonts.medium}>
                Are you sure you want to clean all notifications?
              </Text>
              <Button
                buttonColor={theme.colors.tertiary}
                onPress={handleClearNotifications}
                style={styles.buttonStyle}
                labelStyle={{ color: theme.colors.white }}
              >
                Clear
              </Button>
              <Button
                mode="outlined"
                style={styles.buttonStyle}
                labelStyle={{ color: theme.colors.tertiary }}
                onPress={() => {
                  setIsModalVisible(!isModalVisible);
                }}
              >
                Cancel
              </Button>
            </View>
          )}
        </View>
      </Modal>

      <FlatList
        data={notifications.reverse()}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        keyExtractor={(item) => item.identifier}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        contentContainerStyle={styles.flatListStyle}
      />
    </View>
  );
};

export default withTheme(NotificationScreen);
