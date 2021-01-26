import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { RedditUser } from "snoowrap";
import Text from "../components/style/Text";
import UserTabs from "../components/user_related/UserTabs";
import { TAB_CONTAINER_HEIGHT } from "../constants/constants";
import { getTimeSincePosted } from "../util/util";

type Props = {
  userData: RedditUser;
  navigation: any;
};

const User: React.FC<Props> = (props) => {
  const { userData } = props;

  const renderHeader = useCallback(() => {
    return (
      <View style={s.headerContainer}>
        <FastImage source={{ uri: userData.icon_img }} style={s.profilePic} />
        <View style={s.userInfoContainer}>
          <Text style={s.usernameText}>{userData.name}</Text>
          <Text style={s.ageText}>
            user since {getTimeSincePosted(userData.created_utc)} ago
          </Text>
          <Text style={s.linkKarmaText}>
            {userData.link_karma + userData.comment_karma} link karma
          </Text>
        </View>
      </View>
    );
  }, [userData]);

  return (
    <View style={s.container}>
      {renderHeader()}
      {/* TAB CONTENT */}
      <UserTabs user={userData} navigation={props.navigation} />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(20,20,20)" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(10,10,10)",
    padding: 10,
  },
  profilePic: { width: 80, height: 80, borderRadius: 40 },
  userInfoContainer: { justifyContent: "center", marginLeft: 10 },
  usernameText: { fontWeight: "bold", fontSize: 20 },
  ageText: { color: "grey", fontWeight: "normal" },
  linkKarmaText: { color: "grey" },
  commentKarmaText: { color: "grey" },
  tabContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgb(10,10,10)",
  },
  defaultContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: TAB_CONTAINER_HEIGHT,
  },
  emptyListContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default User;
