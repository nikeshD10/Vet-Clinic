import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
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
      title: "Clinic Name 2",
      body: "Clinc Address 2",
    },
    {
      image: require("../assets/register_account.png"),
      title: "Clinic Name 3",
      body: "Clinc Address 3",
    },
    {
      image: require("../assets/sign_in.png"),
      title: "Clinic Name 4",
      body: "Clinc Address 4",
    },
    {
      image: require("../assets/welcomescreen.png"),
      title: "Clinic Name 5",
      body: "Clinc Address 5",
    },
  ];

  const [measuredWidth, setMeasuredWidth] = useState(null);
  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width },
      },
    }) => {
      setMeasuredWidth(width);
    },
    []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const onSlideChange = useCallback(() => {
    // Calculate newIndex here and use it to update your state and to scroll to the new slide
    const newIndex =
      selectedIndex === carouselImages.length - 1 ? 0 : selectedIndex + 1;

    setSelectedIndex(newIndex);

    scrollRef?.current?.scrollTo({
      animated: true,
      y: 0,
      x: dimension.width * newIndex,
    });
  }, [selectedIndex]);

  const setIndex = (event) => {
    let viewSize = event.nativeEvent.layoutMeasurement.width;
    let contentOffset = event.nativeEvent.contentOffset.x;
    let carouselIndex = Math.floor(contentOffset / viewSize);
    setSelectedIndex(carouselIndex);
  };

  useEffect(() => {
    return () => {};
  }, [onSlideChange]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor="skyblue" />

      <View onLayout={onLayout}>
        <TopSection></TopSection>
        <MiddleSection></MiddleSection>
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={setIndex}
          style={styles.thirdSection}
        >
          {cards.map((item, index) => (
            <Card
              key={index}
              imageSrc={item.image}
              cardTitle={item.title}
              cardBody={item.body}
              width={measuredWidth}
            />
          ))}
        </ScrollView>
        <View style={styles.dotContainer}>
          {cards.map((i, k) => (
            <Text
              key={k}
              style={k === selectedIndex ? styles.dot : styles.activeDot}
            >
              ⬤
            </Text>
          ))}
        </View>
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
  image: {
    flex: 1,
    justifyContent: "center",
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

  dot: {
    color: colors.white,
    margin: 3,
  },
  activeDot: {
    color: colors.black,
    margin: 3,
  },
  dotContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
