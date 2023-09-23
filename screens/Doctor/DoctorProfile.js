import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProfileComponent from "../../components/ProfileComponent";
import { Button, ActivityIndicator, withTheme } from "react-native-paper";
import { AuthContext } from "../../services/authContext";
import { DoctorContext } from "../../services/doctorContext";

const DoctorProfile = ({ theme }) => {
  const { doctor, isLoading } = useContext(DoctorContext);
  const [u, setU] = useState({});
  const navigation = useNavigation();
  const { logout, isSigningOut } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    setModalVisible(!modalVisible);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: doctor?.name || "Profile",
      headerRight: () => (
        <View>
          <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Ionicons
              name="log-out-outline"
              size={theme.sizes.xl}
              style={{
                marginRight: theme.spacing.lg,
                color: theme.colors.tertiary,
              }}
            />
            <Text
              style={{
                ...theme.fonts.small,
                fontWeight: "bold",
                color: theme.colors.tertiary,
              }}
            >
              Logout
            </Text>
          </Pressable>
        </View>
      ),
    });
  }, [doctor, navigation]);

  useEffect(() => {
    if (doctor) {
      setU(doctor);
    }
  }, [doctor]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
    },
    profile_background: {
      borderRadius: theme.radius.hard,
      height: theme.layoutSize.lg,
      width: "100%",
    },
    stack: {
      backgroundColor: "white",
      borderRadius: theme.radius.hard,
      paddingVertical: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.lg,
      width: "95%",
      marginVertical: theme.spacing.sm,
      elevation: theme.elevation.md,
      alignSelf: "center",
      ...theme.shadow.sm,
    },
    profile: {
      borderRadius: theme.radius.max,
      height: theme.layoutSize.mdSm,
      width: theme.layoutSize.mdSm,
      borderWidth: 2,
      borderColor: theme.colors.black,
      margin: theme.spacing.vsm,
    },
    button: {
      width: theme.layoutSize.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.white,
      alignItems: "center",
      borderRadius: theme.roundness,
      margin: theme.spacing.md,
      borderColor: theme.colors.black,
      borderWidth: 2,
      alignSelf: "center",
    },

    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: theme.spacing.md,
    },
    modalView: {
      width: "100%",
      margin: theme.spacing.lg,
      backgroundColor: "white",
      padding: theme.spacing.xl,
      borderRadius: theme.roundness,
      alignItems: "center",
      shadowColor: "#000",
      ...theme.shadow.sm,
    },

    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    buttonStyle: {
      width: "100%",
      marginTop: theme.spacing.md,
      borderWidth: 2,
      borderRadius: theme.roundness,
      borderColor: theme.colors.tertiary,
    },
  });

  return (
    <>
      {!isLoading ? (
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              {/* <View style={styles.modalView}>
                <Text style={theme.fonts.medium}>Logout of your account?</Text>
                <Button
                  buttonColor={theme.colors.tertiary}
                  onPress={handleLogout}
                  style={styles.buttonStyle}
                  labelStyle={{ color: theme.colors.white }}
                >
                  Logout
                </Button>
                <Button
                  mode="outlined"
                  style={styles.buttonStyle}
                  labelStyle={{ color: theme.colors.tertiary }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  Cancel
                </Button>
              </View> */}

              {isSigningOut ? (
                <ActivityIndicator size="large" color={theme.colors.tertiary} />
              ) : (
                <View style={styles.modalView}>
                  <Text style={theme.fonts.medium}>
                    Logout of your account?
                  </Text>
                  <Button
                    buttonColor={theme.colors.tertiary}
                    onPress={handleLogout}
                    style={styles.buttonStyle}
                    labelStyle={{ color: theme.colors.white }}
                  >
                    Logout
                  </Button>
                  <Button
                    mode="outlined"
                    style={styles.buttonStyle}
                    labelStyle={{ color: theme.colors.tertiary }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    Cancel
                  </Button>
                </View>
              )}
            </View>
          </Modal>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: theme.spacing.xxxl,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={{
                  uri: u.profile
                    ? u.profile
                    : "https://res.cloudinary.com/dmpfnj9yi/image/upload/v1690509826/profile_pcwgdb.png",
                }}
                style={styles.profile}
              />
            </View>

            <View
              style={{
                padding: theme.spacing.md,
              }}
            >
              <Text style={{ ...theme.fonts.medium, textAlign: "left" }}>
                About
              </Text>
              <Text
                style={{
                  ...theme.fonts.small,
                  textAlign: "justify",
                }}
              >
                {u?.information}
              </Text>
            </View>

            <View style={styles.stack}>
              <ProfileComponent label="Name" iconname="person" data={u.name} />
              <ProfileComponent
                label="Phone"
                iconname="phone-portrait"
                data={u.phone}
              />
              <ProfileComponent label="E-mail" iconname="mail" data={u.email} />
              <ProfileComponent
                label="Address"
                iconname="map"
                data={u.address}
              />
              <ProfileComponent
                label="Postal-Code"
                iconname="locate"
                data={u.postalCode}
              />

              <Button
                mode="contained"
                style={{ marginVertical: theme.spacing.sm }}
                onPress={() => navigation.navigate("EditProfile")}
              >
                Edit Profile
              </Button>
              <Button
                mode="contained"
                style={{ marginVertical: theme.spacing.sm }}
                onPress={() => navigation.navigate("ChangePassword")}
              >
                Change Password
              </Button>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}
    </>
  );
};

export default withTheme(DoctorProfile);
