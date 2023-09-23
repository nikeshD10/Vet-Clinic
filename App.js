import { StatusBar } from "react-native";
import { AuthProvider } from "./services/authContext";
import MainNavigator from "./navigation/MainNavigator";
import { PaperProvider } from "react-native-paper";
import { theme } from "./utils/theme";

export default function App() {
  return (
    <>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <MainNavigator />
        </AuthProvider>
      </PaperProvider>
      <StatusBar style="auto" />
    </>
  );
}
