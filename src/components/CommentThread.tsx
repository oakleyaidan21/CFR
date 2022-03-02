import React, { useCallback, useState, memo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import Snoowrap, { Comment, RedditUser } from "snoowrap";
import { getUserByName } from "../util/snoowrap/snoowrapFunctions";
import { getTimeSincePosted } from "../util/util";
import MDRenderer from "./MDRenderer";
import Score from "./Score";

type Props = {
  data: Comment;
  level: number;
  op: RedditUser;
  onLinkPress: any;
  snoowrap: Snoowrap | null;
  navigation: any;
};

const CommentThread: React.FC<Props> = (props) => {
  const { data, level, op, snoowrap } = props;

  const [showReplies, setShowReplies] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const animateReplies = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAllReplies(false);
    setShowReplies(!showReplies);
  };

  const onUserPress = useCallback(() => {
    props.navigation.push("UserPage", { userName: data.author.name });
  }, []);

  const renderReply = useCallback((comment: Comment) => {
    return (
      <CommentThread
        data={comment}
        level={level + 1}
        op={op}
        key={comment.id}
        onLinkPress={props.onLinkPress}
        snoowrap={snoowrap}
        navigation={props.navigation}
      />
    );
  }, []);

  const renderCommentReplies = () => {
    const moreThanFiveReplies = data.replies.length > 5;
    const replies = moreThanFiveReplies
      ? showAllReplies
        ? data.replies
        : data.replies.slice(0, 4)
      : data.replies;

    return (
      <>
        {replies.map(renderReply)}
        {moreThanFiveReplies && !showAllReplies && (
          <TouchableOpacity
            style={s.showAllRepliesButton}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setShowAllReplies(true);
            }}>
            <Text style={{ color: "grey" }}>
              Show remaining {data.replies.length - 5} replies
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View
      style={[
        s.container,
        {
          margin: level == 0 ? 5 : 0,
          borderTopLeftRadius: level == 0 ? 3 : 0,
          borderBottomLeftRadius: level == 0 ? 3 : 0,
          borderLeftWidth: level > 0 ? 2 : 0,
        },
      ]}>
      {/* BODY */}
      <View style={s.bodyContainer}>
        {/* COMMENTER INFO */}
        <View style={s.commenterInfoContainer}>
          <View style={s.commenterNameContainer}>
            <TouchableWithoutFeedback onPress={onUserPress}>
              <Text
                style={{
                  color:
                    data.distinguished == "moderator"
                      ? "lightgreen"
                      : data.author.name == op.name
                      ? "lightblue"
                      : "grey",
                  fontWeight: "bold",
                }}>
                {data.author.name}
              </Text>
            </TouchableWithoutFeedback>
            <Text style={{ fontStyle: "italic", color: "grey" }}>
              {data.edited && " (edited)"}
            </Text>
          </View>
          <Text style={s.timestampText}>
            {getTimeSincePosted(data.created_utc)}
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={animateReplies}>
          <View>
            {/* HERE TO SPACE MDRENDER EVENLY. SEEMS JANK, TRUST ME IT'S NEEDED */}
            <Text></Text>
            <MDRenderer data={data.body_html} onLinkPress={props.onLinkPress} />
            {/* COMMENT INFO */}

            <View style={s.commentInfoContainer}>
              <Score data={data} iconSize={20} hidden={data.score_hidden} />
              <Text style={s.numReplyText}>
                {data.replies.length == 1
                  ? "1 reply"
                  : data.replies.length == 0
                  ? ""
                  : data.replies.length + " replies"}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* REPLIES */}
      {showReplies &&
        data.replies.length > 0 &&
        // <View style={s.replyContainer}>{data.replies.map(renderReply)}</View>
        renderCommentReplies()}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    marginTop: 0,
    borderRadius: 3,
    paddingLeft: 10,
    borderColor: "rgb(50,50,50)",
    backgroundColor: "rgb(30,30,30)",
  },
  userIconImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "grey",
    marginRight: 5,
  },
  bodyContainer: { padding: 10, paddingLeft: 0 },
  commenterInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timestampText: { color: "grey" },
  commentInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commenterNameContainer: {
    flexDirection: "row",
  },
  numReplyText: { color: "grey" },
  replyContainer: { marginBottom: 5 },
  showAllRepliesButton: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

function commentsAreEqual(prevComment: Props, nextComment: Props) {
  return (
    prevComment.data.id === nextComment.data.id &&
    prevComment.data.score === nextComment.data.score
  );
}

export default memo(CommentThread, commentsAreEqual);
