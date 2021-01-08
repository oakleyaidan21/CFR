import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { Comment, Submission } from "snoowrap";

type Props = {
  data: Comment | Submission;
  iconSize: number;
  disabled?: boolean;
};

const Score: React.FC<Props> = (props) => {
  const { data } = props;

  const [liked, setLiked] = useState(data.likes);
  const [score, setScore] = useState(data.score);

  const upvote = useCallback(() => {
    data.upvote();
    setLiked(liked == true ? null : true);
    setScore(liked == true ? score - 1 : score + 1);
  }, [liked, score]);

  const downvote = useCallback(() => {
    data.downvote();
    setLiked(liked == false ? null : false);
    setScore(liked == false ? score + 1 : score - 1);
  }, [liked, score]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ transform: [{ rotate: "270deg" }] }}>
        <Icon
          name="forward"
          color={liked ? "#ff8b5f" : "grey"}
          size={props.iconSize}
          onPress={upvote}
        />
      </View>
      <Text
        style={{
          color: liked ? "#ff8b5f" : liked == false ? "#9494ff" : "grey",
          fontWeight: "bold",
          marginHorizontal: 10,
        }}>
        {score > 9999 ? (score / 1000).toPrecision(3) + "k" : score}
      </Text>
      <View style={{ transform: [{ rotate: "90deg" }] }}>
        <Icon
          name="forward"
          color={liked == false ? "#9494ff" : "grey"}
          size={props.iconSize}
          onPress={downvote}
        />
      </View>
    </View>
  );
};

export default Score;
