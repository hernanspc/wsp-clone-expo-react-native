import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Alert } from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@firebase/auth";
import { auth, db, updateProfile } from "../exportDatabase/firebase";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //logged in
        setUser(user);
      } else {
        // Not loged in
        setUser(null);
      }

      setLoadingInitial(false);
    });
  }, []);

  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signInWithFirebase = (email, password) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("logeado");
        const user = userCredential.user;
        console.log("log => displayName : ", user);
        console.log("log => displayName : ", user.displayName);
      })
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const updateProfileFirebase = async (name, photo) => {
    const auth = getAuth();
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    })
      .then(() => {
        console.log("Profile updated! ");
        // Profile updated!
        // ...
      })
      .catch((error) => {
        console.log("An error occurred ", error.message);
        // An error occurred
        // ...
      });
  };

  const createUserWithFirebase = async (name, mail, password) => {
    console.log("Print ", name, mail, password);
    setLoading(true);
    let objUser;
    createUserWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        objUser = userCredential.user;

        updateProfileFirebase(name);
        setDoc(doc(db, "users", objUser.uid), {
          id: objUser.uid,
          displayName: name,
          photoURL: null,
          job: null,
          age: null,
          email: objUser.email,
          phoneNumber: objUser.phoneNumber,
          timestamp: serverTimestamp(),
        })
          .then(() => {
            Alert.alert(
              "Operación exitosa",
              `Usuario ${name} agregado satisfactoriamente.`,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]
            );
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const memoValued = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithFirebase,
      createUserWithFirebase,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoValued}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
