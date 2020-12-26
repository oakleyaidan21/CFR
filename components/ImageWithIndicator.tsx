import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
import FastImage from "react-native-fast-image";

type Props = {
  source: any;
  style: any;
  resizeMode: any;
};

const WINDOW_WIDTH = Dimensions.get("window").width;

const ImageWithIndicator: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const loadAnimation = useRef(new Animated.Value(0)).current;

  const onLoadEnd = () => {
    setProgress(1);
  };

  const onProgress = (e: any) => {
    setProgress(e.nativeEvent.loaded / e.nativeEvent.total);
  };

  useEffect(() => {
    Animated.timing(loadAnimation, {
      toValue: progress,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <View style={{ ...props.style }}>
      <FastImage {...props} onLoadEnd={onLoadEnd} onProgress={onProgress} />
      {progress !== 1 && (
        <Animated.View
          style={{
            position: "absolute",
            top: -5,
            height: 2,
            left: WINDOW_WIDTH / 2 - 110,
            width: 200,
            backgroundColor: "#00af64",
            transform: [{ scaleX: progress }],
          }}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  progressBar: {
    position: "absolute",
    top: 0,
    backgroundColor: "#00af64",
    height: 2,
    width: WINDOW_WIDTH,
  },
});

export default ImageWithIndicator;
