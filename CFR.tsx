import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import MainNavigator from "./navigation/MainNavigator";
import SnooContext from "./context/SnooContext";
import {
  initializeDefaultSnoowrap,
  initializeSnoowrap,
  initializeUserSnoowrap,
} from "./util/snoowrap/snoowrapFunctions";
import Snoowrap from "snoowrap";

const CFR: React.FC = () => {
  const { refreshTokens, authCode } = useSelector((state: any) => state);
  useEffect(() => {
    // if (refreshTokens.length > 0) {
    //   initializeUserSnoowrap(refreshTokens[0]).then((r) => {
    //     setSnoowrap(r);
    //     //then get initial data
    //   });
    // } else {
    //   if(authCode) {
    //       console.log("creating default snoowrap");
    //       initializeDefaultSnoowrap().then((r) => {
    //           setSnoowrap(r);
    //           //get initial data
    //       })
    //   } else {
    //       console.log("creating new user snoowrap");
    //       initializeSnoowrap(authCode).then((r) => {

    //       })
    //   }
    // }

    //For now, let's just create a default snoowrap
    initializeDefaultSnoowrap().then((r) => {
      setSnoowrap(r);
    });
  }, []);

  const [snoowrap, setSnoowrap] = useState<Snoowrap | null>(null);
  const [user, setUser] = useState(null);

  return (
    <SnooContext.Provider
      value={{
        snoowrap: snoowrap,
        setSnoowrap: setSnoowrap,
        user: user,
        setUser: user,
      }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {snoowrap ? <MainNavigator /> : null}
      </SafeAreaView>
    </SnooContext.Provider>
  );
};

export default CFR;
