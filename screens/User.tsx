import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Listing, RedditUser, Submission } from "snoowrap";
import TabBarIndicator from "../components/animations/TabBarIndicator";
import PostListItem from "../components/PostListItem";
import Text from "../components/style/Text";
import { getUsersPosts } from "../util/snoowrap/snoowrapFunctions";
import { getTimeSincePosted } from "../util/util";

const tabTypes = ["Posts", "Comments", "Etc"];

type Props = {
  userData: RedditUser;
  navigation: any;
};

const User: React.FC<Props> = (props) => {
  const { userData } = props;
  const [submissions, setSubmissions] = useState<any>();
  const [currentTab, setCurrentTab] = useState<number>(0);

  useEffect(() => {
    console.log("effect!");
    setSubmissions(null);
  }, [userData.id]);

  const getSubmissions = useCallback(() => {
    getUsersPosts(userData).then((results) => {
      setSubmissions(results);
    });
  }, [userData.id]);

  const renderHeader = useCallback(() => {
    return (
      <View style={s.headerContainer}>
        <FastImage source={{ uri: userData.icon_img }} style={s.profilePic} />
        <Text style={s.usernameText}>{userData.name}</Text>
        <Text style={s.ageText}>
          user since {getTimeSincePosted(userData.created_utc)} ago
        </Text>
        <Text style={s.linkKarmaText}>{userData.link_karma} link karma</Text>
        <Text style={s.commentKarmaText}>
          {userData.comment_karma} comment karma
        </Text>
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

  const renderTabContent = useCallback(() => {
    switch (currentTab) {
      case 0: // USER POSTS
        return renderSubmissions();
      case 1: // USER COMMENTS
      default:
        return (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>impl</Text>
          </View>
        );
    }
  }, [currentTab, submissions]);

  const renderSubmissions = useCallback(() => {
    return submissions ? (
      <FlatList
        style={{ flex: 1 }}
        data={submissions}
        renderItem={renderSubmission}
      />
    ) : (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={getSubmissions}>
          <Text>get posts</Text>
        </TouchableOpacity>
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
    width: "100%",
    padding: 10,
    paddingBottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(10,10,10)",
  },
  profilePic: { width: 60, height: 60, borderRadius: 30 },
  usernameText: { fontWeight: "bold", marginTop: 10, fontSize: 20 },
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
});

export default User;
