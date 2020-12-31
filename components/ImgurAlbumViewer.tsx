import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { getAlbum } from "../util/imgur/imgurFunctions";
import GalleryViewer from "./GalleryViewer";

type Props = {
  imgurHash: string;
};

const ImgurAlbumViewer: React.FC<Props> = (props) => {
  const [images, setImages] = useState([]);
  const [gettingImages, setGettingImages] = useState(false);

  const getImages = useCallback(() => {
    setGettingImages(true);
    getAlbum(props.imgurHash).then((data: string) => {
      const imgs = JSON.parse(data).data.images.map((i: any) => {
        return {
          uri: i.link,
        };
      });
      setImages(imgs);
      setGettingImages(false);
    });
  }, []);

  return images.length == 0 ? (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      disabled={gettingImages}
      onPress={getImages}>
      <Icon name="insert-photo" color="grey" size={200} />
      <Text style={{ color: "grey" }}>Tap to get images</Text>
    </TouchableOpacity>
  ) : (
    <GalleryViewer images={images} />
  );
};

export default ImgurAlbumViewer;
