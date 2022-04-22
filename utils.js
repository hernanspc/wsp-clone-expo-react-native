import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
export async function pickImage() {
  let permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  return permissionResult;
}
export async function askForPermission() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status;
}

export async function uploadImage(uri, path, fName) {
  const fileName = nanoid();

  const img = await fetch(uri);
  const bytesBlob = await img.blob();

  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);

  const snapshot = await uploadBytes(imageRef, bytesBlob, {
    contentType: "image/jpeg",
  });

  const url = await getDownloadURL(snapshot.ref);

  return { url, fileName };
}

export async function uploadImageWithName(uri, path, fName) {
  console.log("into uploadImageWithName ", fName);
  const img = await fetch(uri);
  const bytesBlob = await img.blob();

  const imageRef = ref(storage, `${path}/${fName}.jpeg`);

  const snapshot = await uploadBytes(imageRef, bytesBlob, {
    contentType: "image/jpeg",
  });

  const url = await getDownloadURL(snapshot.ref);

  return { url, fName };
}

const palette = {
  // tealGreen: "#128c7e",
  tealGreen: "#047AFC",
  tealGreenDark: "#075e54",
  // tealGreenDark: "#1A73E3",
  green: "#25d366",
  lime: "#dcf8c6",
  skyblue: "#34b7f1",
  smokeWhite: "#ece5dd",
  white: "white",
  gray: "#3C3C3C",
  lightGray: "#757575",
  iconGray: "#717171",
};

export const theme = {
  colors: {
    background: palette.smokeWhite,
    foreground: palette.tealGreenDark,
    primary: palette.tealGreen,
    tertiary: palette.lime,
    secondary: palette.green,
    white: palette.white,
    text: palette.gray,
    secondaryText: palette.lightGray,
    iconGray: palette.iconGray,
  },
};
