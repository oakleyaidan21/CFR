import React from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";
import MainNavigator from "./navigation/MainNavigator";

const CFR: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <MainNavigator />
    </SafeAreaView>
  );
};

export default CFR;
