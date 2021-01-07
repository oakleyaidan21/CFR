import React, { memo } from "react";
import { View } from "react-native";
import Video from "react-native-video";

type Props = {
  source: string;
  play: boolean;
};

const SimpleVideo: React.FC<Props> = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{ uri: props.source }}
        style={{ flex: 1 }}
        resizeMode={"cover"}
        paused={!props.play}
        poster={"http://clipart-library.com/images/8T65a4KGc.png"}
        posterResizeMode={"contain"}
        repeat={false}
        muted={true}
      />
    </View>
  );
};

function propsAreEqual(prevProps: Props, nextProps: Props) {
  return prevProps.source == nextProps.source;
}

export default memo(SimpleVideo, propsAreEqual);
