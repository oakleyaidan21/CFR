import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Listing, Submission } from "snoowrap";
import PostScroller from "../components/PostScroller";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  route: { params: { data: Listing<Submission>; query: string } };
  navigation: any;
};

const SubmissionSearchResults: React.FC<Props> = (props) => {
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
        <Text style={{ color: "white", fontWeight: "bold", marginLeft: 10 }}>
          {'Search Results for "' + props.route.params.query + '"'}
        </Text>
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SubmissionListingProvider
        subreddit={"none"}
        category={"none"}
        timeframe={"none"}
        listing={props.route.params.data}>
        <PostScroller
          currentSubreddit={"Search Results"}
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

export default SubmissionSearchResults;
