import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../utils/colors.js";
import { spacing } from "../utils/sizes.js";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  return (
    <View style={styles.innerContainer}>
      <View style={styles.inputAndMicrophone}>
        <TextInput
          multiline
          placeholder={"Type something..."}
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.rightIconButtonStyle}>
          <Icon name="paperclip" size={23} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightIconButtonStyle}>
          <Icon name="camera" size={23} color={colors.white} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Icon name={"send"} size={32} color={colors.darkBlue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  replyContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  innerContainer: {
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },

  inputAndMicrophone: {
    flexDirection: "row",
    backgroundColor: colors.gray,
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "space-between",
  },

  input: {
    paddingLeft: 20,
    color: colors.black,
    flex: 3,
    fontSize: 15,
    height: 50,
    alignSelf: "center",
  },

  rightIconButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: spacing.sm,
    paddingLeft: spacing.vsm,
  },

  sendButton: {
    backgroundColor: colors.darkBlue,
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatInput;
