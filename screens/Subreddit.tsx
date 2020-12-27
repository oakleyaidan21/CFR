import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Listing, Submission, Subreddit } from "snoowrap";
import PostScroller from "../components/PostScroller";
import SubHeader from "../components/SubHeader";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  route: { params: { data: Subreddit } };
  navigation: any;
};

const Sub: React.FC<Props> = (props) => {
  const { data } = props.route.params;

  const [currentCategory, setCurrentCategory] = useState<string>("Hot");
  const [currentTimeframe, setCurrentTimeframe] = useState<string>("Hour");

  const imgUrl = data.icon_img
    ? data.icon_img
    : data.community_icon
    ? data.community_icon
    : "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png";

  const renderHeader = useCallback(() => {
    return (
      <SubHeader
        data={data}
        navigation={props.navigation}
        currentTimeframe={currentTimeframe}
        currentCategory={currentCategory}
      />
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
