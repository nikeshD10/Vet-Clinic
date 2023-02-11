import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import MessageScreen from "../screens/MessageScreen";
import DoctorListScreen from "../screens/DoctorListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Ionicon from "react-native-vector-icons/Ionicons";
import { radius, spacing } from "../utils/sizes";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Message") {
            iconName = focused
              ? "ios-chatbubble-ellipses-sharp"
              : "ios-chatbubble-ellipses-outline";
          } else if (route.name === "DoctorList") {
            iconName = focused ? "git-network" : "git-network-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicon name={iconName} size={size} color={"black"} />;
        },
        tabBarActiveTintColor: "b63131",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{ headerShown: false, tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="DoctorList"
        component={DoctorListScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    margin: 8,
    height: 56,
    bordetColor: "transparent",
    borderRadius: radius.cornerElipsed,
    backgroundColor: "#6F5CE2",
    shadowColor: "black",
    elevation: 3,
  },
});

export default TabNavigator;
