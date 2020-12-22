import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import Text from "./style/Text";

type Props = {
  fetchingMore: boolean;
};

const PostScrollerFooter: React.FC<Props> = (props) => {
  const flashAnimation = useRef(new Animated.Value(0)).current;

  const flash = (end: number) => {
    Animated.timing(flashAnimation, {
      toValue: end,
      duration: 400,
      useNativeDriver: true,
    }).start((e) => {
      if (e.finished) {
        if (props.fetchingMore) {
          flash(end === 1 ? 0 : 1);
        }
      }
    });
  };

  useEffect(() => {
    if (props.fetchingMore) {
      flash(1);
    } else {
      flashAnimation.setValue(1);
    }
  }, [props.fetchingMore]);

  return (
    <Animated.View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: 100,
        marginBottom: 50,
        opacity: flashAnimation,
      }}>
      <Text style={{ color: "grey" }}>Getting more posts...</Text>
    </Animated.View>
  );
};

export default PostScrollerFooter;
