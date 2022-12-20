import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { fontSizes, radius, spacing } from "../utils/sizes";
import Ionicon from "react-native-vector-icons/Ionicons";

const Card = (props) => {
  return (
    <View style={styles.card}>
      <Image source={props.imageSrc} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <View style={{ alignSelf: "flex-end", flex: 1 }}>
          <Ionicon
            name={"ios-location-outline"}
            size={16}
            color={"white"}
          ></Ionicon>
        </View>
        <View
          style={{
            paddingRight: spacing.md,
            paddingLeft: spacing.sm,
            flex: 10,
          }}
        >
          <Text style={styles.cardTitle}>{props.cardTitle}</Text>
          <Text style={styles.cardBodyText}>{props.cardBody}</Text>
        </View>
        <View style={{ alignSelf: "center", flex: 1 }}>
          <Ionicon
            name={"chevron-forward-circle-outline"}
            size={23}
            color={"white"}
          ></Ionicon>
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    flex: 2,
    marginTop: spacing.md,
    borderRadius: radius.cornerHarden,
    backgroundColor: colors.darkPurple,
    borderColor: "white",
    borderWidth: 2,
  },
  cardBody: {
    padding: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardTitle: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: fontSizes.md,
  },
  cardBodyText: {
    color: colors.yellow,
    fontWeight: "bold",
    fontSize: fontSizes.mdSm,
  },
  cardImage: {
    width: "100%",
    height: 100,
    margin: 0,
    resizeMode: "contain",
    borderTopLeftRadius: radius.radiusToCoverCard,
    borderTopRightRadius: radius.radiusToCoverCard,
  },
});
