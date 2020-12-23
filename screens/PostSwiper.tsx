import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import Swiper from "react-native-swiper";

import { Listing, Submission } from "snoowrap";
import Text from "../components/style/Text";
import Post from "./Post";

type Props = {
  route: { params: { index: number; posts: Listing<Submission> } };
  navigation: any;
};

const PostSwiper: React.FC<Props> = (props) => {
  const [currPosts, setCurrPosts] = useState<Listing<Submission>>(
    props.route.params.posts,
  );

  const onIndexChanged = useCallback(
    (index) => {
      if (currPosts) {
        if (index == currPosts.length - 1) {
          (currPosts as any)
            .fetchMore({ amount: 25, append: true })
            .then((list: Listing<Submission>) => {
              setCurrPosts(list);
            });
        }
      }
    },
    [currPosts.length],
  );

  const renderPosts = useCallback(() => {
    return currPosts.map((postData, index) => {
      return (
        <Post
          key={postData.id}
          route={{ params: { data: postData } }}
          navigation={props.navigation}
        />
      );
    });
  }, [currPosts.length]);

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        loadMinimal={true}
        showsPagination={false}
        loop={false}
        onIndexChanged={onIndexChanged}
        index={props.route.params.index}>
        {renderPosts()}
      </Swiper>
      {/* HEADER */}
      <View style={s.headerContainer}>
        <Icon
          name="arrow-back"
          color="white"
          onPress={props.navigation.goBack}
        />
      </View>
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

export default PostSwiper;
