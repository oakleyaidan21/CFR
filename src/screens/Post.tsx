import React, { useCallback, useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Submission } from "snoowrap";
import CommentThread from "../components/CommentThread";
import Text from "../components/style/Text";
import PostHeader from "../components/PostHeader";
import { parseLink } from "../util/util";
import { HEADER_HEIGHT } from "../constants/constants";
import SnooContext from "../context/SnooContext";
import usePostComments from "../hooks/UsePostComments";

type Props = {
  navigation: any;
  route: { params: { data: Submission } };
};

const Post: React.FC<Props> = (props) => {
  const { snoowrap } = useContext(SnooContext);

  const [data, setData] = useState<Submission>(props.route.params.data);
  const [gettingPostInfo, setGettingPostInfo] = useState(false);
  const [transitionOver, setTransitionOver] = useState(false);

  const { comments, getComments, fetchingComments } = usePostComments(
    props.route.params.data.comments,
  );

  useEffect(() => {
    setTransitionOver(true);
  }, []);

  useEffect(() => {
    setData(props.route.params.data);
  }, [props.route.params.data]);

  const openLink = useCallback((url) => {
    const r = parseLink(url);
    switch (r.type) {
      case "post":
        props.navigation.push("LoadPost", { id: r.id });
        break;
      case "sub":
        props.navigation.push("Subreddit", { data: r.sub });
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
    Promise.all([data.fetch(), getComments()]).then((results) => {
      setData(results[0]);
      setGettingPostInfo(false);
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
