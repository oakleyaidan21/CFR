import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import Text from "../components/style/Text";
import {
  HEADER_HEIGHT,
  TAB_CONTAINER_HEIGHT,
  TAB_CONTENT_AREA_HEIGHT,
} from "../constants/constants";
import SnooContext from "../context/SnooContext";

type Props = {
  navigation: any;
};

const CreatePost: React.FC<Props> = (props) => {
  const { user } = useContext(SnooContext);

  const onTextPress = () => {
    props.navigation.navigate("PostCreation", { postType: "text" });
  };
  const onLinkPress = () => {
    props.navigation.navigate("PostCreation", { postType: "link" });
  };
  const onImagePress = () => {
    props.navigation.navigate("PostCreation", { postType: "image" });
  };
  const onVideoPress = () => {
    props.navigation.navigate("PostCreation", { postType: "video" });
  };
  const onPollPress = () => {
    props.navigation.navigate("PostCreation", { postType: "poll" });
  };

  return (
    <View style={s.screenContainer}>
      {user ? (
        <>
          <PostType
            title="Text"
            subtitle="Start a discussion, ask a question"
            iconName="edit"
            onPress={onTextPress}
            enabled
          />
          <PostType
            title="Link"
            subtitle="Share content!"
            iconName="link"
            onPress={onLinkPress}
            enabled
          />
          <PostType
            title="Image"
            subtitle="blah blah blah!"
            iconName="image"
            onPress={onImagePress}
            enabled
          />
          <PostType
            title="Video"
            subtitle="blah blah blah!"
            iconName="movie"
            onPress={onVideoPress}
            enabled
          />
          <PostType
            title="Poll"
            subtitle="Take a vote"
            iconName="poll"
            onPress={onPollPress}
            enabled
          />
        </>
      ) : (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
            <Text style={{ fontWeight: "bold", color: "#00af64" }}>
              Log in{" "}
            </Text>
          </TouchableOpacity>
          <Text>to create a post!</Text>
        </View>
      )}
    </View>
  );
};

const PostType = (props: {
  title: string;
  subtitle: string;
  iconName: string;
  onPress: any;
  enabled: boolean;
}) => {
  const { title, subtitle, iconName, onPress, enabled } = props;
  return (
    <TouchableOpacity style={s.postType} onPress={onPress} disabled={!enabled}>
      <View style={s.postTypeTitleContainer}>
        <Icon
          name={iconName}
          color={enabled ? "white" : "grey"}
          style={s.postTypeIcon}
          size={50}
        />
        <Text
          style={{
            ...s.postTypeTitleText,
            color: enabled ? "white" : "grey",
          }}>
          {title}
        </Text>
      </View>
      <Text
        style={{
          ...s.postTypeSubtitleText,
          color: enabled ? "white" : "grey",
        }}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  screenContainer: {
    flex: 1,
    marginBottom: TAB_CONTAINER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(20,20,20)",
  },
  postType: {
    flex: 1,
    margin: 10,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  postTypeContainer: {
    width: "100%",
    marginTop: HEADER_HEIGHT,
    height: TAB_CONTENT_AREA_HEIGHT,
  },
  postTypeTitleContainer: { flexDirection: "row", alignItems: "center" },
  postTypeIcon: { marginRight: 10 },
  postTypeTitleText: {
    fontWeight: "bold",
    fontSize: 30,
    color: "white",
  },
  postTypeSubtitleText: {
    marginTop: 10,
  },
  postTypeText: {
    fontWeight: "bold",
    fontSize: 30,
    color: "white",
  },
});

export default CreatePost;
