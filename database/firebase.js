import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDLyw1Y0tcnigi6DD_rCmxY5m7Y-u6DInM",
  authDomain: "expo-chat-ui.firebaseapp.com",
  projectId: "expo-chat-ui",
  storageBucket: "expo-chat-ui.appspot.com",
  messagingSenderId: "196991531686",
  appId: "1:196991531686:web:da55051567968dd587d267",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// ya esta iniciado
const db = getFirestore();
const storage = getStorage();
// Create a storage reference from our storage service
// const storageRef = ref(storage, "image2.jpg");

export { auth, db, storage, updateProfile };
// export { db, storage };
