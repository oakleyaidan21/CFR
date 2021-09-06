import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, StatusBar, Text, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import MainNavigator from "./src/navigation/MainNavigator";
import SnooContext from "./src/context/SnooContext";
import {
  getUserSubs,
  initializeDefaultSnoowrap,
  initializeSnoowrap,
  initializeUserSnoowrap,
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

  const getSubs = (r: Snoowrap) => {
    getUserSubs(r).then((subs: any) => {
      if (subs) {
        subs.sort((a: Subreddit, b: Subreddit) =>
          a.display_name.localeCompare(b.display_name, undefined, {
            sensitivity: "base",
          }),
        );
        setUserSubs(subs);
      }
    });
  };

  useEffect(() => {
    if (refreshToken) {
      initializeUserSnoowrap(refreshToken).then((r) => {
        console.log("creating snoowrap with refresh token");
        setSnoowrap(r);
        r.getMe().then((me: any) => {
          setUser(me);
          r.getUnreadMessages().then((ib) => setUnreadInbox(ib));
          SplashScreen.hide();
          getSubs(r);
        });
      });
    } else {
      if (!authCode) {
        console.log("creating default snoowrap");
        initializeDefaultSnoowrap().then((r) => {
          setSnoowrap(r);
          SplashScreen.hide();
        });
      } else {
        console.log("creating snoowrap with authCode", authCode);
        initializeSnoowrap(authCode).then((r: any) => {
          if (!r) {
            console.log("error in making user snoowrap; making default one");
            initializeDefaultSnoowrap().then((r) => {
              Alert.alert("Error logging in. Please try again");
              setSnoowrap(r);
              dispatch({ type: "SET_AUTH_CODE", code: null });
            });
            return;
          }
          let newUsers = users;
          r.getMe().then((me: any) => {
            r.getUnreadMessages().then((ib: any) => setUnreadInbox(ib));
            console.log("new refresh token:", r.refreshToken);
            newUsers[me.name] = r.refreshToken;
            setUser(me);
            dispatch({ type: "SET_USERS", users: newUsers });
            dispatch({
              type: "SET_REFRESH_TOKEN",
              refreshToken: r.refreshToken,
            });
            setSnoowrap(r);
            SplashScreen.hide();
            getSubs(r);
          });
        });
      }
    }
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
