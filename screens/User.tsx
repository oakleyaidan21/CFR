import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Listing, RedditUser, Submission } from "snoowrap";
import PostListItem from "../components/PostListItem";
import Text from "../components/style/Text";
import { getUsersPosts } from "../util/snoowrap/snoowrapFunctions";

type Props = {
  userData: RedditUser;
  navigation: any;
};

const User: React.FC<Props> = (props) => {
  const { userData } = props;
  const [submissions, setSubmissions] = useState<any>();

  useEffect(() => {
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
        <Text style={s.linkKarmaText}>{userData.link_karma} link karma</Text>
        <Text style={s.commentKarmaText}>
          {userData.comment_karma} comment karma
        </Text>
        <TouchableOpacity onPress={getSubmissions}>
          <Text>get user posts?</Text>
        </TouchableOpacity>
      </View>
    );
  }, [userData]);

  const onSubmissionPress = (index: number) => {
    props.navigation.navigate("PostSwiper", {
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

  return (
    <FlatList
      style={s.container}
      data={submissions}
      renderItem={renderSubmission}
      ListHeaderComponent={renderHeader}
    />
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(20,20,20)" },
  headerContainer: { width: "100%", padding: 10, paddingBottom: 0 },
  profilePic: { width: 60, height: 60, borderRadius: 30 },
  usernameText: { fontWeight: "bold", marginTop: 10 },
  linkKarmaText: { color: "grey" },
  commentKarmaText: { color: "grey" },
});

export default User;
