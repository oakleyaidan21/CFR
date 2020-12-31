import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

const TempTabBarIndicator: React.FC = (props) => {
  const expandAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(expandAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.elastic(1),
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: 50,
        height: 5,
        borderRadius: 2,
        position: "absolute",
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

export default TempTabBarIndicator;
