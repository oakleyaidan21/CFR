import React, { useState } from "react";
import { Text } from "react-native";

type Props = {
  node: any;
};

const SpoilerText: React.FC<Props> = (props) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  return (
    <Text
      style={{
        color: showSpoiler ? "black" : "lightgrey",
        backgroundColor: "lightgrey",
      }}
      onPress={() => setShowSpoiler(!showSpoiler)}>
      {props.node.children[0].data}
    </Text>
  );
};

export default SpoilerText;
