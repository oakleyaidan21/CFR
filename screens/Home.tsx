import React, { useRef, useState } from "react";
import { View } from "react-native";
import HomeHeader from "../components/HomeHeader";
import PostScroller from "../components/PostScroller";
import Text from "../components/style/Text";
import SubmissionListingProvider from "../providers/ListingProvider";

const Home: React.FC = (props) => {
  const scrollRef = useRef(null);

  const [currentSub, setCurrentSub] = useState("Front Page");
  const [currentCategory, setCurrentCategory] = useState("Hot");
  const [currentTimeframe, setCurrentTimeframe] = useState("day");

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <HomeHeader />
      {/* POST SCROLLER */}
      <SubmissionListingProvider
        subreddit={currentSub}
        category={currentCategory}
        timeframe={currentTimeframe}>
        <PostScroller header={HomeHeader} scrollRef={scrollRef} />
      </SubmissionListingProvider>
    </View>
  );
};

export default Home;
