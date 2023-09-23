import { Dimensions } from "react-native";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6F5CE2",
    secondary: "#eaeaea",
    orange: "#e5931a",
    tertiary: "#bd291d",
    white: "#fff",
    black: "#010101",
    green: "#369409",
    red: "#D2654D",
    yellow: "#F9C766",
    darkBlue: "#252250",
    lightGrey: "#d9d9d9",
    textSeenColor: "#727272",
    textUnseenColor: "#1578b7",
  },
  fonts: {
    ...DefaultTheme.fonts,

    small: {
      fontWeight: "400",
      fontSize: 12,
    },

    regular: {
      fontWeight: "500",
      fontSize: 16,
    },

    medium: {
      fontWeight: "700",
      fontSize: 16,
    },

    header: {
      fontWeight: "900",
      fontSize: 24,
    },
  },
  radius: {
    small: 8,
    medium: 12,
    hard: 16,
    rounded: 50,
    max: 100,
  },
  roundness: 24,
  spacing: {
    vsm: 4,
    sm: 8,
    mdSm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 80,
  },
  width: Dimensions.get("screen").width,
  height: Dimensions.get("screen").height,
  layoutSize: {
    vsm: 50,
    sm: 75,
    mdSm: 100,
    md: 125,
    mdLg: 150,
    lg: 200,
    xl: 300,
  },
  sizes: {
    sm: 8,
    mdSm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  elevation: {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  },
  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
  },
};
