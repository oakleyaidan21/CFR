import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const START_VALUE = 0.0;
const END_VALUE = 1.0;

const PlaceholderContainer: React.FC<any> = (props) => {
  const flashAnimation = useRef(new Animated.Value(START_VALUE));

  const start = (end: number) => {
    Animated.timing(flashAnimation.current, {
      toValue: end,
      duration: 300,
      useNativeDriver: true,
    }).start((e) => {
      if (e.finished) {
        start(end === 1.0 ? 0.0 : 1.0);
      }
    });
  };

  useEffect(() => {
    start(0);
  }, []);

  const interp = flashAnimation.current.interpolate({
    inputRange: [START_VALUE, END_VALUE],
    outputRange: [0.4, 1.0],
  });

  return (
    <Animated.View
      {...props}
      style={{
        ...props.style,
        opacity: props.flash ? interp : 1,
      }}>
      {React.Children.map(props.children, (child) => {
        return React.cloneElement(child, {
          style: { backgroundColor: "grey", ...child.props.style },
        });
      })}
    </Animated.View>
  );
};

export default PlaceholderContainer;
