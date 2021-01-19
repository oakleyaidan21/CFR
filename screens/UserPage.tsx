import React from "react";
import { Text, View } from "react-native";
import { RedditUser } from "snoowrap";
import StandardHeader from "../components/StandardHeader";
import User from "./User";

type Props = {
  route: { params: { userData: RedditUser } };
  navigation: any;
};

const UserPage: React.FC<Props> = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <StandardHeader navigation={props.navigation} relative />
      <User
        userData={props.route.params.userData}
        navigation={props.navigation}
      />
    </View>
  );
};

export default UserPage;
