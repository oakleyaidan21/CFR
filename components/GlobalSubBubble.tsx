import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import Text from "./style/Text";

type Props = {
  sub: any;
  size: number;
  onPress: any;
  hideText?: boolean;
};

const GlobalSubBubble: React.FC<Props> = (props) => {
  const getIcon = (name: string) => {
    switch (name) {
      case "Front Page":
        return "web";
      case "All":
        return "group-work";
      case "Saved":
        return "grade";
      case "Popular":
        return "local-fire-department";
      default:
        return "closed";
    }
  };

  return (
    <TouchableOpacity style={s.container} onPress={props.onPress}>
      <View
        style={[
          s.icon,
          {
            width: props.size,
            height: props.size,
            borderRadius: props.size / 2,
          },
        ]}>
        <Icon name={getIcon(props.sub)} color="white" />
      </View>
      {!props.hideText && (
        <View style={s.textContainer}>
          <Text style={{ fontSize: 10, fontWeight: "bold" }} numberOfLines={1}>
            {props.sub}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});

export default memo(GlobalSubBubble);
