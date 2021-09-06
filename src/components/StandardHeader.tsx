import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { HEADER_HEIGHT } from "../constants/constants";
import Text from "./style/Text";

type Props = {
  navigation: any;
  relative?: boolean;
  label?: string;
  safe?: boolean;
  content?: any;
  backgroundColor?: string;
};

const StandardHeader: React.FC<Props> = (props) => {
  return (
    <View
      style={[
        !props.safe ? s.paddingContainer : {},
        {
          position: props.relative ? "relative" : "absolute",
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : "rgba(0,0,0,0.8)",
        },
      ]}>
      <View style={s.container}>
        <Icon
          name="arrow-back"
          color="white"
          onPress={props.navigation.goBack}
        />
        {props.label && (
          <Text style={{ fontWeight: "bold", marginLeft: 15, fontSize: 20 }}>
            {props.label}
          </Text>
        )}
        {props.content && props.content}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  paddingContainer: {
    height: HEADER_HEIGHT,
    justifyContent: "flex-end",
    position: "absolute",
    width: "100%",
    top: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  container: {
    width: "100%",
    height: 60,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});

export default StandardHeader;
