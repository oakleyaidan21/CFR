import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { Icon } from "react-native-elements";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";

type Props = {
  source: string;
};

const VideoPlayer: React.FC<Props> = (props) => {
  const [paused, setPaused] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<Video>(null);

  const onProgress = (data: any) => {
    if (!isLoading) {
      setCurrentVideoTime(data.currentTime);
    }
  };

  const onLoad = (data: any) => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => {
    setFinished(true);
    setPaused(true);
  };

  const onSeek = (data: any) => {};

  const replay = () => {
    setFinished(false);
    setPaused(false);
    videoRef.current?.seek(0);
  };

  const seekVideo = (value: number) => {
    videoRef.current?.seek(value);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => setShowControls(!showControls)}>
        <Video
          source={{ uri: props.source }}
          style={{ flex: 1 }}
          resizeMode={"contain"}
          paused={paused}
          ref={videoRef}
          repeat={false}
          onProgress={onProgress}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onSeek={onSeek}
          onEnd={onEnd}
        />
      </TouchableWithoutFeedback>
      {/* CONTROLS */}
      {showControls && (
        <View style={s.controlBar}>
          <Icon
            name={finished ? "refresh" : paused ? "play-arrow" : "pause"}
            color="white"
            onPress={() => (finished ? replay() : setPaused(!paused))}
          />
          <Slider
            style={{ flex: 1 }}
            value={currentVideoTime}
            minimumValue={0}
            onValueChange={seekVideo}
            maximumValue={duration}
            minimumTrackTintColor={"#00af64"}
          />
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  controlBar: {
    position: "absolute",
    bottom: 0,
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default VideoPlayer;
