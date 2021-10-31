import React, { useCallback, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Listing, Submission } from "snoowrap";
import HomeHeader from "../components/HomeHeader";
import PostScroller from "../components/PostScroller";
import SnooContext from "../context/SnooContext";
import SubmissionListingProvider from "../providers/ListingProvider";
import Post from "./Post";

type Props = {
  navigation: any;
};

const TabletHome: React.FC<Props> = (props) => {
  const { user } = useContext(SnooContext);

  const { postItemView } = useSelector((state: any) => state);

  const [currentPost, setCurrentPost] = useState<Submission>();

  const renderHeader = useCallback(() => {
    return <HomeHeader navigation={props.navigation} />;
  }, []);

  const onPostPress = useCallback((data: Submission) => {
    console.log("setting data!");
    setCurrentPost(data);
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
          onPress={onPostPress}
          dontNavigate={true}
        />
      </SubmissionListingProvider>
    );
  }, [user, postItemView]);

  return (
    <View style={s.container}>
      {/* POST SCROLLER */}
      {renderHomeScroller()}
      <View style={{ flex: 2 }}>
        {currentPost && (
          <Post
            navigation={props.navigation}
            route={{ params: { data: currentPost } }}
          />
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(20,20,20)",
    flexDirection: "row",
  },
});

export default TabletHome;
