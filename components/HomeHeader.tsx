import React, { useContext } from "react";
import { ScrollView, SectionList, StyleSheet, View } from "react-native";
import Text from "./style/Text";
import GlobalSubBubble from "./GlobalSubBubble";
import SubBubble from "./SubBubble";
import { store } from "../redux/store";
import SnooContext from "../context/SnooContext";

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
    },
    {
      data: userSubs,
      renderItem: ({ item }: any) => renderSub(item),
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
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    marginTop: 10,
    paddingVertical: 5,
  },
  separator: {
    width: 3,
    height: 50,
    backgroundColor: "#00af64",
    borderRadius: 2,
  },
});

export default HomeHeader;
