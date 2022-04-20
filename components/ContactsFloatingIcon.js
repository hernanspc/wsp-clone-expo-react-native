import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalContext from "../context/Context";
import { useNavigation } from "@react-navigation/native";
export default function ContactsFloatingIcon() {
  const {
    theme: { colors },
  } = useContext(GlobalContext);
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("contacts", {
          username: "sasasa",
          picture:
            "https://static.wikia.nocookie.net/shrek/images/3/3f/Portada_img.jpg/revision/latest/scale-to-width-down/1200?cb=20100719002911&path-prefix=es",
        })
      }
      style={{
        position: "absolute",
        right: 20,
        bottom: 20,
        borderRadius: 60,
        width: 60,
        height: 60,
        backgroundColor: colors.secondary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons
        name="android-messages"
        size={30}
        color="white"
        style={{ transform: [{ scaleX: -1 }] }}
      />
    </TouchableOpacity>
  );
}
