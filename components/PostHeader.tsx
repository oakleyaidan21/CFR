import React, { memo, useCallback, useState } from "react";
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
import MDRenderer from "./MDRenderer";
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

const postRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?(.jpg|.gif|.png|.gifv)$/;

const windowHeight = Dimensions.get("window").height;

const PostHeader: React.FC<Props> = (props) => {
  const [showContent, setShowContent] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(props.data.saved);
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
  }, [saving]);

  const renderContent = useCallback(() => {
    // SELF POST
    if (isSelf && data.selftext_html) {
      return (
        <MDRenderer
          data={data.selftext_html as string}
          onLinkPress={(url: string) =>
            props.navigation.navigate("Web", { url: url })
          }
        />
      );
    }

    if (!showContent) return null;
    if (!matches)
      return <Text style={{ color: "white" }}>unknonwn regex {data.url}</Text>;
    // IMAGE
    if (matches[5] == ".jpg" || matches[5] == ".png") {
      return (
        <>
          <TouchableWithoutFeedback onPress={() => setShowImageViewer(true)}>
            <FastImage
              source={{ uri: data.url }}
              style={{ width: "100%", height: windowHeight - 240 }}
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
    if (matches[5] == ".gif") {
      return (
        <FastImage
          source={{ uri: data.url }}
          style={{ width: "100%", height: windowHeight - 240 }}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }
    // VIDEO
    if (matches[5] == ".gifv") {
      return <Text style={{ color: "white" }}>Impl gifv</Text>;
    }

    return <Text style={{ color: "white" }}>Impl! {data.url}</Text>;
  }, [showContent, showImageViewer]);

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
      {/* CONTENT */}
      {showContent && <View style={{ marginTop: 10 }}>{renderContent()}</View>}
      {/* FOOTER */}
      <View style={s.headerFooter}>
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
  headerFooter: {
    paddingTop: 10,
  },
  postControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

function postPropsAreEqual(prevPost: Props, nextPost: Props) {
  return (
    prevPost.data.id === nextPost.data.id &&
    prevPost.data.score === nextPost.data.score
  );
}

export default memo(PostHeader, postPropsAreEqual);
