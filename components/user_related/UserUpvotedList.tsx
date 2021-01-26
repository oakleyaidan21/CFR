import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Comment, RedditUser, Submission } from "snoowrap";
import { TAB_CONTAINER_HEIGHT } from "../../constants/constants";
import {
  getUsersPosts,
  getUsersUpvotedContent,
} from "../../util/snoowrap/snoowrapFunctions";
import CommentThread from "../CommentThread";
import PostListItem from "../PostListItem";
import Text from "../style/Text";

type Props = {
  user: RedditUser;
  navigation: any;
};

const UserUpvotedList: React.FC<Props> = (props) => {
  const { user } = props;
  const [upvotedContent, setUpvotedContent] = useState<Array<
    Submission | Comment
  > | null>();

  useEffect(() => {
    setUpvotedContent(null);
    getContent();
  }, [user.id]);

  const getContent = useCallback(() => {
    getUsersUpvotedContent(user).then((results) => {
      setUpvotedContent(results);
    });
  }, [user.id]);

  const onSubmissionPress = (item: Submission) => {
    props.navigation.push("Post", {
      data: item,
    });
  };

  const onCommentPress = (index: number) => {};

  const renderItem = useCallback(({ item, index }) => {
    return item.hasOwnProperty("expandReplies") ? (
      <TouchableWithoutFeedback onPress={() => onCommentPress(item.link_id)}>
        <CommentThread
          data={item}
          level={0}
          op={user}
          onLinkPress={null}
          navigation={props.navigation}
          snoowrap={null}
        />
      </TouchableWithoutFeedback>
    ) : (
      <PostListItem
        data={item}
        onPress={() => onSubmissionPress(item)}
        index={index}
      />
    );
  }, []);

  const renderListEmpty = () => {
    return (
      <View style={s.listEmptyContainer}>
        <Text style={s.listEmptyText}>No upvoted comment</Text>
      </View>
    );
  };

  return upvotedContent ? (
    <FlatList
      style={s.listContainer}
      data={upvotedContent}
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

export default UserUpvotedList;