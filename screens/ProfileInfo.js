import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";

import { auth, logout } from "./../firebase";

const ProfileInfo = () => {
  const navigation = useNavigation();

  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setCurrUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  console.log("currUser: ", currUser?.photoURL);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          // justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{}}>
          {currUser?.email ? currUser?.email : "Cargando..."}
        </Text>
        <Image
          style={styles.userImg}
          source={{
            uri: "https://www.draquio.com/wp-content/uploads/2020/08/las-voces-de-shrek.jpg",
          }}
        />
        <View style={styles.panel}>
          <View style={styles.containerButton}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => {
                navigation.navigate("UpdateProfile", {
                  currUser,
                });
              }}
            >
              <Text style={styles.panelButtonTitle}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
