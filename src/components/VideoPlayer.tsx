import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Icon } from "react-native-elements";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import Fade from "./animations/Fade";
import Text from "./style/Text";
import VideoPoster from "./VideoPoster";

type Props = {
  source: string;
  hasControls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  poster: string;
  navigation: any;
  canFullscreen: boolean;
  title?: string;
};

const VideoPlayer: React.FC<Props> = (props) => {
  const [paused, setPaused] = useState(!props.autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

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
    setCurrentVideoTime(duration);
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

  const onBuffer = (e: any) => {
    setIsBuffering(e.isBuffering);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => setShowControls(!showControls)}>
        <>
          <Video
            source={{ uri: props.source }}
            style={{ flex: 1 }}
            resizeMode={"contain"}
            paused={paused}
            selectedVideoTrack={{
              type: "resolution",
              value: 1080,
            }}
            fullscreen={fullscreen}
            onFullscreenPlayerDidDismiss={() => setFullscreen(false)}
            ref={videoRef}
            onReadyForDisplay={() => setIsLoaded(true)}
            repeat={false}
            onProgress={onProgress}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
            onSeek={onSeek}
            onEnd={onEnd}
            volume={props.muted ? 0 : 1}
            posterResizeMode={"contain"}
            onBuffer={onBuffer}
          />
          {!isLoaded && <VideoPoster source={props.poster} />}
        </>
      </TouchableWithoutFeedback>
      {/* CONTROLS */}
      {props.hasControls && (
        <Fade show={showControls} style={s.controlBarContainer}>
          <View style={s.controlBar}>
            <View style={{ width: 50, height: 50, justifyContent: "center" }}>
              {isBuffering ? (
                <ActivityIndicator color="white" />
              ) : (
                <TouchableOpacity
                  onPress={() => (finished ? replay() : setPaused(!paused))}>
                  <Icon
                    name={
                      finished ? "refresh" : paused ? "play-arrow" : "pause"
                    }
                    color="white"
                    size={50}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
              }}>
              <View style={{ width: 50, alignItems: "center" }}>
                <Text>
                  {Math.floor(currentVideoTime / 60) +
                    ":" +
                    (currentVideoTime % 60 < 10 ? "0" : "") +
                    Math.floor(currentVideoTime % 60)}
                </Text>
              </View>
              <Slider
                style={{ flex: 1 }}
                value={currentVideoTime}
                minimumValue={0}
                onValueChange={seekVideo}
                maximumValue={duration}
                minimumTrackTintColor={"#00af64"}
              />
              <View style={{ width: 50, alignItems: "center" }}>
                <Text>
                  {Math.floor(duration / 60) +
                    ":" +
                    (duration % 60 < 10 ? "0" : "") +
                    (duration % 60)}
                </Text>
              </View>
              {props.canFullscreen && (
                <TouchableOpacity
                  onPress={() =>
                    Platform.OS === "ios"
                      ? setFullscreen(true)
                      : props.navigation.navigate("RedditVideo", {
                          source: props.source,
                          poster: props.poster,
                          title: props.title,
                        })
                  }>
                  <Icon name={"aspect-ratio"} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Fade>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  controlBarContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  controlBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default VideoPlayer;
