import React, { useContext, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { TAB_CONTAINER_HEIGHT } from "../constants/constants";
import SnooContext from "../context/SnooContext";
import TabBarIndicator from "./animations/TabBarIndicator";
import UnreadDot from "./animations/UnreadDot";

const wh = Dimensions.get("window").height;
const sh = Dimensions.get("screen").height;

const TabBar: React.FC<any> = (props) => {
  const { state, navigation } = props;
  const { index } = state;
  const { unreadInbox } = useContext(SnooContext);
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
                {focused && <TabBarIndicator />}
                {name == "Inbox" && unreadInbox && unreadInbox.length > 0 && (
                  <View style={s.dotContainer}>
                    <UnreadDot color="#00af64" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  absoluteContainer: {
    height: TAB_CONTAINER_HEIGHT,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  container: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  iconGroupContainer: {
    maxWidth: 350,
    flex: 1,
    height: 50,
    marginHorizontal: 10,
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
  dotContainer: {
    position: "absolute",
    top: 10,
    right: 8,
  },
});

export default TabBar;
