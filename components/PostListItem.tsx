import React, { memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import { getTimeSincePosted } from "../util/util";
import Flair from "./style/Flair";

type Props = {
  data: Submission;
  onPress: any;
};

const PostListItem: React.FC<Props> = (props) => {
  const { data } = props;
  const imgUrl =
    !data.thumbnail ||
    data.thumbnail == "" ||
    data.thumbnail === "self" ||
    data.thumbnail === "spoiler" ||
    data.thumbnail === "default"
      ? "https://external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png?auto=webp&s=38648ef0dc2c3fce76d5e1d8639234d8da0152b2"
      : data.thumbnail;

  const { subreddit } = data;

  const isSelf = data.domain.includes("self.");

  return (
    <TouchableOpacity style={s.container} onPress={() => props.onPress(data)}>
      {/* POST INFO */}
      <View style={s.row}>
        <Text style={{ color: "grey" }}>
          <Text>{subreddit.display_name}</Text>
          <Text> | </Text>
          <Text>{data.author.name}</Text>
          <Text> | </Text>
          {!isSelf && <Text>{data.domain}</Text>}
          {!isSelf && <Text> | </Text>}
          <Text>{getTimeSincePosted(data.created_utc)}</Text>
        </Text>
      </View>
      {/* MAIN CONTENT */}
      <View style={{ flexDirection: "row" }}>
        {/* THUMBNAIL */}
        <FastImage style={s.image} source={{ uri: imgUrl }} />
        {/* TITLE/FLAIR/POINTS*/}
        <View style={s.titleContainer}>
          <Text
            style={{ flexShrink: 1, color: "white", fontWeight: "bold" }}
            numberOfLines={4}>
            {data.title}
          </Text>
          <Flair
            text={data.link_flair_text}
            backgroundColor={data.link_flair_background_color}
            textColor={data.link_flair_text_color}
          />
        </View>
      </View>
      {/* BOTTOM BAR */}
      <View style={[s.row, { justifyContent: "space-between" }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="swap-vertical-circle" color="grey" size={15} />
          {/* SCORE */}
          <Text style={{ color: "grey", marginLeft: 5 }}>
            {data.score > 9999
              ? (data.score / 1000).toPrecision(3) + "k"
              : data.score}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="comment" color="grey" size={15} />
          {/* COMMENTS */}
          <Text style={{ color: "grey", marginLeft: 5 }}>
            {data.num_comments}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="comment" color="grey" size={15} />
          {/* COMMENTS */}
          <Text style={{ color: "grey", marginLeft: 5 }}></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 3,
    backgroundColor: "black",
  },
  titleContainer: {
    height: 100,
    flex: 1,
    flexGrow: 1,
    flexWrap: "nowrap",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
  },
});

function postPropsAreEqual(prevPost: any, nextPost: any) {
  return prevPost.id === nextPost.id && prevPost.score === nextPost.score;
}

export default memo(PostListItem, postPropsAreEqual);
