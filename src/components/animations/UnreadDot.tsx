import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing } from "react-native";

type Props = {
  color: string;
};

const UnreadDot: React.FC<Props> = (props) => {
  const pulseAnimation = useRef(new Animated.Value(0));
  const fadeAnimation = useRef(new Animated.Value(1));

  const pulseStart = () => {
    pulseAnimation.current.setValue(0);
    fadeAnimation.current.setValue(1);
    Animated.sequence([
      Animated.timing(pulseAnimation.current, {
        toValue: 2,
        duration: 500,
        easing: Easing.elastic(0.9),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation.current, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start((e) => {
      if (e.finished) {
        pulseStart();
      }
    });
  };

  useEffect(() => {
    pulseStart();
  }, []);

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 40,

          borderColor: props.color,
          borderWidth: 1,
          opacity: fadeAnimation.current,
          transform: [
            {
              scaleX: pulseAnimation.current,
            },
            {
              scaleY: pulseAnimation.current,
            },
          ],
        }}
      />
      <Animated.View>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: props.color,
          }}
        />
      </Animated.View>
    </>
  );
};

export default UnreadDot;
