import { StyleSheet, Animated, View, Dimensions } from "react-native";
import React from "react";

const { width } = Dimensions.get("screen");

const Pagination = ({ data, scrollX, index }) => {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        // The inputRange array defines the range of values for which the
        // interpolation will occur. It's based on the scroll positions at
        // which you want the dots to change colors. The inputRange for each dot
        // should include the positions where you want the dot to transition from
        // one color to another.
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        /*
          Let's assume that:

          Screen width: 336 (as you mentioned)
          Number of items in the FlatList: 2
          For the first dot (index 0):

          inputRange: [(-1) * 336, 0 * 336, 1 * 336] = [-336, 0, 336]
          For the second dot (index 1):

          inputRange: [0 * 336, 1 * 336, 2 * 336] = [0, 336, 672]

          Interpolation for Background Color:
          The scrollX Animated value is interpolated to change the background color of the dots dynamically as you scroll. 
          It takes the inputRange and maps it to the corresponding outputRange of colors. The extrapolate property defines
          how the interpolation behaves beyond the defined range.

          outputRange: ["#fff", "#000", "#fff"]
          extrapolate: "clamp" (this prevents the interpolation from producing values outside the defined output range)


          Scenario:

          Initially, when the scrollX value is 0 (no scrolling), the first dot (index 0) will have a background color of #000 (black), 
          and the second dot (index 1) will have a background color of #fff (light gray).

          When you scroll to view the second item, let's say the scrollX value becomes 336 (since you've scrolled the width of the screen).
          The first dot's background color will be #fff (light gray) because it's now outside its inputRange. The second dot's background 
          color will be #000 (black) because it's within its inputRange.

          If you continue scrolling to the right, the first dot's background color will remain #fff, and the second dot's background color
          will remain #000. This will continue until the scrollX value reaches 672 (two screen widths), at which point the second dot's 
          background color will change back to #fff.

        */
        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ["#ccc", "#000", "#ccc"],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.dot, { backgroundColor }]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 100,
    marginHorizontal: 3,
    backgroundColor: "#fff",
  },
  dotActive: {
    backgroundColor: "#000",
  },
});
