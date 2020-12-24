import React, { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";

type Props = {
  source: any;
  style: any;
  resizeMode: any;
};

const ImageWithIndicator: React.FC<Props> = (props) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [showAnimation, setShowAnimation] = useState(false);

  const progress = (value: number) => {
    Animated.timing(progressAnimation, {
      toValue: value,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const onProgress = (e: any) => {
    progress(e.nativeEvent.loaded / e.nativeEvent.total);
  };

  const onLoadStart = () => {
    setShowAnimation(true);
  };

  const onLoadEnd = () => {
    setShowAnimation(false);
  };

  const width = progressAnimation.interpolate({
    inputRange: [0.0, 1.0],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View style={{ ...props.style }}>
      <FastImage
        {...props}
        onProgress={onProgress}
        onLoad={onLoadStart}
        onLoadEnd={onLoadEnd}
      />
      {showAnimation && (
        <Animated.View
          style={[s.progressBar, { transform: [{ scaleX: width }] }]}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  progressBar: {
    position: "absolute",
    top: 0,
    backgroundColor: "green",
    height: 2,
    width: 10,
  },
});

export default ImageWithIndicator;
