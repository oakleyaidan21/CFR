import { request } from "https";
import React, { useState } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { gfyConfig } from "../util/gfy/gfyConfig";
import Text from "./style/Text";
import VideoPlayer from "./VideoPlayer";

type Props = {
  url: String;
};

const GyfyPlayer: React.FC<Props> = (props) => {
  const { url } = props;

  const [gfyDetails, setGyfyDetails] = useState(null);
  const [errored, setErrored] = useState(false);

  const tokens = url.split("/");
  const gfyId = tokens[tokens.length - 1];

  const getGfyInfo = () => {
    setErrored(false);
    fetch("https://api.gfycat.com/v1/gfycats/" + gfyId, {
      method: "GET",
    })
      .then((res) => {
        // console.log(res);r
        return res.json();
      })
      .catch((error) => {
        // console.log("yeet");
        setErrored(true);
      })
      .then((json) => {
        console.log(json);
        if (json.errorMessage) {
          setErrored(true);
        }
        setGyfyDetails(json.gfyItem);
      });
  };

  if (gfyDetails) {
    console.log(gfyDetails.content_urls.mp4.url);
  }

  return (
    <View style={{ flex: 1 }}>
      {errored ? (
        <TouchableOpacity
          onPress={getGfyInfo}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Icon name="close" color="grey" size={200} />
          <Text style={{ color: "grey", textAlign: "center" }}>
            An error occurred -- the gif might not exist anymore. Tap to retry
          </Text>
        </TouchableOpacity>
      ) : gfyDetails ? (
        <VideoPlayer
          source={gfyDetails.content_urls.mp4.url}
          navigation={props.navigation}
          hasControls={true}
          autoPlay={false}
          poster={""}
          title={"yeet"}
          canFullscreen={true}
        />
      ) : (
        <TouchableOpacity
          onPress={getGfyInfo}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Icon name="movie" color="grey" size={200} />
          <Text style={{ color: "grey" }}>Tap to get gif</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GyfyPlayer;
