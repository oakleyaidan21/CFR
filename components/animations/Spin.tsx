import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

type Props = {
  spinning: boolean;
};

const Spin: React.FC<Props> = (props) => {
  const spinAnimation = useRef(new Animated.Value(0)).current;

  const spin = () => {
    Animated.timing(spinAnimation, {
      toValue: 1,
      duration: 700,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start((e) => {
      if (e.finished) {
        spinAnimation.setValue(0);
        spin();
      }
    });
  };

  const interp = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    if (props.spinning) {
      spin();
    } else {
      spinAnimation.stopAnimation(() => spinAnimation.setValue(0));
    }
  }, [props.spinning]);

  return (
    <Animated.View style={{ transform: [{ rotate: interp }] }}>
      {props.children}
    </Animated.View>
  );
};

export default Spin;
