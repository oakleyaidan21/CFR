import React, { useCallback, useState, memo } from "react";
import { StyleSheet, TouchableWithoutFeedback, View, Text } from "react-native";
import { Comment, RedditUser } from "snoowrap";

import HTMLView from "react-native-htmlview";
import SpoilerText from "./SpoilerText";
import { getTimeSincePosted } from "../util/util";
import MDRenderer from "./MDRenderer";

type Props = {
  data: Comment;
  level: number;
  op: RedditUser;
  onLinkPress: any;
};

const CommentThread: React.FC<Props> = (props) => {
  const { data, level, op } = props;

  const [showReplies, setShowReplies] = useState(false);

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
    <TouchableWithoutFeedback
      onPress={() => {
        setShowReplies(!showReplies);
      }}>
      <View
        style={{
          marginLeft: level * 10,
          borderLeftWidth: level > 0 ? 2 : 0,
          borderColor: "rgb(30,30,30)",
        }}>
        {/* BODY */}
        <View style={{ padding: 10 }}>
          <Text style={{ color: "grey" }}>
            <Text
              style={{
                fontWeight: "bold",
                marginVertical: 10,
                color: op.name === data.author.name ? "#00af64" : "grey",
              }}>
              {data.author.name}
            </Text>
            <Text>
              {"  "}|{"  "}
            </Text>
            <Text>{data.score}</Text>
            <Text>
              {"  "}|{"  "}
            </Text>
            <Text>{getTimeSincePosted(data.created_utc)}</Text>
          </Text>
          {/* HERE TO SPACE HTMLVIEW EVENLY */}
          <Text></Text>
          <MDRenderer data={data.body_html} onLinkPress={props.onLinkPress} />
          {/* EXTRA INFO */}

          <Text style={{ color: "grey" }}>
            {data.replies.length > 0 ? data.replies.length : "No"} replies
          </Text>
        </View>
        {/* REPLIES */}
        {showReplies && data.replies.map(renderReply)}
      </View>
    </TouchableWithoutFeedback>
  );
};

function commentsAreEqual(prevComment: Props, nextComment: Props) {
  console.log(prevComment);
  return prevComment.data.id === nextComment.data.id;
}

export default memo(CommentThread, commentsAreEqual);
