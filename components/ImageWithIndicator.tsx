import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Easing,
  Image,
} from "react-native";
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
    console.log("progress!!!!");
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
        <View style={s.progressBarContainer}>
          <Animated.View
            style={{
              height: 2,
              width: 200,
              backgroundColor: "#00af64",
              transform: [{ scaleX: progress }],
            }}
          />
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  progressBarContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageWithIndicator;
