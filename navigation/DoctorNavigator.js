import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import DoctorHome from "../screens/Doctor/DoctorHome";
import DoctorProfile from "../screens/Doctor/DoctorProfile";
import AddUser from "../screens/Doctor/AddUser";
import PetRegistration from "../screens/Doctor/PetRegistration";
import AdmitPet from "../screens/Doctor/AdmitPet";
import PetDetail from "../screens/Pet/PetDetail";
import CurrentTimeline from "../screens/Pet/CurrentTimeline";
import HistoryAdmission from "../screens/Pet/HistoryAdmission";
import MessageScreen from "../screens/Message/MessageScreen";
import ChatScreen from "../screens/Message/ChatScreen";
import EditDoctorProfile from "../screens/Doctor/EditDoctorProfile";
import ChangePassword from "../screens/common/ChangePassword";
import { withTheme, useTheme } from "react-native-paper";
import OngoingAdmissionList from "../screens/Doctor/OngoingAdmissionList";
import ClosedAdmissionList from "../screens/Doctor/ClosedAdmissionList";

const Tab = createBottomTabNavigator();

const DoctorNavigator = ({ theme }) => {
  const styles = generateStyles(theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "DoctorHomeStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "AddPetOwner") {
            iconName = focused ? "person-add" : "person-add-outline";
          } else if (route.name === "DoctorProfileStack") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "AddPet") {
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
    >
      <Tab.Screen
        name="DoctorHomeStack"
        component={DoctorHomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="AddPetOwner" component={AddUser} />
      <Tab.Screen
        name="AddPet"
        component={PetRegistration}
        initialParams={{ ownerEmail: "" }}
      />
      <Tab.Screen
        name="DoctorProfileStack"
        component={DoctorProfileStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const DoctorHomeStackNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = generateStyles(theme);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === "Timeline" ||
      routeName === "Message" ||
      routeName === "Chat" ||
      routeName === "AdmitPet" ||
      routeName === "PetDetail" ||
      routeName === "History" ||
      routeName === "OngoingAdmissionList" ||
      routeName === "ClosedAdmissionList"
    ) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: styles.tabBar });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={DoctorHome} />
      <Stack.Screen name="AdmitPet" component={AdmitPet} />
      <Stack.Screen name="PetDetail" component={PetDetail} />
      <Stack.Screen name="Timeline" component={CurrentTimeline} />
      <Stack.Screen name="History" component={HistoryAdmission} />
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen
        name="OngoingAdmissionList"
        component={OngoingAdmissionList}
      />
      <Stack.Screen
        name="ClosedAdmissionList"
        component={ClosedAdmissionList}
      />
    </Stack.Navigator>
  );
};

const DoctorProfileStack = createNativeStackNavigator();

const DoctorProfileStackNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = generateStyles(theme);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === "EditDoctorProfile" ||
      routeName === "ChangeDoctorPassword"
    ) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: styles.tabBar });
    }
  }, [navigation, route]);
  return (
    <DoctorProfileStack.Navigator initialRouteName="DoctorProfile">
      <DoctorProfileStack.Screen
        name="DoctorProfile"
        component={DoctorProfile}
      />
      <DoctorProfileStack.Screen
        name="EditDoctorProfile"
        component={EditDoctorProfile}
      />
      <DoctorProfileStack.Screen
        name="ChangeDoctorPassword"
        component={ChangePassword}
      />
    </DoctorProfileStack.Navigator>
  );
};

export default withTheme(DoctorNavigator);

const generateStyles = (theme) => {
  return StyleSheet.create({
    tabBar: {
      position: "absolute",
      margin: theme.spacing.sm,
      height: theme.layoutSize.vsm,
      bordetColor: "transparent",
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.primary,
      shadowColor: "black",
      elevation: theme.elevation.md,
    },
  });
};
