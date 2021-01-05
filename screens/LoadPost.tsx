import React, { useContext, useEffect, useState } from "react";
import { InteractionManager, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { Submission } from "snoowrap";
import PostPlaceholder from "../components/placeholders/PostPlaceholder";
import StandardHeader from "../components/StandardHeader";
import SnooContext from "../context/SnooContext";
import Post from "./Post";

type Props = {
  navigation: any;
  route: { params: { id: string } };
};

const LoadPost: React.FC<Props> = (props) => {
  const { id } = props.route.params;

  const { snoowrap } = useContext(SnooContext);

  const [postData, setPostData] = useState<Submission>();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      getPostData();
    });
  }, []);

  const getPostData = () => {
    snoowrap
      ?.getSubmission(id)
      .fetch()
      .then((s) => {
        setPostData(s);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      {postData ? (
        <Post
          navigation={props.navigation}
          route={{ params: { data: postData } }}
        />
      ) : (
        <PostPlaceholder />
      )}
      <StandardHeader navigation={props.navigation} />
    </View>
  );
};
const s = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default LoadPost;
