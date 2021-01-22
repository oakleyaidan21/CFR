import React, { useCallback, useState } from "react";
import { View } from "react-native";
import Swiper from "react-native-swiper";
import { Listing, Submission } from "snoowrap";
import StandardHeader from "../components/StandardHeader";
import Post from "./Post";
import Text from "../components/style/Text";

type Props = {
  route: {
    params: { index: number; posts: Listing<Submission>; prevScreen: string };
  };
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
  }, [currPosts]);

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
      <StandardHeader
        navigation={props.navigation}
        label={props.route.params.prevScreen}
      />
    </View>
  );
};

export default PostSwiper;
