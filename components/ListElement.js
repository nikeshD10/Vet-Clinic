import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Avatar } from "@react-native-material/core";
import Icon from "react-native-vector-icons/Ionicons";
import { fontSizes, radius, spacing } from "../utils/sizes";
import { colors } from "../utils/colors";

export default function ListElement() {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Avatar image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }} />

        <View
          style={{
            paddingLeft: 10,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity>
            <Text style={{ fontSize: fontSizes.md, fontWeight: "bold" }}>
              Clinic of Estremoz
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="navigate" size={16} />
            <Text style={{ paddingLeft: 10 }}>Rua da Missiricoridia</Text>
          </View>
        </View>
      </View>

      <Icon name="close" size={24} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: spacing.sm,
    borderRadius: radius.cornerElipsed,
    padding: spacing.vsm,
    backgroundColor: colors.grayDarkWhite,
    shadowColor: colors.pink,
    elevation: 5,
  },
});
