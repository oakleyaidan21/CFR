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

  const renderHeader = useCallback(({ imageIndex }) => {
    return props.images.length > 1 ? (
      <View style={s.headerContainer}>
        <Text style={s.indexText}>
          {imageIndex + "/" + props.images.length}
        </Text>
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
      HeaderComponent={renderHeader}
    />
  );
};

const s = StyleSheet.create({
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    top: HEADER_HEIGHT,
  },
  indexText: { fontWeight: "bold", fontSize: 20 },
});

export default ImageViewer;
