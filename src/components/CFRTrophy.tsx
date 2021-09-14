import React from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Trophy } from "snoowrap";
import Text from "./style/Text";

type Props = {
  trophyData: Trophy;
};

const CFRTrophy: React.FC<Props> = (props) => {
  const { trophyData } = props;
  return (
    <View style={s.container}>
      <FastImage style={s.image} source={{ uri: trophyData.icon_70 }} />
      <Text style={{ fontWeight: "bold", textAlign: "center" }}>
        {trophyData.name}
      </Text>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
    width: 100,
    margin: 5,
  },
  image: {
    width: 70,
    marginBottom: 10,
    height: 70,
    borderRadius: 35,
    alignSelf: "center",
  },
});

export default CFRTrophy;
