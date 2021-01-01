import React, { useContext, useRef, memo, useCallback, useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import GlobalSubBubble from "./GlobalSubBubble";
import SubBubble from "./SubBubble";
import SnooContext from "../context/SnooContext";
import { Subreddit } from "snoowrap";
import SubmissionListingContext from "../context/SubmissionListingContext";
import Text from "./style/Text";
import SubHeader from "./SubHeader";
import { Icon } from "react-native-elements";
import Fade from "./animations/Fade";

const globalSubs = ["Front Page", "Popular", "All", "Saved"];

type Props = {
  navigation: any;
};

const HomeHeader: React.FC<Props> = (props) => {
  const { userSubs } = useContext(SnooContext);
  const {
    setListing,
    subreddit,
    setSubreddit,
    category,
    timeframe,
    setCategory,
    setTimeframe,
  } = useContext(SubmissionListingContext);

  const [showSubs, setShowSubs] = useState(false);

  const scrollRef = useRef<SectionList>(null);

  const currentSub = subreddit;

  const renderGlobalSub = useCallback(
    (sub: any, index: number, size: number) => {
      return (
        <Fade show={true} delay={(index + 1) * 70}>
          <GlobalSubBubble
            sub={sub}
            size={size}
            onPress={() => {
              setShowSubs(false);
              setSubreddit(sub);
              scrollRef.current?.scrollToLocation({
                viewOffset: 0,
                itemIndex: 0,
                sectionIndex: 0,
              });
            }}
          />
        </Fade>
      );
    },
    [userSubs],
  );

  const renderSub = useCallback(
    (sub: any, index: number, size: number) => {
      return (
        <Fade show={true} delay={index > 5 ? 0 : (index + 5) * 70}>
          <SubBubble
            sub={sub}
            size={size}
            onPress={() => {
              setShowSubs(false);
              setSubreddit(sub);
              scrollRef.current?.scrollToLocation({
                viewOffset: 0,
                itemIndex: 0,
                sectionIndex: 0,
              });
            }}
          />
        </Fade>
      );
    },
    [userSubs],
  );

  const renderFooter = useCallback(() => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          width: 50,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setShowSubs(!showSubs)}>
        <Icon name={showSubs ? "close" : "more-horiz"} color="grey" />
      </TouchableOpacity>
    );
  }, [showSubs]);

  const renderSubHeader = useCallback(() => {
    return (
      <SubHeader
        data={currentSub}
        onSubPress={() => setShowSubs(true)}
        navigation={props.navigation}
        fromHome={true}
      />
    );
  }, [currentSub, category]);

  const sections = [
    {
      data: globalSubs,
      renderItem: ({ item, index }: any) => renderGlobalSub(item, index, 40),
      keyExtractor: (item: string) => item,
    },
    {
      data: userSubs,
      renderItem: ({ item, index }: any) => renderSub(item, index, 40),
      keyExtractor: (item: Subreddit) => item.id,
    },
  ];

  return (
    <View style={s.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showSubs ? (
          <SectionList
            ref={scrollRef}
            horizontal={true}
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              width: "100%",
              height: 60,
            }}
            showsHorizontalScrollIndicator={false}
            sections={sections as any}
          />
        ) : (
          <View style={{ flex: 1 }}>{renderSubHeader()}</View>
        )}
        {/* {renderFooter()} */}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    height: 60,
    justifyContent: "center",
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
