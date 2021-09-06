import React, { useCallback } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Text from "./style/Text";
import ImageView from "react-native-image-viewing";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { HEADER_HEIGHT, OS } from "../constants/constants";

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

  const renderFooter = useCallback(({ imageIndex }) => {
    return props.images.length > 1 ? (
      <View style={s.footerContainer}>
        <View style={s.indexContainer}>
          <Text style={s.indexText}>
            {imageIndex + 1 + "/" + props.images.length}
          </Text>
        </View>
      </View>
    ) : null;
  }, []);

  return (
    <ImageView
      {...props}
      imageIndex={0}
      onLongPress={onLongPress}
      onRequestClose={props.close}
      swipeToCloseEnabled={OS == "ios"}
      FooterComponent={renderFooter}
    />
  );
};

const s = StyleSheet.create({
  footerContainer: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
  },
  indexContainer: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 3,
  },
  indexText: { fontWeight: "bold", fontSize: 20 },
});

export default ImageViewer;
