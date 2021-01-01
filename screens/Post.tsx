import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
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
  const [data, setData] = useState<Submission>(props.route.params.data);
  const [comments, setComments] = useState<Array<Comment> | null>(null);
  const [postHeight, setPostHeight] = useState(0);
  const [gettingPostInfo, setGettingPostInfo] = useState(false);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    if (data.comments) {
      return (data as any).comments
        .fetchMore({ amount: 10, append: true })
        .then((c: Listing<Comment>) => {
          setComments(c);
          setGettingPostInfo(false);
          return true;
        });
    }
    return false;
  };

  const openInWeb = useCallback((url) => {
    props.navigation.navigate("Web", { url: url });
  }, []);

  const renderPostHeader = useCallback(() => {
    return (
      <View>
        {/* padding view to make translucent header look more natural */}
        <View style={{ height: 50, width: "100%", backgroundColor: "black" }} />
        <View style={{ backgroundColor: "black" }}>
          <PostHeader
            data={data}
            navigation={props.navigation}
            postHeight={postHeight}
          />
        </View>
      </View>
    );
  }, [data.score, data.id]);

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

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <CommentThread
          data={item}
          level={0}
          op={data.author}
          onLinkPress={openInWeb}
        />
      );
    },
    [gettingPostInfo],
  );

  const onLayout = useCallback(({ nativeEvent }) => {
    setPostHeight(nativeEvent.layout.height);
  }, []);

  const onRefresh = useCallback(() => {
    setGettingPostInfo(true);
    data.fetch().then((r) => {
      setData(r);
      getComments();
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgb(20,20,20)",
      }}
      onLayout={onLayout}>
      {/* POST & COMMENTS */}
      <FlatList
        style={{ flex: 1 }}
        data={comments}
        ListEmptyComponent={renderListEmtpy}
        renderItem={renderItem}
        ListHeaderComponent={renderPostHeader}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={gettingPostInfo}
            onRefresh={onRefresh}
            tintColor={"grey"}
            progressBackgroundColor={"black"}
            colors={["white", "#00af64"]}
          />
        }
      />
    </View>
  );
};

export default Post;
