import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Subreddit } from "snoowrap";
import GlobalSubBubble from "./GlobalSubBubble";
import Text from "./style/Text";

type Props = {
  data: string | Subreddit;
  navigation?: any;
  currentCategory: string;
  currentTimeframe: string;
};

const SubHeader: React.FC<Props> = (props) => {
  const { data, currentCategory, currentTimeframe } = props;

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
    <View
      style={{
        paddingVertical: 10,
        paddingRight: 10,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
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
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: "grey", fontWeight: "bold" }}>
          {currentCategory}
        </Text>
        <Icon name="arrow-drop-down" color="grey" />
      </TouchableOpacity>
    </View>
  );
};

export default SubHeader;
