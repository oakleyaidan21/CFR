import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Text, View } from "react-native";
import { RedditUser } from "snoowrap";
import StandardHeader from "../components/StandardHeader";
import CFRText from "../components/style/Text";
import SnooContext from "../context/SnooContext";
import { getUserByName } from "../util/snoowrap/snoowrapFunctions";
import User from "./User";

type Props = {
  route: { params: { userName: string } };
  navigation: any;
};

const UserPage: React.FC<Props> = (props) => {
  const { snoowrap } = useContext(SnooContext);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (snoowrap) {
      getUserByName(snoowrap, props.route.params.userName)
        .then((user) => {
          setUserData(user);
        })
        .catch((error) => {
          setUserData(false);
        });
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StandardHeader
        navigation={props.navigation}
        relative
        backgroundColor={"rgb(10,10,10)"}
      />
      {userData ? (
        <User
          userData={userData}
          navigation={props.navigation}
          showUserTabs={true}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {userData == null ? (
            <ActivityIndicator color="white" />
          ) : (
            <CFRText style={{ color: "white" }}>
              Error getting user data
            </CFRText>
          )}
        </View>
      )}
    </View>
  );
};

export default UserPage;
