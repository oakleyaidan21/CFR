import React from "react";
import { StyleSheet, View } from "react-native";
import { Submission } from "snoowrap";
import Text from "./style/Text";

type Props = {
  data: Submission;
};

const PostListItem: React.FC<Props> = (props) => {
  const { data } = props;
  return (
    <View style={s.container}>
      <Text>{data.title}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    marginVertical: 10,
    backgroundColor: "blue",
  },
});

export default PostListItem;
