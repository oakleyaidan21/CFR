import React, { useCallback, useContext, useEffect, useState } from "react";
import { InteractionManager, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { Submission } from "snoowrap";
import PostPlaceholder from "../components/placeholders/PostPlaceholder";
import StandardHeader from "../components/StandardHeader";
import SnooContext from "../context/SnooContext";
import Post from "./Post";
import Text from "../components/style/Text";

type Props = {
  navigation: any;
  route: { params: { id: string; screenTitle: string } };
};

const LoadPost: React.FC<Props> = (props) => {
  const { id } = props.route.params;

  const { snoowrap } = useContext(SnooContext);

  const [postData, setPostData] = useState<Submission>();
  const [errored, setErrored] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("transitionEnd", () => {
      getPostData();
    });
    return unsubscribe;
  }, [props.navigation]);

  const getPostData = () => {
    snoowrap
      ?.getSubmission(id)
      .fetch()
      .then((s) => {
        setPostData(s);
      })
      .catch(() => {
        setErrored(true);
      });
  };

  const renderHeaderContent = useCallback(() => {
    return (
      <View style={{ marginLeft: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {props.route.params.screenTitle}
        </Text>
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {postData ? (
        <Post
          navigation={props.navigation}
          route={{ params: { data: postData } }}
        />
      ) : errored ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 50, marginBottom: 10 }}>:(</Text>
          <Text>An error occurred</Text>
        </View>
      ) : (
        <PostPlaceholder navigation={props.navigation} />
      )}
      <StandardHeader
        navigation={props.navigation}
        content={renderHeaderContent()}
      />
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
