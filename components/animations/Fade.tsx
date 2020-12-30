import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

type Props = {
  show: Boolean;
  style?: any;
};

const Fade: React.FC<Props> = (props) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: props.show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [props.show]);

  return (
    <Animated.View style={{ opacity: fadeAnimation, ...props.style }}>
      {props.children}
    </Animated.View>
  );
};

export default Fade;
