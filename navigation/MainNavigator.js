import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import DoctorNavigator from "./DoctorNavigator";
import PetOwnerNavigator from "./PetOwnerNavigator";
import AdminNavigator from "./AdminNavigator";
import { AuthContext } from "../services/authContext";
import { PetOwnerContextProvider } from "../services/petOwnerContext";
import { AdminContextProvider } from "../services/adminContext";
import { DoctorContextProvider } from "../services/doctorContext";
import LoadingScreen from "../screens/Authentication/LoadingScreen";

const MainNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {isLoading ? ( // Check isLoading state
        <LoadingScreen />
      ) : user ? (
        user.role === "admin" ? (
          <AdminContextProvider>
            <AdminNavigator />
          </AdminContextProvider>
        ) : user.role === "doctor" ? (
          <DoctorContextProvider>
            <DoctorNavigator />
          </DoctorContextProvider>
        ) : (
          <PetOwnerContextProvider>
            <PetOwnerNavigator />
          </PetOwnerContextProvider>
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default MainNavigator;
