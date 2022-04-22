import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Avatar, Text, Button, ListItem, Icon } from "react-native-elements";

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
import { auth, logout, updateProfile, db } from "./../firebase";
import { Modal } from "../components/Shared/Modal/Modal";
import { ChangePasswordForm } from "../components/Account/ChangePasswordForm/ChangePassword";

const ProfileInfo = () => {
  const navigation = useNavigation();

  const { currentUser } = auth;
  const { uid, photoURL, displayName, email } = currentUser;

  const [avatar, setAvatar] = useState(photoURL);

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
        console.log("Perfil guardado correctamente en Storage");
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
      setAvatar(result.uri);
      await sendImage(result.uri, currentUser?.email);
    } else {
      Alert.alert(
        "Alerta!",
        " Es necesario aceptar los permisos de la galeria",
        [{ text: "Ok" }]
      );
    }
  }

  function AccountOptions(props) {
    const { onReload } = props;

    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const onCloseOpenModal = () => setShowModal((prevState) => !prevState);

    const selectedComponent = (key) => {
      if (key === "password") {
        setRenderComponent(<ChangePasswordForm onClose={onCloseOpenModal} />);
      }
      onCloseOpenModal();
    };

    return (
      <View>
        <ListItem bottomDivider onPress={() => selectedComponent("password")}>
          <Icon
            type={"material-community"}
            name={"lock-reset"}
            color={"#ccc"}
          />
          <ListItem.Content>
            <ListItem.Title>{"Cambiar contraseña"}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type={"material-community"}
            name={"chevron-right"}
            color={"#ccc"}
          />
        </ListItem>

        <Modal show={showModal} close={onCloseOpenModal}>
          {renderComponent}
        </Modal>
      </View>
    );
  }

  const [_, setReload] = useState(false);

  const onReload = () => setReload((prevState) => !prevState);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // backgroundColor: "#fff"
      }}
    >
      {/* Informacion de perfil */}
      <View style={styles.content}>
        <Avatar
          size={"large"}
          rounded
          containerStyle={styles.avatar}
          icon={{ type: "material", name: "person" }}
          source={
            avatar
              ? { uri: avatar }
              : require("../assets/img/avatar-default.jpg")
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
      <AccountOptions onReload={onReload} />

      {/* Button options */}
      <Button
        title="Cerrar sesión"
        buttonStyle={styles.btnStyles}
        titleStyle={styles.btnTextStyle}
        onPress={() => console.log("first")}
      />
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
});
