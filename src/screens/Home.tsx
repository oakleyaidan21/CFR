import React, { useCallback, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Listing, Submission } from "snoowrap";
import DetailedPostScroller from "../components/DetailedPostScroller";
import HomeHeader from "../components/HomeHeader";
import PostScroller from "../components/PostScroller";
import SnooContext from "../context/SnooContext";
import SubmissionListingProvider from "../providers/ListingProvider";

type Props = {
  navigation: any;
};

const Home: React.FC<Props> = (props) => {
  const { user } = useContext(SnooContext);

  const { postItemView } = useSelector((state: any) => state);

  const renderHeader = useCallback(() => {
    return <HomeHeader navigation={props.navigation} />;
  }, []);

  const onPostPress = useCallback(
    (data: Listing<Submission>, index: number) => {
      props.navigation.push("PostSwiper", {
        posts: data,
        index: index,
        prevScreen: "Home",
      });
    },
    [],
  );

  const renderHomeScroller = useCallback(() => {
    return (
      <SubmissionListingProvider
        initialSubreddit={"Front Page"}
        initialCategory={"Hot"}
        initialTimeframe={"hour"}>
        {postItemView == "simple" ? (
          <PostScroller
            currentSubreddit={"Front Page"}
            header={renderHeader()}
            onPress={onPostPress}
            dontNavigate={false}
          />
        ) : (
          <DetailedPostScroller
            currentSubreddit={"Front Page"}
            header={renderHeader()}
            onPress={onPostPress}
          />
        )}
      </SubmissionListingProvider>
    );
  }, [user, postItemView]);

  return (
    <View style={s.container}>
      {/* POST SCROLLER */}
      {renderHomeScroller()}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(20,20,20)" },
});

export default Home;
