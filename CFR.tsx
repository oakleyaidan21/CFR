import React, { useState, useEffect } from "react";
import { View, StatusBar } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import MainNavigator from "./src/navigation/MainNavigator";
import SnooContext from "./src/context/SnooContext";
import {
  handleTokenChange,
  sortSubs,
} from "./src/util/snoowrap/snoowrapFunctions";
import SplashScreen from "react-native-splash-screen";
import Snoowrap, { RedditUser, Subreddit } from "snoowrap";

const CFR: React.FC = () => {
  const { refreshToken, authCode, users } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  const [snoowrap, setSnoowrap] = useState<Snoowrap | null>(null);
  const [user, setUser] = useState<RedditUser | null>(null);
  const [userSubs, setUserSubs] = useState<Array<Subreddit>>([]);
  const [unreadInbox, setUnreadInbox] = useState<Array<any>>([]);

  useEffect(() => {
    handleTokenChange(authCode, refreshToken, dispatch, users).then(
      (result) => {
        setSnoowrap(result?.snoowrap);
        setUser(result.user);
        setUnreadInbox(result.unreadMessages);
        if (result.subs) {
          sortSubs(result.subs);
        }
        setUserSubs(result.subs);
        SplashScreen.hide();
      },
    );
  }, [authCode, refreshToken]);

  return (
    <SnooContext.Provider
      value={{
        snoowrap: snoowrap,
        setSnoowrap: setSnoowrap,
        user: user,
        setUser: setUser,
        userSubs: userSubs,
        setUserSubs: setUserSubs,
        unreadInbox: unreadInbox,
        setUnreadInbox: setUnreadInbox,
      }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        {snoowrap ? <MainNavigator /> : null}
      </View>
    </SnooContext.Provider>
  );
};

export default CFR;
