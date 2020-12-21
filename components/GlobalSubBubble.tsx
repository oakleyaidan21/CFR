import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import Text from "./style/Text";

type Props = {
  sub: any;
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
    <View style={s.container}>
      <View style={s.icon}>
        <Icon name={getIcon(props.sub)} color="white" />
      </View>
      <View
        style={{ width: 50, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 10 }} numberOfLines={1}>
          {props.sub}
        </Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: "grey",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(GlobalSubBubble);
