import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Avatar, Text, VStack, Box } from "@react-native-material/core";
import { radius, spacing } from "../utils/sizes";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/profile_theme.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View
          style={{
            position: "relative",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/profile_background.jpg")}
            style={styles.profile_background}
            resizeMode="cover"
          />
          <View style={styles.profile}>
            <Avatar
              image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }}
            />
            <Text variant="h4">Aryan Dhakal</Text>
          </View>
        </View>

        <View style={styles.stack}>
          <VStack m={4} spacing={2} divider={true}></VStack>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  image: {
    flex: 1,
    padding: spacing.sm,
  },
  profile: {
    position: "absolute",
    top: 90,
    alignItems: "center",
  },
  profile_background: {
    borderRadius: radius.cornerElipsed,
    height: 200,
    width: "100%",
  },
  stack: {},
});
