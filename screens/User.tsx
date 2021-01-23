import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { Comment, Listing, RedditUser, Submission } from "snoowrap";
import TabBarIndicator from "../components/animations/TabBarIndicator";
import CommentThread from "../components/CommentThread";
import PostListItem from "../components/PostListItem";
import Text from "../components/style/Text";
import UserTabs from "../components/UserTabs";
import {
  TAB_CONTAINER_HEIGHT,
  TAB_CONTENT_AREA_HEIGHT,
} from "../constants/constants";
import {
  getUsersComments,
  getUsersPosts,
} from "../util/snoowrap/snoowrapFunctions";
import { getTimeSincePosted } from "../util/util";

const tabTypes = ["Posts", "Comments", "Awards", "Other"];

type Props = {
  userData: RedditUser;
  navigation: any;
};

const User: React.FC<Props> = (props) => {
  const { userData } = props;

  const renderHeader = useCallback(() => {
    return (
      <View style={s.headerContainer}>
        <FastImage source={{ uri: userData.icon_img }} style={s.profilePic} />
        <View style={s.userInfoContainer}>
          <Text style={s.usernameText}>{userData.name}</Text>
          <Text style={s.ageText}>
            user since {getTimeSincePosted(userData.created_utc)} ago
          </Text>
          <Text style={s.linkKarmaText}>
            {userData.link_karma + userData.comment_karma} link karma
          </Text>
        </View>
      </View>
    );
  }, [userData]);

  return (
    <View style={s.container}>
      {renderHeader()}
      {/* TAB CONTENT */}
      <UserTabs user={userData} navigation={props.navigation} />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(20,20,20)" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(10,10,10)",
    padding: 10,
  },
  profilePic: { width: 80, height: 80, borderRadius: 40 },
  userInfoContainer: { justifyContent: "center", marginLeft: 10 },
  usernameText: { fontWeight: "bold", fontSize: 20 },
  ageText: { color: "grey", fontWeight: "normal" },
  linkKarmaText: { color: "grey" },
  commentKarmaText: { color: "grey" },
  tabContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgb(10,10,10)",
  },
  defaultContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: TAB_CONTAINER_HEIGHT,
  },
  emptyListContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default User;
