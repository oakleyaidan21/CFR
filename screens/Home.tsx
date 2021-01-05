import React, { useCallback, useContext, useRef, useState } from "react";
import { View } from "react-native";
import { Listing, Submission } from "snoowrap";
import HomeHeader from "../components/HomeHeader";
import PostScroller from "../components/PostScroller";
import Text from "../components/style/Text";
import SnooContext from "../context/SnooContext";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  navigation: any;
};

const Home: React.FC<Props> = (props) => {
  const { user } = useContext(SnooContext);

  const renderHeader = useCallback(() => {
    return <HomeHeader navigation={props.navigation} />;
  }, []);

  const renderHomeScroller = useCallback(() => {
    return (
      <SubmissionListingProvider
        initialSubreddit={"Front Page"}
        initialCategory={"Hot"}
        initialTimeframe={"hour"}>
        <PostScroller
          currentSubreddit={"Front Page"}
          header={renderHeader()}
          onPress={(data: Listing<Submission>, index: number) =>
            props.navigation.navigate("PostSwiper", {
              posts: data,
              index: index,
            })
          }
        />
      </SubmissionListingProvider>
    );
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(20,20,20)" }}>
      {/* POST SCROLLER */}
      {renderHomeScroller()}
    </View>
  );
};

export default Home;
