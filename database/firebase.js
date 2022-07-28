import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCkJDEzvqJYnfB6jlthBuYAweMqZCiCR3E",
  authDomain: "chat-wsp.firebaseapp.com",
  projectId: "chat-wsp",
  storageBucket: "chat-wsp.appspot.com",
  messagingSenderId: "318267623796",
  appId: "1:318267623796:web:6679156de08bdc612a8421"
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
