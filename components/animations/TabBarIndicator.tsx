import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type Props = {
  pos: any;
  name: string;
};

const TabBarIndicator: React.FC<Props> = (props) => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    moveIndicator();
  }, [props.pos]);

  const moveIndicator = () => {
    Animated.timing(moveAnim, {
      toValue: props.pos,
      duration: 200,
      easing: Easing.elastic(0.9),
      useNativeDriver: false,
    }).start();
  };

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
            translateX: moveAnim,
          },
        ],
      }}
    />
  );
};

export default TabBarIndicator;
