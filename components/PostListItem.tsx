import React, { memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import { getTimeSincePosted } from "../util/util";
import Flair from "./style/Flair";

type Props = {
  data: Submission;
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

  if (data.title.includes("Hola")) {
    console.log("color:", data.link_flair_background_color);
  }

  const isSelf = data.domain.includes("self.");

  return (
    <TouchableOpacity style={s.container}>
      {/* POST INFO */}
      <View style={{ flexDirection: "row", paddingVertical: 10 }}>
        <Text style={{ color: "grey" }}>
          <Text>{data.subreddit.display_name}</Text>
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
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    marginBottom: 10,
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
});

function postPropsAreEqual(prevPost: any, nextPost: any) {
  return prevPost.id === nextPost.id && prevPost.score === nextPost.score;
}

export default memo(PostListItem, postPropsAreEqual);
