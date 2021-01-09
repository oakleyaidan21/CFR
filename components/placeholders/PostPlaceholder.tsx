import React from "react";
import { ActivityIndicator, StyleSheet, View, Dimensions } from "react-native";
import { POST_ITEM_HEIGHT } from "../../constants/constants";
import PlaceholderContainer from "./PlaceholderContainer";

const h = Dimensions.get("window").height;

const PostPlaceholder: React.FC = (props) => {
  return (
    <View style={{ height: h, marginTop: 100 }}>
      <PlaceholderContainer style={{ padding: 10 }} flash={true}>
        <View
          style={{
            width: "70%",
            height: 10,
            marginVertical: 5,
            borderRadius: 3,
          }}
        />
        <View style={{ width: 100, height: 100, borderRadius: 3 }} />

        <View
          style={{
            width: "100%",
            height: 25,
            marginVertical: 10,
            borderRadius: 3,
          }}
        />
      </PlaceholderContainer>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <ActivityIndicator color="white" />
      </View>
    </View>
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
  textLine: {
    height: 8,
    borderRadius: 3,
    marginVertical: 10,
    marginLeft: 10,
  },
});

export default PostPlaceholder;
