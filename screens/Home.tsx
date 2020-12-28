import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { Listing, Submission } from "snoowrap";
import HomeHeader from "../components/HomeHeader";
import PostScroller from "../components/PostScroller";
import Text from "../components/style/Text";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  navigation: any;
};

const Home: React.FC<Props> = (props) => {
  const [currentSub, setCurrentSub] = useState("Front Page");
  const [currentCategory, setCurrentCategory] = useState("Hot");
  const [currentTimeframe, setCurrentTimeframe] = useState("day");

  const renderHeader = useCallback(() => {
    return (
      <HomeHeader
        currentSubreddit={currentSub}
        setSubreddit={setCurrentSub}
        currentCategory={currentCategory}
        currentTimeframe={currentTimeframe}
        setCategory={setCurrentCategory}
        setTimeframe={setCurrentTimeframe}
      />
    );
  }, [currentSub, currentCategory, currentTimeframe]);

  return (
    <View style={{ flex: 1 }}>
      {/* POST SCROLLER */}
      <SubmissionListingProvider
        subreddit={currentSub}
        category={currentCategory}
        timeframe={currentTimeframe}>
        <PostScroller
          currentSubreddit={currentSub}
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

export default Home;
