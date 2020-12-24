import React, { useRef, useState } from "react";
import { StyleSheet, View, Dimensions, ActivityIndicator } from "react-native";
import { Bar } from "react-native-progress";
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

  const onLoadEnd = () => {
    setLoading(false);
  };

  const onProgress = (e: any) => {
    setProgress(e.nativeEvent.loaded / e.nativeEvent.total);
  };

  return (
    <View style={{ ...props.style }}>
      <FastImage {...props} onLoadEnd={onLoadEnd} onProgress={onProgress} />
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: WINDOW_WIDTH / 2 - 110,
          }}>
          <Bar progress={progress} width={200} color="green" />
        </View>
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
    width: WINDOW_WIDTH,
  },
});

export default ImageWithIndicator;
