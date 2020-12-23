import React from "react";
import { View } from "react-native";
import ImageView from "react-native-image-viewing";

type Props = {
  visible: boolean;
  images: Array<{ uri: string }>;
  close: any;
};

const ImageViewer: React.FC<Props> = (props) => {
  return (
    <ImageView
      {...props}
      imageIndex={0}
      onRequestClose={props.close}
      swipeToCloseEnabled={true}
    />
  );
};

export default ImageViewer;
