import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../services/authContext";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import ChatCard from "./components/ChatCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { withTheme } from "react-native-paper";

const ChatScreen = ({ route, theme }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { chats: userChats } = user;
  const { chatId } = route.params;

  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState({
    message: "",
    sentBy: user?.email,
    sentAt: new Date().toLocaleString(),
  });

  const [partner, setPartner] = useState({});

  const flatListRef = useRef(null);

  const getPartner = async () => {
    try {
      const [petOwner, doctor] = chatId.split("+");
      const docRef = doc(
        db,
        "users",
        user?.role === "petOwner" ? doctor : petOwner
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPartner({
          name: docSnap.data().name,
          profile: docSnap.data().profile,
          email: docSnap.data().email,
        });
        const chatPartner = {
          name: docSnap.data().name,
          profile: docSnap.data().profile,
          email: docSnap.data().email,
        };
        return chatPartner;
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: partner?.name,
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={theme.sizes.lg}
            onPress={onPressBack}
            style={{ paddingRight: theme.spacing.lg }}
          />
          <Image
            source={{
              uri:
                partner?.profile ||
                "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
            }}
            style={{
              width: theme.sizes.xxl,
              height: theme.sizes.xxl,
              borderRadius: theme.radius.rounded,
              marginRight: theme.spacing.lg,
            }}
          />
        </View>
      ),
    });
  }, [partner, navigation]);

  const onPressBack = async () => {
    navigation.goBack();
  };

  const makeMessageRead = async () => {
    try {
      const collectionRef = collection(db, "chats");
      const docRef = doc(collectionRef, chatId);
      await updateDoc(docRef, {
        isMessageSeen: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChat(chatId);
  }, [partner, newMessage]);

  useEffect(() => {
    getPartner();
  }, []);

  const styles = StyleSheet.create({
    textInputContainer: {
      padding: theme.spacing.mdSm,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderRadius: theme.roundness,
      marginVertical: theme.spacing.vsm,
      marginHorizontal: theme.spacing.mdSm,
      borderWidth: 1,
    },
    textInput: {
      flex: 1,
      maxHeight: theme.layoutSize.mdSm,
    },
  });

  const getChat = async (chatId) => {
    try {
      const collectionRef = collection(db, "chats");
      const docRef = doc(collectionRef, chatId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const unsubscribe = onSnapshot(docRef, async (doc) => {
          setMessages(doc.data().messages.reverse());
          const lastMessageSentBy = doc.data().lastMessageSentBy;
          if (
            lastMessageSentBy !== user?.email &&
            lastMessageSentBy === partner?.email
          ) {
            console.log("Message is read");
            await makeMessageRead();
          }
        });
        return unsubscribe;
      } else {
        console.log("Document does not exist!");
        setMessages([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSend = async () => {
    if (newMessage.message !== "") {
      try {
        const collectionRef = collection(db, "chats");
        const docRef = doc(collectionRef, chatId);
        await updateDoc(docRef, {
          messages: arrayUnion(newMessage),
          isMessageSeen: false,
          lastMessage: newMessage.message,
          lastMessageSentDate: new Date().toLocaleString(),
          lastMessageSentBy: user?.email,
        });
        const filteredChat = userChats.filter((chat) => chat !== chatId);
        filteredChat.push(chatId);
        await updateDoc(doc(db, "users", user?.email), {
          chats: filteredChat,
        });

        const docSnap = await getDoc(doc(db, "users", partner?.email));
        const filteredChatPartner = docSnap
          .data()
          .chats.filter((chat) => chat !== chatId);
        filteredChatPartner.push(chatId);
        await updateDoc(doc(db, "users", partner?.email), {
          chats: filteredChatPartner,
        });
        setNewMessage((prev) => ({
          ...prev,
          message: "",
          sentAt: new Date().toLocaleString(),
        }));
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatCard key={item.sentAt} item={item} />}
        keyExtractor={(item) => item.sentAt}
        // ref={flatListRef}
        inverted={true}
        initialNumToRender={10}
        // onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        // onLayout={() => flatListRef.current.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Type a message"
          style={styles.textInput}
          multiline={true}
          value={newMessage?.message}
          onChangeText={(text) =>
            setNewMessage((prev) => ({ ...prev, message: text }))
          }
        />
        <Pressable onPress={onSend}>
          <Ionicons
            name="send"
            size={24}
            color="black"
            style={{ marginLeft: theme.spacing.sm }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default withTheme(ChatScreen);
