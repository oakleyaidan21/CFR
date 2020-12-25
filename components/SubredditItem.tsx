import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { Subreddit } from "snoowrap";
import MDRenderer from "./MDRenderer";
import Text from "./style/Text";

type Props = {
  data: Subreddit;
  onPress: any;
};

const SubredditItem: React.FC<Props> = (props) => {
  const { data } = props;

  const imgUrl = data.icon_img
    ? data.icon_img
    : data.community_icon
    ? data.community_icon
    : "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png";

  return (
    <TouchableOpacity style={s.container} onPress={props.onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FastImage
          source={{ uri: imgUrl }}
          style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
        />
        <Text>{data.display_name}</Text>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text numberOfLines={2}>{data.public_description}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text>{data.subscribers} Subscribers</Text>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
  },
});

function subsAreEqual(prevSub: Props, nextSub: Props) {
  return prevSub.data.id === nextSub.data.id;
}

export default memo(SubredditItem, subsAreEqual);
