import React from "react";
import { View, TextInput } from "react-native";
import { spacing } from "../utils/sizes";
import Ionicon from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";

export default ProfileComponent = ({
  iconname,
  data,
  isEditable,
  onChangeText,
}) => {
  return (
    <View style={{ margin: spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Ionicon name={iconname} size={30} color={colors.purplePink} />
        <TextInput
          style={{
            fontWeight: "bold",
          }}
          editable={isEditable}
          onChangeText={onChangeText}
          value={data}
        />
      </View>
    </View>
  );
};
