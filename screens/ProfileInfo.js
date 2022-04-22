import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Avatar, Text, Button } from "react-native-elements";

import * as ImagePicker from "expo-image-picker";

import { pickImage, uploadImageWithName } from "../utils";

import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
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
import { auth, logout, updateProfile } from "./../firebase";

const ProfileInfo = () => {
  const { currentUser } = auth;
  const { uid, photoURL, displayName, email } = currentUser;
  const [avatar, setAvatar] = useState(photoURL);

  const navigation = useNavigation();

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

  async function handleOpenPicker() {
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
      await sendImage(result.uri, currentUser?.email);
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
      {/* Informacion de perfil */}
      <View style={styles.content}>
        <Avatar
          // size={"large"}
          size={"large"}
          rounded
          containerStyle={styles.avatar}
          icon={{ type: "material", name: "person" }}
          source={
            avatar
              ? { uri: avatar }
              : require("../assets/img/avatar-default.jpg")
            // require("../assets/img/user.png")
          }
        >
          <Avatar.Accessory size={25} onPress={handleOpenPicker} />
        </Avatar>
        <View>
          <Text style={styles.displayName}>{displayName || "Anónimo"}</Text>
          <Text>{email}</Text>
        </View>
      </View>
      {/* Acount Options */}

      {/* Button options */}
      <Button
        title="Cerrar sesión"
        buttonStyle={styles.btnStyles}
        titleStyle={styles.btnTextStyle}
        onPress={() => console.log("first")}
      />

      <View style={styles.panel}>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => {
              navigation.navigate("UpdateProfile", {
                currentUser,
              });
            }}
          >
            <Text style={styles.panelButtonTitle}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileInfo;

const styles = StyleSheet.create({
  //  informacion de perfil:
  content: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 30,
  },
  avatar: {
    marginRight: 20,
    backgroundColor: "green",
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
  //buttonStyle
  btnStyles: {
    marginTop: 30,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
  btnTextStyle: {
    color: "#00a680",
  },
  //other
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    width: "100%",
    height: "100%",
  },
  userImg: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  userBtn: {
    borderColor: "#128c7e",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#128c7e",
    alignItems: "center",
    marginVertical: 7,
  },
});
