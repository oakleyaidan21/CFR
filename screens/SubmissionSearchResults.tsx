import React, { useCallback, useContext, useEffect, useState } from "react";
import { InteractionManager, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Listing, Submission } from "snoowrap";
import PostScroller from "../components/PostScroller";
import SnooContext from "../context/SnooContext";
import SubmissionListingProvider from "../providers/ListingProvider";
import { searchPosts } from "../util/snoowrap/snoowrapFunctions";

type Props = {
  route: { params: { query: string } };
  navigation: any;
};

const SubmissionSearchResults: React.FC<Props> = (props) => {
  const { snoowrap } = useContext(SnooContext);

  const [data, setData] = useState();

  const searchAllSubmissions = useCallback(() => {
    console.log("searching");
    if (snoowrap) {
      searchPosts(snoowrap, "all", props.route.params.query).then((r: any) => {
        console.log("searched!", r.length);
        setData(r);
      });
    }
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      searchAllSubmissions();
    });
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={s.headerContainer}>
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
        initialSubreddit={"none"}
        initialCategory={"none"}
        initialTimeframe={"none"}
        listing={data}>
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

const s = StyleSheet.create({
  headerContainer: {
    height: 50,
    backgroundColor: "rgba(0,0,0,0.8)",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});

export default SubmissionSearchResults;
