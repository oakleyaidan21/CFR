import React, { useCallback, useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  InteractionManager,
} from "react-native";
import { Comment, Listing, Submission } from "snoowrap";
import CommentThread from "../components/CommentThread";
import Text from "../components/style/Text";
import PostHeader from "../components/PostHeader";
import { TouchableOpacity } from "react-native-gesture-handler";
import { parseLink } from "../util/util";
import { HEADER_HEIGHT } from "../constants/constants";
import SnooContext from "../context/SnooContext";

type Props = {
  navigation: any;
  route: { params: { data: Submission } };
};

const Post: React.FC<Props> = (props) => {
  const { snoowrap } = useContext(SnooContext);

  const [data, setData] = useState<Submission>(props.route.params.data);
  const [comments, setComments] = useState<Listing<Comment> | null>(null);
  const [gettingPostInfo, setGettingPostInfo] = useState(false);
  const [fetchingComments, setFetchingComments] = useState(false);
  const [transitionOver, setTransitionOver] = useState(false);

  useEffect(() => {
    // const unsubscribe = props.navigation.addListener("transitionEnd", () => {
    getComments();
    setTransitionOver(true);
    // });
    // return unsubscribe;
  }, []);

  const getComments = () => {
    setFetchingComments(true);
    const commentList = comments ? comments : data.comments;
    (commentList as any)
      .fetchMore({ amount: 10, append: true })
      .then((c: Listing<Comment>) => {
        setComments(c);
        setGettingPostInfo(false);
        setFetchingComments(false);
        return true;
      });
  };

  const openLink = useCallback((url) => {
    const r = parseLink(url);
    switch (r.type) {
      case "post":
        props.navigation.navigate("LoadPost", { id: r.id });
        break;
      case "sub":
        props.navigation.navigate("Subreddit", { data: r.sub });
        break;
      default:
        props.navigation.navigate("Web", { url: url });
        break;
    }
  }, []);

  const renderPostHeader = useCallback(() => {
    return (
      <View>
        {/* padding view to make translucent header look more natural */}
        <View
          style={{
            height: HEADER_HEIGHT,
            width: "100%",
            backgroundColor: "black",
          }}
        />
        <View style={{ backgroundColor: "black" }}>
          <PostHeader
            data={data}
            navigation={props.navigation}
            showPlaceholder={!transitionOver}
          />
        </View>
      </View>
    );
  }, [data.score, data.id, transitionOver]);

  const renderListEmtpy = useCallback(() => {
    return (
      <View
        style={{ height: 500, justifyContent: "center", alignItems: "center" }}>
        {!comments ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ fontWeight: "bold", color: "grey" }}>No comments</Text>
        )}
      </View>
    );
  }, [comments]);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View style={{ marginTop: index === 0 ? 5 : 0 }}>
          <CommentThread
            data={item}
            level={0}
            op={data.author}
            onLinkPress={openLink}
            snoowrap={snoowrap}
            navigation={props.navigation}
          />
        </View>
      );
    },
    [gettingPostInfo],
  );

  const onRefresh = useCallback(() => {
    setGettingPostInfo(true);
    data.fetch().then((r) => {
      setData(r);
      getComments();
    });
  }, []);

  const renderFooter = useCallback(() => {
    return comments && !comments.isFinished ? (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          marginBottom: 10,
        }}>
        <TouchableOpacity onPress={getComments} disabled={fetchingComments}>
          {fetchingComments ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "grey", fontWeight: "bold" }}>
              Get more comments?
            </Text>
          )}
        </TouchableOpacity>
      </View>
    ) : null;
  }, [comments, fetchingComments]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgb(20,20,20)",
      }}>
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
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default Post;
