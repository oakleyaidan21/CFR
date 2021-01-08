import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Listing, Submission, Subreddit } from "snoowrap";
import PostScroller from "../components/PostScroller";
import SubHeader from "../components/SubHeader";
import { HEADER_HEIGHT } from "../constants/constants";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  route: { params: { data: Subreddit | string } };
  navigation: any;
};

const Sub: React.FC<Props> = (props) => {
  const { data } = props.route.params;

  const renderHeader = useCallback(() => {
    return (
      <View
        style={{
          height: HEADER_HEIGHT,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.8)",
        }}>
        <SubHeader
          data={data}
          navigation={props.navigation}
          fromHome={false}
          onSubPress={null}
        />
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SubmissionListingProvider
        initialSubreddit={typeof data == "string" ? data : data.display_name}
        initialCategory={"Hot"}
        initialTimeframe={"Day"}>
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
