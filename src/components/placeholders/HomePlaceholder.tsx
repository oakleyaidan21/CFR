import React from "react";
import { StyleSheet, View } from "react-native";
import { POST_ITEM_HEIGHT } from "../../constants/constants";
import PlaceholderContainer from "./PlaceholderContainer";

const HomePlaceholder = () => {
  return (
    <PlaceholderContainer style={{ flex: 1, padding: 10 }} flash={true}>
      <View style={s.block} />
      <View style={s.block} />
      <View style={s.block} />
      <View style={s.block} />
      <View style={s.block} />
      <View style={s.block} />
      <View style={s.block} />
      <View style={s.block} />
      <View style={s.block} />
    </PlaceholderContainer>
  );
};

const s = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  line: {
    width: "100%",
    height: 20,
    marginBottom: 10,
    borderRadius: 3,
  },
  block: {
    width: "100%",
    height: POST_ITEM_HEIGHT,
    marginBottom: 10,
    borderRadius: 3,
  },
});

export default HomePlaceholder;
