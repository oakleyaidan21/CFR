import React, { memo, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import Video from "react-native-video";
import VideoPoster from "./VideoPoster";

type Props = {
  source: string;
  play: boolean;
  posterSource: string;
};

const SimpleVideo: React.FC<Props> = (props) => {
  const [showPoster, setShowPoster] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const onReadyForDisplay = useCallback(() => {
    setShowPoster(false);
  }, []);

  const onEnd = useCallback(() => {
    setShowReplay(true);
    setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    setShowReplay(false);
    videoRef.current?.seek(0);
  }, []);

  const onProgress = useCallback(() => {
    setPlaying(true);
  }, []);

  return (
    <View style={s.container}>
      <Video
        source={{ uri: props.source }}
        selectedVideoTrack={{
          type: "resolution",
          value: 480,
        }}
        ref={videoRef}
        onReadyForDisplay={onReadyForDisplay}
        onEnd={onEnd}
        onProgress={onProgress}
        progressUpdateInterval={700}
        style={s.container}
        resizeMode={"contain"}
        paused={!props.play}
        posterResizeMode={"contain"}
        repeat={false}
        muted={true}
      />
      <View style={s.absoluteIconsContainer}>
        <Icon name="volume-off" color="grey" />
      </View>
      {showPoster && <VideoPoster source={props.posterSource} />}
      {showReplay && (
        <View style={s.replayPosterContainer}>
          <TouchableOpacity onPress={replay}>
            <Icon name="replay" color="white" size={50} />
          </TouchableOpacity>
        </View>
      )}
      {playing && props.play && (
        <View style={s.playingIconContainer}>
          <ActivityIndicator color={"grey"} />
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  video: { flex: 1 },
  replayPosterContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playingIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  absoluteIconsContainer: {
    width: "100%",
    position: "absolute",
    top: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

function propsAreEqual(prevProps: Props, nextProps: Props) {
  return (
    prevProps.source == nextProps.source && prevProps.play == nextProps.play
  );
}

export default memo(SimpleVideo, propsAreEqual);
