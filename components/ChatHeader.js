import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

const ChatHeader = ({ username, picture, onlineStatus, onPress }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="angle-left" size={30} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.profile}>
          <Image style={styles.image} source={picture} />
          <View style={styles.usernameAndOnlineStatus}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.onlineStatus}>{onlineStatus}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.options}>
          <TouchableOpacity
            onPress={
              () => {}
              // navigation.navigate("OnCallScreen", {
              //   username: username,
              //   picture: picture,
              // })
            }
            style={{ paddingHorizontal: 5 }}
          >
            <Icon name="phone" size={30} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingHorizontal: 20 }}>
            <Icon name="ellipsis-v" size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.darkBlue,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  profileOptions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    flex: 4,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  usernameAndOnlineStatus: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  username: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  onlineStatus: {
    color: colors.white,
    fontSize: 16,
  },
  options: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default ChatHeader;
