import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { withTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const NotificationCard = ({ notification, theme }) => {
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: theme.width - theme.spacing.md * 2,
      borderRadius: theme.radius.small,
      backgroundColor: theme.colors.lightGrey,
      marginVertical: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    title: {
      ...theme.fonts.medium,
    },
    message: {
      fontSize: 14,
      fontWeight: "500",
    },
    date: {
      ...theme.fonts.small,
    },
  });
  const [expanded, setExpanded] = useState(false);

  const toggleText = () => {
    setExpanded(!expanded);
  };

  const convertDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const second = dateObj.getSeconds();

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const handleOnPress = () => {
    const screen = notification.data.screen;
    if (screen === "CurrentTimeline") {
      const admissionId = notification.data.admissionId;
      navigation.navigate("Timeline", {
        admissionId: admissionId,
        title: notification.title,
      });
    } else if (screen === "Chat") {
      const chatId = notification.data.chatId;
      navigation.navigate("Chat", {
        chatId: chatId,
      });
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={handleOnPress}
    >
      <Text style={styles.title}>{notification?.title}</Text>
      {/* <Pressable onPress={toggleText}> */}
      <Text numberOfLines={expanded ? undefined : 1} style={styles.message}>
        {notification?.body}
      </Text>
      {/* </Pressable> */}
      <Text style={styles.date}>{convertDate(notification?.date)}</Text>
    </Pressable>
  );
};

export default withTheme(NotificationCard);
