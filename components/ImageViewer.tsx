import React from "react";
import { View, Vibration, Alert } from "react-native";
import ImageView from "react-native-image-viewing";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type Props = {
  visible: boolean;
  images: Array<{ uri: string }>;
  close: any;
};

const ImageViewer: React.FC<Props> = (props) => {
  const download = () => {
    console.log("impl!");
  };

  const onLongPress = () => {
    ReactNativeHapticFeedback.trigger("impactLight", options);
    Alert.alert("Download Image", "Would you like to download this image?", [
      { text: "Cancel", style: "cancel" },
      { text: "Download", onPress: download },
    ]);
  };

  return (
    <ImageView
      {...props}
      imageIndex={0}
      onLongPress={onLongPress}
      onRequestClose={props.close}
      swipeToCloseEnabled={true}
    />
  );
};

export default ImageViewer;
