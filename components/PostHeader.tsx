import React, { memo, useCallback, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import { getTimeSincePosted } from "../util/util";
import Flair from "./style/Flair";

type Props = {
  data: Submission;
  navigation: any;
};

function getUriImage(uri: string) {
  return uri !== null &&
    uri !== undefined &&
    uri.includes("/") &&
    uri.includes(".")
    ? uri
    : "";
}

const PostHeader: React.FC<Props> = (props) => {
  const [showContent, setShowContent] = useState(false);
  const { data } = props;
  const imgUrl =
    !getUriImage(data.thumbnail) ||
    data.thumbnail == "" ||
    data.thumbnail === "self" ||
    data.thumbnail === "spoiler" ||
    data.thumbnail === "default"
      ? "https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png"
      : data.thumbnail;

  const { subreddit } = data;

  const isSelf = data.is_self;

  const renderContent = useCallback(() => {
    // IMAGE
    if (data.url.includes(".jpg") || data.url.includes(".png")) {
      return (
        <FastImage
          source={{ uri: data.url }}
          style={{ width: "100%", height: 400 }}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }
    // SELF POST
    if (isSelf) {
    }
    return <Text style={{ color: "white" }}>Impl!</Text>;
  }, []);

  return (
    <View style={s.container}>
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
      <View style={{ flexDirection: "row", flex: 1, width: "100%" }}>
        {/* THUMBNAIL */}
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Web", { url: data.url })}>
          <FastImage style={s.image} source={{ uri: imgUrl }} />
        </TouchableOpacity>
        {/* TITLE/FLAIR/POINTS*/}
        <TouchableOpacity
          style={{ flex: 1 }}
          disabled={isSelf}
          onPress={() => setShowContent(!showContent)}>
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
        </TouchableOpacity>
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
          {/* MISC */}
          <Text style={{ color: "grey", marginLeft: 5 }}></Text>
        </View>
      </View>
      {/* CONTENT */}
      {showContent && renderContent()}
    </View>
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
  },
  titleContainer: {
    height: 100,
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

export default memo(PostHeader, postPropsAreEqual);
