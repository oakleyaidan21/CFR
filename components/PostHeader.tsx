import React, { memo, useCallback, useContext, useState } from "react";
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
import { RedditContent, Submission } from "snoowrap";
import {
  determinePostType,
  getTimeSincePosted,
  getUriImage,
} from "../util/util";
import Spin from "./animations/Spin";
import ImageViewer from "./ImageViewer";
import ImageWithIndicator from "./ImageWithIndicator";
import MDRenderer from "./MDRenderer";
import GalleryViewer from "./GalleryViewer";
import Flair from "./style/Flair";
import VideoPlayer from "./VideoPlayer";
import PostListItem from "./PostListItem";
import ImgurAlbumViewer from "./ImgurAlbumViewer";
import Score from "./Score";
import CrossPostItem from "./CrossPostItem";
import Sub from "../screens/Subreddit";
import SnooContext from "../context/SnooContext";

type Props = {
  data: Submission;
  navigation: any;
  showPlaceholder?: boolean;
};

const windowHeight = Dimensions.get("window").height;

const PostHeader: React.FC<Props> = (props) => {
  const [showContent, setShowContent] = useState(true);
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

  const openLink = useCallback(
    (url) => {
      // check if it's a reddit post
      if (typeof url === "string") {
        const tokens = url.split("/");
        let id = "";
        switch (tokens[2]) {
          case "redd.it":
            id = tokens[3];
            break;
          case "www.reddit.com":
            id = tokens[6];
            break;
          case "old.reddit.com":
            id = tokens[6];
          default:
            break;
        }
        if (id !== "") {
          props.navigation.navigate("LoadPost", { id: id });
        } else {
          props.navigation.navigate("Web", { url: url });
        }
      } else {
        props.navigation.navigate("Web", {
          url: typeof url === "string" ? url : data.url,
        });
      }
    },

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
    const postType = determinePostType(data);
    switch (postType.code) {
      case "SLF":
        return data.selftext_html ? (
          <MDRenderer
            data={data.selftext_html as string}
            onLinkPress={openLink}
          />
        ) : null;
      case "XPT":
        return (
          <CrossPostItem data={postType.xpst} navigation={props.navigation} />
        );
      case "IDK":
        return false;
      case "IMG":
        return props.showPlaceholder ? (
          <View style={{ height: contentHeight }} />
        ) : (
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
      case "GIF":
        return props.showPlaceholder ? (
          <View style={{ height: contentHeight }} />
        ) : (
          <ImageWithIndicator
            source={{ uri: data.url }}
            style={{ width: "100%", height: contentHeight }}
            resizeMode={FastImage.resizeMode.contain}
          />
        );
      case "VID":
        return props.showPlaceholder ? (
          <View style={{ height: contentHeight }} />
        ) : (
          <View style={{ width: "100%", height: contentHeight }}>
            <VideoPlayer
              source={
                postType.fourExt == ".gifv"
                  ? data.url.substring(0, data.url.length - 4) + "mp4"
                  : (data.media?.reddit_video?.hls_url as string)
              }
            />
          </View>
        );
      case "GAL":
        return props.showPlaceholder ? (
          <View style={{ height: contentHeight }} />
        ) : (
          <View style={{ width: "100%", height: contentHeight }}>
            <GalleryViewer images={mapRedditGalleryImages()} />
          </View>
        );
      case "IGL":
        return props.showPlaceholder ? (
          <View style={{ height: contentHeight }} />
        ) : (
          <View style={{ width: "100%", height: contentHeight }}>
            <ImgurAlbumViewer imgurHash={postType.hash} />
          </View>
        );

      default:
        return false;
    }
  }, [showContent, showImageViewer]);

  const content = renderContent();

  return (
    <View style={s.container}>
      {/* POST INFO */}
      <View>
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
          <TouchableOpacity onPress={openLink}>
            <FastImage style={s.image} source={{ uri: imgUrl }} />
          </TouchableOpacity>
          {/* TITLE/FLAIR/POINTS*/}
          <TouchableOpacity
            style={{ flex: 1 }}
            disabled={isSelf}
            onPress={() => {
              if (!content) {
                openLink(null);
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
          <Score data={data} iconSize={20} />
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
