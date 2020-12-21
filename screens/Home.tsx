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
      {/* POST SCROLLER */}
      <SubmissionListingProvider
        subreddit={currentSub}
        category={currentCategory}
        timeframe={currentTimeframe}>
        <PostScroller
          scrollRef={scrollRef}
          currentSubreddit={currentSub}
          header={
            <HomeHeader
              currentSubreddit={currentSub}
              setSubreddit={setCurrentSub}
            />
          }
        />
      </SubmissionListingProvider>
    </View>
  );
};

export default Home;
