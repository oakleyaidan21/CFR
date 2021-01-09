import React, { memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import { DETAILED_POST_HEIGHT } from "../constants/constants";
import {
  determinePostType,
  getTimeSincePosted,
  getUriImage,
} from "../util/util";
import GalleryViewer from "./GalleryViewer";
import ImageWithIndicator from "./ImageWithIndicator";
import Score from "./Score";
import SimpleVideo from "./SimpleVideo";
import Flair from "./style/Flair";
import VideoPoster from "./VideoPoster";

type Props = {
  data: Submission;
  onPress: any;
  index: number;
  viewable: boolean;
};

const DetailedPostListItem: React.FC<Props> = (props) => {
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

  const mapRedditGalleryImages = useCallback(() => {
    let urls = [];

    const metadata = (data as any).media_metadata;
    for (const i of Object.entries(metadata)) {
      urls.push({ uri: (i[1] as any).s.u });
    }
    return urls;
  }, []);

  const renderContent = useCallback(() => {
    const postType = determinePostType(data);
    switch (postType.code) {
      case "IMG":
        return (
          <ImageWithIndicator
            source={{ uri: data.url }}
            style={{ width: "100%", height: "100%", borderRadius: 3 }}
            resizeMode={FastImage.resizeMode.cover}
          />
        );
      case "GIF":
        return (
          <ImageWithIndicator
            source={{ uri: data.url }}
            style={{ width: "100%", height: "100%", borderRadius: 3 }}
            resizeMode={FastImage.resizeMode.cover}
          />
        );

      case "VID":
        return (
          <View style={{ flex: 1 }}>
            <SimpleVideo
              source={
                postType.fourExt == ".gifv"
                  ? data.url.substring(0, data.url.length - 4) + "mp4"
                  : (data.media?.reddit_video?.fallback_url as string)
              }
              play={props.viewable}
              posterSource={imgUrl}
            />
          </View>
        );
      case "WEB":
        return <View style={{ flex: 1 }} />;
      case "GAL":
        return (
          <GalleryViewer images={mapRedditGalleryImages()} noModal={true} />
        );
      default:
        return <View style={{ flex: 1 }} />;
    }
  }, [props.viewable]);

  const content = renderContent();

  return (
    <TouchableOpacity
      style={[
        s.container,
        { height: 160 + (content ? DETAILED_POST_HEIGHT + 10 : 0) },
      ]}
      onPress={() => props.onPress(index)}>
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
      {/* CONTENT */}
      <View style={s.contentContainer}>{content}</View>
      {/* BOTTOM BAR */}
      <View style={[s.row, { justifyContent: "space-between" }]}>
        <Score data={data} iconSize={20} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="comment" color="grey" size={15} />
          {/* COMMENTS */}
          <Text style={{ color: "grey", marginLeft: 5 }}>
            {data.num_comments}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
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
  contentContainer: {
    height: DETAILED_POST_HEIGHT,
    width: "100%",
    backgroundColor: "rgb(0,0,0)",
    marginTop: 10,
    borderRadius: 3,
    overflow: "hidden",
  },
});

function postPropsAreEqual(prevPost: Props, nextPost: Props) {
  return (
    prevPost.data.id === nextPost.data.id &&
    prevPost.data.score === nextPost.data.score &&
    prevPost.viewable === nextPost.viewable
  );
}

export default memo(DetailedPostListItem, postPropsAreEqual);
