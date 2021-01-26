import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Comment, RedditUser } from "snoowrap";
import { TAB_CONTAINER_HEIGHT } from "../../constants/constants";
import { getUsersComments } from "../../util/snoowrap/snoowrapFunctions";
import CommentThread from "../CommentThread";
import Text from "../style/Text";

type Props = {
  user: RedditUser;
  navigation: any;
};

const UserCommentList: React.FC<Props> = (props) => {
  const { user } = props;
  const [comments, setComments] = useState<Array<Comment> | null>();

  useEffect(() => {
    setComments(null);
    getComments();
  }, [user.id]);

  const getComments = useCallback(() => {
    getUsersComments(user).then((results) => {
      setComments(results);
    });
  }, [user.id]);

  const onCommentPress = (postId: string) => {
    props.navigation.push("LoadPost", {
      id: postId,
      screenTitle: "Crosspost",
    });
  };

  const renderListEmpty = () => {
    return (
      <View style={s.listEmptyContainer}>
        <Text style={s.listEmptyText}>No comments</Text>
      </View>
    );
  };

  const renderItem = useCallback(({ item, index }) => {
    return (
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
    );
  }, []);

  return comments ? (
    <FlatList
      style={s.listContainer}
      contentContainerStyle={s.listContentContainer}
      data={comments}
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
  listContentContainer: { marginTop: 5 },
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

export default UserCommentList;
