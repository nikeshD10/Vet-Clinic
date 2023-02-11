// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGXiiN5mi508yms9-1i5qwnLYV2mJHeAc",
  authDomain: "vet-clinic-rn.firebaseapp.com",
  projectId: "vet-clinic-rn",
  storageBucket: "vet-clinic-rn.appspot.com",
  messagingSenderId: "255527893547",
  appId: "1:255527893547:web:5cbdb7228209642d11886e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export default db = getFirestore(app);
