import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../services/authContext";

const ChatCard = ({ item }) => {
  const { user } = useContext(AuthContext);

  const [messageTime, setMessageTime] = useState("");

  const getMessageTime = (localString) => {
    let [datePart, timePart] = localString.split(", ");
    let [month, day, year] = datePart.split("/");
    let [hours, minutes, seconds] = timePart.split(":");
    const convertedDate = new Date(year, month - 1, day, hours, minutes);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[convertedDate.getDay()];

    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const isToday =
      day == todayDay && month - 1 == todayMonth && year == todayYear;
    const isCurrentMonth = month - 1 == todayMonth && year == todayYear;
    const isCurrentYear = year == todayYear;

    if (isToday && isCurrentMonth && isCurrentYear) {
      setMessageTime(`${hours}:${minutes}`);
    } else if (!isToday && isCurrentMonth && isCurrentYear) {
      setMessageTime(`${dayOfWeek} ${hours}:${minutes}`);
    } else if (!isCurrentMonth && isCurrentYear) {
      setMessageTime(`${day}/${month} ${dayOfWeek} ${hours}:${minutes}`);
    } else if (!isCurrentYear) {
      setMessageTime(`${day}/${month}/${year} ${hours}:${minutes}`);
    }
  };

  useEffect(() => {
    if (item.sentAt) {
      getMessageTime(item.sentAt);
    }
  }, []);

  return (
    <View style={{ padding: 10 }}>
      {item.sentBy === user?.email ? (
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: "#2219e6",
              padding: 10,
              borderRadius: 10,
              marginVertical: 4,
              maxWidth: "80%",
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>{item.message}</Text>
            <Text style={{ fontSize: 12, textAlign: "right", color: "white" }}>
              {messageTime}
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              backgroundColor: "#e6e6e6",
              padding: 10,
              borderRadius: 10,
              marginVertical: 4,
              maxWidth: "80%",
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.message}</Text>
            <Text style={{ fontSize: 12, textAlign: "right" }}>
              {messageTime}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatCard;

const styles = StyleSheet.create({});
