import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Text from "./style/Text";

type Props = {
  navigation: any;
  relative?: boolean;
  label?: string;
};

const StandardHeader: React.FC<Props> = (props) => {
  return (
    <View
      style={[
        s.paddingContainer,
        { position: props.relative ? "relative" : "absolute" },
      ]}>
      <View style={s.container}>
        <Icon
          name="arrow-back"
          color="white"
          onPress={props.navigation.goBack}
        />
        {props.label && (
          <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
            {props.label}
          </Text>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  paddingContainer: {
    height: 60 + getStatusBarHeight(),
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
