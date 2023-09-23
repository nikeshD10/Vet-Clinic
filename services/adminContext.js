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

export const AdminContext = createContext();

const initialState = {
  admin: null,
  isLoading: false,
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case "SET_ADMIN":
      return { ...state, admin: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...state, admin: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: true };
    default:
      return state;
  }
};

export const AdminContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    dispatch({
      type: "SET_ADMIN",
      payload: {
        name: user.name,
        email: user.email,
        address: user.address,
        postalCode: user.postalCode,
        phone: user.phone,
        logo: user.logo,
        gps_coord: user.gps_coord,
        information: user.information,
        city: user.city,
      },
    });
  }, [user]);

  const updateAdmin = async (data) => {
    const email = auth.currentUser.email;
    dispatch({ type: "SET_LOADING" });
    try {
      const adminCollection = collection(db, "users");
      const adminDoc = doc(adminCollection, email);
      dispatch({ type: "SET_ADMIN", payload: data });
      await updateDoc(adminDoc, data);
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
      updateAdmin,
      updateProfile,
    }),
    [state, dispatch]
  );

  return (
    <AdminContext.Provider
      value={{
        ...state,
        ...actions,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
