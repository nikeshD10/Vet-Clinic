// prettier-ignore
import React, { useContext, useEffect, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/PetOwner/Home";
import Profile from "../screens/PetOwner/Profile";
import MessageScreen from "../screens/Message/MessageScreen";
import ClinicDetail from "../screens/PetOwner/ClinicDetail";
import DoctorDetail from "../screens/PetOwner/DoctorDetail";
import ChatScreen from "../screens/Message/ChatScreen";
import NotificationScreen from "../screens/Notification/Notification";
import PetList from "../screens/PetOwner/PetList";
import PetDetail from "../screens/Pet/PetDetail";
import CurrentTimeline from "../screens/Pet/CurrentTimeline";
import EditProfile from "../screens/PetOwner/EditProfile";
import ChangePassword from "../screens/common/ChangePassword";
import HistoryAdmission from "../screens/Pet/HistoryAdmission";
import { PetOwnerContext } from "../services/petOwnerContext";

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

import { auth, db } from "../firebase";
//prettier-ignore
import { getDoc, updateDoc, doc, collection, setDoc, arrayUnion } from "firebase/firestore";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// async function registerForPushNotificationsAsync() {
//   try {
//     let token;
//     if (Device.isDevice) {
//       const { status: existingStatus } =
//         await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== "granted") {
//         alert("Failed to get push token for push notification!");
//         return;
//       }
//       token = await Notifications.getExpoPushTokenAsync({
//         projectId: Constants.expoConfig.extra.eas.projectId,
//       });
//     } else {
//       alert("Must use physical device for Push Notifications");
//     }

//     if (Platform.OS === "android") {
//       Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       });
//     }
//     return token;
//   } catch (error) {
//     console.log(error);
//   }
// }

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const theme = useTheme();
  const styles = generateStyles(theme);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "ProfileStack") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Clinic") {
            iconName = focused ? "git-network" : "git-network-outline";
          } else if (route.name === "PetList") {
            iconName = focused ? "paw" : "paw-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.orange,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      })}
      detachInactiveScreens={true}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="PetList"
        component={PetList}
        options={{ headerTitle: "Your Pets" }}
      />
      <Tab.Screen name="Clinic" component={ClinicDetail} />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

// creating shared navigator for pet detail screen
const PetOwnerNavigator = () => {
  // why we didn't pass the useLayouteffect to hide tab bar in certain screen
  // because we don't need to use that hook for any screen mentioned in this stack
  // beacuse tab navigation is own shown screen inside tab bar not outside tab bar.
  const { user } = useContext(PetOwnerContext);
  const responseListener = useRef();
  const navigation = useNavigation();

  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();

  // const assignTokenToUser = async (token) => {
  //   try {
  //     if (auth.currentUser === null) return;
  //     const email = auth.currentUser.email;
  //     const docRef = doc(db, "users", email);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       if (docSnap.data().token === token) return;
  //       await updateDoc(docRef, {
  //         deviceId: token,
  //       });
  //     } else {
  //       console.log("No such document!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (!!user) {
      // if (user?.role === "petOwner") {
      // registerForPushNotificationsAsync().then(async (token) => {
      //   setExpoPushToken(token.data), await assignTokenToUser(token.data);
      // });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          navigation.navigate("Notification");
        });

      // notificationListener.current =
      //   Notifications.addNotificationReceivedListener(
      //     async (notification) => {
      //       try {
      //         const content = notification.request.content;
      //         const { data, body, title } = content;
      //         const identifier = notification.request.identifier;
      //         const date = notification.date;
      //         const collectionRef = collection(db, "notifications");
      //         const docRef = doc(collectionRef, user?.email);
      //         const docSnap = await getDoc(docRef);
      //         if (!docSnap.exists()) {
      //           await setDoc(docRef, {
      //             notifications: arrayUnion({
      //               identifier: identifier,
      //               data: data,
      //               body: body,
      //               title: title,
      //               date: date,
      //             }),
      //           });
      //         }

      //         await updateDoc(docRef, {
      //           notifications: arrayUnion({
      //             identifier: identifier,
      //             data: data,
      //             body: body,
      //             title: title,
      //             date: date,
      //           }),
      //         });
      //         setNotification(notification);
      //       } catch (error) {
      //         console.log(error);
      //       }
      //     }
      //   );

      return () => {
        Notifications.removeNotificationSubscription(responseListener.current);
        // Notifications.removeNotificationSubscription(
        //   notificationListener.current
        // );
      };
      // }
    }
  }, [user]);

  return (
    <Stack.Navigator initialRouteName="TabNavigator">
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PetDetail" component={PetDetail} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
      <Stack.Screen name="Timeline" component={CurrentTimeline} />
      <Stack.Screen name="History" component={HistoryAdmission} />
    </Stack.Navigator>
  );
};

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = generateStyles(theme);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "EditProfile" || routeName === "ChangePassword") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: styles.tabBar });
    }
  }, [navigation, route]);

  return (
    <ProfileStack.Navigator initialRouteName="Profile">
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePassword} />
    </ProfileStack.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = generateStyles(theme);
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === "Message" ||
      routeName === "Chat" ||
      routeName === "Notification"
    ) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: styles.tabBar });
    }
  }, [navigation, route]);

  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Message" component={MessageScreen} />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
      <HomeStack.Screen name="Notification" component={NotificationScreen} />
    </HomeStack.Navigator>
  );
};

export default PetOwnerNavigator;

const generateStyles = (theme) => {
  return StyleSheet.create({
    tabBar: {
      position: "absolute",
      margin: theme.spacing.sm,
      borderColor: "transparent",
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.primary,
      elevation: theme.elevation.md,
      ...theme.shadow.md,
    },
  });
};
