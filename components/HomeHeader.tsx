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

const globalSubs = ["Front Page", "Popular", "All", "Saved"];

type Props = {
  currentSubreddit: string | Subreddit;
  setSubreddit: any;
  currentCategory: string;
  currentTimeframe: string;
  setCategory: any;
  setTimeframe: any;
};

const HomeHeader: React.FC<Props> = (props) => {
  const { userSubs } = useContext(SnooContext);
  const { setListing } = useContext(SubmissionListingContext);

  const [showSubs, setShowSubs] = useState(false);

  const scrollRef = useRef<SectionList>(null);

  const currentSub = props.currentSubreddit;

  const renderGlobalSub = useCallback(
    (sub: any, size: number) => {
      return (
        <GlobalSubBubble
          sub={sub}
          size={size}
          onPress={() => {
            setShowSubs(false);
            props.setSubreddit(sub);
            if (currentSub != sub) {
              setListing(null);
            }
            scrollRef.current?.scrollToLocation({
              viewOffset: 0,
              itemIndex: 0,
              sectionIndex: 0,
            });
          }}
        />
      );
    },
    [userSubs],
  );

  const renderSub = useCallback(
    (sub: any, size: number) => {
      return (
        <SubBubble
          sub={sub}
          size={size}
          onPress={() => {
            setShowSubs(false);
            if (currentSub != sub) {
              setListing(null);
            }
            props.setSubreddit(sub);
            scrollRef.current?.scrollToLocation({
              viewOffset: 0,
              itemIndex: 0,
              sectionIndex: 0,
            });
          }}
        />
      );
    },
    [userSubs],
  );

  const renderFooter = useCallback(() => {
    return (
      <TouchableOpacity
        style={{ marginHorizontal: 10, backgroundColor: "rgba(0,0,0,0.8)" }}
        onPress={() => setShowSubs(!showSubs)}>
        <Icon name={showSubs ? "close" : "more-vert"} color="grey" />
      </TouchableOpacity>
    );
  }, [showSubs]);

  const renderSubHeader = useCallback(() => {
    return (
      <SubHeader
        data={currentSub}
        currentCategory={props.currentCategory}
        currentTimeframe={props.currentTimeframe}
        setCategory={(cat: string) => {
          setListing(null);
          props.setCategory(cat);
        }}
        setTimeframe={(tf: string) => {
          setListing(null);
          props.setTimeframe(tf);
        }}
      />
    );
  }, [currentSub, props.currentCategory]);

  const sections = [
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showSubs ? (
          <SectionList
            ref={scrollRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            sections={sections as any}
            style={{ width: "100%" }}
          />
        ) : (
          <View style={{ flex: 1 }}>{renderSubHeader()}</View>
        )}
        {renderFooter()}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    backgroundColor: "rgba(0,0,0,0.8)",
    height: 70,
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
