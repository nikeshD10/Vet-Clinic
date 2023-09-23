import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { auth, db } from "../firebase";
import {
  getDoc,
  updateDoc,
  onSnapshot,
  doc,
  collection,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { Platform } from "react-native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export const AuthContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  try {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  } catch (error) {
    console.log(error);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(true);
      try {
        const credential = await SecureStore.getItemAsync("credential");
        const parsedCredential = JSON.parse(credential);
        if (parsedCredential) {
          const email = parsedCredential.email;
          const password = parsedCredential.password;
          const userRef = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const collectionRef = collection(db, "users");
          const docRef = doc(collectionRef, userRef.user.email);
          const unsubscribe = onSnapshot(docRef, async (doc) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setUser(doc.data());
            setIsLoading(false);
            setError(null);
          });
          return () => unsubscribe();
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setIsLoading(false);
          setError(null);
        }
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setError("Credential is invalid. Please login again.");
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  // const responseListener = useRef();

  const assignTokenToUser = async (token) => {
    try {
      if (auth.currentUser === null) return;
      const email = auth.currentUser.email;
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().token === token) return;
        await updateDoc(docRef, {
          deviceId: token,
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!!user) {
      if (user.role !== "admin") {
        registerForPushNotificationsAsync().then(async (token) => {
          setExpoPushToken(token.data), await assignTokenToUser(token.data);
        });
      }

      notificationListener.current =
        Notifications.addNotificationReceivedListener(async (notification) => {
          try {
            const content = notification.request.content;
            const { data, body, title } = content;
            const identifier = notification.request.identifier;
            const date = notification.date;
            const collectionRef = collection(db, "notifications");
            const docRef = doc(collectionRef, user?.email);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
              await setDoc(docRef, {
                notifications: arrayUnion({
                  identifier: identifier,
                  data: data,
                  body: body,
                  title: title,
                  date: date,
                }),
              });
            }

            await updateDoc(docRef, {
              notifications: arrayUnion({
                identifier: identifier,
                data: data,
                body: body,
                title: title,
                date: date,
              }),
            });
            setNotification(notification);
          } catch (error) {
            console.log(error);
          }
        });

      // responseListener.current =
      //   Notifications.addNotificationResponseReceivedListener((response) => {
      //     console.log(response);
      //     console.log(response.notification.request.content);
      //   });

      return () => {
        // console.log("Removing listeners...");
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        // Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [user]);

  const validateLogin = (email, password) => {
    switch (true) {
      case email === "":
        setError("Please enter your email");
        return false;
      case password === "":
        setError("Please enter your password");
        return false;
      case !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email):
        setError("Please enter a valid email");
        return false;
      default:
        return true;
    }
  };

  const signIn = async (email, password) => {
    setIsSigningIn(true);
    try {
      const isValid = validateLogin(email, password);
      if (!isValid) {
        setIsSigningIn(false);
        return;
      }
      const userRef = await signInWithEmailAndPassword(auth, email, password);
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, userRef.user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setIsSigningIn(false);
        setError(null);
        const credential = {
          email: email,
          password: password,
        };
        await SecureStore.setItemAsync(
          "credential",
          JSON.stringify(credential)
        );
      }
    } catch (error) {
      setIsSigningIn(false);
      setError("Credential is invalid. Please login again.");
    }
  };

  const logout = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync("credential");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSigningOut(false);
      setUser(null);
    } catch (error) {
      setError("Something went wrong in logout.");
      setIsSigningOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSigningIn,
        isSigningOut,
        signIn,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
