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
    : sub.community_icon
    ? sub.community_icon
    : "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png";
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
        style={{
          width: 50,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
        }}>
        <Text style={{ fontSize: 10, fontWeight: "bold" }} numberOfLines={1}>
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
    // backgroundColor: "grey",
    borderRadius: 20,
  },
});

function subPropsAreEqual(prevSub: Props, nextSub: Props) {
  return prevSub.sub.id === nextSub.sub.id;
}

export default memo(SubBubble, subPropsAreEqual);
