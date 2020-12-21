import React, { useContext, useRef } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import GlobalSubBubble from "./GlobalSubBubble";
import SubBubble from "./SubBubble";
import SnooContext from "../context/SnooContext";
import { Subreddit } from "snoowrap";

const globalSubs = ["Front Page", "Popular", "All", "Saved"];

type Props = {
  currentSubreddit: string | Subreddit;
  setSubreddit: any;
};

const HomeHeader: React.FC<Props> = (props) => {
  const { userSubs } = useContext(SnooContext);
  const scrollRef = useRef<SectionList>(null);

  const renderGlobalSub = (sub: any, size: number) => {
    return (
      <GlobalSubBubble
        sub={sub}
        size={size}
        onPress={() => {
          props.setSubreddit(sub);
          scrollRef.current?.scrollToLocation({
            viewOffset: 0,
            itemIndex: 0,
            sectionIndex: 0,
          });
        }}
      />
    );
  };

  const renderSub = (sub: any, size: number) => {
    return (
      <SubBubble
        sub={sub}
        size={size}
        onPress={() => {
          props.setSubreddit(sub);
          scrollRef.current?.scrollToLocation({
            viewOffset: 0,
            itemIndex: 0,
            sectionIndex: 0,
          });
        }}
      />
    );
  };

  const currentSub = props.currentSubreddit;

  const subIsString = typeof currentSub === "string";

  const sections = [
    {
      data: [currentSub],
      renderItem: ({ item }: any) =>
        subIsString ? renderGlobalSub(item, 60) : renderSub(item, 60),
      keyExtractor: (item: any) =>
        subIsString ? item : item.display_name + item.id,
    },
    {
      data: globalSubs,
      renderItem: ({ item }: any) => renderGlobalSub(item, 40),
      keyExtractor: (item: string) => item,
    },
    {
      data: userSubs,
      renderItem: ({ item }: any) => renderSub(item, 40),
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
        // SectionSeparatorComponent={({ trailingItem }) =>
        //   trailingItem ? <View style={s.separator} /> : null
        // }
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
    height: 50,
    backgroundColor: "#00af64",
    borderRadius: 2,
  },
});

export default HomeHeader;
