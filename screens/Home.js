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
import { SafeAreaView } from "react-native-safe-area-context";

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
  const cards = [
    {
      image: require("../assets/forgot_pass.png"),
      title: "Clinic Name 1",
      body: "Clinc Address 1",
    },
    {
      image: require("../assets/create_account.png"),
      title: "Clinic Name 1",
      body: "Clinc Address 1",
    },
    {
      image: require("../assets/register_account.png"),
      title: "Clinic Name 1",
      body: "Clinc Address 1",
    },
    {
      image: require("../assets/sign_in.png"),
      title: "Clinic Name 1",
      body: "Clinc Address 1",
    },
    {
      image: require("../assets/welcomescreen.png"),
      title: "Clinic Name 1",
      body: "Clinc Address 1",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor="skyblue" />
      <View>
        <TopSection></TopSection>
        <MiddleSection></MiddleSection>
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thirdSection}
        >
          {cards.map((item, index) => (
            <Card
              imageSrc={item.image}
              cardTitle={item.title}
              cardBody={item.body}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "orange",
    padding: spacing.md,
    flex: 1,
  },
  img: {
    width: layoutSize.sm,
    height: layoutSize.sm,
    borderRadius: radius.rounded,
  },

  topSection: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  middleSection: {
    marginTop: spacing.md,
    borderRadius: radius.cornerElipsed,
    padding: spacing.lg,
    borderColor: "white",
    backgroundColor: "white",
    alignSelf: "stretch",
  },
  thirdSection: {},
});
