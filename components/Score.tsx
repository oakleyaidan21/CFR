import React from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { Submission } from "snoowrap";

type Props = {
  data: any;
  iconSize: number;
};

const Score: React.FC<Props> = (props) => {
  const { data } = props;
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Icon
        name="forward"
        color="grey"
        size={props.iconSize}
        style={{ transform: [{ rotate: "270deg" }] }}
      />
      <Text
        style={{
          color: "grey",
          fontWeight: "bold",
          marginHorizontal: 10,
        }}>
        {data.score > 9999
          ? (data.score / 1000).toPrecision(3) + "k"
          : data.score}
      </Text>
      <Icon
        name="forward"
        color="grey"
        size={props.iconSize}
        style={{ transform: [{ rotate: "90deg" }] }}
      />
    </View>
  );
};

export default Score;
