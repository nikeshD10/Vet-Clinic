import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddMemberScreen from "../screens/Admin/AddMemberScreen";
import AdminHome from "../screens/Admin/AdminHome";
import MemberListScreen from "../screens/Admin/MemberListScreen";
import ChangePassword from "../screens/common/ChangePassword";
import { Ionicons } from "@expo/vector-icons";
import AdminProfile from "../screens/Admin/AdminProfile";
import { withTheme, useTheme } from "react-native-paper";
import EditAdminProfile from "../screens/Admin/EditAdminProfile";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import DoctorDetail from "../screens/PetOwner/DoctorDetail";
import ClientList from "../screens/Admin/ClientList";
import AdmissionList from "../screens/Admin/AdmissionList";
import PetList from "../screens/Admin/PetList";
import PetDetail from "../screens/Pet/PetDetail";
import CurrentTimeline from "../screens/Pet/CurrentTimeline";
import HistoryAdmission from "../screens/Pet/HistoryAdmission";
import ClientProfile from "../screens/Admin/ClientProfile";
import EditUserProfile from "../screens/Admin/components/EditUserProfile";

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
          } else if (route.name === "AddMember") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "MemberList") {
            iconName = focused ? "git-network" : "git-network-outline";
          } else if (route.name === "AdminProfileStack") {
            iconName = focused ? "person" : "person-outline";
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
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="AddMember" component={AddMemberScreen} />
      <Tab.Screen
        name="MemberList"
        component={DoctorListStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AdminProfileStack"
        component={AdminProfileStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();
const AdminNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="TabNavigator">
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EditUser" component={EditUserProfile} />
    </Stack.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = generateStyles(theme);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === "ClientList" ||
      routeName === "PetList" ||
      routeName === "AdmissionList" ||
      routeName === "PetDetail" ||
      routeName === "Timeline" ||
      routeName === "History" ||
      routeName === "ClientProfile"
    ) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: styles.tabBar });
    }
  }, [navigation, route]);

  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={AdminHome} />
      <HomeStack.Screen name="ClientList" component={ClientList} />
      <HomeStack.Screen name="PetList" component={PetList} />
      <HomeStack.Screen name="AdmissionList" component={AdmissionList} />
      <HomeStack.Screen name="PetDetail" component={PetDetail} />
      <HomeStack.Screen name="Timeline" component={CurrentTimeline} />
      <HomeStack.Screen name="History" component={HistoryAdmission} />
      <HomeStack.Screen name="ClientProfile" component={ClientProfile} />
    </HomeStack.Navigator>
  );
};

const AdminProfileStack = createNativeStackNavigator();

const AdminProfileStackNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = generateStyles(theme);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === "EditAdminProfile" ||
      routeName === "ChangeAdminPassword"
    ) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: styles.tabBar });
    }
  }, [navigation, route]);
  return (
    <AdminProfileStack.Navigator initialRouteName="AdminProfile">
      <AdminProfileStack.Screen name="AdminProfile" component={AdminProfile} />
      <AdminProfileStack.Screen
        name="EditAdminProfile"
        component={EditAdminProfile}
      />
      <AdminProfileStack.Screen
        name="ChangeAdminPassword"
        component={ChangePassword}
      />
    </AdminProfileStack.Navigator>
  );
};

const DoctorListStack = createNativeStackNavigator();

const DoctorListStackNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = generateStyles(theme);
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "DoctorDetail") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: styles.tabBar });
    }
  }, [navigation, route]);
  return (
    <DoctorListStack.Navigator initialRouteName="DoctorList">
      <DoctorListStack.Screen name="DoctorList" component={MemberListScreen} />
      <DoctorListStack.Screen name="DoctorDetail" component={DoctorDetail} />
    </DoctorListStack.Navigator>
  );
};

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

export default withTheme(AdminNavigator);
