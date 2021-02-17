import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";
import { RedditUser, Submission } from "snoowrap";
import { TAB_CONTAINER_HEIGHT } from "../../constants/constants";
import { getUsersPosts } from "../../util/snoowrap/snoowrapFunctions";
import PostListItem from "../PostListItem";
import Text from "../style/Text";

type Props = {
  user: RedditUser;
  navigation: any;
};

const UserPostList: React.FC<Props> = (props) => {
  const { user } = props;
  const [submissions, setSubmissions] = useState<Array<Submission> | null>();

  useEffect(() => {
    setSubmissions(null);
    getSubmissions();
  }, [user.id]);

  const getSubmissions = useCallback(() => {
    getUsersPosts(user).then((results) => {
      setSubmissions(results);
    });
  }, [user.id]);

  const onSubmissionPress = (index: number) => {
    props.navigation.push("PostSwiper", {
      posts: submissions,
      index: index,
      prevScreen: user.name,
    });
  };

  const renderItem = useCallback(
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

  const renderListEmpty = () => {
    return (
      <View style={s.listEmptyContainer}>
        <Text style={s.listEmptyText}>No posts</Text>
      </View>
    );
  };

  return submissions ? (
    <FlatList
      style={s.listContainer}
      data={submissions}
      renderItem={renderItem}
      ListEmptyComponent={renderListEmpty}
    />
  ) : (
    <View style={s.placeholderContainer}>
      <ActivityIndicator color="white" size="large" />
    </View>
  );
};

const s = StyleSheet.create({
  listContainer: { flex: 1 },
  listEmptyContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  listEmptyText: {
    fontWeight: "bold",
    color: "grey",
  },
  placeholderContainer: {
    flex: 1,
    marginBottom: TAB_CONTAINER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserPostList;
