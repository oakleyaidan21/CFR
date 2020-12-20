import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import Text from "./style/Text";

type Props = {
  data: Submission;
};

const PostListItem: React.FC<Props> = (props) => {
  const { data } = props;
  const imgUrl =
    !data.thumbnail ||
    data.thumbnail == "" ||
    data.thumbnail === "self" ||
    data.thumbnail === "spoiler" ||
    data.thumbnail === "default"
      ? "https://external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png?auto=webp&s=38648ef0dc2c3fce76d5e1d8639234d8da0152b2"
      : data.thumbnail;

  return (
    <View style={s.container}>
      <FastImage style={s.image} source={{ uri: imgUrl }} />
      <View
        style={{
          flexDirection: "row",

          height: 100,
          flex: 1,
          flexGrow: 1,
          flexWrap: "nowrap",
        }}>
        <Text style={{ flexShrink: 1 }} numberOfLines={6}>
          {data.title}
        </Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    backgroundColor: "rgb(50,50,50)",
    borderRadius: 3,
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 3,
    backgroundColor: "black",
  },
});

function postPropsAreEqual(prevPost: any, nextPost: any) {
  return prevPost.id === nextPost.id && prevPost.score === nextPost.score;
}

export default memo(PostListItem, postPropsAreEqual);
