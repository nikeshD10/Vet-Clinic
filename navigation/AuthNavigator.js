import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Authentication/LoginScreen";
import LoadingScreen from "../screens/Authentication/LoadingScreen";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      // initialRouteName={"Loading"}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="Loading" component={LoadingScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
