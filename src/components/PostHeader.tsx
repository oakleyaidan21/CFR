import React, { useCallback, useState, memo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Share,
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
import {
  OS,
  POST_CONTENT_HEIGHT,
  POST_INFO_CONTAINER_HEIGHT,
} from "../constants/constants";
import GfyPlayer from "./GfyPlayer";

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
      if (typeof url == "string") {
        const r = parseLink(url);
        switch (r.type) {
          case "post":
            props.navigation.push("LoadPost", { id: r.id });
            break;
          case "sub":
            props.navigation.push("Subreddit", { data: r.sub });
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

  const sharePost = useCallback(() => {
    Share.share(
      { message: OS == "ios" ? data.title : data.url, url: data.url },
      { dialogTitle: data.title },
    );
  }, []);

  const mapRedditGalleryImages = useCallback(() => {
    let idMap = {};
    const gallery_data = (data as any).gallery_data.items;
    let urls = new Array(gallery_data.length);
    for (let i = 0; i < gallery_data.length; i++) {
      const key = gallery_data[i].media_id;
      idMap[key] = { index: i, data: gallery_data[i] };
    }

    const metadata = (data as any).media_metadata;
    console.log("meta:", Object.entries(metadata)[0][0]);
    for (const i of Object.entries(metadata)) {
      urls[idMap[i[0]].index] = {
        uri: (i[1] as any).s.u,
        data: idMap[i[0]].data,
      };
    }

    console.log(urls);

    return urls;
  }, []);

  const getPostType = useCallback(() => {
    return determinePostType(data);
  }, []);

  const openSub = useCallback(
    () => props.navigation.push("Subreddit", { data: subreddit }),
    [],
  );

  const renderContent = useCallback(() => {
    const postType = getPostType();
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
      case "GFY":
        return (
          <View style={s.gfyContainer}>
            <GfyPlayer url={data.url} red={false} />
          </View>
        );
      case "RED":
        return (
          <View style={s.gfyContainer}>
            <GfyPlayer url={data.url} red={true} />
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
          <TouchableOpacity onPress={openSub}>
            <Text style={s.topBarText}>{subreddit.display_name}</Text>
          </TouchableOpacity>
          <Text style={s.topBarText}> | </Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("UserPage", {
                userName: data.author.name,
              })
            }>
            <Text style={s.topBarText}>{data.author.name}</Text>
          </TouchableOpacity>
          <Text style={s.topBarText}>
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
          <TouchableOpacity>
            <Icon name="flag" color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={sharePost}>
            <Icon name="share" color="grey" />
          </TouchableOpacity>
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
  postInfoContainer: { minHeight: POST_INFO_CONTAINER_HEIGHT },
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
  mainContentContainer: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
  },
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
  gfyContainer: { width: "100%", height: POST_CONTENT_HEIGHT },
});

function postsAreEqual(prevComment: Props, nextComment: Props) {
  return (
    prevComment.data.id === nextComment.data.id &&
    prevComment.data.score === nextComment.data.score
  );
}

export default memo(PostHeader, postsAreEqual);
