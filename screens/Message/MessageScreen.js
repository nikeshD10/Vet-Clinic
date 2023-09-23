import { StyleSheet, View, FlatList } from "react-native";
import React from "react";
import { useEffect, useContext } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../services/authContext";
import { collection, onSnapshot, doc } from "firebase/firestore";
import MessageCard from "./components/MessageCard";
import { withTheme } from "react-native-paper";

const MessageScreen = ({ theme }) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = React.useState([]);
  useEffect(() => {
    const getChats = async () => {
      try {
        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, user?.email);
        onSnapshot(docRef, (doc) => {
          // console.log(doc.data());
          const unreveresedChats = doc.data().chats;
          const reversedChats = unreveresedChats.reverse();
          setChats(reversedChats);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.mdSm,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={({ item }) => <MessageCard key={item} item={item} />}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default withTheme(MessageScreen);
