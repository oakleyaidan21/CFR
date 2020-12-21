import React, { useContext } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import GlobalSubBubble from "./GlobalSubBubble";
import SubBubble from "./SubBubble";
import SnooContext from "../context/SnooContext";
import { Subreddit } from "snoowrap";

const globalSubs = ["Front Page", "Popular", "All", "Saved"];

const HomeHeader: React.FC = (props) => {
  const { userSubs } = useContext(SnooContext);

  const renderGlobalSub = (sub: any) => {
    return <GlobalSubBubble sub={sub} />;
  };

  const renderSub = (sub: any) => {
    return <SubBubble sub={sub} />;
  };

  const sections = [
    {
      data: [...globalSubs],
      renderItem: ({ item }: any) => renderGlobalSub(item),
      keyExtractor: (item: string) => item,
    },
    {
      data: userSubs,
      renderItem: ({ item }: any) => renderSub(item),
      keyExtractor: (item: Subreddit) => item.display_name,
    },
  ];

  return (
    <View style={s.container}>
      <SectionList
        horizontal={true}
        sections={sections as any}
        // SectionSeparatorComponent={({ trailingItem }) =>
        //   trailingItem ? <View style={s.separator} /> : null
        // }
        style={{ width: "100%", height: "100%" }}
      />
      <View
        style={{
          width: "100%",
          height: 3,
          borderRadius: 2,
          backgroundColor: "#00af64",
        }}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    padding: 5,
    backgroundColor: "black",
  },
  separator: {
    width: 3,
    height: 50,
    backgroundColor: "#00af64",
    borderRadius: 2,
  },
});

export default HomeHeader;
