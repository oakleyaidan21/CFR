import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Alert, Text } from "react-native";
import HTMLView from "react-native-htmlview";

type Props = {
  node: any;
};

const SpoilerText: React.FC<Props> = (props) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Alert.alert("Spoiler", props.node.children[0].data);
        setShowSpoiler(true);
      }}>
      <View
        style={{ alignItems: "center", backgroundColor: "rgb(200,200,200)" }}>
        <Text style={{ color: showSpoiler ? "black" : "rgb(200,200,200)" }}>
          {props.node.children[0].data}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SpoilerText;
