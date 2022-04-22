import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
// import { Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/core";
import { pickImage, uploadImage, uploadImageWithName } from "../utils";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db, auth, updateProfile } from "../firebase";
// import { getAuth } from "@firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  getDocs,
  where,
  getDoc,
  serverTimestamp,
} from "@firebase/firestore";

const UpdateProfile = () => {
  const { params } = useRoute();
  const { currentUser } = params;
  const { uid, photoURL, displayName, email } = currentUser;
  // console.log("currUser ", photoURL);

  const navigation = useNavigation();
  const [userData, setuserData] = useState(null);
  const [image, setImage] = useState(null);
  // console.log("currUser ", currUser.photoURL);
  const updateProfileAuth = async (uri) => {
    //guardando photoURL en el auth de firebase
    await updateProfile(auth.currentUser, {
      photoURL: uri,
    })
      .then(() => {
        console.log("Profile updated! ");
      })
      .catch((error) => {
        console.log("An error occurred ", error.message);
      });
  };

  async function sendImage(uri, fileName) {
    //guardando en storage y obteniendo url
    const { url, fName } = await uploadImageWithName(
      uri,
      `images/profiles/`,
      fileName
    );

    updateProfileAuth(url);
    setDoc(doc(db, "users", currentUser?.uid), {
      id: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: url,
      email: currentUser.email,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log("Perfil guardado en Storage");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  async function handlePhotoPicker() {
    const resultPermissions = await pickImage();
    if (resultPermissions.status !== "denied") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      //   if (result.cancelled) {
      //     Alert.alert("Alerta!", " Has cerrado la selección de imagenes", [
      //       { text: "Ok" },
      //     ]);
      //   }
      await sendImage(result.uri, currUser?.email);
    } else {
      Alert.alert(
        "Alerta!",
        " Es necesario aceptar los permisos de la galeria",
        [{ text: "Ok" }]
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        // style={styles.container}
        contentContainerStyle={
          {
            // justifyContent: "center",
            // alignItems: "center",
          }
        }
        // showsVerticalScrollIndicator={false}
      >
        <View style={styles.panel}>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={handlePhotoPicker}
          >
            <Text style={styles.panelButtonTitle}>Elejir de tu libreria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.panelButtonTitle}>Cancelar</Text>
          </TouchableOpacity>
        </View>
        <Button
          title="Cerrar sesión"
          buttonStyle={styles.btnStyles}
          titleStyle={styles.btnTextStyle}
          onPress={() => console.log("first")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    width: "100%",
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },

  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#128c7e",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});
