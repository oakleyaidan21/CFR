import React, { useCallback, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View, Text } from "react-native";
import { Comment, RedditUser } from "snoowrap";

import HTMLView from "react-native-htmlview";
import SpoilerText from "./SpoilerText";
import { getTimeSincePosted } from "../util/util";

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

  const renderSpecificNodes = useCallback(
    (node, index, siblings, parent, defaultRenderer) => {
      if (node.attribs) {
        if (node.attribs.class) {
          if (node.attribs.class === "md-spoiler-text") {
            return (
              <View style={{ alignSelf: "center" }}>
                <SpoilerText node={node} />
              </View>
            );
          }
        }
      }

      return undefined;
    },
    [],
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowReplies(!showReplies);
        console.log(props.data.body_html);
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
          <HTMLView
            value={"<cfr>" + data.body_html + "<cfr>"}
            stylesheet={htmlstyles}
            renderNode={renderSpecificNodes}
            addLineBreaks={false}
            onLinkPress={props.onLinkPress}
          />
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

const htmlstyles = StyleSheet.create({
  div: {
    color: "white",
  },
  cfr: {},
});

export default CommentThread;
