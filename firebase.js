import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDw7kFDM6Vb4dkbAVsiA5naRmeRU2v95s",
  authDomain: "vet-project-f97eb.firebaseapp.com",
  projectId: "vet-project-f97eb",
  storageBucket: "vet-project-f97eb.appspot.com",
  messagingSenderId: "340488931149",
  appId: "1:340488931149:web:0f46351bc548e2b54f9904",
  measurementId: "G-S4MWZ2DCJ5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
