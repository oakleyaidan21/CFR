import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import { Comment, Submission } from "snoowrap";
import CommentThread from "../components/CommentThread";
import PostListItem from "../components/PostListItem";
import Text from "../components/style/Text";

type Props = {
  navigation: any;
  route: { params: { data: Submission } };
};

const Post: React.FC<Props> = (props) => {
  const { data } = props.route.params;

  const [comments, setComments] = useState<Array<Comment> | null>(null);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    if (data.comments) {
      data.comments.fetchMore({ amount: 10, append: true }).then((c) => {
        setComments(c);
      });
    }
  };

  const renderPostHeader = useCallback(() => {
    return (
      <View style={{ marginTop: 50 }}>
        <PostListItem data={data} onPress={() => {}} />
      </View>
    );
  }, []);

  const renderListEmtpy = useCallback(() => {
    return (
      <View
        style={{ height: 500, justifyContent: "center", alignItems: "center" }}>
        {!comments ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text>No comments</Text>
        )}
      </View>
    );
  }, [comments]);

  const renderItem = useCallback(({ item }) => {
    return <CommentThread data={item} level={0} op={data.author} />;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* POST & COMMENTS */}
      <FlatList
        style={{ flex: 1 }}
        data={comments}
        ListEmptyComponent={renderListEmtpy}
        renderItem={renderItem}
        ListHeaderComponent={renderPostHeader}
        keyExtractor={(item) => item.id}
      />
      {/* HEADER */}
      <View style={s.headerContainer}>
        <Icon
          name="arrow-back"
          color="white"
          onPress={props.navigation.goBack}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default Post;
