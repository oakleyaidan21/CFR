import React, { useCallback, useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { Comment, Listing, Submission } from "snoowrap";
import CommentThread from "../components/CommentThread";
import Text from "../components/style/Text";
import PostHeader from "../components/PostHeader";

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
      (data as any).comments
        .fetchMore({ amount: 10, append: true })
        .then((c: Listing<Comment>) => {
          setComments(c);
        });
    }
  };

  const renderPostHeader = useCallback(() => {
    return (
      <View style={{ marginTop: 50 }}>
        <PostHeader data={data} navigation={props.navigation} />
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
    return (
      <CommentThread
        data={item}
        level={0}
        op={data.author}
        onLinkPress={(url: string) =>
          props.navigation.navigate("Web", { url: url })
        }
      />
    );
  }, []);

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      {/* POST & COMMENTS */}
      <FlatList
        style={{ flex: 1 }}
        data={comments}
        ListEmptyComponent={renderListEmtpy}
        renderItem={renderItem}
        ListHeaderComponent={renderPostHeader}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Post;
