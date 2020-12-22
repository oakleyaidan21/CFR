import React, { useRef, useState } from "react";
import { View } from "react-native";
import { Submission } from "snoowrap";
import HomeHeader from "../components/HomeHeader";
import PostScroller from "../components/PostScroller";
import Text from "../components/style/Text";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  navigation: any;
};

const Home: React.FC<Props> = (props) => {
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
          onPress={(data: Submission) =>
            props.navigation.navigate("Post", { data: data })
          }
        />
      </SubmissionListingProvider>
    </View>
  );
};

export default Home;
