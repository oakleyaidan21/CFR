import React, { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Subreddit } from "snoowrap";
import CategoryPicker from "./CategoryPicker";
import GlobalSubBubble from "./GlobalSubBubble";
import Text from "./style/Text";

type Props = {
  data: string | Subreddit;
  navigation?: any;
  currentCategory: string;
  currentTimeframe: string;
  setCategory: any;
  setTimeframe: any;
};

const SubHeader: React.FC<Props> = (props) => {
  const { data, currentCategory, currentTimeframe } = props;

  const [showCatPicker, setShowCatPicker] = useState(false);

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
          return "closed";
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {props.navigation && (
          <Icon
            name="arrow-back"
            color="white"
            onPress={props.navigation.goBack}
          />
        )}
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
      </View>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => setShowCatPicker(true)}>
        <Text style={{ color: "grey", fontWeight: "bold" }}>
          {props.currentCategory}
        </Text>
        <Icon name="arrow-drop-down" color="grey" />
      </TouchableOpacity>

      <CategoryPicker
        isVisible={showCatPicker}
        close={() => setShowCatPicker(false)}
        setCategory={props.setCategory}
        setTimeframe={props.setTimeframe}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingRight: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SubHeader;