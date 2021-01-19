import React, { useCallback, useState, memo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import {
  determinePostType,
  getTimeSincePosted,
  getUriImage,
  parseLink,
} from "../util/util";
import Spin from "./animations/Spin";
import ImageViewer from "./ImageViewer";
import ImageWithIndicator from "./ImageWithIndicator";
import MDRenderer from "./MDRenderer";
import GalleryViewer from "./GalleryViewer";
import Flair from "./style/Flair";
import VideoPlayer from "./VideoPlayer";
import ImgurAlbumViewer from "./ImgurAlbumViewer";
import Score from "./Score";
import CrossPostItem from "./CrossPostItem";
import { POST_CONTENT_HEIGHT } from "../constants/constants";

type Props = {
  data: Submission;
  navigation: any;
  showPlaceholder?: boolean;
};

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
        const r = parseLink(url);
        switch (r.type) {
          case "post":
            props.navigation.navigate("LoadPost", { id: r.id });
            break;
          case "sub":
            props.navigation.navigate("Subreddit", { data: r.sub });
            break;
          default:
            props.navigation.navigate("Web", { url: url });
            break;
        }
      } else {
        props.navigation.navigate("Web", {
          url: data.url,
        });
      }
    },

    [],
  );

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
          <View style={s.placeholderContainer} />
        ) : (
          <>
            <TouchableWithoutFeedback onPress={() => setShowImageViewer(true)}>
              <ImageWithIndicator
                source={{ uri: data.url }}
                style={s.imageContainer}
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
          <View style={s.placeholderContainer} />
        ) : (
          <ImageWithIndicator
            source={{ uri: data.url }}
            style={s.imageContainer}
            resizeMode={FastImage.resizeMode.contain}
          />
        );
      case "VID":
        return props.showPlaceholder ? (
          <View style={s.placeholderContainer} />
        ) : (
          <View style={s.videoContainer}>
            <VideoPlayer
              source={
                postType.fourExt == ".gifv"
                  ? data.url.substring(0, data.url.length - 4) + "mp4"
                  : (data.media?.reddit_video?.hls_url as string)
              }
              navigation={props.navigation}
              hasControls={true}
              autoPlay={false}
              poster={imgUrl}
              title={data.title}
              canFullscreen={true}
            />
          </View>
        );
      case "GAL":
        return props.showPlaceholder ? (
          <View style={s.placeholderContainer} />
        ) : (
          <View style={s.imageContainer}>
            <GalleryViewer images={mapRedditGalleryImages()} />
          </View>
        );
      case "IGL":
        return props.showPlaceholder ? (
          <View style={s.placeholderContainer} />
        ) : (
          <View style={s.imageContainer}>
            <ImgurAlbumViewer imgurHash={postType.hash as string} />
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
      <View style={s.postInfoContainer}>
        <View style={s.row}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Subreddit", { data: subreddit })
            }>
            <Text style={s.subNameText}>{subreddit.display_name}</Text>
          </TouchableOpacity>
          <Text style={s.topBarText}>
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
          <TouchableOpacity onPress={openLink}>
            <FastImage style={s.image} source={{ uri: imgUrl }} />
          </TouchableOpacity>
          {/* TITLE/FLAIR/POINTS*/}
          <TouchableOpacity
            style={s.postTextContainer}
            disabled={isSelf}
            onPress={() => {
              if (!content) {
                openLink(null);
              } else {
                setShowContent(!showContent);
              }
            }}>
            <View style={s.titleContainer}>
              <Text style={s.titleText}>{data.title}</Text>
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
        <View style={s.contentContainer}>{content}</View>
      )}
      {/* FOOTER */}
      <View style={s.footerContainer}>
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
        <View style={s.commentInfoContainer}>
          <Icon name="comment" color="grey" style={s.commentIcon} size={20} />
          <Text style={s.numCommentText}>{data.num_comments} Comments</Text>
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
  postInfoContainer: { height: 130 },
  row: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
  },
  footerContainer: { height: 84 },

  postControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  placeholderContainer: { height: POST_CONTENT_HEIGHT },
  imageContainer: { width: "100%", height: POST_CONTENT_HEIGHT },
  videoContainer: { width: "100%", height: POST_CONTENT_HEIGHT },
  subNameText: { color: "grey", fontWeight: "bold" },
  mainContentContainer: { flexDirection: "row", flex: 1, width: "100%" },
  topBarText: { color: "grey", fontWeight: "bold" },
  postTextContainer: { flexDirection: "row", flex: 1, width: "100%" },
  contentContainer: { marginTop: 10 },
  titleText: { color: "white", fontWeight: "bold" },
  commentIcon: { marginRight: 10 },
  numCommentText: { color: "grey", fontWeight: "bold" },
  commentInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

function postsAreEqual(prevComment: Props, nextComment: Props) {
  return (
    prevComment.data.id === nextComment.data.id &&
    prevComment.data.score === nextComment.data.score
  );
}

export default memo(PostHeader, postsAreEqual);
