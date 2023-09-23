import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { AuthContext } from "../../../services/authContext";
import { db } from "../../../firebase";
import { useEffect } from "react";
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { withTheme } from "react-native-paper";

const MessageCard = ({ item, theme }) => {
  const navigation = useNavigation();
  const [chatInfo, setChatInfo] = useState({});
  const { user } = useContext(AuthContext);
  const [chatPartner, setChatPartner] = useState({});

  const getPartner = async (id) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setChatPartner({
          name: docSnap.data().name,
          email: docSnap.data().email,
          profile: docSnap.data().profile,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    const getChat = () => {
      try {
        const collectionRef = collection(db, "chats");
        const docRef = doc(collectionRef, item);
        const unsubscribe = onSnapshot(docRef, async (doc) => {
          const {
            chatStatus,
            lastMessage,
            lastMessageSentDate,
            lastMessageSentBy,
            isMessageSeen,
            clientId,
            doctorId,
          } = doc.data();
          setChatInfo({
            chatStatus: chatStatus,
            lastMessage: lastMessage,
            lastMessageSentDate: lastMessageSentDate,
            isMessageSeen: isMessageSeen,
            lastMessageSentBy: lastMessageSentBy,
          });
          if (user?.role === "doctor") {
            await getPartner(clientId);
          } else {
            await getPartner(doctorId);
          }
        });
        return unsubscribe;
      } catch (error) {}
    };
    getChat();
  }, []);

  const styles = StyleSheet.create({
    name: {
      fontSize: theme.sizes.md,
      fontWeight: "bold",
    },
    message: {
      fontSize: theme.sizes.mdSm,
      fontWeight: "600",
    },
    time: {
      fontSize: theme.sizes.mdSm,
      fontWeight: "normal",
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: theme.spacing.sm,
      backgroundColor: theme.colors.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.small,
      maxHeight: theme.layoutSize.sm,
      // elevation: theme.elevation.md,
      // ...theme.shadow.md,
    },
    profile: {
      width: theme.layoutSize.vsm,
      height: theme.layoutSize.vsm,
      borderRadius: theme.radius.rounded,
      marginRight: theme.spacing.mdSm,
      borderWidth: 1,
      borderColor: theme.colors.black,
    },
    messageContainer: {
      flex: 1,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
  });

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", {
          chatId: item,
        })
      }
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri:
              chatPartner?.profile ||
              "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
          }}
          style={styles.profile}
        />
        <View style={styles.messageContainer}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.name,
                {
                  color:
                    chatInfo?.lastMessageSentBy === user?.email ||
                    chatInfo?.isMessageSeen
                      ? theme.colors.textSeenColor
                      : theme.colors.textUnseenColor,
                },
              ]}
            >
              {chatPartner?.name}
            </Text>
            {chatInfo?.lastMessage && (
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  styles.message,
                  {
                    color:
                      chatInfo?.lastMessageSentBy === user?.email ||
                      chatInfo?.isMessageSeen
                        ? theme.colors.textSeenColor
                        : theme.colors.textUnseenColor,
                  },
                ]}
              >
                {chatInfo?.lastMessage}
              </Text>
            )}
            <Text
              style={[
                styles.time,
                {
                  color:
                    chatInfo?.lastMessageSentBy === user?.email ||
                    chatInfo?.isMessageSeen
                      ? theme.colors.textSeenColor
                      : theme.colors.textUnseenColor,
                },
              ]}
            >
              {chatInfo?.lastMessageSentDate}
            </Text>
          </View>
          {chatInfo?.lastMessageSentBy === user?.email &&
            // <Ionicons
            //   name={
            //     chatInfo?.isMessageSeen
            //       ? "checkmark-circle"
            //       : "checkmark-circle-outline"
            //   }
            //   size={24}
            //   color="black"
            //   style={{ marginLeft: theme.spacing.sm }}
            // />
            (chatInfo?.isMessageSeen ? (
              <Image
                source={{
                  uri:
                    chatPartner?.profile ||
                    "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
                }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 50,
                  marginLeft: theme.spacing.sm,
                }}
              />
            ) : (
              <Ionicons
                name={"checkmark-circle-outline"}
                size={24}
                color="black"
                style={{ marginLeft: theme.spacing.sm }}
              />
            ))}
        </View>
      </View>
    </Pressable>
  );
};

export default withTheme(MessageCard);
