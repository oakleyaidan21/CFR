import React from "react";
import { View } from "react-native";
import Text from "./Text";

type Props = {
  text: string | null;
  backgroundColor: string;
  textColor: string;
};

const Flair: React.FC<Props> = (props) => {
  const bc = props.backgroundColor === "" ? "#00af64" : props.backgroundColor;
  return props.text ? (
    <View style={{ backgroundColor: bc, padding: 2, borderRadius: 3 }}>
      <Text
        style={{
          fontSize: 13,
          color:
            props.textColor !== "dark" || props.backgroundColor === ""
              ? "white"
              : "black",
        }}
        numberOfLines={1}>
        {props.text}
      </Text>
    </View>
  ) : null;
};

export default Flair;
