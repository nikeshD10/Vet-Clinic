import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "API key",
  authDomain: "auth-domain",
  projectId: "project-id",
  storageBucket: "storage-bucket",
  messagingSenderId: "sender id",
  appId: "appId",
  measurementId: "device-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
