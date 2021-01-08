import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";

type Props = {
  source: string;
};

const VideoPoster: React.FC<Props> = (props) => {
  return (
    <View
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <FastImage
        style={{ width: 100, height: 100, borderRadius: 3 }}
        source={{ uri: props.source }}
      />
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Icon name="movie" color="white" size={40} />
      </View>
    </View>
  );
};

export default VideoPoster;
