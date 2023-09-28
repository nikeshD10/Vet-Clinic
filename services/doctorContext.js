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

export const DoctorContext = createContext();

const initialState = {
  doctor: null,
  isLoading: false,
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case "SET_DOCTOR":
      return { ...state, doctor: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...state, doctor: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: true };
    default:
      return state;
  }
};

export const DoctorContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    dispatch({
      type: "SET_DOCTOR",
      payload: {
        name: user.name,
        email: user.email,
        address: user.address,
        postalCode: user.postalCode,
        phone: user.phone,
        profile: user.profile,
        information: user.information,
        clinicId: user.clinicId,
      },
    });
  }, [user]);

  const updateDoctor = async (data) => {
    const email = auth.currentUser.email;
    dispatch({ type: "SET_LOADING" });
    try {
      const userCollection = collection(db, "users");
      const doctorDoc = doc(userCollection, email);
      dispatch({ type: "SET_DOCTOR", payload: data });
      await updateDoc(doctorDoc, data);
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
        dispatch({ type: "SET_DOCTOR", payload: { profile: url } });
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
      updateDoctor,
      updateProfile,
    }),
    [state, dispatch]
  );

  return (
    <DoctorContext.Provider
      value={{
        ...state,
        ...actions,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};
