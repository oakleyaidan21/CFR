import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import Flash from "./animations/Flash";
import Text from "./style/Text";

type Props = {
  fetchingMore: boolean;
};

const PostScrollerFooter: React.FC<Props> = (props) => {
  return (
    <Flash flashing={props.fetchingMore}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 100,
          marginBottom: 50,
        }}>
        <Text style={{ color: "grey" }}>Getting more posts...</Text>
      </View>
    </Flash>
  );
};

export default PostScrollerFooter;
