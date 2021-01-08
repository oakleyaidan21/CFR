import React, { memo, useCallback, useState } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import Video from "react-native-video";
import VideoPoster from "./VideoPoster";

type Props = {
  source: string;
  play: boolean;
  posterSource: string;
};

const SimpleVideo: React.FC<Props> = (props) => {
  const [showPoster, setShowPoster] = useState(true);

  const onReadyForDisplay = useCallback(() => {
    setShowPoster(false);
  }, []);

  const onEnd = useCallback(() => {
    setShowPoster(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{ uri: props.source }}
        selectedVideoTrack={{
          type: "resolution",
          value: 480,
        }}
        onReadyForDisplay={onReadyForDisplay}
        onEnd={onEnd}
        style={{ flex: 1 }}
        resizeMode={"cover"}
        paused={!props.play}
        posterResizeMode={"contain"}
        repeat={false}
        muted={true}
      />
      {showPoster && <VideoPoster source={props.posterSource} />}
    </View>
  );
};

function propsAreEqual(prevProps: Props, nextProps: Props) {
  return (
    prevProps.source == nextProps.source && prevProps.play == nextProps.play
  );
}

export default memo(SimpleVideo, propsAreEqual);
