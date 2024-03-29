import React from "react";
import { StyleSheet, View } from "react-native";
import { SUB_ITEM_HEIGHT } from "../../constants/constants";
import PlaceholderContainer from "./PlaceholderContainer";

const SearchSubsPlaceholder = () => {
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
    height: SUB_ITEM_HEIGHT,
    marginBottom: 10,
    borderRadius: 3,
  },
});

export default SearchSubsPlaceholder;
