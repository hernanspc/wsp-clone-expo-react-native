import React from "react";
import { Image } from "react-native";

export default function Avatar({ size, user }) {
  return (
    <Image
      style={{
        width: size,
        height: size,
        borderRadius: size,
      }}
      source={
        // image ? { uri: image } : require("../assets/img/avatar-default.jpg")
        user.photoURL
          ? { uri: user.photoURL }
          : require("../assets/img/avatar-default.jpg")
      }
      resizeMode="cover"
    />
  );
}
