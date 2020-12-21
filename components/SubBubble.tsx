import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Subreddit } from "snoowrap";
import Text from "./style/Text";

type Props = {
  sub: Subreddit;
  size: number;
  onPress: any;
};

const SubBubble: React.FC<Props> = (props) => {
  const { sub } = props;
  const imgUrl = sub.icon_img
    ? sub.icon_img
    : "https://img.favpng.com/4/2/8/computer-icons-reddit-logo-website-png-favpng-hMmUQ5KAUjd27EWLvNwpuvW5Q.jpg";

  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 5,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={props.onPress}>
      <FastImage
        source={{ uri: imgUrl }}
        style={[
          s.subIcon,
          {
            width: props.size,
            height: props.size,
            borderRadius: props.size / 2,
          },
        ]}
      />
      <View
        style={{ width: 50, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 10 }} numberOfLines={1}>
          {sub.display_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  subIcon: {
    width: 40,
    height: 40,
    backgroundColor: "grey",
    borderRadius: 20,
  },
});

export default memo(SubBubble);
