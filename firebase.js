import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDLyw1Y0tcnigi6DD_rCmxY5m7Y-u6DInM",
  authDomain: "expo-chat-ui.firebaseapp.com",
  projectId: "expo-chat-ui",
  storageBucket: "expo-chat-ui.appspot.com",
  messagingSenderId: "196991531686",
  appId: "1:196991531686:web:da55051567968dd587d267",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}
