import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Avatar, Text, VStack } from "@react-native-material/core";
import { fontSizes, radius, spacing } from "../utils/sizes";
import { colors } from "../utils/colors";
import ProfileComponent from "../components/ProfileComponent";

const ProfileScreen = () => {
  const [name, setName] = useState("Alexandra Dadadario");
  const [email, setEmail] = useState("alexandra@email.com");
  const [phoneNumber, setPhoneNumber] = useState("+12-202-5253-538");
  const [password, setPassword] = useState("*********");

  const [isEditable, setIsEditable] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/profile_theme.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 56,
          }}
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
              <Text variant="h4" color="white">
                Aryan Dhakal
              </Text>
            </View>
          </View>

          <View style={styles.stack}>
            <VStack m={4} spacing={2} divider={true}>
              <ProfileComponent
                iconname="person"
                data={name}
                isEditable={isEditable}
                onChangeText={(name) => setName(name)}
              />
              <ProfileComponent
                iconname="phone-portrait"
                data={phoneNumber}
                isEditable={isEditable}
                onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
              />
              <ProfileComponent
                iconname="mail"
                data={email}
                isEditable={isEditable}
                onChangeText={(email) => setEmail(email)}
              />
              <ProfileComponent
                iconname="lock-open"
                data={password}
                isEditable={isEditable}
                onChangeText={(password) => setPassword(password)}
              />
            </VStack>
          </View>

          <View>
            {isEditable ? (
              <TouchableOpacity
                onPress={() => setIsEditable(false)}
                style={styles.button}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: fontSizes.md,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditable(true)}
                style={[styles.button, { backgroundColor: colors.darkPurple }]}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: fontSizes.md,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    paddingHorizontal: spacing.sm,
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
  stack: {
    backgroundColor: "white",
    borderRadius: radius.cornerElipsed,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    width: "100%",
    marginVertical: 10,
    elevation: 20,
    shadowColor: "#52006A",
  },
  button: {
    width: 200,
    padding: spacing.md,
    backgroundColor: "#ffff",
    alignItems: "center",
    borderRadius: radius.cornerCircled,
    margin: spacing.md,
    borderColor: colors.darkPurple,
    borderWidth: 2,
    alignSelf: "center",
  },
});
