import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";

type Props = {
  flashing: boolean;
};

const Flash: React.FC<Props> = (props) => {
  const flashAnimation = useRef(new Animated.Value(0)).current;

  const flash = (end: number) => {
    Animated.timing(flashAnimation, {
      toValue: end,
      duration: 400,
      useNativeDriver: true,
    }).start((e) => {
      if (e.finished) {
        flash(end === 1 ? 0 : 1);
      }
    });
  };

  useEffect(() => {
    if (props.flashing) {
      flash(1);
    } else {
      flashAnimation.setValue(1);
      flashAnimation.stopAnimation(() => flashAnimation.setValue(0));
    }
  }, [props.flashing]);

  return (
    <Animated.View style={{ opacity: flashAnimation }}>
      {props.children}
    </Animated.View>
  );
};

export default Flash;
