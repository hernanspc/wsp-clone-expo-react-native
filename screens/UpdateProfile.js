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
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/core";
import { pickImage, uploadImage, uploadImageWithName } from "../utils";

const UpdateProfile = () => {
  const { params } = useRoute();
  const { currUser } = params;

  const navigation = useNavigation();
  const [userData, setuserData] = useState(null);
  const [image, setImage] = useState(null);

  console.log("currUser: ", currUser?.uid);

  //   const uploadProfile = async (uri) => {
  //     console.log("add file process ", "profiles/" + `profile-${user.uid}.jpg`);
  //     const storageRef = ref(storage, "profiles/" + `profile-${user.uid}.jpg`);
  //     //convert image to array of bytes
  //     const img = await fetch(uri);
  //     const bytes = await img.blob();

  //     const res = await uploadBytes(storageRef, bytes);
  //     return res;
  //   };

  async function sendImage(uri, userId) {
    console.log("userId ", userId);
    const { url, fName } = await uploadImageWithName(
      uri,
      `images/profiles/`,
      userId
    );
    console.log("log: ", url, fName);
    //Ver si se puede mandar a user-Firebase photoURL // FIXME:
    // const message = {
    //   _id: fileName,
    //   text: "",
    //   createdAt: new Date(),
    //   user: senderUser,
    //   image: url,
    // };
    // const lastMessage = { ...message, text: "Image" };
    // await Promise.all([
    //   addDoc(roomMessagesRef, message),
    //   updateDoc(roomRef, { lastMessage }),
    // ]);
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
      await sendImage(result.uri, currUser?.uid);
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
        style={styles.container}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={styles.userImg}
          source={{
            uri: userData
              ? userData.userImg ||
                "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
              : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
          }}
        />
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
