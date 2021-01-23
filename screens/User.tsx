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
  const [submissions, setSubmissions] = useState<Array<Submission> | null>();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [comments, setComments] = useState<Array<Comment> | null>();

  const userScreenIsFocused = useIsFocused();

  useEffect(() => {
    setSubmissions(null);
    getSubmissions();
  }, [userData.id]);

  useEffect(() => {
    if (currentTab == 0) return;
    switch (currentTab) {
      case 1: //COMMENTS
        if (comments) return;
        return getComments();
      default:
        return;
    }
  }, [currentTab]);

  const getSubmissions = useCallback(() => {
    getUsersPosts(userData).then((results) => {
      setSubmissions(results);
    });
  }, [userData.id]);

  const getComments = useCallback(() => {
    getUsersComments(userData).then((results) => {
      setComments(results);
    });
  }, [userData.id]);

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

  const onSubmissionPress = (index: number) => {
    props.navigation.push("PostSwiper", {
      posts: submissions,
      index: index,
      prevScreen: userData.name,
    });
  };

  const renderSubmission = useCallback(
    ({ item, index }) => {
      return (
        <PostListItem
          data={item}
          onPress={() => onSubmissionPress(index)}
          index={index}
        />
      );
    },
    [submissions],
  );

  const renderTabs = useCallback(() => {
    return tabTypes.map((type, index) => {
      const selected = currentTab == index;
      return (
        <TouchableOpacity
          onPress={() => setCurrentTab(index)}
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 4,
            borderColor: selected ? "#00af64" : "transparent",
          }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
            }}>
            {type}
          </Text>
        </TouchableOpacity>
      );
    });
  }, [currentTab]);

  const renderComment = useCallback(
    ({ item, index }) => {
      return (
        <CommentThread
          data={item}
          op={item.author}
          level={0}
          snoowrap={null}
          navigation={props.navigation}
          onLinkPress={null}
        />
      );
    },
    [comments],
  );

  const renderComments = useCallback(() => {
    return comments ? (
      <FlatList
        style={{ flex: 1 }}
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListEmptyComponent={
          <View style={s.emptyListContainer}>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              No comments
            </Text>
          </View>
        }
      />
    ) : (
      <View style={s.defaultContentContainer}>
        {userScreenIsFocused && (
          <ActivityIndicator color="white" size="large" />
        )}
      </View>
    );
  }, [comments]);

  const renderTabContent = useCallback(() => {
    switch (currentTab) {
      case 0: // USER POSTS
        return renderSubmissions();
      case 1: // USER COMMENTS
        return renderComments();
      default:
        return (
          <View style={s.defaultContentContainer}>
            <Text>impl</Text>
          </View>
        );
    }
  }, [currentTab, submissions, comments]);

  const renderSubmissions = useCallback(() => {
    return submissions ? (
      <FlatList
        style={{ flex: 1 }}
        data={submissions}
        ListEmptyComponent={
          <View style={s.emptyListContainer}>
            <Text style={{ fontWeight: "bold", color: "grey" }}>No posts</Text>
          </View>
        }
        keyExtractor={(item) => item.id}
        renderItem={renderSubmission}
      />
    ) : (
      <View style={s.defaultContentContainer}>
        {userScreenIsFocused && (
          <ActivityIndicator color="white" size="large" />
        )}
      </View>
    );
  }, [submissions]);

  return (
    <View style={s.container}>
      {renderHeader()}
      {/* TABS */}
      <View style={s.tabContainer}>{renderTabs()}</View>
      {/* TAB CONTENT */}
      {renderTabContent()}
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
