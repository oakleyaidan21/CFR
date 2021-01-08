import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import TempTabBarIndicator from "./animations/TempTabBarIndicator";

const wh = Dimensions.get("window").height;
const sh = Dimensions.get("screen").height;

const TabBar: React.FC<any> = (props) => {
  const { state, navigation } = props;
  const { index } = state;
  const [positions, setPositions] = useState<Array<number>>([0, 0, 0, 0, 0]);

  const iconName = (name: string) => {
    switch (name) {
      case "Home": {
        return "home";
      }
      case "Explore": {
        return "explore";
      }
      case "CreatePost": {
        return "add";
      }
      case "Profile": {
        return "account-box";
      }
      case "Inbox": {
        return "mail";
      }
      default: {
        return "close";
      }
    }
  };

  return (
    <View style={s.absoluteContainer}>
      <View style={s.container}>
        <View style={s.iconGroupContainer}>
          {state.routes.map((route: { name: string }, i: number) => {
            const focused = index === i;
            const { name } = route;

            return (
              <TouchableOpacity
                onLayout={(event) => {
                  let newPositions = positions;
                  newPositions[i] = event.nativeEvent.layout.x;
                  setPositions(newPositions);
                }}
                key={name}
                style={s.tabBarIconContainer}
                onPress={() => {
                  navigation.navigate(name);
                }}>
                <Icon
                  name={iconName(name)}
                  color={focused ? "white" : "grey"}
                  size={30}
                />
                {focused && <TempTabBarIndicator />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  absoluteContainer: {
    height: wh === sh ? (Platform.OS === "android" ? 75 : 70) : 105,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  iconGroupContainer: {
    width: 350,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    overflow: "visible",
  },
  tabBarIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  newDot: {
    position: "absolute",
    top: 10,
    right: 8,
  },
});

export default TabBar;
