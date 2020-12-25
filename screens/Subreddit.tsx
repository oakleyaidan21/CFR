import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Listing, Submission, Subreddit } from "snoowrap";
import PostScroller from "../components/PostScroller";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  route: { params: { data: Subreddit } };
  navigation: any;
};

const Sub: React.FC<Props> = (props) => {
  const { data } = props.route.params;

  const imgUrl = data.icon_img
    ? data.icon_img
    : data.community_icon
    ? data.community_icon
    : "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png";
  const renderHeader = useCallback(() => {
    return (
      <View
        style={{
          paddingVertical: 10,
          backgroundColor: "rgba(0,0,0,0.8)",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Icon
          name="arrow-back"
          color="white"
          onPress={props.navigation.goBack}
        />
        <FastImage
          source={{ uri: imgUrl }}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            marginHorizontal: 10,
          }}
        />
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {data.display_name}
        </Text>
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SubmissionListingProvider
        subreddit={data.display_name}
        category={"Hot"}
        timeframe={"Day"}>
        <PostScroller
          currentSubreddit={data}
          header={renderHeader()}
          onPress={(data: Listing<Submission>, index: number) =>
            props.navigation.navigate("PostSwiper", {
              posts: data,
              index: index,
            })
          }
        />
      </SubmissionListingProvider>
    </View>
  );
};

export default Sub;
