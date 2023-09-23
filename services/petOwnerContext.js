import { collection, updateDoc, doc } from "firebase/firestore";
import React, {
  useEffect,
  createContext,
  useMemo,
  useReducer,
  useContext,
} from "react";
import { db, auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from "./authContext";

export const PetOwnerContext = createContext();

const initialState = {
  user: null,
  isLoading: false,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: true };
    default:
      return state;
  }
};

export const PetOwnerContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    dispatch({
      type: "SET_USER",
      payload: {
        name: user.name,
        email: user.email,
        address: user.address,
        postalCode: user.postalCode,
        phone: user.phone,
        profile: user.profile,
        clinicId: user.clinicId,
      },
    });
  }, [user]);

  const updateUser = async (data) => {
    const email = auth.currentUser.email;
    dispatch({ type: "SET_LOADING" });
    try {
      const userCollection = collection(db, "users");
      const userDoc = doc(userCollection, email);
      dispatch({ type: "SET_USER", payload: data });
      await updateDoc(userDoc, data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async (image) => {
    const email = auth.currentUser.email;
    try {
      const imageUri = image;
      const splitFileName = imageUri.split("/");
      const [imageName] = splitFileName.slice(-1);
      try {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", imageUri, true);
          xhr.send(null);
        });
        const storageRef = ref(
          storage,
          `users/${email}/profile_picture/${imageName}`
        );
        await uploadBytes(storageRef, blob);
        blob.close();
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const actions = useMemo(
    () => ({
      updateUser,
      updateProfile,
    }),
    [state, dispatch]
  );

  return (
    <PetOwnerContext.Provider
      value={{
        ...state,
        ...actions,
      }}
    >
      {children}
    </PetOwnerContext.Provider>
  );
};
