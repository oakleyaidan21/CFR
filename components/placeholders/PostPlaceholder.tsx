import React from "react";
import { ActivityIndicator, StyleSheet, View, Dimensions } from "react-native";
import { POST_ITEM_HEIGHT } from "../../constants/constants";
import StandardHeader from "../StandardHeader";
import PlaceholderContainer from "./PlaceholderContainer";

const PostPlaceholder = (props: { navigation: any }) => {
  return (
    <View style={{ flex: 1 }}>
      <StandardHeader navigation={props.navigation} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="white" size={"large"} />
      </View>
    </View>
    // <View style={{ height: h }}>
    //   <StandardHeader navigation={props.navigation} relative={true} />
    //   <PlaceholderContainer style={{ padding: 10 }} flash={true}>
    //     <View style={s.text} />
    //     <View style={s.image} />
    //     <View style={s.postFooter} />
    //     <View style={{ ...s.comment, height: 100 }} />
    //     <View style={{ ...s.comment, height: 70 }} />
    //     <View
    //       style={{
    //         ...s.comment,
    //         height: 70,
    //         width: "90%",
    //         alignSelf: "flex-end",
    //       }}
    //     />
    //     <View
    //       style={{
    //         ...s.comment,
    //         height: 50,
    //         width: "90%",
    //         alignSelf: "flex-end",
    //       }}
    //     />
    //     <View
    //       style={{
    //         ...s.comment,
    //         height: 50,
    //         width: "80%",
    //         alignSelf: "flex-end",
    //       }}
    //     />
    //     <View style={{ ...s.comment, height: 80 }} />
    //     <View
    //       style={{
    //         ...s.comment,
    //         height: 80,
    //         width: "90%",
    //         alignSelf: "flex-end",
    //       }}
    //     />
    //     <View style={{ ...s.comment, height: 80 }} />
    //   </PlaceholderContainer>
    // </View>
  );
};

const s = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  text: {
    width: "70%",
    height: 10,
    marginVertical: 5,
    borderRadius: 3,
  },
  line: {
    width: "100%",
    height: 20,
    marginBottom: 10,
    borderRadius: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 3,
  },

  textLine: {
    height: 8,
    borderRadius: 3,
    marginVertical: 10,
    marginLeft: 10,
  },
  postFooter: {
    width: "100%",
    height: 25,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 3,
  },
  comment: {
    width: "100%",
    marginVertical: 5,
    borderRadius: 3,
  },
});

export default PostPlaceholder;
