import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Subreddit } from "snoowrap";
import MDRenderer from "../components/MDRenderer";
import StandardHeader from "../components/StandardHeader";
import Text from "../components/style/Text";
import { HEADER_HEIGHT } from "../constants/constants";
import { parseLink } from "../util/util";

type Props = {
  route: { params: { subData: Subreddit } };
  navigation: any;
};

const SubSidebar: React.FC<Props> = (props) => {
  const { subData } = props.route.params;

  const [showDescription, setShowDescription] = useState(false);
  const [subscribed, setSubscribed] = useState(subData.user_is_subscriber);
  const [changingSubscription, setChangingSubscription] = useState(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("transitionEnd", () => {
      setShowDescription(true);
    });
    return unsubscribe;
  }, [props.navigation]);

  const toggleSubscribed = useCallback(() => {
    setChangingSubscription(true);
    if (subscribed) {
      subData.unsubscribe().then(() => {
        setChangingSubscription(false);
        setSubscribed(false);
      });
    } else {
      subData.subscribe().then(() => {
        setChangingSubscription(false);
        setSubscribed(true);
      });
    }
  }, [subscribed]);

  const iconImg = subData.icon_img
    ? subData.icon_img
    : subData.community_icon
    ? subData.community_icon
    : "https://cdn.iconscout.com/icon/free/png-256/reddit-74-434748.png";

  const bannerImage = subData.banner_img ? subData.banner_img : false;

  const openLink = useCallback(
    (url) => {
      // check if it's a reddit post
      const r = parseLink(url);
      switch (r.type) {
        case "post":
          props.navigation.navigate("LoadPost", { id: r.id });
          break;
        case "sub":
          props.navigation.navigate("Subreddit", { data: r.sub });
          break;
        default:
          props.navigation.navigate("Web", { url: url });
          break;
      }
    },

    [],
  );

  const showBannerColor = subData.banner_background_color.length > 0;

  return (
    <View style={s.container}>
      <ScrollView style={s.scrollContainer} bounces={false}>
        {bannerImage ? (
          <FastImage
            style={s.bannerContainer}
            source={{
              uri: bannerImage,
            }}
            resizeMode={"cover"}
          />
        ) : showBannerColor ? (
          <View
            style={[
              s.bannerContainer,
              {
                backgroundColor: subData.banner_background_color,
              },
            ]}
          />
        ) : (
          <View style={s.emptyBannerContainer} />
        )}

        <View style={s.infoContainer}>
          <View style={s.nameContainer}>
            <FastImage style={s.iconImg} source={{ uri: iconImg }} />
            <View style={s.subNameInfo}>
              <Text style={s.subNameText} numberOfLines={1}>
                {subData.display_name}
              </Text>
              <Text style={s.numSubscriberText}>
                {subData.subscribers} subscribers
              </Text>
              <TouchableOpacity
                style={s.subscribeButton}
                onPress={toggleSubscribed}>
                <Text style={s.subscribedText}>
                  {subscribed ? "Unsubscribe" : "Subscribe"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {showDescription ? (
            <MDRenderer
              data={subData.description_html}
              onLinkPress={openLink}
            />
          ) : (
            <View style={s.activityIndicatorContainer}>
              <ActivityIndicator color="white" size="large" />
            </View>
          )}
        </View>
      </ScrollView>
      <StandardHeader
        navigation={props.navigation}
        backgroundColor="transparent"
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  topMargin: { marginTop: HEADER_HEIGHT },
  scrollContainer: { flex: 1 },
  scrollContentContainer: { padding: 10 },
  bannerContainer: { width: "100%", height: HEADER_HEIGHT + 50 },
  subNameInfo: { paddingLeft: 10, width: "100%" },
  nameContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "white",
  },
  subNameText: { fontWeight: "bold", fontSize: 30 },
  numSubscriberText: { marginVertical: 5 },
  subscribedText: { fontWeight: "bold" },
  subscribeButton: {
    padding: 5,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: 110,

    flexDirection: "row",
  },
  activityIndicatorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: { padding: 10, width: "100%" },
  emptyBannerContainer: { marginTop: HEADER_HEIGHT },
});

export default SubSidebar;
