import React, { useCallback, useState, memo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
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

  const animateReplies = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowReplies(!showReplies);
  };

  const onUserPress = useCallback(() => {
    if (snoowrap) {
      getUserByName(snoowrap, data.author.name)
        .then((user) => {
          props.navigation.navigate("UserPage", { userData: user });
        })
        .catch((error) => {
          console.log("error getting user:", error);
        });
    }
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

          <Text style={s.timestampText}>
            {getTimeSincePosted(data.created_utc)}
            {data.edited && "*"}
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
      {showReplies && data.replies.length > 0 && (
        <View style={s.replyContainer}>{data.replies.map(renderReply)}</View>
      )}
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
  numReplyText: { color: "grey" },
  replyContainer: { marginBottom: 5 },
});

function commentsAreEqual(prevComment: Props, nextComment: Props) {
  return (
    prevComment.data.id === nextComment.data.id &&
    prevComment.data.score === nextComment.data.score
  );
}

export default memo(CommentThread, commentsAreEqual);
