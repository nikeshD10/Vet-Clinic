import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { withTheme } from "react-native-paper";

const ProfileComponent = ({ iconname, label, data, theme, width }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      marginVertical: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
      width: width ?? "100%",
    },
    label: {
      position: "absolute",
      backgroundColor: theme.colors.white,
      paddingHorizontal: theme.spacing.vsm,
      color: theme.colors.lightGrey,
      top: -theme.spacing.sm,
      left: theme.spacing.mdSm,
      zIndex: 1,
    },
    input: {
      borderWidth: 1,
      borderRadius: theme.radius.small,
      borderColor: theme.colors.lightGrey,
      padding: theme.spacing.sm,
      paddingLeft: theme.spacing.xl,
      color: theme.colors.black,
    },
  });
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Ionicon
        name={iconname}
        size={theme.sizes.xl}
        color={theme.colors.darkBlue}
      />
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput value={data} editable={false} style={styles.input} />
      </View>
    </View>
  );
};

export default withTheme(ProfileComponent);
