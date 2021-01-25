import React, { memo, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import {
  DETAILED_POST_CONTENT_HEIGHT,
  DETAILED_POST_HEIGHT,
} from "../constants/constants";
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
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useNavigation } from "@react-navigation/native";
import Spin from "./animations/Spin";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type Props = {
  data: Submission;
  onPress: any;
  index: number;
  viewable: boolean;
};

const DetailedPostListItem: React.FC<Props> = (props) => {
  const { data, index } = props;

  const [imageCover, setImageCover] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(props.data.saved);

  const navigation = useNavigation();

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

  const onMainContentPress = useCallback(() => {
    props.onPress(index);
  }, [index]);

  const onVideoPress = useCallback((source, poster, title) => {
    // props.onPress(index);
    navigation.navigate("RedditVideo", {
      source,
      poster,
      title,
    });
  }, []);

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

  const onImagePress = useCallback(() => {
    ReactNativeHapticFeedback.trigger("impactLight", options);
    setImageCover(!imageCover);
  }, [imageCover]);

  const renderContent = useCallback(() => {
    const postType = determinePostType(data);
    switch (postType.code) {
      case "IMG":
        return (
          <TouchableWithoutFeedback onPress={onImagePress}>
            {/* <ImageWithIndicator
              source={{ uri: data.url }}
              style={s.imageContainer}
              resizeMode={
                imageCover
                  ? FastImage.resizeMode.cover
                  : FastImage.resizeMode.contain
              } 
            /> */}
            {/* Will use above version if they fix resize change issue */}
            <Image
              source={{ uri: data.url }}
              style={s.imageContainer}
              resizeMode={
                imageCover
                  ? FastImage.resizeMode.cover
                  : FastImage.resizeMode.contain
              }
              fadeDuration={0}
            />
          </TouchableWithoutFeedback>
        );
      case "GIF":
        return (
          <ImageWithIndicator
            source={{ uri: data.url }}
            style={s.imageContainer}
            resizeMode={
              imageCover
                ? FastImage.resizeMode.cover
                : FastImage.resizeMode.contain
            }
          />
          /* Will use above version if they fix resize change issue */
          // <Image
          //   source={{ uri: data.url }}
          //   style={s.imageContainer}
          //   resizeMode={
          //     imageCover
          //       ? FastImage.resizeMode.cover
          //       : FastImage.resizeMode.contain
          //   }
          //   fadeDuration={0}
          // />
        );

      case "VID":
        const videoSourceIsGifv = postType.fourExt == ".gifv";
        const simpleSource = videoSourceIsGifv
          ? data.url.substring(0, data.url.length - 4) + "mp4"
          : (data.media?.reddit_video?.fallback_url as string);
        const naviSource = videoSourceIsGifv
          ? data.url.substring(0, data.url.length - 4) + "mp4"
          : (data.media?.reddit_video?.hls_url as string);

        return (
          <TouchableWithoutFeedback
            onPress={() => onVideoPress(naviSource, imgUrl, data.title)}>
            <View style={s.flex}>
              <SimpleVideo
                source={simpleSource}
                play={props.viewable}
                posterSource={imgUrl}
              />
            </View>
          </TouchableWithoutFeedback>
        );
      case "WEB":
        // return <View style={s.flex} />;
        return null;
      case "GAL":
        return (
          <GalleryViewer images={mapRedditGalleryImages()} noModal={true} />
        );
      default:
        // return <View style={s.flex} />;
        null;
    }
  }, [props.viewable, imageCover]);

  const content = renderContent();

  return (
    <View style={[s.container]}>
      {/* // onPress={() => props.onPress(index)}> */}
      {/* POST INFO */}
      <View style={s.row}>
        <Text style={s.postInfoText} numberOfLines={1}>
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
        <FastImage style={s.image} source={{ uri: imgUrl }} />
        {/* TITLE/FLAIR/POINTS*/}

        <TouchableOpacity style={s.titleContainer} onPress={onMainContentPress}>
          <Text style={s.titleText} numberOfLines={4}>
            {data.title}
          </Text>
          <Flair
            text={data.link_flair_text}
            backgroundColor={data.link_flair_background_color}
            textColor={data.link_flair_text_color}
          />
        </TouchableOpacity>
      </View>
      {/* CONTENT */}
      {content && <View style={s.contentContainer}>{content}</View>}
      {/* BOTTOM BAR */}
      <View style={s.bottomBarContainer}>
        <Score data={data} iconSize={20} />
        <Spin spinning={saving}>
          <TouchableNativeFeedback onPress={savePost} disabled={saving}>
            <View>
              <Icon name="star" color={isSaved ? "#00af64" : "grey"} />
            </View>
          </TouchableNativeFeedback>
        </Spin>
        <Icon name="flag" color="grey" size={20} />
        <View style={s.numCommentContainer}>
          <Icon name="comment" color="grey" size={15} />
          {/* COMMENTS */}
          <Text style={s.numCommentText}>{data.num_comments}</Text>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    margin: 10,
    marginBottom: 0,
    paddingHorizontal: 10,
    borderRadius: 3,
    // height: DETAILED_POST_HEIGHT,
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
    height: DETAILED_POST_CONTENT_HEIGHT,
    width: "100%",
    backgroundColor: "rgb(0,0,0)",
    marginTop: 10,
    borderRadius: 3,
    overflow: "hidden",
  },
  postInfoText: { color: "grey", fontWeight: "bold" },
  imageContainer: { width: "100%", height: "100%", borderRadius: 3 },
  flex: { flex: 1 },
  mainContentContainer: { flexDirection: "row" },
  titleText: { flexShrink: 1, color: "white", fontWeight: "bold" },
  numCommentContainer: { flexDirection: "row", alignItems: "center" },
  bottomBarContainer: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  numCommentText: { color: "grey", marginLeft: 5, fontWeight: "bold" },
});

function postPropsAreEqual(prevPost: Props, nextPost: Props) {
  return (
    prevPost.data.id === nextPost.data.id &&
    prevPost.data.score === nextPost.data.score &&
    prevPost.viewable === nextPost.viewable
  );
}

export default memo(DetailedPostListItem, postPropsAreEqual);
