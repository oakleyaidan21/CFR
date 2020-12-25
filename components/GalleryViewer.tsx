import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import FastImage from "react-native-fast-image";
import ImageViewer from "./ImageViewer";
import ImageWithIndicator from "./ImageWithIndicator";

type Props = {
  images: Array<{ uri: string }>;
};

const GalleryViewer: React.FC<Props> = (props) => {
  const { images } = props;
  const [showGallery, setShowGallery] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {images.length > 0 && (
        <TouchableWithoutFeedback onPress={() => setShowGallery(true)}>
          <ImageWithIndicator
            source={{ uri: images[0].uri }}
            style={{ flex: 1 }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableWithoutFeedback>
      )}
      <ImageViewer
        visible={showGallery}
        images={images}
        close={() => setShowGallery(false)}
      />
      <View style={s.pageLength}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {images.length} images
        </Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  pageLength: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    borderRadius: 3,
  },
});

export default GalleryViewer;
