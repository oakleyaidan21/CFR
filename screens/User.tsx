import React, { useCallback } from "react";
import { FlatList, View } from "react-native";
import FastImage from "react-native-fast-image";
import { RedditUser } from "snoowrap";
import Text from "../components/style/Text";

type Props = {
  userData: RedditUser;
};

const User: React.FC<Props> = (props) => {
  const { userData } = props;
  const renderHeader = useCallback(() => {
    return (
      <View style={{ width: "100%" }}>
        <View style={{ padding: 10 }}>
          <FastImage
            source={{ uri: userData.icon_img }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            {userData.name}
          </Text>
          <Text style={{ color: "grey" }}>
            {userData.link_karma} link karma
          </Text>
          <Text style={{ color: "grey" }}>
            {userData.comment_karma} comment karma
          </Text>
        </View>
      </View>
    );
  }, [userData]);

  return (
    <FlatList
      style={{ flex: 1 }}
      data={[]}
      renderItem={null}
      ListHeaderComponent={renderHeader}
    />
  );
};

export default User;
