import React, { useCallback, useContext, useEffect, useState } from "react";
import { InteractionManager, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Listing, Submission, Subreddit } from "snoowrap";
import PostScroller from "../components/PostScroller";
import StandardHeader from "../components/StandardHeader";
import SnooContext from "../context/SnooContext";
import SubmissionListingProvider from "../providers/ListingProvider";
import {
  searchFrontPage,
  searchPosts,
} from "../util/snoowrap/snoowrapFunctions";

type Props = {
  route: { params: { query: string; sub: Subreddit | string } };
  navigation: any;
};

const SubmissionSearchResults: React.FC<Props> = (props) => {
  const { snoowrap, userSubs } = useContext(SnooContext);

  const [data, setData] = useState();

  const searchSubmissions = useCallback(() => {
    console.log("searching");
    if (snoowrap) {
      if (props.route.params.sub == "Front Page") {
        searchFrontPage(snoowrap, props.route.params.query, userSubs).then(
          (results: any) => {
            setData(results);
          },
        );
      } else {
        searchPosts(
          snoowrap,
          typeof props.route.params.sub === "string"
            ? props.route.params.sub
            : props.route.params.sub.display_name,
          props.route.params.query,
        ).then((r: any) => {
          console.log("searched!", r.length);
          setData(r);
        });
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("transitionEnd", () => {
      searchSubmissions();
    });
    return unsubscribe;
  }, [props.navigation]);

  const renderHeader = useCallback(() => {
    return (
      <StandardHeader
        navigation={props.navigation}
        label={'Search Results for "' + props.route.params.query + '"'}
        relative={true}
      />
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
            props.navigation.push("PostSwiper", {
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
