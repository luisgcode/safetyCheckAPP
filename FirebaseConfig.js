// FirebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4wUL_eH8T129sRJFxaqfHt6lV_0m8DCY",
  authDomain: "lab05luisgcode.firebaseapp.com",
  projectId: "lab05luisgcode",
  storageBucket: "lab05luisgcode.appspot.com",
  messagingSenderId: "46679335161",
  appId: "1:46679335161:web:811ba275a07eb081df4228",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize authentication with AsyncStorage
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// Export instances
export { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB };
