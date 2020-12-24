import React from "react";
import { View, Vibration, Alert } from "react-native";
import ImageView from "react-native-image-viewing";

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
    Vibration.vibrate();
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
