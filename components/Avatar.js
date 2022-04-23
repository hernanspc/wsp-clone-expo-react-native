import React from "react";
import { Image } from "react-native";

export default function Avatar({ size, user, image }) {
  console.log("image ", image);
  return (
    <Image
      style={{
        width: size,
        height: size,
        borderRadius: size,
      }}
      source={image ? { uri: image } : require("../assets/icon-square.png")}
      resizeMode="cover"
    />
  );
}
