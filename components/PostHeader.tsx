import React, { memo, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import { getTimeSincePosted } from "../util/util";
import Spin from "./animations/Spin";
import ImageViewer from "./ImageViewer";
import ImageWithIndicator from "./ImageWithIndicator";
import MDRenderer from "./MDRenderer";
import Flair from "./style/Flair";
import VideoPlayer from "./VideoPlayer";

type Props = {
  data: Submission;
  navigation: any;
  postHeight: number;
};

function getUriImage(uri: string) {
  return uri !== null &&
    uri !== undefined &&
    uri.includes("/") &&
    uri.includes(".")
    ? uri
    : "";
}

const postRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)$/;

const windowHeight = Dimensions.get("window").height;

const PostHeader: React.FC<Props> = (props) => {
  const [showContent, setShowContent] = useState(true);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(props.data.saved);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { data } = props;
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

  const matches = data.url.match(postRegex);

  const savePost = useCallback(() => {
    setSaving(true);
    !isSaved
      ? data.save().then(() => {
          setSaving(false);
          setIsSaved(true);
        })
      : data.unsave().then(() => {
          setSaving(false);
          setIsSaved(false);
        });
  }, [saving, isSaved]);

  const onHeaderLayout = useCallback(
    ({ nativeEvent }) => {
      setHeaderHeight(nativeEvent.layout.height);
    },
    [headerHeight],
  );

  const contentHeight = props.postHeight - headerHeight - 110;

  const renderContent = useCallback(() => {
    // SELF POST
    if (isSelf) {
      return data.selftext_html ? (
        <MDRenderer
          data={data.selftext_html as string}
          onLinkPress={(url: string) =>
            props.navigation.navigate("Web", { url: url })
          }
        />
      ) : null;
    }

    if (!showContent) return null;
    if (!matches)
      return <Text style={{ color: "white" }}>unknown regex {data.url}</Text>;

    const threeExt = matches[4]
      ? matches[4].substring(matches[4].length - 4, matches[4].length)
      : false;
    const fourExt = matches[4]
      ? matches[4].substring(matches[4].length - 5, matches[4].length)
      : false;

    // IMAGE
    if (threeExt == ".jpg" || threeExt == ".png" || threeExt == ".jpeg") {
      return (
        <>
          <TouchableWithoutFeedback onPress={() => setShowImageViewer(true)}>
            <ImageWithIndicator
              source={{ uri: data.url }}
              style={{ width: "100%", height: contentHeight }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableWithoutFeedback>
          <ImageViewer
            visible={showImageViewer}
            images={[{ uri: data.url }]}
            close={() => setShowImageViewer(false)}
          />
        </>
      );
    }

    // GIF
    if (threeExt == ".gif") {
      return (
        <ImageWithIndicator
          source={{ uri: data.url }}
          style={{ width: "100%", height: contentHeight }}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }
    // VIDEO
    if (fourExt == ".gifv" || matches[2] === ".redd") {
      return (
        <View style={{ width: "100%", height: contentHeight }}>
          <VideoPlayer
            source={
              fourExt == ".gifv"
                ? data.url.substring(0, data.url.length - 4) + "mp4"
                : (data.media?.reddit_video?.hls_url as string)
            }
          />
        </View>
      );
    }

    return <Text style={{ color: "white" }}>Impl! {data.url}</Text>;
  }, [showContent, showImageViewer, headerHeight]);

  return (
    <View style={s.container}>
      {/* POST INFO */}
      <View onLayout={onHeaderLayout}>
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
            onPress={() => {
              if (!matches) {
                props.navigation.navigate("Web", { url: data.url });
              } else {
                setShowContent(!showContent);
              }
            }}>
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
      </View>
      {/* CONTENT */}
      {showContent && <View style={{ marginTop: 10 }}>{renderContent()}</View>}
      {/* FOOTER */}
      <View>
        <View style={s.postControl}>
          {/* SCORE CONTROL */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Icon
              name="forward"
              color="grey"
              size={20}
              style={{ transform: [{ rotate: "270deg" }] }}
            />
            <Text
              style={{
                color: "grey",
                fontWeight: "bold",
                marginHorizontal: 10,
              }}>
              {data.score}
            </Text>
            <Icon
              name="forward"
              color="grey"
              size={20}
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </View>
          <Spin spinning={saving}>
            <TouchableNativeFeedback onPress={savePost} disabled={saving}>
              <View>
                <Icon name="star" color={isSaved ? "green" : "grey"} />
              </View>
            </TouchableNativeFeedback>
          </Spin>
          <Icon name="flag" color="grey" />
          <Icon name="more-horiz" color="grey" />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="comment"
            color="grey"
            style={{ marginRight: 10 }}
            size={20}
          />
          <Text style={{ color: "grey", fontWeight: "bold" }}>
            {data.num_comments} Comments
          </Text>
          <Icon name="arrow-drop-down" color="grey" />
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
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

  postControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
});

function postPropsAreEqual(prevPost: Props, nextPost: Props) {
  return (
    prevPost.data.id === nextPost.data.id &&
    prevPost.data.score === nextPost.data.score
  );
}

export default memo(PostHeader, postPropsAreEqual);
