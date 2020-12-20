import { Text } from "react-native";
import React from "react";

type Props = any;

const CFRText: React.FC<Props> = (props) => {
  const color = props.style
    ? props.style.color
      ? props.style.color
      : "white"
    : "white";
  return (
    <Text
      {...props}
      style={{
        ...props.style,
        color: color,
      }}>
      {props.children}
    </Text>
  );
};

export default CFRText;
