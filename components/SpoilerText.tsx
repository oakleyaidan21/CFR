import React, { useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import HTMLView from "react-native-htmlview";
import Text from "./style/Text";

type Props = {
  node: any;
};

const SpoilerText: React.FC<Props> = (props) => {
  const [showSpoiler, setShowSpoiler] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => setShowSpoiler(true)}>
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
