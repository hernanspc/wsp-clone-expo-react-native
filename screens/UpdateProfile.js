import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

const UpdateProfile = () => {
  const navigation = useNavigation();
  const [userData, setuserData] = useState(null);

  return (
    <View style={styles.panel}>
      <Image
        style={styles.userImg}
        source={{
          uri: userData
            ? userData.userImg ||
              "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
            : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
        }}
      />

      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => console.log("elejir")}
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
