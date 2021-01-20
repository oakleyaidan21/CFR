import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Subreddit } from "snoowrap";
import MDRenderer from "../components/MDRenderer";
import StandardHeader from "../components/StandardHeader";
import Text from "../components/style/Text";
import { HEADER_HEIGHT } from "../constants/constants";

type Props = {
  route: { params: { subData: Subreddit } };
  navigation: any;
};

const SubSidebar: React.FC<Props> = (props) => {
  const { subData } = props.route.params;

  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("transitionEnd", () => {
      setShowDescription(true);
    });
    return unsubscribe;
  }, [props.navigation]);

  const iconImg = subData.icon_img
    ? subData.icon_img
    : subData.community_icon
    ? subData.community_icon
    : "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png";

  return (
    <View style={s.container}>
      <ScrollView
        style={s.scrollContainer}
        contentContainerStyle={s.scrollContentContainer}>
        {/* Top margin to make translucent header nicer */}
        {/* <View style={s.topMargin} /> */}
        <FastImage
          style={s.topImage}
          source={{
            uri:
              "https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg",
          }}
          resizeMode={"cover"}
        />
        <View style={s.nameContainer}>
          <FastImage style={s.iconImg} source={{ uri: iconImg }} />
          <Text style={s.subNameText} numberOfLines={1}>
            {subData.display_name}
          </Text>
        </View>
        {showDescription && (
          <MDRenderer data={subData.description_html} onLinkPress={null} />
        )}
      </ScrollView>
      <StandardHeader navigation={props.navigation} />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  topMargin: { marginTop: HEADER_HEIGHT },
  scrollContainer: { flex: 1 },
  scrollContentContainer: { padding: 10 },
  topImage: { width: "100%", height: HEADER_HEIGHT + 50 },
  nameContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconImg: { width: 100, height: 100, borderRadius: 50 },
  subNameText: { fontWeight: "bold", marginLeft: 10, fontSize: 35 },
});

export default SubSidebar;
