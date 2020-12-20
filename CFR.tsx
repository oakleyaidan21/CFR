import React from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";

const CFR: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Text style={{ color: "white" }}>Hi!</Text>
    </SafeAreaView>
  );
};

export default CFR;
