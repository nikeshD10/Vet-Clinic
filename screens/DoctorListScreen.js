import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../utils/colors";
import { Divider, Searchbar } from "react-native-paper";
import { fontSizes, spacing } from "../utils/sizes";
import { ScrollView } from "react-native-gesture-handler";
import ListElement from "../components/ListElement";

const DoctorListScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={[styles.backIcon, { margin: spacing.sm }]}>
          <Icon name="arrow-left-circle" size={40} color={colors.blue} />
        </View>

        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          elevation={3}
          style={{
            width: "60%",
            borderRadius: 24,
          }}
        />
        <TouchableOpacity
          style={[
            styles.backIcon,
            { padding: 15, backgroundColor: "black", margin: spacing.sm },
          ]}
        >
          <Text style={{ color: "white" }}>Go</Text>
        </TouchableOpacity>
      </View>
      <Divider style={{ borderWidth: 0.4 }} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: spacing.sm,
        }}
      >
        <Text style={{ fontSize: fontSizes.md, fontWeight: "bold" }}>
          Recents
        </Text>
        <TouchableOpacity>
          <Text style={{ color: colors.blue, fontWeight: "bold" }}>
            see all
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        {/* <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement /> */}
      </ScrollView>
    </View>
  );
};

export default DoctorListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    backgroundColor: "white",
    borderRadius: 50,
    marginRight: spacing.sm,
    elevation: 5,
  },
  searchHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: spacing.sm,
  },
});
