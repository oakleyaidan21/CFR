import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

type Props = {
  relative?: boolean;
  width?: number;
};

const TabBarIndicator: React.FC<Props> = (props) => {
  const expandAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(expandAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      // easing: Easing.elastic(1),
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: props.width ? props.width : 50,
        height: 5,
        borderRadius: 2,
        position: props.relative ? "relative" : "absolute",
        bottom: 0,
        backgroundColor: "#00af64",
        transform: [
          {
            scaleX: expandAnimation,
          },
        ],
      }}
    />
  );
};

export default TabBarIndicator;
