import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";

const ProfileInfo = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.panel}>
      <Image
        style={styles.userImg}
        source={{
          uri: "https://www.draquio.com/wp-content/uploads/2020/08/las-voces-de-shrek.jpg",
        }}
      />
      <View style={styles.containerButton}>
        <TouchableOpacity
          style={styles.userBtn}
          onPress={() => {
            navigation.navigate("UpdateProfile");
          }}
        >
          <Text style={styles.userBtnTxt}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileInfo;

const styles = StyleSheet.create({
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
  userBtnTxt: {
    color: "#128c7e",
  },
  //   containerButton: {
  //     padding: 20,
  //   },
});
