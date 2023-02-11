import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import { colors } from "../utils/colors";

const ChatMessageItem = (props) => {
  const { message, senderName, user, senderId } = props;
  return (
    <View style={{ flex: 1 }}>
      {user === senderId ? (
        <View style={styles.leftMessageContainer}>
          <View
            style={{
              ...styles.messageTile,
              backgroundColor: "pink",
            }}
          >
            <Text textStyle={{ color: "purple" }}>{message}</Text>
          </View>
          <View style={{ marginRight: 10 }}>
            {/* <Text textStyle={{ fontSize: 10 }}>
                {getDisplayTime(messageTime)}
              </Text> */}
          </View>
        </View>
      ) : (
        <View style={styles.rightMessageContainer}>
          <View style={{ ...styles.messageTile, backgroundColor: colors.gray }}>
            <View style={{ paddingRight: 10, paddingBottom: 5 }}>
              <Text textStyle={{ fontSize: 18, color: "purple" }}>
                {message}
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 10 }}>
            {/* <Text textStyle={{ fontSize: 10 }}>
                {getDisplayTime(messageTime)}
              </Text> */}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  leftMessageContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginBottom: 3,
    marginTop: 5,
  },
  rightMessageContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginVertical: 5,
  },
  messageTile: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    borderRadius: 5,
    maxWidth: "60%",
  },
});

const messages = [
  {
    message: "hello Nikesh",
    senderId: 1,
    senderName: "Aryan",
  },

  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "Hello world by the native by the means fo the world ",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 2,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 1,
    senderName: "Aryan",
  },
  {
    message: "hello",
    senderId: 2,
    senderName: "Aryan",
  },
];

const MessageScreen = () => {
  // const time = new Date();
  // const messageTime = time.getHours() + ": " + time.getMinutes;
  const userData = { userId: 1 };
  const [reply, setReply] = useState("");
  const [isLeft, setIsLeft] = useState();

  const swipeToReply = (message, isLeft) => {
    setReply(message.length > 50 ? message.slice(0, 50) + "..." : message);
    setIsLeft(isLeft);
  };

  const closeReply = () => {
    setReply("");
  };
  return (
    <View style={{ flex: 1 }}>
      <ChatHeader
        onPress={() => {}}
        username={"username"}
        picture={require("../assets/forgot_pass.png")}
        onlineStatus={"Online"}
      />
      <FlatList
        style={{ flex: 1 }}
        keyExtractor={(item, index) => index.toString()}
        inverted={true}
        data={messages}
        renderItem={({ item, index }) => {
          return (
            <ChatMessageItem
              item={item}
              user={userData.userId}
              senderId={item.senderId}
              // getDisplayTime={messageTime}
              senderName={item.senderName}
              message={item.message}
            />
          );
        }}
      />
      <ChatInput
        reply={reply}
        isLeft={isLeft}
        closeReply={closeReply}
        username={"username"}
      />
    </View>
  );
};

export default MessageScreen;
