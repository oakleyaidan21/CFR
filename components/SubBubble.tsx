import React, { memo } from "react";
import { View } from "react-native";
import Text from "./style/Text";

type Props = {
  sub: any;
};

const SubBubble: React.FC<Props> = (props) => {
  return (
    <View
      style={{
        marginHorizontal: 5,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: "grey",
          borderRadius: 25,
        }}
      />
      <View
        style={{ width: 50, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 10 }} numberOfLines={1}>
          {props.sub}
        </Text>
      </View>
    </View>
  );
};

export default memo(SubBubble);
