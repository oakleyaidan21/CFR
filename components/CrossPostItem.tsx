import React, { useCallback, useContext, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import { Submission } from "snoowrap";
import SnooContext from "../context/SnooContext";
import { getTimeSincePosted, getUriImage } from "../util/util";

type Props = {
  data: Submission;
  navigation?: any;
};

const CrossPostItem: React.FC<Props> = (props) => {
  const { data } = props;
  const imgUrl =
    !getUriImage(data.thumbnail) ||
    data.thumbnail == "" ||
    data.thumbnail === "self" ||
    data.thumbnail === "spoiler" ||
    data.thumbnail === "default"
      ? "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png"
      : data.thumbnail;

  const getXPost = useCallback(() => {
    props.navigation.navigate("LoadPost", {
      id: data.id,
      screenTitle: "Crosspost",
    });
  }, []);

  return (
    <TouchableOpacity style={s.container} onPress={getXPost}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 50,
          height: 50,
          borderRadius: 3,
          backgroundColor: "black",
        }}>
        <FastImage
          style={{ width: "100%", height: "100%", borderRadius: 3 }}
          source={{ uri: imgUrl }}
        />
      </View>
      <View style={{ flex: 1, height: 50, marginLeft: 10 }}>
        <Text style={{ color: "grey" }} numberOfLines={1}>
          <Text>{data.subreddit.display_name}</Text>
          <Text> | </Text>
          <Text>{data.author.name}</Text>
          <Text> | </Text>
          <Text>{data.domain}</Text>
          <Text> | </Text>
          <Text>{getTimeSincePosted(data.created_utc)}</Text>
        </Text>
        <Text style={{ color: "white", fontWeight: "bold" }} numberOfLines={1}>
          {props.data.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(30,30,30)",
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 3,
  },
});

export default CrossPostItem;
