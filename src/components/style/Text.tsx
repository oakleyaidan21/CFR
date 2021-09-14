import { Platform, Text, TextProps } from "react-native";
import React from "react";
import { OS } from "../../constants/constants";

type Props = TextProps;

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
        // fontFamily: OS == "android" ? "roboto" : "San Fransisco",
      }}>
      {props.children}
    </Text>
  );
};

export default CFRText;
