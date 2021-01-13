import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { Subreddit } from "snoowrap";
import { SUB_ITEM_HEIGHT } from "../constants/constants";
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
      <View style={s.imageContainer}>
        <FastImage source={{ uri: imgUrl }} style={s.image} />
      </View>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>{data.display_name}</Text>
        {data.public_description.length > 0 && (
          <Text numberOfLines={2}>{data.public_description}</Text>
        )}
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "grey" }}>
            {data.subscribers > 999999
              ? (data.subscribers / 1000000).toPrecision(3) + "M "
              : data.subscribers > 9999
              ? (data.subscribers / 1000).toPrecision(3) + "k "
              : data.subscribers + " "}
            Subscribers
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "rgb(30,30,30)",
    borderRadius: 3,
    height: SUB_ITEM_HEIGHT,
    justifyContent: "center",
    flexDirection: "row",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  imageContainer: {
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,

    borderRadius: 50,
  },
});

function subsAreEqual(prevSub: Props, nextSub: Props) {
  return prevSub.data.id === nextSub.data.id;
}

export default memo(SubredditItem, subsAreEqual);
