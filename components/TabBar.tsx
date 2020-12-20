import React, { useContext, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import TabBarIndicator from "./animations/TabBarIndicator";

const TabBar: React.FC<any> = (props) => {
  const { state, navigation } = props;
  const { index } = state;
  const [positions, setPositions] = useState<Array<number>>([0, 0, 0, 0, 0]);

  const iconName = (name: string) => {
    switch (name) {
      case "Home": {
        return "home";
      }
      case "Search": {
        return "search";
      }
      case "CreatePost": {
        return "add";
      }
      default: {
        return "close";
      }
    }
  };

  return (
    <View style={s.container}>
      <View style={s.iconGroupContainer}>
        <TabBarIndicator
          pos={positions[index]}
          name={iconName(state.routes[index].name)}
        />
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
            </TouchableOpacity>
          );
        })}
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
