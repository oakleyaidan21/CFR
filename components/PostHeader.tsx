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
import ImageWithIndicator from "./ImageWithIndicator";
import MDRenderer from "./MDRenderer";
import GalleryViewer from "./GalleryViewer";
import Flair from "./style/Flair";
import VideoPlayer from "./VideoPlayer";
import PostListItem from "./PostListItem";
import ImgurAlbumViewer from "./ImgurAlbumViewer";

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

  const onHeaderLayout = useCallback(({ nativeEvent }) => {
    setHeaderHeight(nativeEvent.layout.height);
  }, []);

  const openInWeb = useCallback(
    (url) =>
      props.navigation.navigate("Web", {
        url: typeof url === "string" ? url : data.url,
      }),

    [],
  );

  const contentHeight = windowHeight - 25 - 130 - 110;

  const mapRedditGalleryImages = useCallback(() => {
    let urls = [];

    for (const i of Object.entries(data.media_metadata)) {
      urls.push({ uri: i[1].s.u });
    }
    return urls;
  }, []);

  const renderContent = useCallback(() => {
    const matches = data.url.match(postRegex);

    console.log("m:", matches);
    // SELF POST
    if (isSelf) {
      return data.selftext_html ? (
        <MDRenderer
          data={data.selftext_html as string}
          onLinkPress={openInWeb}
        />
      ) : null;
    }

    const crosspost = data.crosspost_parent_list;
    // CROSSPOST
    if (crosspost) {
      return (
        <View
          style={{
            backgroundColor: "rgb(30,30,30)",
            borderRadius: 3,
          }}>
          <PostListItem
            index={0}
            onPress={() =>
              props.navigation.navigate("Post", { data: crosspost[0] })
            }
            data={crosspost[0]}
          />
        </View>
      );
    }

    if (!matches)
      return <Text style={{ color: "white" }}>unknown regex {data.url}</Text>;

    const isGallery = data.is_gallery;
    const isImgurGallery = matches[4]
      ? matches[4].substring(0, 3) == "/a/"
      : false;

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

    // REDDIT GALLERY
    if (isGallery) {
      return (
        <View style={{ width: "100%", height: contentHeight }}>
          <GalleryViewer images={mapRedditGalleryImages()} />
        </View>
      );
    }

    // IMGUR GALLERY
    if (isImgurGallery) {
      return (
        <View style={{ width: "100%", height: contentHeight }}>
          <ImgurAlbumViewer imgurHash={matches[4].substring(3)} />
        </View>
      );
    }
    // return <Text style={{ color: "white" }}>Impl! {data.url}</Text>;
    return false;
  }, [showContent, showImageViewer]);

  const content = renderContent();

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
          <TouchableOpacity onPress={openInWeb}>
            <FastImage style={s.image} source={{ uri: imgUrl }} />
          </TouchableOpacity>
          {/* TITLE/FLAIR/POINTS*/}
          <TouchableOpacity
            style={{ flex: 1 }}
            disabled={isSelf}
            onPress={() => {
              if (!content) {
                openInWeb(null);
              } else {
                setShowContent(!showContent);
              }
            }}>
            <View style={s.titleContainer}>
              <Text
                style={{ color: "white", fontWeight: "bold" }}
                numberOfLines={isSelf ? 10 : 4}>
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
      {showContent && content && (
        <View style={{ marginTop: 10 }}>{content}</View>
      )}
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
                <Icon name="star" color={isSaved ? "#00af64" : "grey"} />
              </View>
            </TouchableNativeFeedback>
          </Spin>
          <Icon name="flag" color="grey" />
          <Icon name="more-horiz" color="grey" />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}>
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
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 3,
  },
  titleContainer: {
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

// export default memo(PostHeader, postPropsAreEqual);

export default PostHeader;
