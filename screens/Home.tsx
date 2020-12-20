import React, { useState } from "react";
import { View } from "react-native";
import HomeHeader from "../components/HomeHeader";
import PostScroller from "../components/PostScroller";
import Text from "../components/style/Text";
import SubmissionListingProvider from "../providers/ListingProvider";

const Home: React.FC = (props) => {
  const [currentSub, setCurrentSub] = useState("All");
  const [currentCategory, setCurrentCategory] = useState("Hot");
  const [currentTimeframe, setCurrentTimeframe] = useState("day");

  return (
    <View style={{ flex: 1 }}>
      {/* POST SCROLLER */}
      <SubmissionListingProvider
        subreddit={currentSub}
        category={currentCategory}
        timeframe={currentTimeframe}>
        <PostScroller header={HomeHeader} />
      </SubmissionListingProvider>
    </View>
  );
};

export default Home;
