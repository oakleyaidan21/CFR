import React, { useCallback, useState, memo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import { Comment, RedditUser } from "snoowrap";
import { getTimeSincePosted } from "../util/util";
import MDRenderer from "./MDRenderer";
import Score from "./Score";

type Props = {
  data: Comment;
  level: number;
  op: RedditUser;
  onLinkPress: any;
};

const CommentThread: React.FC<Props> = (props) => {
  const { data, level, op } = props;

  const [showReplies, setShowReplies] = useState(false);

  const animateReplies = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowReplies(!showReplies);
  };

  const renderReply = useCallback((comment: Comment) => {
    return (
      <CommentThread
        data={comment}
        level={level + 1}
        op={op}
        key={comment.id}
        onLinkPress={props.onLinkPress}
      />
    );
  }, []);

  return (
    <TouchableWithoutFeedback onPress={animateReplies}>
      <View
        style={{
          margin: level === 0 ? 5 : 0,
          marginTop: 0,
          borderRadius: 3,
          borderTopLeftRadius: level === 0 ? 3 : 0,
          borderBottomLeftRadius: level === 0 ? 3 : 0,
          paddingLeft: 10,
          borderLeftWidth: level > 0 ? 2 : 0,
          borderColor: "rgb(50,50,50)",
          backgroundColor: "rgb(30,30,30)",
        }}>
        {/* BODY */}
        <View style={{ padding: 10, paddingLeft: 0 }}>
          {/* COMMENTER INFO */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
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

            <Text style={{ color: "grey" }}>
              {getTimeSincePosted(data.created_utc)}
            </Text>
          </View>
          {/* HERE TO SPACE MDRENDER EVENLY. SEEMS JANK, TRUST ME IT'S NEEDED */}
          <Text></Text>
          <MDRenderer data={data.body_html} onLinkPress={props.onLinkPress} />
          {/* COMMENT INFO */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            {data.replies.length > 0 && (
              <Text style={{ color: "grey" }}>
                {data.replies.length == 1
                  ? "1 reply"
                  : data.replies.length + " replies"}
              </Text>
            )}
            <Score data={data} iconSize={20} />
          </View>
        </View>
        {/* REPLIES */}
        {showReplies && data.replies.length > 0 && (
          <View style={{ marginBottom: 5 }}>
            {data.replies.map(renderReply)}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const s = StyleSheet.create({
  userIconImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "grey",
    marginRight: 5,
  },
});

function commentsAreEqual(prevComment: Props, nextComment: Props) {
  return (
    prevComment.data.id === nextComment.data.id &&
    prevComment.data.score === nextComment.data.score
  );
}

export default memo(CommentThread, commentsAreEqual);
