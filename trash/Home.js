import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { fontSizes, layoutSize, radius, spacing } from "../utils/sizes";
import Button from "../components/Button";
import Card from "../components/Card";
import HomeCard from "../components/HomeCard";

const TopSection = () => {
  return (
    <View style={styles.topSection}>
      <View>
        <Text style={{ fontSize: fontSizes.xl }}>Hi Nikesh</Text>
        <Text style={{ fontSize: fontSizes.md }}>How can I you today?</Text>
      </View>

      <Image
        style={styles.img}
        source={require("../assets/create_account.png")}
      ></Image>
    </View>
  );
};

const MiddleSection = () => {
  return (
    <View style={styles.middleSection}>
      <Text>
        Proident ad excepteur commodo exercitation voluptate id officia dolore.
        Occaecat laborum reprehenderit excepteur excepteur ad ipsum. Quis sint
        deserunt minim Lorem eiusmod in non duis excepteur nostrud. Pariatur
        tempor elit anim laboris in in magna nulla duis nulla incididunt
        nostrud.
      </Text>
      <Button text="Close" color={colors.darkPurple} />
    </View>
  );
};

const Home = ({ navigation }) => {
  const image = require("../assets/forgot_pass.png");
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor="skyblue" />
      <View style={styles.mainContainer}>
        <TopSection></TopSection>
        <MiddleSection></MiddleSection>
        <Card
          imageSrc={image}
          cardTitle="Vet clinic name"
          cardBody="Vet clinic address"
          textStyle={{ fontSize: fontSizes.sm }}
        />

        <HomeCard
          imageSrc={image}
          cardTitle="Vet clinic name"
          cardBody="Vet clinic address"
          navigation={navigation}
          // textStyle={{ fontSize: fontSizes.sm }}
          style={styles.cardStyles}
        />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "orange",
    padding: spacing.md,
  },
  mainContainer: {
    flex: 1,
  },
  img: {
    width: layoutSize.sm,
    height: layoutSize.sm,
    borderRadius: radius.rounded,
  },

  topSection: {
    flex: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  middleSection: {
    flex: 2,
    marginTop: spacing.md,
    borderRadius: radius.cornerElipsed,
    padding: spacing.lg,
    borderColor: "white",
    backgroundColor: "white",
    alignSelf: "stretch",
    minWidth: 0,
  },

  cardStyles: {
    cardBody: {
      fontSize: fontSizes.md,
    },
    card: {
      backgroundColor: colors.lightPink,
    },
  },
});
