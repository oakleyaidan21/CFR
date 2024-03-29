import React, { useContext, useRef, memo, useCallback, useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import GlobalSubBubble from "./GlobalSubBubble";
import SubBubble from "./SubBubble";
import SnooContext from "../context/SnooContext";
import { Subreddit } from "snoowrap";
import SubmissionListingContext from "../context/SubmissionListingContext";
import Text from "./style/Text";
import SubHeader from "./SubHeader";
import { HEADER_HEIGHT } from "../constants/constants";
import Fade from "./animations/Fade";
import { Icon } from "react-native-elements";

const globalSubs = ["Front Page", "Popular", "All", "Saved"];
const anonSubs = ["Front Page", "Popular", "All"];

type Props = {
  navigation: any;
};

const HomeHeader: React.FC<Props> = (props) => {
  const { userSubs, user } = useContext(SnooContext);
  const { subreddit, setSubreddit, category } = useContext(
    SubmissionListingContext,
  );

  const [showSubs, setShowSubs] = useState(false);

  const scrollRef = useRef<SectionList>(null);

  const currentSub = subreddit;

  const onSubPress = useCallback((sub) => {
    console.log("pressed!");
    animateHeaderChange();
    setSubreddit(sub);
    scrollRef.current?.scrollToLocation({
      viewOffset: 0,
      itemIndex: 0,
      sectionIndex: 0,
    });
  }, []);

  const renderGlobalSub = useCallback(
    (sub: any, index: number, size: number) => {
      return (
        <GlobalSubBubble
          sub={sub}
          size={size}
          onPress={() => onSubPress(sub)}
        />
      );
    },
    [userSubs],
  );

  const renderSub = useCallback(
    (sub: any, index: number, size: number) => {
      return (
        <SubBubble sub={sub} size={size} onPress={() => onSubPress(sub)} />
      );
    },
    [userSubs],
  );

  const renderFooter = useCallback(() => {
    return userSubs.length > 0 ? null : (
      <View style={s.footerContainer}>
        {user ? (
          <Text style={{ color: "grey" }}>
            Your subscribed subreddits go here. Subscribe to some!
          </Text>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Login")}>
              <Text style={{ fontWeight: "bold", color: "#00af64" }}>
                Log in{" "}
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "grey" }}>to view your subscriptions!</Text>
          </View>
        )}
      </View>
    );
  }, [user, userSubs]);

  const renderSubHeader = useCallback(() => {
    return (
      <Fade show={true}>
        <SubHeader
          data={currentSub}
          onSubPress={animateHeaderChange}
          navigation={props.navigation}
          fromHome={true}
        />
      </Fade>
    );
  }, [currentSub, category]);

  const renderSectionListHeader = () => {
    return (
      <TouchableOpacity
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 15,
          marginRight: 10,
        }}
        onPress={animateHeaderChange}>
        <Icon name="close" color="white" size={30} />
      </TouchableOpacity>
    );
  };

  const animateHeaderChange = useCallback(() => {
    setShowSubs(!showSubs);
  }, [showSubs]);

  const sections = [
    {
      data: user ? globalSubs : anonSubs,
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
    <View style={s.paddingContainer}>
      <View style={s.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showSubs ? (
            <Fade show={true} style={{ flex: 1 }}>
              <SectionList
                ref={scrollRef}
                horizontal={true}
                style={{
                  width: "100%",
                  height: 60,
                }}
                showsHorizontalScrollIndicator={false}
                sections={sections as any}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderSectionListHeader}
              />
            </Fade>
          ) : (
            <View style={{ flex: 1 }}>{renderSubHeader()}</View>
          )}
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  paddingContainer: {
    height: HEADER_HEIGHT,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
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
  footerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
    marginRight: 10,
  },
});

export default memo(HomeHeader);
