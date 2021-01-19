import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { Comment, Submission } from "snoowrap";
import Spin from "./animations/Spin";

type Props = {
  data: Comment | Submission;
  iconSize: number;
  disabled?: boolean;
  hidden?: boolean;
};

const Score: React.FC<Props> = (props) => {
  const { data, hidden } = props;

  const [liked, setLiked] = useState(data.likes);
  const [score, setScore] = useState(data.score);
  const [upvoting, setUpvoting] = useState(false);
  const [downvoting, setDownvoting] = useState(false);

  const upvote = useCallback(() => {
    setUpvoting(true);
    liked == true
      ? data.unvote().then(() => {
          setLiked(null);
          setScore(score - 1);
          setUpvoting(false);
        })
      : data.upvote().then(() => {
          setLiked(true);
          setScore(score + 1);
          setUpvoting(false);
        });
  }, [liked, score]);

  const downvote = useCallback(() => {
    setDownvoting(true);
    liked == true
      ? data.unvote().then(() => {
          setLiked(null);
          setScore(score + 1);
          setDownvoting(false);
        })
      : data.downvote().then(() => {
          setLiked(false);
          setScore(score - 1);
          setDownvoting(false);
        });
  }, [liked, score]);

  return (
    <View style={s.container}>
      <Spin spinning={upvoting}>
        <View style={s.upvote}>
          <Icon
            name="forward"
            color={liked ? "#ff8b5f" : "grey"}
            size={props.iconSize}
            onPress={upvote}
          />
        </View>
      </Spin>
      <Text
        style={{
          color: liked ? "#ff8b5f" : liked == false ? "#9494ff" : "grey",
          fontWeight: "bold",
          marginHorizontal: 10,
        }}>
        {hidden
          ? "•"
          : score > 9999
          ? (score / 1000).toPrecision(3) + "k"
          : score}
      </Text>
      <Spin spinning={downvoting}>
        <View style={s.downvote}>
          <Icon
            name="forward"
            color={liked == false ? "#9494ff" : "grey"}
            size={props.iconSize}
            onPress={downvote}
          />
        </View>
      </Spin>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  upvote: { transform: [{ rotate: "270deg" }] },
  downvote: { transform: [{ rotate: "90deg" }] },
});

export default Score;
