import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Subreddit } from "snoowrap";
import SnooContext from "../context/SnooContext";
import SubmissionListingContext from "../context/SubmissionListingContext";
import CategoryPicker from "./CategoryPicker";
import GlobalSubBubble from "./GlobalSubBubble";
import Text from "./style/Text";
import SubSearchBar from "./SubSearchBar";

type Props = {
  data: string | Subreddit;
  navigation?: any;
  onSubPress: any;
  fromHome: boolean;
};

const globalSubs = ["Front Page", "Popular", "All", "Saved"];

const SubHeader: React.FC<Props> = (props) => {
  const { snoowrap } = useContext(SnooContext);
  const { subreddit, category, timeframe } = useContext(
    SubmissionListingContext,
  );
  const [data, setData] = useState<string | Subreddit>(props.data);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    if (typeof props.data == "string" && !globalSubs.includes(props.data)) {
      getSub();
    }
  }, []);

  const getSub = useCallback(() => {
    snoowrap
      ?.getSubreddit(
        typeof props.data == "string" ? props.data : props.data.display_name,
      )
      .fetch()
      .then((s) => {
        setData(s);
      });
  }, [props.data]);

  const isString = typeof data === "string";

  const getImageString = useCallback(() => {
    if (typeof data === "string") {
      switch (data) {
        case "Front Page":
          return "web";
        case "All":
          return "group-work";
        case "Saved":
          return "grade";
        case "Popular":
          return "local-fire-department";
        default:
          return "times";
      }
    } else {
      return data.icon_img
        ? data.icon_img
        : data.community_icon
        ? data.community_icon
        : "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png";
    }
  }, [data]);

  const imgUrl = getImageString();

  return (
    <View style={s.container}>
      {showSearchBar ? (
        <SubSearchBar
          sub={data}
          close={() => setShowSearchBar(false)}
          onSearch={(sub: any, query: string) =>
            props.navigation.navigate("SearchResults", {
              sub: sub,
              query: query,
            })
          }
        />
      ) : (
        <>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {!props.fromHome && (
              <Icon
                name="arrow-back"
                color="white"
                onPress={props.navigation.goBack}
              />
            )}
            <TouchableOpacity
              onPress={props.onSubPress}
              style={{ flexDirection: "row", alignItems: "center" }}>
              {!isString ? (
                <FastImage
                  source={{ uri: imgUrl }}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    marginHorizontal: 10,
                  }}
                />
              ) : (
                <GlobalSubBubble
                  sub={data}
                  onPress={null}
                  size={40}
                  hideText={true}
                />
              )}
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {typeof data === "string" ? data : data.display_name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => setShowCatPicker(!showCatPicker)}>
              <Text style={{ color: "grey", fontWeight: "bold" }}>
                {category}
              </Text>
              <Icon name="arrow-drop-down" color="grey" />
            </TouchableOpacity>
            {subreddit !== "Front Page" && subreddit !== "Saved" && (
              <TouchableOpacity onPress={() => setShowSearchBar(true)}>
                <Icon name="search" color="grey" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )}
          </View>
          <CategoryPicker
            isVisible={showCatPicker}
            close={() => setShowCatPicker(false)}
          />
        </>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    padding: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
  },
});

export default SubHeader;
