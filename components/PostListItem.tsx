import React, { memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import { POST_ITEM_HEIGHT } from "../constants/constants";
import { getTimeSincePosted, getUriImage } from "../util/util";
import Score from "./Score";
import Flair from "./style/Flair";

type Props = {
  data: Submission;
  onPress: any;
  index: number;
};

const PostListItem: React.FC<Props> = (props) => {
  const { data, index } = props;
  const imgUrl =
    !getUriImage(data.thumbnail) ||
    data.thumbnail == "" ||
    data.thumbnail === "self" ||
    data.thumbnail === "spoiler" ||
    data.thumbnail === "default"
      ? "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png"
      : data.thumbnail;

  const { subreddit } = data;

  const isSelf = data.is_self;

  const onPress = useCallback(() => {
    props.onPress(index);
  }, [index]);

  return (
    <TouchableOpacity style={s.container} onPress={onPress}>
      {/* POST INFO */}
      <View style={s.row}>
        <Text style={s.topText} numberOfLines={1}>
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
      <View style={s.mainContentContainer}>
        {/* THUMBNAIL */}
        <Image style={s.image} source={{ uri: imgUrl }} fadeDuration={0} />
        {/* TITLE/FLAIR/POINTS*/}
        <View style={s.titleContainer}>
          <Text style={s.titleText} numberOfLines={4}>
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
      <View style={s.bottomRow}>
        <Score data={data} iconSize={20} />
        <View style={s.commentContainer}>
          <Icon name="comment" color="grey" size={15} />
          {/* COMMENTS */}
          <Text style={s.commentText}>{data.num_comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    height: POST_ITEM_HEIGHT,
    margin: 10,
    marginBottom: 0,
    paddingHorizontal: 10,
    borderRadius: 3,
    backgroundColor: "rgb(30,30,30)",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 3,
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
  bottomRow: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topText: { color: "grey", fontWeight: "bold" },
  commentContainer: { flexDirection: "row", alignItems: "center" },
  commentText: { color: "grey", marginLeft: 5, fontWeight: "bold" },
  titleText: { flexShrink: 1, color: "white", fontWeight: "bold" },
  mainContentContainer: { flexDirection: "row" },
});

function postPropsAreEqual(prevPost: Props, nextPost: Props) {
  return (
    prevPost.data.id === nextPost.data.id &&
    prevPost.data.score === nextPost.data.score
  );
}

export default memo(PostListItem, postPropsAreEqual);
