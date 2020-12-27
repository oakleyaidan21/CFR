import React, { useContext, useRef, memo, useCallback } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import GlobalSubBubble from "./GlobalSubBubble";
import SubBubble from "./SubBubble";
import SnooContext from "../context/SnooContext";
import { Subreddit } from "snoowrap";
import SubmissionListingContext from "../context/SubmissionListingContext";

const globalSubs = ["Front Page", "Popular", "All", "Saved"];

type Props = {
  currentSubreddit: string | Subreddit;
  setSubreddit: any;
};

const HomeHeader: React.FC<Props> = (props) => {
  const { userSubs } = useContext(SnooContext);
  const { setListing, getPosts, listing } = useContext(
    SubmissionListingContext,
  );

  const scrollRef = useRef<SectionList>(null);

  const currentSub = props.currentSubreddit;

  const subIsString = typeof currentSub === "string";

  const renderGlobalSub = (sub: any, size: number, header: boolean) => {
    return (
      <GlobalSubBubble
        sub={sub}
        size={size}
        onPress={() => {
          if (header) {
            setListing(null);
            getPosts();
          } else {
            props.setSubreddit(sub);
            if (currentSub != sub) {
              setListing(null);
            }
            scrollRef.current?.scrollToLocation({
              viewOffset: 0,
              itemIndex: 0,
              sectionIndex: 0,
            });
          }
        }}
      />
    );
  };

  const renderSub = (sub: any, size: number, header: boolean) => {
    return (
      <SubBubble
        sub={sub}
        size={size}
        onPress={() => {
          if (header) {
            setListing(null);
            getPosts();
          } else {
            if (currentSub != sub) {
              setListing(null);
            }
            props.setSubreddit(sub);
            scrollRef.current?.scrollToLocation({
              viewOffset: 0,
              itemIndex: 0,
              sectionIndex: 0,
            });
          }
        }}
      />
    );
  };

  const renderHeader = useCallback(() => {
    return subIsString
      ? renderGlobalSub(props.currentSubreddit, 60, true)
      : renderSub(props.currentSubreddit, 60, true);
  }, [props.currentSubreddit, listing, userSubs]);

  const renderSectionHeader = useCallback(
    () => <View style={s.separator} />,
    [],
  );

  const sections = [
    {
      data: globalSubs,
      renderItem: ({ item }: any) => renderGlobalSub(item, 40, false),
      keyExtractor: (item: string) => item,
    },
    {
      data: userSubs,
      renderItem: ({ item }: any) => renderSub(item, 40, false),
      keyExtractor: (item: Subreddit) => item.id,
    },
  ];

  return (
    <View style={s.container}>
      <SectionList
        ref={scrollRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        sections={sections as any}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        style={{ width: "100%" }}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: "100%",
    padding: 5,
    position: "relative",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  separator: {
    width: 3,
    height: 40,
    marginTop: 10,
    backgroundColor: "#00af64",
    borderRadius: 2,
  },
});

export default memo(HomeHeader);
